import { useRewards } from "../../contexts/RewardsContext";
import { useEffect, useState } from "react";
function ri(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const c = 3e8;
function gamma(v) {
  return 1 / Math.sqrt(1 - v * v / (c * c));
}
function makeQuestion() {
  const t = ["timeDilation", "lengthContraction", "massEnergy"];
  const type = t[ri(0, t.length - 1)];
  if (type === "timeDilation") {
    const t0 = ri(1, 9);
    const v = ri(1, 9) / 10 * c;
    const g = gamma(v);
    const t2 = Number((g * t0).toFixed(3));
    return { type, prompt: `Proper time t0=${t0}s, ship speed v=${(v / c).toFixed(1)}c. Find dilated time t (s).`, answer: t2, unit: "s", hint: "t = \u03B3 t0" };
  }
  if (type === "lengthContraction") {
    const L0 = ri(100, 900);
    const v = ri(1, 9) / 10 * c;
    const g = gamma(v);
    const L = Number((L0 / g).toFixed(2));
    return { type, prompt: `Proper length L0=${L0} m, v=${(v / c).toFixed(1)}c. Find contracted length L (m).`, answer: L, unit: "m", hint: "L = L0/\u03B3" };
  }
  const m = ri(1, 9);
  const E = Number((m * c * c).toExponential(2));
  return { type: "massEnergy", prompt: `Mass m=${m} kg. Compute energy E = mc\xB2 (J). Use scientific notation (e.g., 9.00e+16).`, answer: m * c * c, unit: "J", hint: "E = mc\xB2" };
}
function parseSci(s) {
  const x = Number(s);
  return Number.isFinite(x) ? x : null;
}
const RelativityTimeRace12 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("relativity-time-race12", scoreVal, { title: "Relativity Time Race12", subject: "Science" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [q, setQ] = useState(makeQuestion());
  const [input, setInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [stability, setStability] = useState(100);
  const [feedback, setFeedback] = useState(null);
  useEffect(() => {
    const id = setInterval(() => setProgress((p) => Math.min(100, p + 0.4)), 60);
    return () => clearInterval(id);
  }, []);
  const submit = () => {
    const val = parseSci(input.trim());
    if (val == null) {
      setFeedback("Enter a numeric value (scientific notation allowed).");
      return;
    }
    const ok = q.type === "massEnergy" ? Math.abs((val - q.answer) / q.answer) <= 0.05 : Math.abs(val - q.answer) <= (q.type === "lengthContraction" ? 0.5 : 0.01);
    if (ok) {
      setProgress((p) => Math.min(100, p + 10));
      setFeedback("Stable warp! Correct.");
      setQ(makeQuestion());
      setInput("");
    } else {
      setStability((s) => Math.max(0, s - 10));
      setFeedback(`Instability detected. Hint: ${q.hint}`);
    }
  };
  const reset = () => {
    setQ(makeQuestion());
    setInput("");
    setProgress(0);
    setStability(100);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Relativity Time Race (Grade 12)</h1><p className="text-gray-600 text-sm">Solve relativity problems to keep your ship stable and finish the race.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Player: <span className="font-semibold">{currentUser ?? "You"}</span> • Stability: <span className="font-semibold">{stability}</span> • Progress: <span className="font-semibold">{progress.toFixed(0)}%</span></div><div className="relative h-24 bg-gray-50 border rounded-xl overflow-hidden mb-4"><div className="absolute inset-0 flex items-center"><div className="w-full h-1 bg-gradient-to-r from-gray-200 to-gray-300" /></div><div className="absolute top-6 left-0 h-6 w-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center" style={{ transform: `translateX(${progress}%)` }}>🚀</div></div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-2">{q.prompt}</div><div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder={`in ${q.unit}`} /><button onClick={submit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Stabilize</button></div>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Hints: γ = 1/√(1−v²/c²); t = γ t0; L = L0/γ; E = mc².</div></div>
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
export default RelativityTimeRace12;
