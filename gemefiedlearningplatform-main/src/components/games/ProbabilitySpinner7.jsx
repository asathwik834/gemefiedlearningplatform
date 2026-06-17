import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
function rand() {
  return Math.random();
}
const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];
const ProbabilitySpinner7 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("probability-spinner7", scoreVal, { title: "Probability Spinner7", subject: "Mathematics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const { t } = useTranslation();
  const [weights, setWeights] = useState([1, 1, 1, 1]);
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const [spins, setSpins] = useState(0);
  const total = weights.reduce((a, b) => a + b, 0);
  const theoretical = weights.map((w) => w / total);
  const empirical = counts.map((c) => spins > 0 ? c / spins : 0);
  const spinOnce = () => {
    const r = rand() * total;
    let acc = 0;
    let idx = 0;
    for (let i = 0; i < weights.length; i++) {
      acc += weights[i];
      if (r <= acc) {
        idx = i;
        break;
      }
    }
    setCounts((prev) => prev.map((c, i) => i === idx ? c + 1 : c));
    setSpins((s) => s + 1);
  };
  const reset = () => {
    setCounts([0, 0, 0, 0]);
    setSpins(0);
  };
  const setUniform = () => setWeights([1, 1, 1, 1]);
  const favorRed = () => setWeights([3, 1, 1, 1]);
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-4xl mx-auto"><div className="flex items-center justify-between mb-6"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800"><ArrowLeft className="w-5 h-5 mr-2" /> {t("backToGames")}</button><div className="hidden sm:block text-sm text-gray-700">{t("player") || "Player"}: {currentUser}</div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{
    /* Spinner controls and canvas */
  }<div className="bg-white rounded-xl shadow-sm p-4"><div className="font-semibold text-gray-800 mb-2">Spinner</div><div className="flex items-center gap-2 mb-3"><button onClick={spinOnce} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Spin</button><button onClick={reset} className="px-3 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 border"><RefreshCcw className="w-4 h-4 inline-block mr-1" />Reset</button></div><div className="flex items-center gap-2 mb-3 text-sm"><span>Preset:</span><button onClick={setUniform} className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border">Uniform</button><button onClick={favorRed} className="px-2 py-1 rounded bg-rose-50 text-rose-700 border">Favor Red</button></div><div className="mx-auto my-4 w-56 h-56 relative"><svg viewBox="0 0 100 100" className="w-full h-full">{weights.map((w, i) => {
    const start = weights.slice(0, i).reduce((a, b) => a + b, 0) / total * 2 * Math.PI;
    const end = weights.slice(0, i + 1).reduce((a, b) => a + b, 0) / total * 2 * Math.PI;
    const x1 = 50 + 50 * Math.cos(start), y1 = 50 + 50 * Math.sin(start);
    const x2 = 50 + 50 * Math.cos(end), y2 = 50 + 50 * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    const d = `M50,50 L${x1},${y1} A50,50 0 ${large} 1 ${x2},${y2} z`;
    return <path key={i} d={d} fill={COLORS[i]} stroke="#fff" strokeWidth={0.5} />;
  })}<circle cx="50" cy="50" r="2" fill="#111" /></svg><div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-white border rounded px-2 py-1 shadow">Pointer</div></div></div>{
    /* Stats */
  }<div className="bg-white rounded-xl shadow-sm p-4"><div className="font-semibold text-gray-800 mb-2">Results</div><div className="text-sm text-gray-600 mb-2">Spins: {spins}</div><div className="grid grid-cols-2 gap-3">{weights.map((w, i) => <div key={i} className="border rounded p-3"><div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 inline-block rounded" style={{ backgroundColor: COLORS[i] }} /> Sector {i + 1}</div><div className="text-xs text-gray-600">Theoretical: {(theoretical[i] * 100).toFixed(0)}%</div><div className="text-xs text-gray-600">Empirical: {(empirical[i] * 100).toFixed(0)}%</div><div className="text-xs text-gray-500">Count: {counts[i]}</div></div>)}</div></div></div></div>
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
export default ProbabilitySpinner7;
