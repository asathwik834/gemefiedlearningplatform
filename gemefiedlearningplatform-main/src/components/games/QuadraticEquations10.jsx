import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
import { ArrowLeft, Sigma, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
const QUESTIONS = [
  { id: 1, q: "Standard form of a quadratic equation is", options: ["ax + b = 0", "ax^2 + bx + c = 0", "ax^3 + bx^2 + c = 0", "a/x + b = 0"], correct: 1 },
  { id: 2, q: "Discriminant (D) equals", options: ["b^2 - 4ac", "b^2 + 4ac", "2ab - c", "a^2 - 4bc"], correct: 0 },
  { id: 3, q: "If D > 0 and is a perfect square, roots are", options: ["Real, equal", "Real, unequal rational", "Imaginary", "None"], correct: 1 },
  { id: 4, q: "Sum of roots \u03B1 + \u03B2 equals", options: ["-b/a", "b/a", "-c/a", "c/a"], correct: 0 },
  { id: 5, q: "Product of roots \u03B1\u03B2 equals", options: ["-b/a", "c/a", "-c/a", "a/c"], correct: 1 },
  { id: 6, q: "Roots formula x =", options: ["(-b \xB1 \u221AD) / (2a)", "(b \xB1 \u221AD) / (2a)", "(-b \xB1 D) / (2a)", "(-b \xB1 \u221AD) / a"], correct: 0 },
  { id: 7, q: "If a=1, b=-5, c=6, roots are", options: ["2 and 3", "1 and 6", "\u22122 and \u22123", "5 and 6"], correct: 0 },
  { id: 8, q: "If D = 0, then roots are", options: ["Equal", "Unequal", "Imaginary", "Irrational"], correct: 0 },
  { id: 9, q: "If D < 0, then roots are", options: ["Real unequal", "Real equal", "Imaginary (no real roots)", "Rational unequal"], correct: 2 },
  { id: 10, q: "Equation with roots 2 and 3 is", options: ["x^2 - 5x + 6 = 0", "x^2 + 5x + 6 = 0", "x^2 - 6x + 5 = 0", "x^2 - 1x + 6 = 0"], correct: 0 }
];
const QuadraticEquations10 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("quadratic-equations10", scoreVal, { title: "Quadratic Equations10", subject: "Mathematics" });
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
export default QuadraticEquations10;
