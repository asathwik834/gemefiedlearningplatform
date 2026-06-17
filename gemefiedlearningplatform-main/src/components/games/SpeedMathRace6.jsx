import { useRewards } from "../../contexts/RewardsContext";
import { useEffect, useState } from "react";
import { ArrowLeft, Car, Timer, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function makeQuestion(level) {
  const ops = ["+", "-", "\xD7", "\xF7"];
  const op = pick(ops);
  let a = randInt(2, 12);
  let b = randInt(2, 12);
  let ans = 0;
  switch (op) {
    case "+":
      ans = a + b;
      break;
    case "-":
      ans = a - b;
      break;
    case "\xD7":
      ans = a * b;
      break;
    case "\xF7":
      b = randInt(2, 12);
      ans = a * b;
      return { text: `${ans} \xF7 ${b}`, value: a };
  }
  return { text: `${a} ${op} ${b}`, value: ans };
}
const SpeedMathRace6 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("speed-math-race6", scoreVal, { title: "Speed Math Race6", subject: "Mathematics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [q, setQ] = useState(makeQuestion(1));
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (done) return;
    if (timeLeft <= 0) {
      setDone(true);
      return;
    }
    const t2 = setTimeout(() => setTimeLeft((s) => s - 1), 1e3);
    return () => clearTimeout(t2);
  }, [timeLeft, done]);
  const submit = () => {
    if (done) return;
    const val = parseInt(input, 10);
    if (!Number.isFinite(val)) return;
    if (val === q.value) {
      setScore((s) => s + 5);
      setStreak((s) => s + 1);
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
      setStreak(0);
    }
    setTimeout(() => {
      setQ(makeQuestion(1));
      setInput("");
      setFeedback(null);
    }, 300);
  };
  const progress = Math.min(100, Math.max(0, score / 100 * 100));
  if (done) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-3xl mx-auto"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-6"><ArrowLeft className="w-5 h-5 mr-2" /> {t("backToGames")}</button><div className="bg-white rounded-xl shadow p-8 text-center"><Car className="w-10 h-10 text-red-500 mx-auto mb-2" /><h2 className="text-2xl font-bold mb-2">Race Finished!</h2><p className="text-gray-700 mb-1">{t("totalPoints")}: {score}</p><p className="text-gray-500">{t("streak")}: {streak}</p><div className="mt-4"><button onClick={onBack} className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium">{t("backToGames")}</button></div>
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
  }
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-3xl mx-auto"><div className="flex items-center justify-between mb-6"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800"><ArrowLeft className="w-5 h-5 mr-2" /> {t("backToGames")}</button><div className="flex items-center space-x-4 text-gray-700"><div className="flex items-center"><Timer className="w-5 h-5 text-orange-500 mr-2" /> {timeLeft}s</div><div className="hidden sm:block text-sm">{t("player") || "Player"}: {currentUser}</div></div></div><div className="bg-white rounded-xl shadow-sm p-8 text-center"><div className="text-2xl font-semibold text-gray-900 mb-4">{q.text}</div><input type="number" inputMode="numeric" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} className="w-full sm:w-64 mx-auto border-2 border-gray-200 rounded-lg px-4 py-3 text-center text-lg focus:outline-none focus:border-blue-400" placeholder={t("yourAnswer") || "Your answer"} /><button onClick={submit} className="mt-4 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium">{t("submit") || "Submit"}</button>{feedback && <div className={`mt-4 inline-flex items-center px-3 py-2 rounded-full text-sm ${feedback === "correct" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{feedback === "correct" ? <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> : <XCircle className="w-4 h-4 mr-2 text-red-600" />}{feedback === "correct" ? t("correctAnswer") || "Correct!" : t("incorrectAnswer") || "Try again!"}</div>}<div className="mt-6"><div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{ width: `${progress}%` }} /></div><div className="text-xs text-gray-500 mt-1">Race progress</div></div></div></div></div>;
};
export default SpeedMathRace6;
