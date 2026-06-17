import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
const scenarios = [
  {
    reaction: "N\u2082(g) + 3H\u2082(g) \u21CC 2NH\u2083(g)   \u0394H = -92 kJ/mol",
    question: "If pressure is increased, which way does equilibrium shift?",
    change: "increase",
    target: "pressure",
    correctShift: "right",
    hint: "Fewer moles on product side."
  },
  {
    reaction: "N\u2082(g) + 3H\u2082(g) \u21CC 2NH\u2083(g)   \u0394H = -92 kJ/mol",
    question: "If temperature is increased, which way does equilibrium shift?",
    change: "increase",
    target: "temperature",
    correctShift: "left",
    hint: "Exothermic forward; heat favors reverse when T \u2191."
  },
  {
    reaction: "2SO\u2082(g) + O\u2082(g) \u21CC 2SO\u2083(g)   \u0394H = -197 kJ/mol",
    question: "Removing SO\u2083 will shift equilibrium which way?",
    change: "decrease",
    target: "concentration",
    correctShift: "right",
    hint: "System tries to replace what is removed."
  }
];
function pickScenario() {
  return Math.floor(Math.random() * scenarios.length);
}
const EquilibriumChallenge11 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("equilibrium-challenge11", scoreVal, { title: "Equilibrium Challenge11", subject: "Chemistry" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [idx, setIdx] = useState(pickScenario());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const sc = scenarios[idx];
  const answer = (side) => {
    if (side === sc.correctShift) {
      setScore((s) => s + 10);
      setFeedback("Correct! Reaction shifts " + side + ".");
      setIdx(pickScenario());
    } else {
      setFeedback("Not quite. Hint: " + sc.hint);
    }
  };
  const reset = () => {
    setIdx(pickScenario());
    setScore(0);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Equilibrium Challenge (Grade 11)</h1><p className="text-gray-600 text-sm">Use Le Chatelier’s principle to predict the direction of shift.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Score: <span className="font-semibold">{score}</span> • Player: {currentUser ?? "You"}</div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-1">Reaction:</div><div className="mb-3">{sc.reaction}</div><div className="font-semibold mb-2">{sc.question}</div><div className="flex gap-2"><button onClick={() => answer("left")} className="px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200">Shift Left</button><button onClick={() => answer("none")} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">No Change</button><button onClick={() => answer("right")} className="px-4 py-2 rounded bg-green-100 text-green-700 hover:bg-green-200">Shift Right</button></div>{feedback && <div className="mt-3 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Tip: Changes in pressure favor side with fewer gas moles; heat favors endothermic direction when increased.</div></div>
      {((typeof score !== "undefined" ? score > 0 : (typeof moves !== "undefined" ? moves > 0 : true))) && (
        <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-xl shadow-lg border border-gray-200 max-w-xs animate-fade-in flex flex-col gap-2">
          <div className="text-sm font-semibold text-gray-800">
            Submit Score ({(typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100))} pts)
          </div>
          <button
            onClick={handleSubmitScore}
            disabled={submitted}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all ${
              submitted ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 active:scale-95"
            }`}
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
</div>;
};
export default EquilibriumChallenge11;
