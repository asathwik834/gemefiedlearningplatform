import { useRewards } from "../../contexts/RewardsContext";
import { useMemo, useState } from "react";
import { ArrowLeft, Gauge, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
const PhysicsSim8 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("physics-sim8", scoreVal, { title: "Physics Sim8", subject: "Physics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const { t } = useTranslation();
  const [mass, setMass] = useState(5);
  const [force, setForce] = useState(10);
  const [time, setTime] = useState(4);
  const [friction, setFriction] = useState(0);
  const results = useMemo(() => {
    const netF = Math.max(0, force - friction);
    const a = netF / Math.max(0.1, mass);
    const s = 0.5 * a * time * time;
    const v = a * time;
    return { a, s, v };
  }, [mass, force, time, friction]);
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-4xl mx-auto"><div className="flex items-center justify-between mb-6"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800"><ArrowLeft className="w-5 h-5 mr-2" /> {t("backToGames")}</button><div className="hidden sm:block text-sm text-gray-700">{t("player") || "Player"}: {currentUser}</div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{
    /* Controls */
  }<div className="bg-white rounded-xl shadow-sm p-4"><div className="flex items-center gap-2 mb-3 text-gray-800 font-semibold"><SlidersHorizontal className="w-5 h-5" /> Controls</div><div className="space-y-3"><div><div className="text-sm text-gray-700">Mass (kg): {mass}</div><input type="range" min={1} max={20} value={mass} onChange={(e) => setMass(parseInt(e.target.value))} className="w-full" /></div><div><div className="text-sm text-gray-700">Applied Force (N): {force}</div><input type="range" min={0} max={50} value={force} onChange={(e) => setForce(parseInt(e.target.value))} className="w-full" /></div><div><div className="text-sm text-gray-700">Friction (N): {friction}</div><input type="range" min={0} max={30} value={friction} onChange={(e) => setFriction(parseInt(e.target.value))} className="w-full" /></div><div><div className="text-sm text-gray-700">Time (s): {time}</div><input type="range" min={1} max={10} value={time} onChange={(e) => setTime(parseInt(e.target.value))} className="w-full" /></div></div></div>{
    /* Readouts */
  }<div className="bg-white rounded-xl shadow-sm p-4"><div className="flex items-center gap-2 mb-3 text-gray-800 font-semibold"><Gauge className="w-5 h-5" /> Results</div><div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><div className="bg-blue-50 rounded p-3"><div className="text-xs text-gray-600">Acceleration (m/s²)</div><div className="text-2xl font-bold text-blue-600">{results.a.toFixed(2)}</div></div><div className="bg-emerald-50 rounded p-3"><div className="text-xs text-gray-600">Distance (m)</div><div className="text-2xl font-bold text-emerald-600">{results.s.toFixed(2)}</div></div><div className="bg-purple-50 rounded p-3"><div className="text-xs text-gray-600">Velocity (m/s)</div><div className="text-2xl font-bold text-purple-600">{results.v.toFixed(2)}</div></div></div><div className="mt-4 text-sm text-gray-600">
              Try different values to predict motion. Net force = Force − Friction. a = F/m, s = 0.5·a·t².
            </div></div></div></div>
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
export default PhysicsSim8;
