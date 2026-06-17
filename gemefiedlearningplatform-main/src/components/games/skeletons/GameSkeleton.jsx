import { useMemo, useState } from "react";
import { useRewards } from "../../../contexts/RewardsContext";
import { CheckCircle2, Star, Award } from "lucide-react";

const samplePromptsByType = {
  card: [
    "Find a correct pair twice in a row.",
    "Explain one real-life example related to this concept."
  ],
  "drag-drop": [
    "Drag 3 items into the correct category.",
    "Fix one incorrect placement."
  ],
  simulation: [
    "Choose the correct method for a given scenario.",
    "Predict the outcome before applying."
  ],
  puzzle: [
    "Solve a target configuration in 3 moves.",
    "Explain why your move works."
  ],
  "role-play": [
    "Pick choices that maximize the objective.",
    "Reflect on one trade-off you faced."
  ],
  board: [
    "Answer 3 correctness checks to advance.",
    "Land on a challenge tile and succeed."
  ],
  story: [
    "Sequence 4 tiles correctly.",
    "Identify main idea in one sentence."
  ],
  quiz: [
    "Score 3/3 in quick quiz.",
    "Get a streak of 2 right answers."
  ],
  lab: [
    "Run two controlled trials and compare observations.",
    "Explain the principle shown in your results."
  ],
  debate: [
    "Choose the strongest evidence card for your claim.",
    "Counter an opponent\u2019s argument effectively."
  ],
  investigation: [
    "Collect two pieces of evidence for a conclusion.",
    "State a hypothesis and test it with given data."
  ],
  strategy: [
    "Plan 3 steps ahead to maximize score.",
    "Adjust your plan after a random event."
  ],
  escape: [
    "Solve a timed puzzle to unlock the next room.",
    "Use a hint efficiently to progress."
  ],
  sandbox: [
    "Try two parameter settings and compare outcomes.",
    "Document a surprising behavior you observed."
  ],
  project: [
    "Assemble all required components for a submission.",
    "Present a summary of your choices and results."
  ],
  "simulation-advanced": [
    "Tune parameters to hit a numeric target with <5% error.",
    "Explain why changing one parameter affected outcomes."
  ]
};

const GameSkeleton = ({ game, onBack, focusMode = false }) => {
  const rewards = useRewards();
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [awardedXP, setAwardedXP] = useState(null);
  
  const prompts = useMemo(() => samplePromptsByType[game.type] || [], [game.type]);
  
  const handleDoAction = () => {
    setProgress((p) => Math.min(100, p + 34));
  };
  
  const handleComplete = () => {
    if (completed) return;
    setCompleted(true);
    const baseXP = 50;
    const multiplier = focusMode ? 1.5 : 1;
    const awarded = Math.round(baseXP * multiplier);
    rewards.addXP(awarded);
    setAwardedXP(awarded);
    rewards.recordHighScore(game.id, Math.round(progress), { title: game.title, subject: game.subject });
    rewards.awardBadge({ id: `cbse6-${game.id}`, name: `${game.title} Starter` });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{game.title}</h1>
            <div className="text-sm text-gray-600">{game.subject.toUpperCase()} • {game.chapter}</div>
          </div>
          <div className="flex gap-2">
            {onBack && <button onClick={onBack} className="px-3 py-2 rounded-md border bg-white hover:bg-gray-50 text-gray-700">Back</button>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="text-gray-800 mb-2 font-semibold">How to Play</div>
          <p className="text-gray-700 mb-4">{game.howToPlay}</p>
          <div className="text-gray-800 mb-2 font-semibold">Learning Outcome</div>
          <p className="text-gray-700">{game.learningOutcome}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {focusMode && (
            <div className="mb-4 inline-flex items-center gap-2 text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-md">
              <Award className="w-4 h-4" /> Focus Mode On — +50% XP bonus
            </div>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-gray-800">Interactive Tasks</div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-500" /> Progress
            </div>
          </div>
          
          <ul className="list-disc pl-6 space-y-2 mb-4">
            {prompts.map((p, i) => <li key={i} className="text-gray-700">{p}</li>)}
          </ul>
          
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          
          <div className="mt-4 flex gap-2">
            <button onClick={handleDoAction} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
              Try an Action
            </button>
            <button 
              onClick={handleComplete} 
              disabled={completed}
              className={`px-4 py-2 rounded-md font-medium text-white transition-all ${
                completed 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {completed ? "Progress Submitted" : focusMode ? "Submit Progress (Focus +50% XP)" : "Submit Progress"}
            </button>
          </div>

          {completed && (
            <div className="mt-4 inline-flex flex-col gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-md w-full animate-fade-in">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-5 h-5" /> Great job! {focusMode ? "Focus bonus applied. " : ""}You earned {awardedXP ?? 0} XP.
              </div>
              <div className="text-xs font-medium text-emerald-600 pl-7">
                ✓ Progress successfully saved to MySQL database!
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 text-gray-800 font-semibold mb-2">
            <Award className="w-5 h-5 text-purple-500" /> Tip
          </div>
          <p className="text-gray-700">This is a lightweight skeleton. We can upgrade it into a full {game.type} game with graphics and deeper logic.</p>
        </div>
      </div>
    </div>
  );
};

export default GameSkeleton;
