import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
function ri(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function makePuzzle() {
  const t = ri(1, 3);
  if (t === 1) {
    const m = ri(1, 5);
    const dT = ri(5, 30);
    const c = 4.2;
    const Q = Number((m * c * dT).toFixed(1));
    return { prompt: `Heat added to ${m} kg of water for \u0394T=${dT} K (c\u22484.2 kJ/kg\xB7K). Find Q (kJ).`, answer: Q, unit: "kJ", hint: "Q = m c \u0394T" };
  }
  if (t === 2) {
    const P = ri(100, 400);
    const dV = ri(2, 12);
    const W = Number((P * dV / 1e3).toFixed(2));
    return { prompt: `At constant pressure P=${P} kPa, volume increases by \u0394V=${dV} L. Find work W (kJ).`, answer: W, unit: "kJ", hint: "W = P \u0394V; 1 kPa\xB7L = 1 J" };
  }
  const Qin = ri(500, 2e3);
  const Wout = ri(100, Math.max(200, Math.floor(Qin * 0.6)));
  const eta = Number((Wout / Qin * 100).toFixed(1));
  return { prompt: `Engine takes Q_in=${Qin} kJ and outputs W_out=${Wout} kJ. Find efficiency \u03B7 (%) to 1 d.p.`, answer: eta, unit: "%", hint: "\u03B7 = W_out / Q_in \xD7 100%" };
}
const ThermoLabEscape11 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("thermo-lab-escape11", scoreVal, { title: "Thermo Lab Escape11", subject: "Science" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [p, setP] = useState(makePuzzle());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [doors, setDoors] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const submit = () => {
    const val = Number(input);
    if (!Number.isFinite(val)) {
      setFeedback("Enter a number.");
      return;
    }
    const ok = Math.abs(val - p.answer) <= Math.max(0.02 * Math.abs(p.answer), p.unit === "%" ? 0.2 : 0.2);
    if (ok) {
      setScore((s) => s + 10);
      setDoors((d) => d + 1);
      setFeedback(`Door unlocked! Correct \u2248 ${p.answer} ${p.unit}.`);
      setP(makePuzzle());
      setInput("");
    } else {
      setFeedback(`Not yet. Hint: ${p.hint}`);
    }
  };
  const reset = () => {
    setP(makePuzzle());
    setInput("");
    setScore(0);
    setDoors(0);
    setFeedback(null);
  };
  const escaped = doors >= 3;
  return <div className="min-h-screen bg-gradient-to-b from-amber-50 to-red-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Thermodynamics Lab Escape (Grade 11)</h1><p className="text-gray-600 text-sm">Unlock 3 doors by solving heat, work, and efficiency puzzles.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Score: <span className="font-semibold">{score}</span> • Doors: <span className="font-semibold">{doors}/3</span> • Player: {currentUser ?? "You"}</div><div className="bg-gray-50 rounded-xl p-4 border mb-4">{escaped ? <div className="text-green-700">You escaped the lab! 🎉</div> : <><div className="font-semibold mb-2">{p.prompt}</div><div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder={`in ${p.unit}`} /><button onClick={submit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Unlock</button></div>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</>}</div><div className="text-sm text-gray-600">Hints: Q = m c ΔT; W = P ΔV; η = W_out / Q_in × 100%.</div></div>
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
export default ThermoLabEscape11;
