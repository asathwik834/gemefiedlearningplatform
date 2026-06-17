import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
function norm(s) {
  return s.trim().replace(/\s+/g, "").toLowerCase();
}
function makeScale() {
  const sx = Number((Math.random() * 2 + 0.5).toFixed(2));
  const sy = Number((Math.random() * 2 + 0.5).toFixed(2));
  return {
    mode: "scale",
    prompt: `Matrix for scaling by (sx, sy) = (${sx}, ${sy}). Enter a,b,c,d for [[a,b],[c,d]] as a,b,c,d (2dp).`,
    answer: `${sx.toFixed(2)},0.00,0.00,${sy.toFixed(2)}`,
    hint: "Scale matrix = [[sx,0],[0,sy]]."
  };
}
function makeRotate() {
  const theta = [30, 45, 60, 90][Math.floor(Math.random() * 4)];
  const rad = theta * Math.PI / 180;
  const c = Math.cos(rad), s = Math.sin(rad);
  return {
    mode: "rotate",
    prompt: `2D rotation by \u03B8=${theta}\xB0. Enter a,b,c,d for [[a,b],[c,d]] (2dp).`,
    answer: `${c.toFixed(2)},${(-s).toFixed(2)},${s.toFixed(2)},${c.toFixed(2)}`,
    hint: "Rotation = [[cos\u03B8,-sin\u03B8],[sin\u03B8,cos\u03B8]]."
  };
}
function makeShear() {
  const kx = Number((Math.random() * 1.5).toFixed(2));
  return {
    mode: "shear",
    prompt: `x-shear by k=${kx}. Enter matrix [[1,k],[0,1]] as a,b,c,d (2dp).`,
    answer: `1.00,${kx.toFixed(2)},0.00,1.00`,
    hint: "Shear_x = [[1,k],[0,1]]."
  };
}
function makePuzzle() {
  const makers = [makeScale, makeRotate, makeShear];
  return makers[Math.floor(Math.random() * makers.length)]();
}
const LinearAlgebraNetworkFlow12 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("linear-algebra-network-flow12", scoreVal, { title: "Linear Algebra Network Flow12", subject: "Mathematics" });
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
    const m = s.match(/^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/);
    if (m) {
      const vals = m.slice(1).map(Number);
      const avals = ans.split(",").map(Number);
      const ok = vals.every((v, i) => Math.abs(v - avals[i]) <= 0.05);
      if (ok) {
        setScore((v) => v + 10);
        setStability((v) => Math.min(100, v + 10));
        setFeedback("Network segment restored!");
        setP(makePuzzle());
        setInput("");
        return;
      }
    }
    setStability((v) => Math.max(0, v - 8));
    setFeedback("Mismatch. Check the transform matrix. " + p.hint);
  };
  const reset = () => {
    setP(makePuzzle());
    setInput("");
    setScore(0);
    setStability(50);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Linear Algebra Network Flow (Grade 12)</h1><p className="text-gray-600 text-sm">Compose transforms to repair the network—get the right 2×2.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Player: <span className="font-semibold">{currentUser ?? "You"}</span> • Score: <span className="font-semibold">{score}</span> • Stability: <span className="font-semibold">{stability}</span></div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-2">{p.prompt}</div><div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="a,b,c,d" /><button onClick={submit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Apply</button></div>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Hints: det≠0 for invertible; rotation preserves area (det=1); scaling changes area by det.</div></div>
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
export default LinearAlgebraNetworkFlow12;
