import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
import { ArrowLeft, Sigma, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
const QUESTIONS = [
  { id: 1, q: "Euclid's division lemma says for integers a, b (b>0), there exist q, r such that", options: ["a = bq + r, 0 \u2264 r < b", "a = qb + r, r > b", "a = qr + b, 0 < r \u2264 b", "a = b + qr, r\u2265b"], correct: 0 },
  { id: 2, q: "The Fundamental Theorem of Arithmetic states that every integer > 1 can be", options: ["Written uniquely as a product of primes", "Written as a sum of primes", "Divisible by all primes", "A prime itself only"], correct: 0 },
  { id: 3, q: "HCF \xD7 LCM of two numbers equals", options: ["Their sum", "Their product", "Their difference", "The larger number"], correct: 1 },
  { id: 4, q: "Which is irrational?", options: ["\u221A2", "3/4", "0.25", "1.5"], correct: 0 },
  { id: 5, q: "If HCF(8,12)=4, then LCM(8,12)=", options: ["12", "16", "24", "48"], correct: 2 },
  { id: 6, q: "If 2 is a factor of a^2, then 2 is a factor of a. This is used in the proof of", options: ["Rationality of \u221A2", "Irrationality of \u221A2", "Euclid\u2019s lemma", "HCF method"], correct: 1 },
  { id: 7, q: "Prime factorization of 90 is", options: ["2\xD73^2\xD75", "2^2\xD73\xD75", "3^2\xD75", "2\xD73\xD75^2"], correct: 0 },
  { id: 8, q: "LCM of 12 and 18 is", options: ["24", "36", "48", "72"], correct: 1 },
  { id: 9, q: "HCF(24, 36) is", options: ["6", "12", "18", "24"], correct: 0 },
  { id: 10, q: "If a = 20, b = 15, then a = bq + r with 0 \u2264 r < b gives r =", options: ["0", "5", "10", "15"], correct: 1 }
];
const RealNumbers10 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("real-numbers10", scoreVal, { title: "Real Numbers10", subject: "Mathematics" });
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
  if (done) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-2xl mx-auto"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-6"><ArrowLeft className="w-5 h-5 mr-2" />{t("backToGames")}</button><div className="bg-white rounded-xl shadow p-8 text-center"><Sigma className="w-10 h-10 text-emerald-600 mx-auto mb-2" /><h2 className="text-2xl font-bold mb-2">{t("gameComplete")}</h2><p className="text-gray-700">{t("totalPoints")}: {score}</p>
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
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-2xl mx-auto"><div className="flex items-center justify-between mb-6"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800"><ArrowLeft className="w-5 h-5 mr-2" />{t("backToGames")}</button><div className="hidden sm:block text-sm text-gray-700">{t("player") || "Player"}: {currentUser}</div></div><div className="bg-white rounded-xl shadow-sm p-8"><h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center"><Sigma className="w-5 h-5 mr-2" />{q.q}</h3><div className="grid grid-cols-1 gap-3">{q.options.map((opt, i) => {
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
export default RealNumbers10;
