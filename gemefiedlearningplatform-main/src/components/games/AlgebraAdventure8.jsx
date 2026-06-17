import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
import { ArrowLeft, KeyRound, CheckCircle, XCircle, Map } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
const QUESTIONS = [
  { id: 1, q: "Solve: 2x + 5 = 17", options: ["x = 5", "x = 6", "x = 7", "x = 8"], correct: 1 },
  { id: 2, q: "Solve: 3(x - 2) = 9", options: ["x = 3", "x = 4", "x = 5", "x = 6"], correct: 1 },
  { id: 3, q: "Simplify: 5y - 2y + 6", options: ["7y + 6", "3y + 6", "7y - 6", "3y - 6"], correct: 1 },
  { id: 4, q: "Word: A number increased by 7 is 19. The number is", options: ["10", "11", "12", "13"], correct: 1 },
  { id: 5, q: "Solve: x/4 = 3", options: ["x = 7", "x = 10", "x = 12", "x = 16"], correct: 2 }
];
const AlgebraAdventure8 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("algebra-adventure8", scoreVal, { title: "Algebra Adventure8", subject: "Mathematics" });
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
    setTimeout(() => handleNext(), 900);
  };
  const handleNext = () => {
    if (idx < QUESTIONS.length - 1) {
      setIdx((i) => i + 1);
      setSelected(null);
      setShow(false);
    } else {
      setDone(true);
    }
  };
  const progress = Math.round(idx / QUESTIONS.length * 100);
  if (done) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-2xl mx-auto"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-6"><ArrowLeft className="w-5 h-5 mr-2" /> {t("backToGames")}</button><div className="bg-white rounded-xl shadow p-8 text-center"><KeyRound className="w-10 h-10 text-purple-600 mx-auto mb-2" /><h2 className="text-2xl font-bold mb-2">Treasure Unlocked!</h2><p className="text-gray-700">{t("totalPoints")}: {score}</p></div></div>
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
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-2xl mx-auto"><div className="flex items-center justify-between mb-4"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800"><ArrowLeft className="w-5 h-5 mr-2" /> {t("backToGames")}</button><div className="hidden sm:block text-sm text-gray-700">{t("player") || "Player"}: {currentUser}</div></div><div className="mb-4"><div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-purple-500" style={{ width: `${progress}%` }} /></div><div className="text-xs text-gray-500 mt-1">Door {idx + 1} of {QUESTIONS.length}</div></div><div className="bg-white rounded-xl shadow-sm p-8"><h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center"><Map className="w-5 h-5 mr-2" /> {q.q}</h3><div className="grid grid-cols-1 gap-3">{q.options.map((opt, i) => {
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
export default AlgebraAdventure8;
