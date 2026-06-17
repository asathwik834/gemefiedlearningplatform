import { useRewards } from "../../contexts/RewardsContext";
import { useEffect, useRef, useState } from "react";
function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
const LawsOfMotionArena = ({ onBack, currentUser, hardMode }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("laws-of-motion-arena", scoreVal, { title: "Laws Of Motion Arena", subject: "Physics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [mass, setMass] = useState(5);
  const [mu, setMu] = useState(hardMode ? 0.2 : 0.1);
  const [forceX, setForceX] = useState(hardMode ? 8 : 10);
  const [running, setRunning] = useState(false);
  const [x, setX] = useState(0);
  const [v, setV] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const goal = hardMode ? 30 : 20;
  const lastTs = useRef(null);
  useEffect(() => {
    if (!running) return;
    const raf = (ts) => {
      if (lastTs.current == null) lastTs.current = ts;
      const dt = (ts - lastTs.current) / 1e3;
      lastTs.current = ts;
      const g = 9.8;
      const normal = mass * g;
      const frictionMag = mu * normal;
      const applied = forceX;
      const dir = v >= 0 ? -1 : 1;
      const friction = v === 0 && Math.abs(applied) < frictionMag ? -applied : dir * Math.min(frictionMag, Math.abs(v) > 0 ? frictionMag : Math.abs(applied));
      const net = applied + friction;
      const a = net / mass;
      const nv = v + a * dt;
      const nx = x + nv * dt;
      setV(clamp(nv, -30, 30));
      setX(clamp(nx, 0, goal + 2));
      if (nx >= goal) {
        setRunning(false);
        setFeedback("Goal reached! Great application of Newton's laws.");
        return;
      }
      if (running) requestAnimationFrame(raf);
    };
    const id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, [running, mass, mu, forceX, x, v]);
  const reset = () => {
    setRunning(false);
    setX(0);
    setV(0);
    setFeedback(null);
    lastTs.current = null;
  };
  const predictAccel = (guess) => {
    const g = 9.8, normal = mass * g, frictionMag = mu * normal;
    const friction = v === 0 && Math.abs(forceX) < frictionMag ? -forceX : v >= 0 ? -frictionMag : frictionMag;
    const net = forceX + friction;
    const a = net / mass;
    const ok = Math.abs(guess - a) < 0.5;
    setFeedback(ok ? "Correct acceleration estimate! Bonus awarded." : `Close! Actual a \u2248 ${a.toFixed(2)} m/s\xB2`);
  };
  return <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Laws of Motion Arena</h1>{hardMode && <span className="ml-2 inline-block align-middle text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">Hard</span>}<p className="text-gray-600 text-sm">{currentUser ? `Player: ${currentUser}` : "Single Player"} • Apply forces to move the cart to the goal.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="md:col-span-2">{
    /* Arena */
  }<div className="relative h-48 bg-gray-50 border rounded-xl overflow-hidden"><div className="absolute left-0 right-0 bottom-10 h-1 bg-gray-300" /><div
    className="absolute left-0 bottom-10 h-6 w-10 rounded bg-blue-600 text-white flex items-center justify-center shadow"
    style={{ transform: `translateX(${x / goal * 90}%)` }}
  >Cart</div><div className="absolute right-6 bottom-10 text-xs text-gray-700">Goal →</div><div className="absolute inset-x-0 bottom-0 h-10 bg-[repeating-linear-gradient(90deg,#e5e7eb, #e5e7eb_10px, #f3f4f6_10px, #f3f4f6_20px)]" /></div><div className="mt-4 text-sm text-gray-700">x = {x.toFixed(2)} m • v = {v.toFixed(2)} m/s</div></div>{
    /* Controls */
  }<div className="bg-gray-50 rounded-xl p-4 border"><div className="mb-3"><label className="block text-sm font-medium">Mass (kg): {mass}</label><input type="range" min={1} max={20} value={mass} onChange={(e) => setMass(Number(e.target.value))} className="w-full" /></div><div className="mb-3"><label className="block text-sm font-medium">Friction μ: {mu.toFixed(2)}</label><input type="range" min={0} max={0.5} step={0.01} value={mu} onChange={(e) => setMu(Number(e.target.value))} className="w-full" /></div><div className="mb-3"><label className="block text-sm font-medium">Applied Force Fx (N): {forceX}</label><input type="range" min={-50} max={50} value={forceX} onChange={(e) => setForceX(Number(e.target.value))} className="w-full" /></div><div className="flex gap-2"><button onClick={() => setRunning(true)} disabled={running} className={`px-3 py-2 rounded text-white ${running ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}>Run</button><button onClick={() => setRunning(false)} className="px-3 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200">Stop</button></div><div className="mt-3 text-sm text-gray-700">Predict acceleration (m/s²):</div><div className="flex gap-2 mt-2"><input type="number" step="0.1" className="flex-1 border rounded px-2 py-1" placeholder="e.g., 1.5" id="accGuess" /><button onClick={() => {
    const el = document.getElementById("accGuess");
    if (el) predictAccel(Number(el.value));
  }} className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Check</button></div>{feedback && <div className="mt-3 text-sm text-amber-800 bg-amber-50 px-3 py-2 rounded">{feedback}</div>}</div></div><div className="mt-6 text-sm text-gray-600">
          Tip: Newton's 2nd Law F = ma. Friction opposes motion with magnitude μN. Adjust force, mass, and friction to reach the goal efficiently.
        </div></div>
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
export default LawsOfMotionArena;
