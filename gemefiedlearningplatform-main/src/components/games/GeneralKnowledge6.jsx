import { useRewards } from "../../contexts/RewardsContext";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Brain, CheckCircle, Timer, XCircle } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
const QUESTION_POOL = [
  { id: 1, q: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correct: 1 },
  { id: 2, q: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], correct: 2 },
  { id: 3, q: "The Taj Mahal is in which city?", options: ["Delhi", "Agra", "Mumbai", "Jaipur"], correct: 1 },
  { id: 4, q: "Which gas do plants absorb from the air?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct: 2 },
  { id: 5, q: "What is H2O commonly called?", options: ["Salt", "Water", "Sugar", "Air"], correct: 1 },
  { id: 6, q: "Which animal is known as the King of the Jungle?", options: ["Tiger", "Lion", "Elephant", "Giraffe"], correct: 1 },
  { id: 7, q: "Which direction does the Sun rise from?", options: ["North", "South", "East", "West"], correct: 2 },
  { id: 8, q: "How many days are there in a leap year?", options: ["365", "366", "364", "360"], correct: 1 },
  { id: 9, q: "Which is the largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
  { id: 10, q: "Who wrote the national anthem of India?", options: ["Rabindranath Tagore", "Mahatma Gandhi", "Subhash Chandra Bose", "Sarojini Naidu"], correct: 0 },
  { id: 11, q: "Which festival is known as the Festival of Lights?", options: ["Holi", "Diwali", "Eid", "Christmas"], correct: 1 },
  { id: 12, q: "What do bees collect and use to make honey?", options: ["Water", "Nectar", "Leaves", "Soil"], correct: 1 },
  { id: 13, q: "Which is the smallest prime number?", options: ["1", "2", "3", "5"], correct: 1 },
  { id: 14, q: "Which organ pumps blood in our body?", options: ["Lungs", "Stomach", "Heart", "Liver"], correct: 2 },
  { id: 15, q: "Which country is called the Land of the Rising Sun?", options: ["China", "Japan", "Thailand", "Korea"], correct: 1 },
  { id: 16, q: "Rainbow has how many colors?", options: ["5", "6", "7", "8"], correct: 2 },
  { id: 17, q: "Which instrument measures temperature?", options: ["Barometer", "Thermometer", "Speedometer", "Hygrometer"], correct: 1 },
  { id: 18, q: "Which bird is a universal symbol of peace?", options: ["Eagle", "Dove", "Peacock", "Parrot"], correct: 1 },
  { id: 19, q: "What is the capital of India?", options: ["Mumbai", "Chennai", "Kolkata", "New Delhi"], correct: 3 },
  { id: 20, q: "Which is the longest river in the world?", options: ["Nile", "Amazon", "Ganga", "Yangtze"], correct: 0 }
];
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const GeneralKnowledge6 = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("general-knowledge6", scoreVal, { title: "General Knowledge6", subject: "Science" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const { t } = useTranslation();
  const order = useMemo(() => shuffle(QUESTION_POOL.map((_, i) => i)), []);
  const [pos, setPos] = useState(0);
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [done, setDone] = useState(false);
  const current = QUESTION_POOL[order[pos]];
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
    if (i === current.correct) {
      setScore((s) => s + 10);
    }
    setTimeout(() => handleNext(), 800);
  };
  const handleNext = () => {
    if (pos < order.length - 1) {
      setPos((p) => p + 1);
      setSelected(null);
      setShow(false);
      setTimeLeft(20);
    } else {
      setDone(true);
    }
  };
  const restart = () => {
    setPos(0);
    setSelected(null);
    setShow(false);
    setScore(0);
    setTimeLeft(20);
    setDone(false);
  };
  if (done) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-2xl mx-auto"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-6"><ArrowLeft className="w-5 h-5 mr-2" /> {t("backToGames")}</button><div className="bg-white rounded-xl shadow p-8 text-center"><Brain className="w-10 h-10 text-indigo-500 mx-auto mb-2" /><h2 className="text-2xl font-bold mb-2">{t("gameComplete")}</h2><p className="text-gray-700 mb-1">{t("totalPoints")}: {score}</p>
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
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-2xl mx-auto"><div className="flex items-center justify-between mb-6"><button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800"><ArrowLeft className="w-5 h-5 mr-2" /> {t("backToGames")}</button><div className="flex items-center space-x-4 text-gray-700"><div className="flex items-center"><Timer className="w-5 h-5 text-orange-500 mr-2" /> {timeLeft}s</div><div className="hidden sm:block text-sm">{t("player") || "Player"}: {currentUser}</div></div></div><div className="bg-white rounded-xl shadow-sm p-8"><h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center"><Brain className="w-5 h-5 mr-2" /> {current.q}</h3><div className="grid grid-cols-1 gap-3">{current.options.map((opt, i) => {
    const correct = i === current.correct;
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
export default GeneralKnowledge6;
