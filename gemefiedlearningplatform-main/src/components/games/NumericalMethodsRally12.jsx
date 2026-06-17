import { useRewards } from "../../contexts/RewardsContext";
import { useEffect, useState } from "react";
function round(n, dp = 4) {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
}
function makeNewton() {
  const A = Math.floor(Math.random() * 15) + 5;
  const root = Math.sqrt(A);
  return {
    mode: "newton",
    prompt: `Find a root of f(x)=x^2\u2212${A}. Give the positive root to 3 d.p.`,
    answer: round(root, 3),
    hint: "Newton: x_{n+1}=x_n - f(x_n)/f'(x_n); here root is sqrt(A)."
  };
}
function makeBisection() {
  const B = 0.5 + Math.random();
  const approx = 1.3;
  return {
    mode: "bisection",
    prompt: `Root of g(x)=x^3 - x - ${B.toFixed(2)} near [1,2]. Provide ~root to 2 d.p.`,
    answer: round(approx, 2),
    hint: "Bisection halves interval; sign change guides the next interval."
  };
}
function makeSimpson() {
  const k = Math.floor(Math.random() * 5) + 1;
  const L = Math.floor(Math.random() * 6) + 4;
  const exact = k * L * L / 2;
  return {
    mode: "simpson",
    prompt: `Approximate \u222B_0^${L} (${k}x) dx via Simpson/trapezoid; enter the value to 2 d.p.`,
    answer: round(exact, 2),
    hint: "Exact here is k L^2 / 2; Simpson matches linear exactly."
  };
}
function makePuzzle() {
  const r = Math.random();
  if (r < 0.34) return makeNewton();
  if (r < 0.67) return makeBisection();
  return makeSimpson();
}
const NumericalMethodsRally12 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("numerical-methods-rally12", scoreVal, { title: "Numerical Methods Rally12", subject: "Science" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [p, setP] = useState(makePuzzle());
  const [input, setInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [stability, setStability] = useState(100);
  const [feedback, setFeedback] = useState(null);
  useEffect(() => {
    const id = setInterval(() => setProgress((v) => Math.min(100, v + 0.5)), 60);
    return () => clearInterval(id);
  }, []);
  const submit = () => {
    const v = Number(input);
    if (!Number.isFinite(v)) {
      setFeedback("Enter a numeric value.");
      return;
    }
    const tol = p.mode === "bisection" ? 0.05 : p.mode === "newton" ? 0.01 : 0.1;
    const ok = Math.abs(v - p.answer) <= tol;
    if (ok) {
      setProgress((s) => Math.min(100, s + 12));
      setFeedback("Fast segment! Correct.");
      setP(makePuzzle());
      setInput("");
    } else {
      setStability((s) => Math.max(0, s - 10));
      setFeedback("Instability! Adjust method/precision. " + p.hint);
    }
  };
  const reset = () => {
    setP(makePuzzle());
    setInput("");
    setProgress(0);
    setStability(100);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Numerical Methods Rally (Grade 12)</h1><p className="text-gray-600 text-sm">Choose the right method to keep speed without diverging.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Player: <span className="font-semibold">{currentUser ?? "You"}</span> • Stability: <span className="font-semibold">{stability}</span> • Progress: <span className="font-semibold">{progress.toFixed(0)}%</span></div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-2">{p.prompt}</div><div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="e.g., 1.414" /><button onClick={submit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Accelerate</button></div>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Hints: Newton converges quadratically near the root; bisection is robust; Simpson integrates polynomials up to cubic exactly.</div></div>
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
export default NumericalMethodsRally12;
