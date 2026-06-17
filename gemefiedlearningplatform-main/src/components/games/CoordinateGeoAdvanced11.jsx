import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
function ri(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generate() {
  const m = ["distance", "slope", "midpoint", "section", "triangleArea"];
  const mode = m[ri(0, m.length - 1)];
  const p1 = { x: ri(-10, 10), y: ri(-10, 10) };
  const p2 = { x: ri(-10, 10), y: ri(-10, 10) };
  if (mode === "distance") {
    const d = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    return { mode, p1, p2, answer: Number(d.toFixed(3)) };
  }
  if (mode === "slope") {
    const dx = p2.x - p1.x;
    const s = dx === 0 ? Infinity : (p2.y - p1.y) / dx;
    return { mode, p1, p2, answer: Number(s.toFixed(3)) };
  }
  if (mode === "midpoint") {
    const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    return { mode, p1, p2, answer: mid };
  }
  if (mode === "section") {
    const m1 = ri(1, 5), n1 = ri(1, 5);
    const x = (m1 * p2.x + n1 * p1.x) / (m1 + n1);
    const y = (m1 * p2.y + n1 * p1.y) / (m1 + n1);
    return { mode, p1, p2, extra: { m: m1, n: n1 }, answer: { x, y } };
  }
  const p3 = { x: ri(-10, 10), y: ri(-10, 10) };
  const area = Math.abs(p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2;
  return { mode: "triangleArea", p1, p2, extra: { p3 }, answer: Number(area.toFixed(2)) };
}
function isCorrect(q, input) {
  const tolNum = 0.05;
  if (q.mode === "midpoint" || q.mode === "section") {
    const m = input.match(/\(?\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)?/);
    if (!m) return false;
    const x = Number(m[1]);
    const y = Number(m[2]);
    return Math.abs(x - q.answer.x) < tolNum && Math.abs(y - q.answer.y) < tolNum;
  }
  const val = Number(input);
  if (!Number.isFinite(val)) return false;
  return Math.abs(val - q.answer) <= (q.mode === "slope" ? 0.05 : 0.05);
}
function prompt(q) {
  const { p1, p2 } = q;
  if (q.mode === "distance") return `Distance between (${p1.x}, ${p1.y}) and (${p2.x}, ${p2.y})? (3 dp)`;
  if (q.mode === "slope") return `Slope between (${p1.x}, ${p1.y}) and (${p2.x}, ${p2.y})? (3 dp)`;
  if (q.mode === "midpoint") return `Midpoint of (${p1.x}, ${p1.y}) and (${p2.x}, ${p2.y})? (format: x,y)`;
  if (q.mode === "section") return `Point dividing (${p1.x}, ${p1.y}) and (${p2.x}, ${p2.y}) internally in ratio ${q.extra.m}:${q.extra.n}? (format: x,y)`;
  const p3 = q.extra.p3;
  return `Area of triangle with vertices (${p1.x}, ${p1.y}), (${p2.x}, ${p2.y}), (${p3.x}, ${p3.y})? (2 dp)`;
}
const CoordinateGeoAdvanced11 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("coordinate-geo-advanced11", scoreVal, { title: "Coordinate Geo Advanced11", subject: "Science" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [q, setQ] = useState(generate());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const submit = () => {
    const ok = isCorrect(q, input.trim());
    if (ok) {
      setScore((s) => s + 10);
      setFeedback("Correct! Speed boost applied.");
      setQ(generate());
      setInput("");
    } else {
      setFeedback("Not quite. Check formulas and try again.");
    }
  };
  const reset = () => {
    setQ(generate());
    setInput("");
    setScore(0);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Coordinate Geometry Race (Advanced, Grade 11)</h1><p className="text-gray-600 text-sm">Now with section formula and triangle area questions.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Score: <span className="font-semibold">{score}</span> • Player: {currentUser ?? "You"}</div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-2">{prompt(q)}</div><div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder={q.mode === "midpoint" || q.mode === "section" ? "x,y" : "number"} /><button onClick={submit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Answer</button></div>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Hints: distance, slope, midpoint, section formula (internal), and area via determinant.</div></div>
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
export default CoordinateGeoAdvanced11;
