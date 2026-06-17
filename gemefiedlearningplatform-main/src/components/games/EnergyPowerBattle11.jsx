import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function makeQuestion() {
  const t = ["work", "kinetic", "power"];
  const type = t[randInt(0, t.length - 1)];
  if (type === "work") {
    const F = randInt(10, 80);
    const s = randInt(2, 20);
    const theta = [0, 30, 45, 60][randInt(0, 3)];
    const ans2 = Number((F * s * Math.cos(theta * Math.PI / 180)).toFixed(2));
    return { type, data: { F, s, theta }, answer: ans2, unit: "J" };
  }
  if (type === "kinetic") {
    const m = randInt(1, 20);
    const v = randInt(2, 20);
    const ans2 = Number((0.5 * m * v * v).toFixed(2));
    return { type, data: { m, v }, answer: ans2, unit: "J" };
  }
  const W = randInt(100, 2e3);
  const tsec = randInt(2, 20);
  const ans = Number((W / tsec).toFixed(2));
  return { type: "power", data: { W, t: tsec }, answer: ans, unit: "W" };
}
function promptText(q) {
  if (q.type === "work") {
    const { F, s, theta } = q.data;
    return `A force of ${F} N is applied over ${s} m at ${theta}\xB0. Find work (in J).`;
  }
  if (q.type === "kinetic") {
    const { m, v } = q.data;
    return `A body of mass ${m} kg moves at ${v} m/s. Find KE (in J).`;
  }
  const { W, t } = q.data;
  return `A machine does ${W} J of work in ${t} s. Find power (in W).`;
}
const EnergyPowerBattle11 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("energy-power-battle11", scoreVal, { title: "Energy Power Battle11", subject: "Physics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [q, setQ] = useState(makeQuestion());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [shield, setShield] = useState(50);
  const submit = () => {
    const val = Number(input);
    if (!Number.isFinite(val)) {
      setFeedback("Enter a number.");
      return;
    }
    const ok = Math.abs(val - q.answer) <= Math.max(0.02 * q.answer, 0.5);
    if (ok) {
      setScore((s) => s + 10);
      setShield((h) => Math.min(100, h + 10));
      setFeedback(`Correct! +10 shield. True answer \u2248 ${q.answer} ${q.unit}`);
      setQ(makeQuestion());
      setInput("");
    } else {
      setShield((h) => Math.max(0, h - 8));
      setFeedback(`Close! Your answer ${val} vs ${q.answer} ${q.unit}. Shield -8.`);
    }
  };
  const reset = () => {
    setQ(makeQuestion());
    setInput("");
    setScore(0);
    setShield(50);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Energy & Power Battle (Grade 11)</h1><p className="text-gray-600 text-sm">Recharge shields by calculating Work, KE, and Power.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Score: <span className="font-semibold">{score}</span> • Shield: <span className="font-semibold">{shield}</span> • Player: {currentUser ?? "You"}</div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-2">{promptText(q)}</div><div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder={`in ${q.unit}`} /><button onClick={submit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Recharge</button></div>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Hints: W = F s cosθ. KE = 1/2 m v². Power = Work / time.</div></div>
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
export default EnergyPowerBattle11;
