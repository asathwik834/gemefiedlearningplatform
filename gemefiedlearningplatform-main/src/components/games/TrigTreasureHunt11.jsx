import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
const bank = [
  { prompt: "Simplify: sin^2 x + cos^2 x = ?", answer: "1", hint: "Pythagorean identity" },
  { prompt: "Simplify: 1 + tan^2 x = ?", answer: "sec^2 x", hint: "Divide by cos^2 x" },
  { prompt: "Simplify: 1 + cot^2 x = ?", answer: "csc^2 x", hint: "Divide by sin^2 x" },
  { prompt: "Simplify: sin(2x) / (2 sin x cos x) = ?", answer: "1", hint: "sin(2x)=2sinx cosx" },
  { prompt: "Simplify: (1 - cos 2x) / 2 = ?", answer: "sin^2 x", hint: "Double-angle identities" },
  { prompt: "Simplify: (1 + cos 2x) / 2 = ?", answer: "cos^2 x", hint: "Double-angle identities" }
];
function nextIdx(used) {
  const options = bank.map((_, i) => i).filter((i) => !used.has(i));
  return options[Math.floor(Math.random() * options.length)];
}
const TrigTreasureHunt11 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("trig-treasure-hunt11", scoreVal, { title: "Trig Treasure Hunt11", subject: "Mathematics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [used, setUsed] = useState(/* @__PURE__ */ new Set());
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [stage, setStage] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const identity = bank[idx];
  const submit = () => {
    const normalized = input.trim().replace(/\s+/g, "").toLowerCase();
    const target = identity.answer.replace(/\s+/g, "").toLowerCase();
    if (normalized === target) {
      setScore((s) => s + 10);
      setFeedback("Correct! You found the next map clue.");
      const newUsed = new Set(used).add(idx);
      setUsed(newUsed);
      if (newUsed.size >= Math.min(5, bank.length)) {
        setFeedback("Treasure found! \u{1F389}");
      } else {
        const n = nextIdx(newUsed);
        setIdx(n);
        setStage((st) => st + 1);
      }
      setInput("");
    } else {
      setFeedback("Not quite. Try again or use a hint.");
    }
  };
  const reset = () => {
    setUsed(/* @__PURE__ */ new Set());
    setIdx(0);
    setInput("");
    setScore(0);
    setStage(1);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-fuchsia-50 to-indigo-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Trig Treasure Hunt (Grade 11)</h1><p className="text-gray-600 text-sm">Solve identities to unlock the next location on the map.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div>{
    /* Map progress */
  }<div className="mb-4 text-sm text-gray-700">Stage: <span className="font-semibold">{stage}</span> / 5 • Score: <span className="font-semibold">{score}</span> • Player: {currentUser ?? "You"}</div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-2">{identity.prompt}</div><div className="flex gap-2"><input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Type simplified result (e.g., sec^2 x, 1)"
    className="flex-1 border rounded px-3 py-2"
  /><button onClick={submit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Unlock</button></div><div className="mt-2 text-xs text-gray-600">Hint: {identity.hint}</div>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Tip: Use standard identities and double-angle relations.</div></div>
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
export default TrigTreasureHunt11;
