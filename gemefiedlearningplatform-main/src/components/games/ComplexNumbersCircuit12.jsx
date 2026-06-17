import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
function norm(s) {
  return s.trim().replace(/\s+/g, "").toLowerCase();
}
function makePolar() {
  const a = Math.floor(Math.random() * 10) - 5;
  const b = Math.floor(Math.random() * 10) - 5 || 3;
  const r = Math.hypot(a, b);
  let theta = Math.atan2(b, a) * 180 / Math.PI;
  if (theta < 0) theta += 360;
  return {
    mode: "polar",
    prompt: `Rectangular to polar: z = ${a} + ${b}i. Enter r,theta as r,thetaDeg (rounded to 2dp).`,
    answer: `${r.toFixed(2)},${theta.toFixed(2)}`,
    hint: "r = \u221A(a\xB2+b\xB2); \u03B8 = atan2(b,a) in degrees (0..360)."
  };
}
function makeRect() {
  const r = Math.random() * 4 + 1;
  const theta = Math.floor(Math.random() * 360);
  const a = r * Math.cos(theta * Math.PI / 180);
  const b = r * Math.sin(theta * Math.PI / 180);
  return {
    mode: "rect",
    prompt: `Polar to rectangular: z = ${r.toFixed(2)}\u2220${theta}\xB0. Enter a,b as a,b (2dp).`,
    answer: `${a.toFixed(2)},${b.toFixed(2)}`,
    hint: "a = r cos\u03B8, b = r sin\u03B8."
  };
}
function makeDeMoivre() {
  const r = Math.random() * 3 + 1;
  const theta = Math.floor(Math.random() * 180);
  const n = [2, 3, 4][Math.floor(Math.random() * 3)];
  return {
    mode: "deMoivre",
    prompt: `Apply De Moivre: (${r.toFixed(2)}\u2220${theta}\xB0)^${n}. Enter r,theta as r,thetaDeg (theta mod 360).`,
    answer: `${(r ** n).toFixed(2)},${(theta * n % 360).toFixed(2)}`,
    hint: "r^n, n\u03B8 (deg), wrap \u03B8 to [0,360)."
  };
}
function makeNthRoots() {
  const r = Math.random() * 3 + 1;
  const theta = Math.floor(Math.random() * 360);
  const n = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
  const rootR = Math.pow(r, 1 / n);
  const rootTheta = theta / n % 360;
  return {
    mode: "nthRoots",
    prompt: `Principal n-th root: For z = ${r.toFixed(2)}\u2220${theta}\xB0, n=${n}, enter r,theta for principal root (2dp).`,
    answer: `${rootR.toFixed(2)},${rootTheta.toFixed(2)}`,
    hint: "Principal root: r^(1/n), \u03B8/n."
  };
}
function makePuzzle() {
  const makers = [makePolar, makeRect, makeDeMoivre, makeNthRoots];
  return makers[Math.floor(Math.random() * makers.length)]();
}
const ComplexNumbersCircuit12 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("complex-numbers-circuit12", scoreVal, { title: "Complex Numbers Circuit12", subject: "Science" });
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
    const ans = norm(p.answer);
    const m = s.match(/^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/);
    if (m) {
      const x = Number(m[1]);
      const y = Number(m[2]);
      const [ax, ay] = ans.split(",").map(Number);
      const ok = Math.abs(x - ax) <= 0.2 && Math.abs(y - ay) <= 0.2;
      if (ok) {
        setScore((v) => v + 10);
        setStability((v) => Math.min(100, v + 10));
        setFeedback("Circuit stabilized!");
        setP(makePuzzle());
        setInput("");
        return;
      }
    }
    setStability((v) => Math.max(0, v - 8));
    setFeedback("Overload! Check conversions. Hint: " + p.hint);
  };
  const reset = () => {
    setP(makePuzzle());
    setInput("");
    setScore(0);
    setStability(50);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-fuchsia-50 to-indigo-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Complex Numbers Circuit (Grade 12)</h1><p className="text-gray-600 text-sm">Rotate/scale signals on the Argand plane to light up the circuit.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Player: <span className="font-semibold">{currentUser ?? "You"}</span> • Score: <span className="font-semibold">{score}</span> • Stability: <span className="font-semibold">{stability}</span></div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-2">{p.prompt}</div><div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="e.g., 2.83,45.00" /><button onClick={submit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Apply</button></div>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Hints: Use r∠θ form (deg) and De Moivre for powers; nth roots divide the angle.</div></div>
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
export default ComplexNumbersCircuit12;
