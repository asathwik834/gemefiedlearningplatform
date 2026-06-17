import { useRewards } from "../../contexts/RewardsContext";
import { useEffect, useMemo, useState } from "react";
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateQuestion(hard = false) {
  const range = hard ? 10 : 5;
  const p1 = { x: randomInt(-range, range), y: randomInt(-range, range) };
  const p2 = { x: randomInt(-range, range), y: randomInt(-range, range) };
  const modes = ["distance", "slope", "midpoint"];
  const mode = modes[randomInt(0, modes.length - 1)];
  if (mode === "distance") {
    const d = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    return { p1, p2, mode, answer: Number(d.toFixed(hard ? 3 : 2)) };
  }
  if (mode === "slope") {
    const dx = p2.x - p1.x;
    const m = dx === 0 ? Infinity : (p2.y - p1.y) / dx;
    return { p1, p2, mode, answer: Number(m.toFixed(hard ? 3 : 2)) };
  }
  const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  return { p1, p2, mode, answer: mid };
}
function isCorrect(q, input, hard = false) {
  if (q.mode === "midpoint") {
    const m = input.match(/\(?\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)?/);
    if (!m) return false;
    const x = Number(m[1]);
    const y = Number(m[2]);
    const tol2 = hard ? 0.01 : 0.05;
    return Math.abs(x - q.answer.x) < tol2 && Math.abs(y - q.answer.y) < tol2;
  }
  const val = Number(input);
  if (!Number.isFinite(val)) return false;
  const ans = q.answer;
  const tol = hard ? 0.03 : 0.1;
  return Math.abs(val - ans) <= tol;
}
const CoordinateRace = ({ onBack, currentUser, hardMode }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("coordinate-race", scoreVal, { title: "Coordinate Race", subject: "Science" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [question, setQuestion] = useState(generateQuestion(!!hardMode));
  const [input, setInput] = useState("");
  const [speed, setSpeed] = useState(hardMode ? 0.9 : 1);
  const [progress, setProgress] = useState(0);
  const [ghostProgress, setGhostProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => Math.min(100, p + speed * 0.5));
      setGhostProgress((g) => Math.min(100, g + (hardMode ? 1 : 0.8)));
    }, 60);
    return () => clearInterval(id);
  }, [speed, hardMode]);
  useEffect(() => {
    if (progress >= 100 || ghostProgress >= 100) {
      setFeedback(progress >= 100 ? "You win the race! \u{1F389}" : "Ghost wins! Try again.");
    }
  }, [progress, ghostProgress]);
  const onSubmit = () => {
    if (progress >= 100 || ghostProgress >= 100) return;
    const ok = isCorrect(question, input.trim(), !!hardMode);
    if (ok) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const bonus = 2 + Math.min(3, newStreak * (hardMode ? 0.6 : 0.5));
      setSpeed((s) => Math.min(5, s + 0.3));
      setFeedback(`Correct! +boost (${bonus.toFixed(1)})`);
      setQuestion(generateQuestion(!!hardMode));
      setInput("");
    } else {
      setStreak(0);
      setSpeed((s) => Math.max(1, s - 0.2));
      setFeedback("Oops! Small slowdown.");
    }
  };
  const reset = () => {
    setProgress(0);
    setGhostProgress(0);
    setSpeed(1);
    setStreak(0);
    setFeedback(null);
    setQuestion(generateQuestion(!!hardMode));
    setInput("");
  };
  const qText = useMemo(() => {
    const { p1, p2, mode } = question;
    if (mode === "distance") return `Distance between (${p1.x}, ${p1.y}) and (${p2.x}, ${p2.y})? (2 dp)`;
    if (mode === "slope") return `Slope between (${p1.x}, ${p1.y}) and (${p2.x}, ${p2.y})? (2 dp)`;
    return `Midpoint of (${p1.x}, ${p1.y}) and (${p2.x}, ${p2.y})? (format: x,y)`;
  }, [question]);
  return <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Coordinate Geometry Race</h1>{hardMode && <span className="ml-2 inline-block align-middle text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">Hard</span>}<p className="text-gray-600 text-sm">Solve to boost speed and win the lap.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 flex items-center gap-4 text-sm"><div>Player: <span className="font-semibold">{currentUser ?? "You"}</span></div><div>Streak: <span className="font-semibold">{streak}</span></div><div>Speed: <span className="font-semibold">{speed.toFixed(1)}</span></div></div>{
    /* Track */
  }<div className="relative h-32 bg-gray-50 border rounded-xl overflow-hidden mb-6"><div className="absolute inset-0 flex items-center"><div className="w-full h-1 bg-gradient-to-r from-gray-200 to-gray-300" /></div><div
    className="absolute top-4 left-0 h-6 w-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center"
    style={{ transform: `translateX(${progress}%)` }}
  >P</div><div
    className="absolute top-16 left-0 h-6 w-6 rounded-full bg-gray-500 text-white text-xs flex items-center justify-center"
    style={{ transform: `translateX(${ghostProgress}%)` }}
  >G</div></div>{
    /* Question */
  }<div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-2">{qText}</div><div className="flex gap-2"><input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    className="flex-1 border rounded px-3 py-2"
    placeholder={question.mode === "midpoint" ? "e.g., 1.5,2" : "e.g., 2.83"}
  /><button onClick={onSubmit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Boost!</button></div>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div>{
    /* Solution hint */
  }<div className="text-sm text-gray-600">
          Hints: distance = sqrt((x2-x1)^2 + (y2-y1)^2); slope = (y2-y1)/(x2-x1); midpoint = ((x1+x2)/2, (y1+y2)/2)
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
export default CoordinateRace;
