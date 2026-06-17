import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
import { ArrowLeft, Triangle, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
const QUESTIONS = [
  { id: 1, q: "In right triangle, sin \u03B8 =", options: ["Opp/Hyp", "Adj/Hyp", "Opp/Adj", "Hyp/Opp"], correct: 0 },
  { id: 2, q: "cos 0\xB0 =", options: ["0", "1", "\u221A2/2", "undefined"], correct: 1 },
  { id: 3, q: "tan \u03B8 =", options: ["Opp/Hyp", "Adj/Hyp", "Opp/Adj", "Hyp/Adj"], correct: 2 },
  { id: 4, q: "For \u03B8=30\xB0, sin \u03B8 =", options: ["1/2", "\u221A3/2", "\u221A2/2", "1"], correct: 0 },
  { id: 5, q: "Pythagorean identity", options: ["sin\xB2\u03B8 + cos\xB2\u03B8 = 1", "sin\xB2\u03B8 \u2212 cos\xB2\u03B8 = 1", "tan\xB2\u03B8 + 1 = sin\xB2\u03B8", "1 + cos\xB2\u03B8 = tan\xB2\u03B8"], correct: 0 }
];
const TrigonometryBasics9 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("trigonometry-basics9", scoreVal, { title: "Trigonometry Basics9", subject: "Mathematics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const handleSelect = (i) => {
    if (show) return;
    setSelected(i);
    setShow(true);
    if (i === QUESTIONS[idx].correct) setScore((s) => s + 10);
    setTimeout(() => handleNext(), 800);
  };
  const handleNext = () => {
    if (idx < QUESTIONS.length - 1) {
      setIdx((i) => i + 1);
      setSelected(null);
      setShow(false);
    } else setDone(true);
  };
  if (done) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-2xl mx-auto"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-6"><ArrowLeft className="w-5 h-5 mr-2" />{t("backToGames")}</button><div className="bg-white rounded-xl shadow p-8 text-center"><Triangle className="w-10 h-10 text-indigo-600 mx-auto mb-2" /><h2 className="text-2xl font-bold mb-2">{t("gameComplete")}</h2><p className="text-gray-700">{t("totalPoints")}: {score}</p>
            <div className="mt-4 flex flex-col items-center justify-center gap-2">
              <button
                onClick={handleSubmitScore}
                disabled={submitted}
                className={`px-6 py-2 rounded-lg font-semibold text-white transition-all ${
                  submitted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md hover:shadow-lg"
                }`}
              >
                {submitted ? "Score Submitted!" : "Submit Score"}
              </button>
              {submitted && (
                <p className="text-sm font-medium text-emerald-600 animate-fade-in">
                  ✓ Progress successfully saved to MySQL database!
                </p>
              )}
            </div></div></div></div>;
  const q = QUESTIONS[idx];
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-2xl mx-auto"><div className="flex items-center justify-between mb-6"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800"><ArrowLeft className="w-5 h-5 mr-2" />{t("backToGames")}</button><div className="hidden sm:block text-sm text-gray-700">{t("player") || "Player"}: {currentUser}</div></div><div className="bg-white rounded-xl shadow-sm p-8"><h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center"><Triangle className="w-5 h-5 mr-2" />{q.q}</h3><div className="grid grid-cols-1 gap-3">{q.options.map((opt, i) => {
    const correct = i === q.correct;
    const isSel = i === selected;
    let cls = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ";
    if (show) {
      if (correct) cls += "border-green-500 bg-green-50 text-green-800";
      else if (isSel) cls += "border-red-500 bg-red-50 text-red-800";
      else cls += "border-gray-200 bg-gray-50 text-gray-500";
    } else {
      cls += "border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700";
    }
    return <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={show}><div className="flex items-center justify-between"><span>{opt}</span>{show && correct && <CheckCircle className="w-5 h-5 text-green-600" />}{show && isSel && !correct && <XCircle className="w-5 h-5 text-red-600" />}</div></button>;
  })}</div></div></div></div>;
};
export default TrigonometryBasics9;
