import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
function ri(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function makeSlope() {
  const a = ri(1, 3), b = ri(-4, 4), c = ri(-5, 5);
  const x0 = ri(-3, 3);
  const m = 2 * a * x0 + b;
  return {
    mode: "slope",
    prompt: `Bridge ramp slope: For f(x) = ${a}x^2 + ${b}x + ${c}, find f'(x) at x = ${x0}.`,
    answer: Number(m.toFixed(2)),
    hint: "If f(x) = ax^2+bx+c, then f'(x) = 2ax + b."
  };
}
function makeArea() {
  const k = ri(1, 6);
  const L = ri(2, 8);
  const A = 0.5 * k * L * L;
  return {
    mode: "area",
    prompt: `Support strength: Compute \u222B v(x) dx from 0 to ${L} for v(x) = ${k}x.`,
    answer: Number(A.toFixed(2)),
    unit: "units\xB2",
    hint: "\u222B kx dx = (k/2) x^2 + C"
  };
}
function makeOptimize() {
  const P = ri(20, 60);
  const xmax = P / 4;
  const Amax = xmax * (P / 2 - xmax);
  return {
    mode: "optimize",
    prompt: `Choose deck piece: Maximize A = x*(P/2 - x) for P = ${P}. Find x at max A.`,
    answer: Number(xmax.toFixed(2)),
    unit: "units",
    hint: "Vertex of -x^2 parabola: derivative 0 at x = P/4"
  };
}
function makePuzzle() {
  const pick = [makeSlope, makeArea, makeOptimize];
  return pick[ri(0, pick.length - 1)]();
}
const CalculusBridgeBuilder12 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("calculus-bridge-builder12", scoreVal, { title: "Calculus Bridge Builder12", subject: "Science" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [p, setP] = useState(makePuzzle());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [stability, setStability] = useState(50);
  const [feedback, setFeedback] = useState(null);
  const submit = () => {
    const val = Number(input);
    if (!Number.isFinite(val)) {
      setFeedback("Enter a numeric value.");
      return;
    }
    const ok = Math.abs(val - p.answer) <= Math.max(0.02 * Math.abs(p.answer), 0.1);
    if (ok) {
      setScore((s) => s + 10);
      setStability((s) => Math.min(100, s + 10));
      setFeedback(`Stable! Correct \u2248 ${p.answer}${p.unit ? " " + p.unit : ""}.`);
      setP(makePuzzle());
      setInput("");
    } else {
      setStability((s) => Math.max(0, s - 8));
      setFeedback(`Bridge shakes! Target \u2248 ${p.answer}${p.unit ? " " + p.unit : ""}. Hint: ${p.hint}`);
    }
  };
  const reset = () => {
    setP(makePuzzle());
    setInput("");
    setScore(0);
    setStability(50);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Calculus Bridge Builder (Grade 12)</h1><p className="text-gray-600 text-sm">Use derivatives and integrals to select the right bridge pieces.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Score: <span className="font-semibold">{score}</span> • Stability: <span className="font-semibold">{stability}</span> • Player: {currentUser ?? "You"}</div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-2">{p.prompt}</div><div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder={p.unit ? `in ${p.unit}` : "number"} /><button onClick={submit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Place Piece</button></div>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Hints: f'(x) rules, basic definite integrals, quadratic optimization.</div></div>
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
export default CalculusBridgeBuilder12;
