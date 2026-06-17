import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
import { ArrowLeft, FlaskConical, AtSign } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
const PALETTE = ["H", "H", "O", "C"];
const MoleculeBuilder8 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("molecule-builder8", scoreVal, { title: "Molecule Builder8", subject: "Chemistry" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const { t } = useTranslation();
  const [slots, setSlots] = useState([
    { id: 1, atom: null },
    { id: 2, atom: null },
    { id: 3, atom: null }
  ]);
  const [message, setMessage] = useState("Drag atoms to build H2O or CO2");
  const onDragStart = (e, atom) => {
    e.dataTransfer.setData("text/plain", atom);
  };
  const onDragOver = (e) => e.preventDefault();
  const onDrop = (slotId, e) => {
    e.preventDefault();
    const atom = e.dataTransfer.getData("text/plain");
    setSlots((prev) => prev.map((s) => s.id === slotId ? { ...s, atom } : s));
    setMessage("");
  };
  const clear = () => {
    setSlots(slots.map((s) => ({ ...s, atom: null })));
    setMessage("Drag atoms to build H2O or CO2");
  };
  const validate = () => {
    const arr = slots.map((s) => s.atom).filter(Boolean);
    const count = (a) => arr.filter((x) => x === a).length;
    const okH2O = count("H") === 2 && count("O") === 1 && arr.length === 3;
    const okCO2 = count("C") === 1 && count("O") === 2 && arr.length === 3;
    if (okH2O) setMessage("Great! H2O (water) formed.");
    else if (okCO2) setMessage("Great! CO2 (carbon dioxide) formed.");
    else setMessage("Not a valid target molecule. Try again!");
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-4xl mx-auto"><div className="flex items-center justify-between mb-6"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800"><ArrowLeft className="w-5 h-5 mr-2" /> {t("backToGames")}</button><div className="hidden sm:block text-sm text-gray-700">{t("player") || "Player"}: {currentUser}</div></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{
    /* Palette */
  }<div className="bg-white rounded-xl shadow-sm p-4"><div className="flex items-center gap-2 mb-3 text-gray-800 font-semibold"><FlaskConical className="w-5 h-5" /> Palette</div><div className="space-y-2">{PALETTE.map((a, idx) => <div key={idx} draggable onDragStart={(e) => onDragStart(e, a)} className="px-3 py-2 rounded border bg-white hover:shadow cursor-move inline-flex items-center gap-2 w-24"><AtSign className="w-4 h-4 text-emerald-600" /> {a}</div>)}</div></div>{
    /* Board */
  }<div className="md:col-span-2 bg-white rounded-xl shadow-sm p-4"><div className="font-semibold text-gray-800 mb-3">Build Molecule</div><div className="grid grid-cols-3 gap-3">{slots.map((s) => <div key={s.id} onDrop={(e) => onDrop(s.id, e)} onDragOver={onDragOver} className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center text-gray-500">{s.atom ? s.atom : "Drop atom"}</div>)}</div><div className="mt-4 flex gap-3"><button onClick={validate} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Validate</button><button onClick={clear} className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 border">Clear</button></div>{message && <div className="mt-3 text-sm text-gray-700">{message}</div>}</div></div></div>
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
export default MoleculeBuilder8;
