import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
const targets = [
  { name: "Benzene (C6H6)", formula: { C: 6, H: 6, O: 0, N: 0, Cl: 0 }, hint: "Aromatic ring: 6 carbons, 6 hydrogens" },
  { name: "Ethanol (C2H6O)", formula: { C: 2, H: 6, O: 1, N: 0, Cl: 0 }, hint: "Alcohol group present" },
  { name: "Chloroethane (C2H5Cl)", formula: { C: 2, H: 5, O: 0, N: 0, Cl: 1 }, hint: "Alkyl halide" },
  { name: "Glycine (C2H5NO2)", formula: { C: 2, H: 5, O: 2, N: 1, Cl: 0 }, hint: "Simplest amino acid" }
];
function eq(a, b) {
  return Object.keys(a).every((k) => a[k] === b[k]);
}
const MolecularArchitectureVR12 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("molecular-architecture-vr12", scoreVal, { title: "Molecular Architecture VR12", subject: "Science" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [i, setI] = useState(0);
  const [bag, setBag] = useState({ C: 0, H: 0, O: 0, N: 0, Cl: 0 });
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const t = targets[i];
  const add = (p) => setBag((prev) => ({ ...prev, [p]: prev[p] + 1 }));
  const remove = (p) => setBag((prev) => ({ ...prev, [p]: Math.max(0, prev[p] - 1) }));
  const resetBag = () => setBag({ C: 0, H: 0, O: 0, N: 0, Cl: 0 });
  const submit = () => {
    if (eq(bag, t.formula)) {
      setScore((s) => s + 20);
      setFeedback("Stable structure! +20 pts");
      setI((i + 1) % targets.length);
      resetBag();
    } else {
      setFeedback(`Destabilized! Hint: ${t.hint}`);
    }
  };
  const hardReset = () => {
    setI(0);
    resetBag();
    setScore(0);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-cyan-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Molecular Architecture VR (Grade 12)</h1><p className="text-gray-600 text-sm">Assemble complex molecules by matching formulas.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={hardReset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Player: <span className="font-semibold">{currentUser ?? "You"}</span> • Score: <span className="font-semibold">{score}</span></div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-2">Target: {t.name}</div><div className="mb-2 text-xs text-gray-600">Hint: {t.hint}</div><div className="grid grid-cols-5 gap-2 mb-3">{["C", "H", "O", "N", "Cl"].map((p) => <div key={p} className="p-3 bg-white border rounded flex flex-col items-center"><div className="text-lg font-bold">{p}</div><div className="text-sm mb-2">{bag[p]}</div><div className="flex gap-2"><button onClick={() => remove(p)} className="px-2 py-1 rounded bg-gray-100">-</button><button onClick={() => add(p)} className="px-2 py-1 rounded bg-emerald-600 text-white">+</button></div></div>)}</div><button onClick={submit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Assemble</button>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Tip: Count atoms to match the molecular formula. Incorrect bonding destabilizes the model.</div></div>
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
export default MolecularArchitectureVR12;
