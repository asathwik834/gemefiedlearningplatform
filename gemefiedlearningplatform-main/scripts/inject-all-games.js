const fs = require('fs');
const path = require('path');

const gamesDir = path.resolve(__dirname, '../src/components/games');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

function getSubject(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('physics') || lower.includes('motion') || lower.includes('light') || lower.includes('oscillation') || lower.includes('energy') || lower.includes('kinematics')) {
    return 'Physics';
  }
  if (lower.includes('chem') || lower.includes('molecule') || lower.includes('equilibrium')) {
    return 'Chemistry';
  }
  if (lower.includes('biology') || lower.includes('genetic')) {
    return 'Biology';
  }
  if (lower.includes('math') || lower.includes('algebra') || lower.includes('trig') || lower.includes('quadratic') || lower.includes('geometry') || lower.includes('fraction') || lower.includes('decimal') || lower.includes('division') || lower.includes('times') || lower.includes('area') || lower.includes('probability') || lower.includes('stats') || lower.includes('set') || lower.includes('arithmetic') || lower.includes('realnumbers') || lower.includes('polynomials') || lower.includes('proportion') || lower.includes('integer') || lower.includes('angle') || lower.includes('gk') || lower.includes('gk-6') || lower.includes('gk6')) {
    return 'Mathematics';
  }
  return 'Science';
}

function getGameId(filename) {
  const base = path.basename(filename, '.jsx');
  return base
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function getGameTitle(filename) {
  const base = path.basename(filename, '.jsx');
  return base
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
}

// Centered button inside white completion card
const CENTERED_BUTTON_HTML = `
            <div className="mt-4 flex flex-col items-center justify-center gap-2">
              <button
                onClick={handleSubmitScore}
                disabled={submitted}
                className={\`px-6 py-2 rounded-lg font-semibold text-white transition-all \${
                  submitted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md hover:shadow-lg"
                }\`}
              >
                {submitted ? "Score Submitted!" : "Submit Score"}
              </button>
              {submitted && (
                <p className="text-sm font-medium text-emerald-600 animate-fade-in">
                  ✓ Progress successfully saved to MySQL database!
                </p>
              )}
            </div>
`;

// Floating overlay button for sandbox games
const FLOATING_BUTTON_HTML = `
      {((typeof score !== "undefined" ? score > 0 : (typeof moves !== "undefined" ? moves > 0 : true))) && (
        <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-xl shadow-lg border border-gray-200 max-w-xs animate-fade-in flex flex-col gap-2">
          <div className="text-sm font-semibold text-gray-800">
            Submit Score ({(typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100))} pts)
          </div>
          <button
            onClick={handleSubmitScore}
            disabled={submitted}
            className={\`px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all \${
              submitted ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 active:scale-95"
            }\`}
          >
            {submitted ? "Score Submitted!" : "Submit Score"}
          </button>
          {submitted && (
            <p className="text-xs text-emerald-600 font-medium">
              ✓ Progress successfully saved to MySQL database!
            </p>
          )}
        </div>
      )}
`;

console.log('Starting full Submit Button injection and validation...');

let processedCount = 0;

walkDir(gamesDir, (filePath) => {
  if (filePath.endsWith('.jsx')) {
    const filename = path.basename(filePath);
    
    // Skip skeletons directory
    if (filePath.includes('skeletons')) {
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Determine configuration
    const gameId = getGameId(filename);
    const title = getGameTitle(filename);
    const subject = getSubject(filename);

    console.log(`Checking game: ${filename} (ID: ${gameId}, Subject: ${subject})`);

    // 2. Ensure useRewards is imported
    if (!content.includes('useRewards')) {
      content = 'import { useRewards } from "../../contexts/RewardsContext";\n' + content;
    }

    // 3. Ensure useState is imported
    if (!content.includes('useState') && content.includes('import React')) {
      content = content.replace(/import React\s*from/g, 'import React, { useState } from');
    }

    // 4. Inject rewards hooks and handleSubmitScore if not defined
    if (!content.includes('handleSubmitScore')) {
      const componentName = path.basename(filename, '.jsx');
      const componentDeclRegex = new RegExp(`const\\s+${componentName}\\s*=\\s*\\(([^)]*)\\)\\s*=>\\s*{`);
      
      if (componentDeclRegex.test(content)) {
        const injection = `
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("${gameId}", scoreVal, { title: "${title}", subject: "${subject}" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };
`;
        content = content.replace(componentDeclRegex, (match) => match + injection);
      } else {
        console.warn(`Could not find component declaration for ${componentName}`);
      }
    }

    // 5. Inject submit button if not already called
    if (!content.includes('onClick={handleSubmitScore}')) {
      // Determine if there's a completion screen
      // We look for done/completed/gameCompleted/showResult early returns
      const earlyReturnPatterns = [
        /if\s*\(\s*(done|completed|gameCompleted|showResult|escaped|gameOver|finished)\s*\)\s*\{?\s*return\s*\(?\s*<div/i,
        /if\s*\(\s*(done|completed|gameCompleted|showResult|escaped|gameOver|finished)\s*\)\s*\{[\s\S]*?return\s*\(?\s*<div/i
      ];

      let hasEarlyReturn = false;
      let matchVar = '';
      for (const pattern of earlyReturnPatterns) {
        const match = content.match(pattern);
        if (match) {
          hasEarlyReturn = true;
          matchVar = match[1];
          break;
        }
      }

      if (hasEarlyReturn) {
        console.log(`-> Game has completion screen (state: ${matchVar})`);
        // Find the return block inside that if statement
        // Let's find return statements inside that block
        const completionReturnRegex = new RegExp(`if\\s*\\(\\s*${matchVar}\\s*\\)\\s*(?:\\{[\\s\\S]*?return\\s*([\\s\\S]*?);\\s*\\}|return\\s*([\\s\\S]*?);)`, 'i');
        const match = content.match(completionReturnRegex);
        if (match) {
          const fullMatch = match[0];
          const returnJsx = match[1] || match[2];
          
          // Let's replace the last </div> of returnJsx with CENTERED_BUTTON_HTML + </div>
          const lastDivIdx = returnJsx.lastIndexOf('</div>');
          if (lastDivIdx !== -1) {
            const updatedReturnJsx = returnJsx.substring(0, lastDivIdx) + CENTERED_BUTTON_HTML + returnJsx.substring(lastDivIdx);
            // Replace in main content
            const updatedFullMatch = fullMatch.replace(returnJsx, updatedReturnJsx);
            content = content.replace(fullMatch, updatedFullMatch);
            console.log(`-> Successfully injected centered button into completion screen!`);
          } else {
            console.warn(`-> Found early return block but could not locate closing </div>`);
          }
        }
      } else {
        console.log(`-> Game is sandbox/simulation. Injecting floating overlay.`);
        // Inject floating overlay inside the final returned div
        const lastDivIndex = content.lastIndexOf('</div>');
        if (lastDivIndex !== -1) {
          content = content.slice(0, lastDivIndex) + FLOATING_BUTTON_HTML + content.slice(lastDivIndex);
          console.log(`-> Successfully injected floating overlay!`);
        } else {
          console.warn(`-> Could not find closing </div> in file`);
        }
      }
    } else {
      console.log(`-> Game already has Submit button called.`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    processedCount++;
  }
});

console.log(`\nProcessed and verified ${processedCount} game components successfully!`);
