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

console.log('Starting remaining Submit Button injection...');

function getSubject(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('physics') || lower.includes('motion') || lower.includes('light') || lower.includes('oscillation') || lower.includes('energy') || lower.includes('kinematics')) {
    return 'Physics';
  }
  if (lower.includes('chem') || lower.includes('molecule')) {
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

let count = 0;

walkDir(gamesDir, (filePath) => {
  if (filePath.endsWith('.jsx')) {
    const filename = path.basename(filePath);
    
    // Skip skeletons
    if (filePath.includes('skeletons')) {
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if it already imports useRewards (was already processed)
    if (content.includes('useRewards')) {
      return;
    }

    console.log(`Processing remaining: ${filename}`);

    // 1. Add useRewards import
    content = 'import { useRewards } from "../../contexts/RewardsContext";\n' + content;

    // 2. Setup constants
    const gameId = getGameId(filename);
    const title = getGameTitle(filename);
    const subject = getSubject(filename);

    // 3. Inject hook inside component declaration
    const componentDeclRegex = new RegExp(`const\\s+${path.basename(filename, '.jsx')}\\s*=\\s*\\(([^)]*)\\)\\s*=>\\s*{`);
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
      content = content.replace(componentDeclRegex, (match) => {
        return match + injection;
      });
    }

    // 4. Inject Floating Submit Card right before the last closing </div> of the JSX return
    const lastDivIndex = content.lastIndexOf('</div>');
    if (lastDivIndex !== -1) {
      const floatCardHtml = `
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

      content = content.slice(0, lastDivIndex) + floatCardHtml + content.slice(lastDivIndex);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    count++;
  }
});

console.log(`\nSubmit buttons successfully injected into remaining ${count} games!`);
