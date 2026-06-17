import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function fieldAtPoint(charges, px, py) {
  let Ex = 0, Ey = 0;
  for (const c of charges) {
    const dx = px - c.x;
    const dy = py - c.y;
    const r2 = dx * dx + dy * dy || 1e-6;
    const r = Math.sqrt(r2);
    const E = c.q / r2;
    Ex += E * (dx / r);
    Ey += E * (dy / r);
  }
  return { Ex, Ey, mag: Math.hypot(Ex, Ey) };
}
const EMFieldBuilder12 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("em-field-builder12", scoreVal, { title: "EM Field Builder12", subject: "Science" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [charges, setCharges] = useState([]);
  const [target, setTarget] = useState(() => ({ x: rand(20, 80), y: rand(20, 80), mag: rand(0.2, 1.2) }));
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const placeCharge = (q) => {
    const x = rand(10, 90);
    const y = rand(10, 90);
    setCharges((cs) => [...cs, { x, y, q }]);
  };
  const reset = () => {
    setCharges([]);
    setScore(0);
    setFeedback(null);
    setTarget({ x: rand(20, 80), y: rand(20, 80), mag: rand(0.2, 1.2) });
  };
  const check = () => {
    const E = fieldAtPoint(charges, target.x, target.y);
    const ok = Math.abs(E.mag - target.mag) <= 0.1;
    if (ok) {
      setScore((s) => s + Math.max(5, 20 - charges.length));
      setFeedback(`Success! |E|\u2248${E.mag.toFixed(2)} at target. New target generated.`);
      setTarget({ x: rand(20, 80), y: rand(20, 80), mag: rand(0.2, 1.2) });
      setCharges([]);
    } else {
      setFeedback(`Current |E|\u2248${E.mag.toFixed(2)}, target=${target.mag.toFixed(2)}. Adjust charges.`);
    }
  };
  return <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-amber-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Electromagnetism Field Builder (Grade 12)</h1><p className="text-gray-600 text-sm">Place charges to match the target field magnitude at a point.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-3 text-sm text-gray-700">Player: <span className="font-semibold">{currentUser ?? "You"}</span> • Score: <span className="font-semibold">{score}</span></div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="mb-2">Target: position=({target.x.toFixed(1)}%, {target.y.toFixed(1)}%), |E|≈{target.mag.toFixed(2)}</div><div className="flex gap-2 mb-3"><button onClick={() => placeCharge(1)} className="px-3 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200">Place +q</button><button onClick={() => placeCharge(-1)} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Place -q</button><button onClick={check} className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700">Check</button></div><div className="relative h-56 bg-white border rounded overflow-hidden">{
    /* Render charges and target as simple dots on a 100x100% board */
  }{charges.map((c, idx) => <div key={idx} className={`absolute h-3 w-3 rounded-full ${c.q > 0 ? "bg-red-500" : "bg-blue-500"}`} style={{ left: `${c.x}%`, top: `${c.y}%`, transform: "translate(-50%, -50%)" }} title={`${c.q > 0 ? "+" : "-"}q`} />)}<div className="absolute h-3 w-3 rounded-full bg-emerald-500" style={{ left: `${target.x}%`, top: `${target.y}%`, transform: "translate(-50%, -50%)" }} title="Target" /></div></div><div className="text-sm text-gray-600">Hints: |E| from a point charge is k|q|/r². Vector sum determines net field; use opposite charges for cancellation.</div></div>
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
export default EMFieldBuilder12;
