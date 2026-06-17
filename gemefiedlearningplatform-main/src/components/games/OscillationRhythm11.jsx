import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
function ri(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function makeQuestion() {
  const modes = ["freq", "period", "phase", "equationMatch"];
  const mode = modes[ri(0, modes.length - 1)];
  if (mode === "freq") {
    const T = ri(1, 10);
    const f2 = (1 / T).toFixed(2);
    return { mode, data: { T }, answer: f2, displayAnswer: `${f2} Hz` };
  }
  if (mode === "period") {
    const f2 = ri(1, 10);
    const T = (1 / f2).toFixed(2);
    return { mode, data: { f: f2 }, answer: T, displayAnswer: `${T} s` };
  }
  if (mode === "phase") {
    const phiDeg2 = [0, 30, 45, 60, 90, 120, 150, 180][ri(0, 7)];
    return { mode, data: { phiDeg: phiDeg2 }, answer: `${phiDeg2}` };
  }
  const A = ri(1, 5);
  const f = ri(1, 5);
  const phiDeg = [0, 30, 45, 60, 90][ri(0, 4)];
  const eq = `y = ${A} sin(2\u03C0\xB7${f}\xB7t + ${phiDeg}\xB0)`;
  return { mode: "equationMatch", data: { eq }, answer: `${A},${f},${phiDeg}` };
}
function prompt(q) {
  if (q.mode === "freq") return `A wave has period T = ${q.data.T} s. Find frequency f (Hz) to 2 d.p.`;
  if (q.mode === "period") return `A wave has frequency f = ${q.data.f} Hz. Find period T (s) to 2 d.p.`;
  if (q.mode === "phase") return `Given a sine wave leads by \u03C6 degrees. If shown as y = A sin(\u03C9t + \u03C6), enter \u03C6 in degrees (e.g., 60). Sample \u03C6 = ${q.data.phiDeg}\xB0`;
  return `Identify A, f, \u03C6 from: ${q.data.eq}  (format: A,f,phi).`;
}
function normalize(input) {
  return input.trim().replace(/\s+/g, "").toLowerCase();
}
const OscillationRhythm11 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("oscillation-rhythm11", scoreVal, { title: "Oscillation Rhythm11", subject: "Physics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [q, setQ] = useState(makeQuestion());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const submit = () => {
    const inp = normalize(input);
    const ans = normalize(q.answer);
    const ok = q.mode === "equationMatch" ? inp === ans : Math.abs(Number(inp) - Number(ans)) <= 0.01;
    if (ok) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore((s) => s + 10 + Math.min(10, newStreak * 2));
      setFeedback(`Perfect timing! ${q.displayAnswer ? `Answer: ${q.displayAnswer}` : ""}`);
      setQ(makeQuestion());
      setInput("");
    } else {
      setStreak(0);
      setFeedback(`Off-beat. ${q.displayAnswer ? `Correct \u2248 ${q.displayAnswer}` : ""}`);
    }
  };
  const reset = () => {
    setQ(makeQuestion());
    setInput("");
    setScore(0);
    setStreak(0);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Oscillation Rhythm (Grade 11)</h1><p className="text-gray-600 text-sm">Match frequency, period, and phase to keep the beat.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Score: <span className="font-semibold">{score}</span> • Streak: <span className="font-semibold">{streak}</span> • Player: {currentUser ?? "You"}</div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-2">{prompt(q)}</div><div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder={q.mode === "equationMatch" ? "A,f,phi" : "number"} /><button onClick={submit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Tap</button></div>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Hints: f = 1/T. y = A sin(2π f t + φ). φ in degrees for this game.</div></div>
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
export default OscillationRhythm11;
