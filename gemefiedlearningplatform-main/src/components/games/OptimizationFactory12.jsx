import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
function norm(s) {
  return s.trim().replace(/\s+/g, "").toLowerCase();
}
function makeLagrange() {
  const P = 20 + Math.floor(Math.random() * 21);
  const x = P / 2;
  const y = P / 2;
  return {
    mode: "lagrange",
    prompt: `Constrained max: Maximize f(x,y)=xy subject to x+y=${P}. Enter optimal x,y as x,y (2dp).`,
    answer: `${x.toFixed(2)},${y.toFixed(2)}`,
    hint: "L(x,y,\u03BB)=xy-\u03BB(x+y-P). \u2202/\u2202x: y-\u03BB=0, \u2202/\u2202y: x-\u03BB=0 \u21D2 x=y=P/2."
  };
}
function makeCurveSketch() {
  const a = [1, 2, 3, -1, -2, -3][Math.floor(Math.random() * 6)];
  const b = Math.floor(Math.random() * 11) - 5;
  const x0 = -b / (2 * a);
  return {
    mode: "curveSketch",
    prompt: `Vertex x-coordinate for f(x)=${a}x^2 + ${b}x + c. Enter x (2dp).`,
    answer: `${x0.toFixed(2)}`,
    hint: "Vertex at x=-b/(2a). a>0 min, a<0 max."
  };
}
function makePuzzle() {
  const makers = [makeLagrange, makeCurveSketch];
  return makers[Math.floor(Math.random() * makers.length)]();
}
const OptimizationFactory12 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("optimization-factory12", scoreVal, { title: "Optimization Factory12", subject: "Science" });
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
    const s = norm(input);
    let ok = false;
    if (p.mode === "lagrange") {
      const m = s.match(/^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/);
      if (m) {
        const x = Number(m[1]);
        const y = Number(m[2]);
        const [ax, ay] = p.answer.split(",").map(Number);
        ok = Math.abs(x - ax) <= 0.2 && Math.abs(y - ay) <= 0.2;
      }
    } else {
      const v = Number(s);
      ok = Number.isFinite(v) && Math.abs(v - Number(p.answer)) <= 0.2;
    }
    if (ok) {
      setScore((v) => v + 10);
      setStability((v) => Math.min(100, v + 10));
      setFeedback("Production optimized!");
      setP(makePuzzle());
      setInput("");
    } else {
      setStability((v) => Math.max(0, v - 8));
      setFeedback("Suboptimal. Hint: " + p.hint);
    }
  };
  const reset = () => {
    setP(makePuzzle());
    setInput("");
    setScore(0);
    setStability(50);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Optimization Factory (Grade 12)</h1><p className="text-gray-600 text-sm">Apply calculus optimization to tune production under constraints.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Player: <span className="font-semibold">{currentUser ?? "You"}</span> • Score: <span className="font-semibold">{score}</span> • Stability: <span className="font-semibold">{stability}</span></div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-2">{p.prompt}</div><div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder={p.mode === "lagrange" ? "x,y" : "x"} /><button onClick={submit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Apply</button></div>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Hints: Lagrange multipliers equalize marginal gain; vertex formula gives extremum for quadratics.</div></div>
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
export default OptimizationFactory12;
