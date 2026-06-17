import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
import { ArrowLeft, Shapes, Ruler } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
const PALETTE = ["triangle", "square", "rectangle"];
const label = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const quizFor = (shape) => {
  if (shape === "triangle") return { q: "Sum of interior angles of a triangle?", a: "180\xB0" };
  if (shape === "square") return { q: "Area of a square with side 4?", a: "16" };
  return { q: "Perimeter of a rectangle 3\xD75?", a: "16" };
};
const GeometryBuilder6 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("geometry-builder6", scoreVal, { title: "Geometry Builder6", subject: "Mathematics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const { t } = useTranslation();
  const [slots, setSlots] = useState([
    { id: 1, shape: null },
    { id: 2, shape: null },
    { id: 3, shape: null }
  ]);
  const [quiz, setQuiz] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const onDragStart = (e, shape) => {
    e.dataTransfer.setData("text/plain", shape);
  };
  const handleDrop = (slotId, e) => {
    e.preventDefault();
    const shape = e.dataTransfer.getData("text/plain");
    setSlots((prev) => prev.map((s) => s.id === slotId ? { ...s, shape } : s));
    setQuiz(quizFor(shape));
    setAnswer("");
    setFeedback(null);
  };
  const onDragOver = (e) => e.preventDefault();
  const submitQuiz = () => {
    if (!quiz) return;
    if (answer.trim().toLowerCase() === quiz.a.toLowerCase()) {
      setFeedback("Correct!");
      setQuiz(null);
    } else {
      setFeedback("Try again!");
    }
  };
  const reset = () => {
    setSlots(slots.map((s) => ({ ...s, shape: null })));
    setQuiz(null);
    setAnswer("");
    setFeedback(null);
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-4xl mx-auto"><div className="flex items-center justify-between mb-6"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800"><ArrowLeft className="w-5 h-5 mr-2" /> {t("backToGames")}</button><div className="hidden sm:block text-sm text-gray-700">{t("player") || "Player"}: {currentUser}</div></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="bg-white rounded-xl shadow-sm p-4"><div className="flex items-center mb-3 text-gray-800 font-semibold"><Shapes className="w-5 h-5 mr-2" /> Shapes</div><div className="space-y-2">{PALETTE.map((s) => <div key={s} draggable onDragStart={(e) => onDragStart(e, s)} className="px-3 py-2 rounded border bg-white hover:shadow cursor-move capitalize">{label(s)}</div>)}</div><button onClick={reset} className="mt-4 px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 border">Reset</button></div><div className="md:col-span-2 bg-white rounded-xl shadow-sm p-4"><div className="flex items-center mb-3 text-gray-800 font-semibold"><Ruler className="w-5 h-5 mr-2" /> Build Houses</div><div className="grid grid-cols-3 gap-3">{slots.map((s) => <div key={s.id} onDrop={(e) => handleDrop(s.id, e)} onDragOver={onDragOver} className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center text-gray-500">{s.shape ? label(s.shape) : "Drop shape"}</div>)}</div>{quiz && <div className="mt-4 p-4 rounded bg-blue-50"><div className="font-medium text-gray-800 mb-2">{quiz.q}</div><div className="flex items-center gap-2"><input value={answer} onChange={(e) => setAnswer(e.target.value)} className="px-3 py-2 border rounded w-48" placeholder="Your answer" /><button onClick={submitQuiz} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Submit</button>{feedback && <div className={`text-sm ${feedback === "Correct!" ? "text-green-700" : "text-red-700"}`}>{feedback}</div>}</div></div>}</div></div></div>
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
export default GeometryBuilder6;
