import { useRewards } from "../../contexts/RewardsContext";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, Timer, XCircle } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
const QUESTIONS = [
  { id: 1, q: "Which of these is a prime number?", options: ["21", "29", "1", "35"], correct: 1 },
  { id: 2, q: "Which of these is NOT a prime number?", options: ["2", "3", "9", "11"], correct: 2 },
  { id: 3, q: "What are the prime factors of 18?", options: ["2 \xD7 9", "3 \xD7 6", "2 \xD7 3 \xD7 3", "18 \xD7 1"], correct: 2 },
  { id: 4, q: "Is 1 a prime number?", options: ["Yes", "No"], correct: 1 },
  { id: 5, q: "Smallest prime number is", options: ["0", "1", "2", "3"], correct: 2 },
  { id: 6, q: "Which is a composite number?", options: ["13", "17", "23", "21"], correct: 3 },
  { id: 7, q: "Which pair are twin primes?", options: ["9 & 11", "11 & 13", "13 & 17", "17 & 19"], correct: 1 }
];
const PrimeDetective = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("prime-detective", scoreVal, { title: "Prime Detective", subject: "Science" });
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
  const [timeLeft, setTimeLeft] = useState(20);
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
    if (i === QUESTIONS[idx].correct) {
      setScore((s) => s + 10);
    }
    setTimeout(() => handleNext(), 800);
  };
  const handleNext = () => {
    if (idx < QUESTIONS.length - 1) {
      setIdx((i) => i + 1);
      setSelected(null);
      setShow(false);
      setTimeLeft(20);
    } else {
      setDone(true);
    }
  };
  const restart = () => {
    setIdx(0);
    setSelected(null);
    setShow(false);
    setScore(0);
    setTimeLeft(20);
    setDone(false);
  };
  if (done) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-2xl mx-auto"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-6"><ArrowLeft className="w-5 h-5 mr-2" /> {t("backToGames")}</button><div className="bg-white rounded-xl shadow p-8 text-center"><h2 className="text-2xl font-bold mb-2">{t("gameComplete")}</h2><p className="text-gray-600 mb-6">{t("totalPoints")}: {score}</p>
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
            </div><div className="space-x-3"><button onClick={restart} className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium">{t("playAgain")}</button><button onClick={onBack} className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium">{t("backToGames")}</button></div></div></div></div>;
  }
  const q = QUESTIONS[idx];
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-2xl mx-auto"><div className="flex items-center justify-between mb-6"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800"><ArrowLeft className="w-5 h-5 mr-2" /> {t("backToGames")}</button><div className="flex items-center space-x-4 text-gray-700"><div className="flex items-center"><Timer className="w-5 h-5 text-orange-500 mr-2" /> {timeLeft}s</div><div className="hidden sm:block text-sm">{t("player") || "Player"}: {currentUser}</div></div></div><div className="bg-white rounded-xl shadow-sm p-8"><h3 className="text-xl font-semibold text-gray-900 mb-4">{q.q}</h3><div className="grid grid-cols-1 gap-3">{q.options.map((opt, i) => {
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
export default PrimeDetective;
