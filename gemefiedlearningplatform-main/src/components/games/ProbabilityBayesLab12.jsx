import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
function round(n, dp = 4) {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
}
function makeMedical() {
  const p = round(0.01 + Math.random() * 0.29, 3);
  const se = round(0.8 + Math.random() * 0.19, 2);
  const sp = round(0.8 + Math.random() * 0.19, 2);
  const num = se * p;
  const den = se * p + (1 - sp) * (1 - p);
  const post = num / den;
  return {
    mode: "medicalTest",
    prompt: `A disease has prevalence p=${(p * 100).toFixed(1)}%. A test has sensitivity ${se.toFixed(2)} and specificity ${sp.toFixed(2)}. If a person tests positive, compute P(disease | +) as a decimal to 3 d.p.`,
    answer: round(post, 3),
    hint: "Bayes: P(D|+) = (se\xB7p) / (se\xB7p + (1\u2212sp)\xB7(1\u2212p))"
  };
}
function makeUrn() {
  const q = round(0.3 + Math.random() * 0.6, 2);
  const aR = Math.floor(3 + Math.random() * 4);
  const aB = Math.floor(3 + Math.random() * 4);
  const bR = Math.floor(3 + Math.random() * 4);
  const bB = Math.floor(3 + Math.random() * 4);
  const pa = q;
  const pb = 1 - q;
  const pRed = pa * (aR / (aR + aB)) + pb * (bR / (bR + bB));
  return {
    mode: "urn",
    prompt: `Choose Urn A with probability q=${q.toFixed(2)} (else Urn B). Urn A has ${aR} red, ${aB} blue. Urn B has ${bR} red, ${bB} blue. Draw one ball. Compute P(Red) to 3 d.p.`,
    answer: round(pRed, 3),
    hint: "Law of total probability: P(R) = q\xB7P(R|A) + (1\u2212q)\xB7P(R|B)"
  };
}
function makePuzzle() {
  return Math.random() < 0.5 ? makeMedical() : makeUrn();
}
const ProbabilityBayesLab12 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("probability-bayes-lab12", scoreVal, { title: "Probability Bayes Lab12", subject: "Mathematics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [p, setP] = useState(makePuzzle());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [resources, setResources] = useState(50);
  const [feedback, setFeedback] = useState(null);
  const submit = () => {
    const v = Number(input);
    if (!Number.isFinite(v)) {
      setFeedback("Enter a numeric probability (0..1).");
      return;
    }
    const ok = Math.abs(v - p.answer) <= 0.01;
    if (ok) {
      setScore((s) => s + 10);
      setResources((r) => Math.min(100, r + 10));
      setFeedback("Correct! Posterior updated.");
      setP(makePuzzle());
      setInput("");
    } else {
      setResources((r) => Math.max(0, r - 8));
      setFeedback("Not quite. Hint: " + p.hint);
    }
  };
  const reset = () => {
    setP(makePuzzle());
    setInput("");
    setScore(0);
    setResources(50);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-teal-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Probability Bayes Lab (Grade 12)</h1><p className="text-gray-600 text-sm">Update beliefs with Bayes. Manage limited lab resources.</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button></div></div><div className="mb-4 text-sm text-gray-700">Player: <span className="font-semibold">{currentUser ?? "You"}</span> • Score: <span className="font-semibold">{score}</span> • Resources: <span className="font-semibold">{resources}</span></div><div className="bg-gray-50 rounded-xl p-4 border mb-4"><div className="font-semibold mb-2">{p.prompt}</div><div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="e.g., 0.423" /><button onClick={submit} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Update</button></div>{feedback && <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div><div className="text-sm text-gray-600">Hints: Bayes’ theorem and total probability rule are your best tools.</div></div>
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
export default ProbabilityBayesLab12;
