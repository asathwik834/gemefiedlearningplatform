import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
function norm(s) {
  return s.trim().replace(/\s+/g, "").toLowerCase();
}
function makeSeparable() {
  const k = [1, 2, 3, -1, -2][Math.floor(Math.random() * 5)];
  return {
    mode: "separable",
    prompt: `Solve dy/dx = ${k} y. Enter general solution (omit constant), e.g., y=exp(x).`,
    answer: `y=exp(${k}x)`,
    hint: "\u222B dy/y = \u222B k dx \u21D2 ln y = kx + C \u21D2 y = C e^{kx}. Omit C."
  };
}
function makeLinearIF() {
  const p = [1, 2, 3][Math.floor(Math.random() * 3)], q = [0, 1, 2][Math.floor(Math.random() * 3)];
  return {
    mode: "linearIF",
    prompt: `Solve y' + ${p} y = ${q}. Enter canonical solution form: y = A e^(-${p}x) + ${q}/${p} (omit A).`,
    answer: `y=aexp(-${p}x)+${q}/${p}`,
    hint: "IF = e^{\u222Bp dx}. y = Ce^{-px} + q/p."
  };
}
function makeSlopeField() {
  const a = [1, -1, 2][-~(Math.random() * 3) | 0] || 1;
  const b = [1, -1, 0][Math.floor(Math.random() * 3)];
  const signAt10 = Math.sign(a * 1 + b * 0);
  const trend = signAt10 > 0 ? "increasing at x>0" : signAt10 < 0 ? "decreasing at x>0" : "flat along x-axis";
  return {
    mode: "slopeField",
    prompt: `Consider dy/dx = ${a}x + ${b}y at point (1,0). Describe local trend: increasing at x>0, decreasing at x>0, or flat along x-axis?`,
    answer: trend,
    hint: "Evaluate dy/dx at (1,0). Sign >0 increasing, <0 decreasing, 0 flat."
  };
}
function makePuzzle() {
  const makers = [makeSeparable, makeLinearIF, makeSlopeField];
  return makers[Math.floor(Math.random() * makers.length)]();
}
const DifferentialEquationsRescue12 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("differential-equations-rescue12", scoreVal, { title: "Differential Equations Rescue12", subject: "Science" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [p, setP] = useState(makePuzzle());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [battery, setBattery] = useState(50);
  const [feedback, setFeedback] = useState(null);
  const submit = () => {
    const s = norm(input);
    let ok = false;
    if (p.mode === "separable") {
      ok = s === norm(p.answer) || s === norm("y = e^{" + p.answer.split("exp(")[1]);
    } else if (p.mode === "linearIF") {
      const base = norm(p.answer).replace("a", "a");
      ok = /y=ae\^\(-\d+x\)\+\d+\/\d+/i.test(s) || s === base;
    } else {
      ok = s === norm(p.answer);
    }
    if (ok) {
      setScore((v) => v + 10);
      setBattery((v) => Math.min(100, v + 10));
      setFeedback("Autopilot updated!");
      setP(makePuzzle());
      setInput("");
    } else {
      setBattery((v) => Math.max(0, v - 8));
      setFeedback("Check method. Hint: " + p.hint);
    }
  };
  const reset = () => {
    setP(makePuzzle());
    setInput("");
    setScore(0);
    setBattery(50);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Differential Equations Rescue (Grade 12)</h1><p className="text-gray-600 text-sm">Solve ODE prompts to guide the rescue drone.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Player: <span className="font-semibold">{currentUser ?? "You"}</span> • Score: <span className="font-semibold">{score}</span> • Battery: <span className="font-semibold">{battery}</span></div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-2">{p.prompt}</div><div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Your answer" /><button onClick={submit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Confirm</button></div>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Hints: separable integrates to ln y = ∫k dx; linear IF uses e^(∫p dx); slope field uses sign of dy/dx.</div></div>
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
export default DifferentialEquationsRescue12;
