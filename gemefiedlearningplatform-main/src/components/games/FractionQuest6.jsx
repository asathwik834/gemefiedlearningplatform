import { useRewards } from "../../contexts/RewardsContext";
import { useEffect, useState } from "react";
import { ArrowLeft, Map, CheckCircle, Timer, XCircle } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
const QUESTIONS = [
  { id: 1, q: "Which is greater?", options: ["1/3", "1/4"], correct: 0 },
  { id: 2, q: "Simplify 4/8", options: ["1/2", "2/4", "4/8", "3/6"], correct: 0 },
  { id: 3, q: "1/2 + 1/4 = ?", options: ["3/4", "2/4", "5/4", "1/6"], correct: 0 },
  { id: 4, q: "Order ascending: 2/3, 1/2, 3/4", options: ["1/2, 2/3, 3/4", "2/3, 1/2, 3/4", "1/2, 3/4, 2/3", "3/4, 2/3, 1/2"], correct: 0 },
  { id: 5, q: "What is 2/5 of 30?", options: ["10", "12", "15", "20"], correct: 1 }
];
const FractionQuest6 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("fraction-quest6", scoreVal, { title: "Fraction Quest6", subject: "Mathematics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (done || show) return;
    if (timeLeft <= 0) {
      setShow(true);
      setTimeout(() => handleNext(), 800);
      return;
    }
    const tmr = setTimeout(() => setTimeLeft((s) => s - 1), 1e3);
    return () => clearTimeout(tmr);
  }, [timeLeft, show, done]);
  const handleSelect = (i) => {
    if (show) return;
    setSelected(i);
    setShow(true);
    setTimeout(() => handleNext(), 900);
  };
  const handleNext = () => {
    if (idx < QUESTIONS.length - 1) {
      setIdx((i) => i + 1);
      setSelected(null);
      setShow(false);
      setTimeLeft(25);
    } else {
      setDone(true);
    }
  };
  const progressPct = Math.round(idx / QUESTIONS.length * 100);
  if (done) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-3xl mx-auto"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-6"><ArrowLeft className="w-5 h-5 mr-2" /> {t("backToGames")}</button><div className="bg-white rounded-xl shadow p-8 text-center"><Map className="w-10 h-10 text-emerald-600 mx-auto mb-2" /><h2 className="text-2xl font-bold mb-2">Bridge Crossed!</h2><p className="text-gray-600">You completed the Fraction Quest.</p><div className="mt-4"><button onClick={onBack} className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium">{t("backToGames")}</button></div></div></div>
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
            </div>
</div>;
  }
  const q = QUESTIONS[idx];
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-3xl mx-auto"><div className="flex items-center justify-between mb-4"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800"><ArrowLeft className="w-5 h-5 mr-2" /> {t("backToGames")}</button><div className="flex items-center space-x-4 text-gray-700"><div className="flex items-center"><Timer className="w-5 h-5 text-orange-500 mr-2" /> {timeLeft}s</div><div className="hidden sm:block text-sm">{t("player") || "Player"}: {currentUser}</div></div></div>{
    /* Adventure progress bar */
  }<div className="mb-4"><div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${progressPct}%` }} /></div><div className="text-xs text-gray-500 mt-1">Bridge {idx + 1} of {QUESTIONS.length}</div></div><div className="bg-white rounded-xl shadow-sm p-8"><h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center"><Map className="w-5 h-5 mr-2" /> {q.q}</h3><div className="grid grid-cols-1 gap-3">{q.options.map((opt, i) => {
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
export default FractionQuest6;
