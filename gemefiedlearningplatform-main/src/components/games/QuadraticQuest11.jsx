import { useRewards } from "../../contexts/RewardsContext";
import { useMemo, useState } from "react";
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function makeQuestion() {
  const type = Math.random();
  if (type < 0.7) {
    const r1 = randInt(-6, 6);
    const r2 = randInt(-6, 6);
    const a = randInt(1, 3);
    const b = -a * (r1 + r2);
    const c = a * r1 * r2;
    const roots = [r1, r2].sort((x, y) => x - y);
    return { a, b, c, roots };
  } else {
    const a = randInt(1, 3);
    const b = randInt(-6, 6);
    const c = randInt(1, 9);
    const D = b * b - 4 * a * c;
    if (D >= 0) return makeQuestion();
    return { a, b, c, roots: "complex" };
  }
}
function checkAnswer(q, input) {
  const norm = input.trim().replace(/\s+/g, "");
  if (q.roots === "complex") {
    return /complex|no\s*real\s*roots/i.test(input);
  }
  const m = norm.match(/^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/);
  if (!m) return false;
  const r1 = Number(m[1]);
  const r2 = Number(m[2]);
  const cand = [r1, r2].sort((x, y) => x - y);
  const ans = q.roots.map((n) => Number(n.toFixed(3)));
  return Math.abs(cand[0] - ans[0]) < 0.01 && Math.abs(cand[1] - ans[1]) < 0.01;
}
const QuadraticQuest11 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("quadratic-quest11", scoreVal, { title: "Quadratic Quest11", subject: "Mathematics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [q, setQ] = useState(makeQuestion());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const questionText = useMemo(() => {
    const { a, b, c } = q;
    return `Solve ax^2 + bx + c = 0 \u2192 ${a}x^2 + ${b}x + ${c} = 0. Give roots as r1,r2 (ascending) or type "complex" if no real roots.`;
  }, [q]);
  const submit = () => {
    if (checkAnswer(q, input)) {
      setScore((s) => s + 10);
      setFeedback("Correct! The path forward is clear.");
      setQ(makeQuestion());
      setInput("");
    } else {
      setFeedback("Not quite. Try factoring or use the quadratic formula.");
    }
  };
  const reset = () => {
    setQ(makeQuestion());
    setInput("");
    setScore(0);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Quadratic Quest (Grade 11)</h1><p className="text-gray-600 text-sm">Solve for roots to help the characters overcome obstacles.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Score: <span className="font-semibold">{score}</span> • Player: {currentUser ?? "You"}</div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-2">{questionText}</div><div className="flex gap-2"><input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="e.g., -2,3 or complex"
    className="flex-1 border rounded px-3 py-2"
  /><button onClick={submit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Solve</button></div>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Tip: If factoring is hard, use the quadratic formula: x = (-b ± √(b²-4ac))/(2a).</div></div>
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
export default QuadraticQuest11;
