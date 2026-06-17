import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
function norm(s) {
  return s.trim().replace(/\s+/g, "").toLowerCase();
}
function toInterval(lo, hi, dp = 2) {
  return `(${lo.toFixed(dp)}, ${hi.toFixed(dp)})`;
}
function makeZInterval() {
  const xbar = 50 + Math.floor(Math.random() * 20);
  const sigma = 10 + Math.floor(Math.random() * 10);
  const n = 25 + Math.floor(Math.random() * 25);
  const z = 1.96;
  const m = z * sigma / Math.sqrt(n);
  const lo = xbar - m;
  const hi = xbar + m;
  return {
    mode: "zInterval",
    prompt: `Known \u03C3. Compute 95% CI for mean with x\u0304=${xbar}, \u03C3=${sigma}, n=${n}. Format: (lo, hi) with 2 d.p.`,
    answer: toInterval(lo, hi),
    hint: "x\u0304 \xB1 1.96\xB7\u03C3/\u221An"
  };
}
function makeTInterval() {
  const xbar = 60 + Math.floor(Math.random() * 20);
  const s = 8 + Math.floor(Math.random() * 10);
  const n = 15 + Math.floor(Math.random() * 20);
  const t = 2.1;
  const m = t * s / Math.sqrt(n);
  const lo = xbar - m;
  const hi = xbar + m;
  return {
    mode: "tInterval",
    prompt: `Unknown \u03C3. Compute ~95% CI for mean with x\u0304=${xbar}, s=${s}, n=${n}. Format: (lo, hi) with 2 d.p.`,
    answer: toInterval(lo, hi),
    hint: "x\u0304 \xB1 t*\xB7s/\u221An (use t*\u22482.1)"
  };
}
function makeZTest() {
  const mu0 = 100;
  const xbar = 100 + (Math.random() < 0.5 ? -1 : 1) * (2 + Math.floor(Math.random() * 8));
  const sigma = 15;
  const n = 36;
  const z = (xbar - mu0) / (sigma / Math.sqrt(n));
  const reject = Math.abs(z) > 1.96;
  return {
    mode: "zTest",
    prompt: `Test H0: \u03BC=${mu0} vs two-sided at \u03B1=0.05 with x\u0304=${xbar}, \u03C3=${sigma}, n=${n}. Decide: reject or do not reject.`,
    answer: reject ? "reject" : "donotreject",
    hint: "|z| > 1.96 \u21D2 reject H0."
  };
}
function makePuzzle() {
  const pick = [makeZInterval, makeTInterval, makeZTest];
  return pick[Math.floor(Math.random() * pick.length)]();
}
const StatsInferenceLab12 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("stats-inference-lab12", scoreVal, { title: "Stats Inference Lab12", subject: "Mathematics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [p, setP] = useState(makePuzzle());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [resources, setResources] = useState(50);
  const [feedback, setFeedback] = useState(null);
  const submit = () => {
    const s = norm(input);
    const ans = norm(p.answer);
    let ok = false;
    if (p.mode === "zTest") {
      ok = s === ans || s.includes("reject") && ans === "reject" || s.includes("not") && ans === "donotreject";
    } else {
      const m = s.match(/^\((-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)\)$/);
      if (m) {
        const lo = Number(m[1]);
        const hi = Number(m[2]);
        const [alo, ahi] = p.answer.replace(/[()\s]/g, "").split(",").map(Number);
        ok = Math.abs(lo - alo) <= 0.2 && Math.abs(hi - ahi) <= 0.2;
      }
    }
    if (ok) {
      setScore((v) => v + 10);
      setResources((v) => Math.min(100, v + 10));
      setFeedback("Correct! Experiment succeeded.");
      setP(makePuzzle());
      setInput("");
    } else {
      setResources((v) => Math.max(0, v - 8));
      setFeedback("Check conditions/critical values. Hint: " + p.hint);
    }
  };
  const reset = () => {
    setP(makePuzzle());
    setInput("");
    setScore(0);
    setResources(50);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Statistical Inference Lab (Grade 12)</h1><p className="text-gray-600 text-sm">Run experiments and decide with CIs/tests; manage limited resources.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Player: <span className="font-semibold">{currentUser ?? "You"}</span> • Score: <span className="font-semibold">{score}</span> • Resources: <span className="font-semibold">{resources}</span></div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-2">{p.prompt}</div><div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder={p.mode === "zTest" ? "reject / do not reject" : "(lo, hi)"} /><button onClick={submit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Decide</button></div>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Hints: 95% z*≈1.96; t*≈2.1 for moderate df; two-sided reject if |z|&gt;1.96.</div></div>
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
export default StatsInferenceLab12;
