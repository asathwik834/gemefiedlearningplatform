import { useRewards } from "../../contexts/RewardsContext";
import { useState } from "react";
import { ArrowLeft, Ruler, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
const QUESTIONS = [
  { id: 1, q: "Distance between (x1,y1) and (x2,y2) equals", options: ["(x2-x1)+(y2-y1)", "\u221A[(x2-x1)^2 + (y2-y1)^2]", "|x2-x1| + |y2-y1|", "\u221A[(x2+x1)^2 + (y2+y1)^2]"], correct: 1 },
  { id: 2, q: "Midpoint of A(x1,y1), B(x2,y2) equals", options: ["(x1+x2, y1+y2)", "((x1+x2)/2, (y1+y2)/2)", "((x2-x1)/2, (y2-y1)/2)", "(x1x2, y1y2)"], correct: 1 },
  { id: 3, q: "Section formula (internal) for ratio m:n gives point", options: ["((mx1+nx2)/(m+n), (my1+ny2)/(m+n))", "((mx2+nx1)/(m+n), (my2+ny1)/(m+n))", "((x1+x2)/2, (y1+y2)/2)", "(m+n, m-n)"], correct: 0 },
  { id: 4, q: "Area of triangle with vertices (x1,y1),(x2,y2),(x3,y3) = 1/2 | x1(y2\u2212y3)+x2(y3\u2212y1)+x3(y1\u2212y2) |", options: ["True", "False", "Only for right triangles", "Only if centroid known"], correct: 0 },
  { id: 5, q: "Slope of line through (1,2) and (3,6) equals", options: ["2", "3/2", "4/2", "2/3"], correct: 0 },
  { id: 6, q: "Distance between (0,0) and (6,8) equals", options: ["10", "12", "14", "8"], correct: 0 },
  { id: 7, q: "Midpoint of (2,5) and (4,9) equals", options: ["(3,7)", "(6,14)", "(1,2)", "(8,10)"], correct: 0 },
  { id: 8, q: "If a triangle has area 0, its points are", options: ["Collinear", "Isosceles", "Right angled", "Equilateral"], correct: 0 },
  { id: 9, q: "The centroid divides medians in the ratio", options: ["1:1", "2:1", "3:1", "1:2"], correct: 1 },
  { id: 10, q: "Section point dividing (0,0) and (10,0) in ratio 2:3 (internal) is", options: ["(3,0)", "(4,0)", "(5,0)", "(6,0)"], correct: 1 }
];
const CoordinateGeometry10 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("coordinate-geometry10", scoreVal, { title: "Coordinate Geometry10", subject: "Mathematics" });
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
  if (done) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-2xl mx-auto"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-6"><ArrowLeft className="w-5 h-5 mr-2" />{t("backToGames")}</button><div className="bg-white rounded-xl shadow p-8 text-center"><Ruler className="w-10 h-10 text-emerald-600 mx-auto mb-2" /><h2 className="text-2xl font-bold mb-2">{t("gameComplete")}</h2><p className="text-gray-700">{t("totalPoints")}: {score}</p>
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
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-2xl mx-auto"><div className="flex items-center justify-between mb-6"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800"><ArrowLeft className="w-5 h-5 mr-2" />{t("backToGames")}</button><div className="hidden sm:block text-sm text-gray-700">{t("player") || "Player"}: {currentUser}</div></div><div className="bg-white rounded-xl shadow-sm p-8"><h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center"><Ruler className="w-5 h-5 mr-2" />{q.q}</h3><div className="grid grid-cols-1 gap-3">{q.options.map((opt, i) => {
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
export default CoordinateGeometry10;
