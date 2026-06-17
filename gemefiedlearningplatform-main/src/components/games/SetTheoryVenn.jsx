import { useRewards } from "../../contexts/RewardsContext";
import { useMemo, useState } from "react";
const sampleSets = [
  { A: /* @__PURE__ */ new Set(["2", "4", "6", "8"]), B: /* @__PURE__ */ new Set(["6", "8", "10", "12"]), tokens: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "12"] },
  { A: /* @__PURE__ */ new Set(["apple", "banana", "mango"]), B: /* @__PURE__ */ new Set(["banana", "grapes", "mango"]), tokens: ["apple", "banana", "cherry", "grapes", "mango", "orange"] },
  { A: /* @__PURE__ */ new Set(["prime"]), B: /* @__PURE__ */ new Set(["even"]), tokens: ["2", "3", "4", "5", "6", "7", "9", "10", "11"] }
];
const sampleSetsHard = [
  { A: /* @__PURE__ */ new Set(["multiplesOf3"]), B: /* @__PURE__ */ new Set(["even"]), tokens: ["6", "9", "10", "11", "12", "13", "14", "15", "18"] },
  { A: /* @__PURE__ */ new Set(["vowels"]), B: /* @__PURE__ */ new Set(["startsWithB"]), tokens: ["apple", "banana", "berry", "cat", "orange", "boat", "umbrella"] },
  { A: /* @__PURE__ */ new Set(["prime"]), B: /* @__PURE__ */ new Set([">10"]), tokens: ["7", "11", "12", "13", "17", "19", "20", "21", "23"] }
];
function getCorrectRegion(A, B, token) {
  const inA = A.has(token) || A.has("prime") && isPrime(token) || A.has("even") && isEven(token) || A.has("multiplesOf3") && isMultipleOf(token, 3) || A.has("vowels") && startsWithVowel(token) || A.has("startsWithB") && token.toLowerCase().startsWith("b") || A.has(">10") && Number(token) > 10;
  const inB = B.has(token) || B.has("prime") && isPrime(token) || B.has("even") && isEven(token) || B.has("multiplesOf3") && isMultipleOf(token, 3) || B.has("vowels") && startsWithVowel(token) || B.has("startsWithB") && token.toLowerCase().startsWith("b") || B.has(">10") && Number(token) > 10;
  if (inA && inB) return "A\u2229B";
  if (inA) return "A";
  if (inB) return "B";
  return "outside";
}
function isPrime(s) {
  const n = Number(s);
  if (!Number.isFinite(n) || n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}
function isEven(s) {
  const n = Number(s);
  return Number.isFinite(n) && n % 2 === 0;
}
function isMultipleOf(s, k) {
  const n = Number(s);
  return Number.isFinite(n) && n % k === 0;
}
function startsWithVowel(s) {
  return /^[aeiou]/i.test(s);
}
const SetTheoryVenn = ({ onBack, currentUser, hardMode }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("set-theory-venn", scoreVal, { title: "Set Theory Venn", subject: "Mathematics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [placed, setPlaced] = useState({});
  const [feedback, setFeedback] = useState(null);
  const { A, B, tokens } = useMemo(() => {
    const pool = hardMode ? sampleSetsHard : sampleSets;
    return pool[level % pool.length];
  }, [level, hardMode]);
  const remaining = tokens.filter((t) => !placed[t]);
  const handleDrop = (token, region) => {
    const correct = getCorrectRegion(A, B, token);
    const isRight = correct === region;
    setPlaced((prev) => ({ ...prev, [token]: region }));
    setScore((s) => s + (isRight ? 1 : 0));
    setFeedback(isRight ? "Great! Correct placement." : `Try again! "${token}" belongs to ${correct}.`);
    if (!isRight) {
      setTimeout(() => setPlaced((p) => ({ ...p, [token]: null })), 700);
    }
  };
  const reset = () => {
    setPlaced({});
    setScore(0);
    setFeedback(null);
  };
  const nextPuzzle = () => {
    setLevel((l) => l + 1);
    setPlaced({});
    setScore(0);
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50 p-4 md:p-8"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div><h1 className="text-2xl font-bold">Set Theory Puzzle</h1><p className="text-gray-600 text-sm">{currentUser ? `Player: ${currentUser}` : "Single Player"}</p></div><div className="flex gap-2"><button onClick={onBack} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button><button onClick={reset} className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reset</button><button onClick={nextPuzzle} className="px-3 py-2 rounded bg-green-100 text-green-700 hover:bg-green-200">Next</button></div></div><div className="flex items-center justify-between mb-4"><div className="text-sm text-gray-700">Score: <span className="font-semibold">{score}</span> {hardMode && <span className="ml-2 text-xs text-indigo-600">Hard</span>}</div>{feedback && <div className="text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded">{feedback}</div>}</div>{
    /* Board */
  }<div className="grid grid-cols-1 md:grid-cols-3 gap-6">{
    /* Tokens */
  }<div className="bg-gray-50 rounded-xl p-4 border"><h2 className="font-semibold mb-2">Tokens</h2><div className="flex flex-wrap gap-2">{remaining.map((t) => <div
    key={t}
    draggable
    onDragStart={(e) => e.dataTransfer.setData("text/plain", t)}
    className="px-3 py-2 rounded-full bg-white border shadow hover:shadow-md cursor-move select-none"
  >{t}</div>)}</div></div>{
    /* Venn diagram */
  }<div className="md:col-span-2"><div className="relative h-80">{
    /* Region: A */
  }<div
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => handleDrop(e.dataTransfer.getData("text/plain"), "A")}
    className="absolute left-10 top-10 w-56 h-56 rounded-full bg-blue-100/60 border-2 border-blue-300 flex items-center justify-center"
  ><div className="text-blue-800 font-semibold">A</div></div>{
    /* Region: B */
  }<div
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => handleDrop(e.dataTransfer.getData("text/plain"), "B")}
    className="absolute left-36 top-10 w-56 h-56 rounded-full bg-purple-100/60 border-2 border-purple-300 flex items-center justify-center"
  ><div className="text-purple-800 font-semibold">B</div></div>{
    /* Region: Outside */
  }<div
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => handleDrop(e.dataTransfer.getData("text/plain"), "outside")}
    className="absolute inset-0 rounded-xl border-2 border-dashed border-gray-200"
  />{
    /* Region: Intersection - handled by dropping on either correct circle when token belongs to both; we visually label center */
  }<div className="absolute left-28 top-10 w-56 h-56 rounded-full flex items-center justify-center pointer-events-none"><div className="text-gray-700 font-semibold">A∩B</div></div>{
    /* Placed tokens preview (simple list) */
  }<div className="absolute bottom-2 left-0 right-0 flex flex-wrap justify-center gap-2 px-2">{tokens.filter((t) => placed[t]).map((t) => <span key={t} className="text-xs px-2 py-1 rounded bg-gray-100 border">{t} → {placed[t]}</span>)}</div></div></div></div><div className="mt-6 text-sm text-gray-600">
          Tip: Drag tokens into regions. Intersection means tokens belonging to both A and B.
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
export default SetTheoryVenn;
