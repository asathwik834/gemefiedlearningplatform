import { useRewards } from "../../contexts/RewardsContext";
import { useEffect, useState } from "react";
import { ArrowLeft, Timer, Zap, CheckCircle } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function makeQuestion() {
  const a = randInt(2, 12);
  const b = randInt(2, 12);
  return { a, b, answer: a * b };
}
const TimesTablesRush = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("times-tables-rush", scoreVal, { title: "Times Tables Rush", subject: "Mathematics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [q, setQ] = useState(makeQuestion());
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState(null);
  useEffect(() => {
    if (done) return;
    if (timeLeft <= 0) {
      setDone(true);
      return;
    }
    const tmr = setTimeout(() => setTimeLeft((s) => s - 1), 1e3);
    return () => clearTimeout(tmr);
  }, [timeLeft, done]);
  const submit = () => {
    if (done) return;
    const val = parseInt(input, 10);
    if (!Number.isFinite(val)) return;
    if (val === q.answer) {
      setScore((s) => s + 5);
      setStreak((s) => s + 1);
      setFeedback("correct");
    } else {
      setStreak(0);
      setFeedback("incorrect");
    }
    setTimeout(() => {
      setQ(makeQuestion());
      setInput("");
      setFeedback(null);
    }, 300);
  };
  const restart = () => {
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setQ(makeQuestion());
    setInput("");
    setDone(false);
    setFeedback(null);
  };
  if (done) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-2xl mx-auto"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-6"><ArrowLeft className="w-5 h-5 mr-2" /> {t("backToGames")}</button><div className="bg-white rounded-xl shadow p-8 text-center"><Zap className="w-10 h-10 text-orange-500 mx-auto mb-2" /><h2 className="text-2xl font-bold mb-2">{t("gameComplete")}</h2><p className="text-gray-700 mb-1">{t("totalPoints")}: {score}</p>
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
            </div><p className="text-gray-500 mb-6">{t("streak")}: {streak}</p><div className="space-x-3"><button onClick={restart} className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium">{t("playAgain")}</button><button onClick={onBack} className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium">{t("backToGames")}</button></div></div></div></div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-2xl mx-auto"><div className="flex items-center justify-between mb-6"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800"><ArrowLeft className="w-5 h-5 mr-2" /> {t("backToGames")}</button><div className="flex items-center space-x-4 text-gray-700"><div className="flex items-center"><Timer className="w-5 h-5 text-orange-500 mr-2" />{timeLeft}s</div><div className="hidden sm:block text-sm">{t("player") || "Player"}: {currentUser}</div></div></div><div className="bg-white rounded-xl shadow-sm p-8 text-center"><div className="text-xl font-semibold text-gray-900 mb-2">{q.a} × {q.b} = ?</div><input
    type="number"
    inputMode="numeric"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && submit()}
    className="w-full sm:w-64 mx-auto border-2 border-gray-200 rounded-lg px-4 py-3 text-center text-lg focus:outline-none focus:border-blue-400"
    placeholder={t("yourAnswer") || "Your answer"}
  /><button onClick={submit} className="mt-4 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium">{t("submit") || "Submit"}</button>{feedback && <div className={`mt-4 inline-flex items-center px-3 py-2 rounded-full text-sm ${feedback === "correct" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}><CheckCircle className={`w-4 h-4 mr-2 ${feedback === "correct" ? "text-green-600" : "text-red-600"}`} />{feedback === "correct" ? t("correctAnswer") || "Correct!" : t("incorrectAnswer") || "Try again!"}</div>}<div className="mt-6 grid grid-cols-2 gap-4 text-gray-600"><div className="bg-blue-50 rounded-lg p-4"><div className="text-sm">{t("score") || "Score"}</div><div className="text-2xl font-bold text-blue-600">{score}</div></div><div className="bg-green-50 rounded-lg p-4"><div className="text-sm">{t("streak") || "Streak"}</div><div className="text-2xl font-bold text-green-600">{streak}</div></div></div></div></div></div>;
};
export default TimesTablesRush;
