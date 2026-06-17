import { useRewards } from "../../contexts/RewardsContext";
import { useState, useEffect } from "react";
import { ArrowLeft, Timer, Trophy, Target, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
const MathGame = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("math-game", scoreVal, { title: "Math Game", subject: "Mathematics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const questions = [
    {
      id: 1,
      question: "What is 1/2 + 1/4?",
      options: ["1/6", "3/4", "2/4", "5/4"],
      correctAnswer: 1,
      difficulty: "easy",
      points: 10
    },
    {
      id: 2,
      question: "If 20% of a number is 30, what is the number?",
      options: ["120", "130", "150", "100"],
      correctAnswer: 2,
      difficulty: "easy",
      points: 10
    },
    {
      id: 3,
      question: "Simplify: 18 \xF7 6 \xD7 2",
      options: ["3", "6", "9", "12"],
      correctAnswer: 1,
      difficulty: "easy",
      points: 10
    },
    {
      id: 4,
      question: "Find the ratio of 12:16",
      options: ["3:4", "4:3", "6:8", "2:3"],
      correctAnswer: 0,
      difficulty: "easy",
      points: 10
    },
    {
      id: 5,
      question: "What is 3/5 of 100?",
      options: ["50", "55", "60", "65"],
      correctAnswer: 2,
      difficulty: "easy",
      points: 10
    },
    {
      id: 6,
      question: "The perimeter of a square is 36 cm. What is the length of one side?",
      options: ["6 cm", "8 cm", "9 cm", "12 cm"],
      correctAnswer: 2,
      difficulty: "easy",
      points: 10
    },
    {
      id: 7,
      question: "If a box has 24 apples and 1/3 are spoiled, how many are good?",
      options: ["6", "12", "16", "18"],
      correctAnswer: 2,
      difficulty: "easy",
      points: 10
    },
    {
      id: 8,
      question: "Convert 2.5 into a fraction.",
      options: ["5/2", "3/2", "7/2", "2/3"],
      correctAnswer: 0,
      difficulty: "easy",
      points: 10
    },
    {
      id: 9,
      question: "What is the LCM of 6 and 8?",
      options: ["12", "16", "18", "24"],
      correctAnswer: 3,
      difficulty: "easy",
      points: 10
    },
    {
      id: 10,
      question: "A triangle has sides 3 cm, 4 cm, 5 cm. What type is it?",
      options: ["Equilateral", "Scalene", "Isosceles", "Right-angled"],
      correctAnswer: 3,
      difficulty: "easy",
      points: 10
    }
  ];
  useEffect(() => {
    if (timeLeft > 0 && !showResult && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1e3);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, gameCompleted]);
  const handleTimeUp = () => {
    setShowResult(true);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        nextQuestion();
      } else {
        setGameCompleted(true);
      }
    }, 2e3);
  };
  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + questions[currentQuestion].points);
      setCorrectAnswers(correctAnswers + 1);
    }
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        nextQuestion();
      } else {
        setGameCompleted(true);
      }
    }, 2e3);
  };
  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30);
  };
  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30);
    setGameCompleted(false);
    setCorrectAnswers(0);
  };
  if (gameCompleted) {
    const percentage = correctAnswers / questions.length * 100;
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-2xl mx-auto"><button
      onClick={onBack}
      className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
    ><ArrowLeft className="w-5 h-5 mr-2" />{t("backToGames")}</button><div className="bg-white rounded-xl shadow-lg p-8 text-center"><Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6" /><h2 className="text-3xl font-bold text-gray-900 mb-4">{t("gameComplete")}</h2><div className="grid grid-cols-3 gap-6 mb-8"><div className="bg-blue-50 rounded-lg p-4"><div className="text-2xl font-bold text-blue-600">{score}</div>
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
            </div><div className="text-sm text-gray-600">{t("totalPoints")}</div></div><div className="bg-green-50 rounded-lg p-4"><div className="text-2xl font-bold text-green-600">{correctAnswers}/{questions.length}</div><div className="text-sm text-gray-600">{t("correct")}</div></div><div className="bg-purple-50 rounded-lg p-4"><div className="text-2xl font-bold text-purple-600">{percentage.toFixed(0)}%</div><div className="text-sm text-gray-600">{t("accuracy")}</div></div></div><div className="space-y-4"><button
      onClick={restartGame}
      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
    >{t("playAgain")}</button><button
      onClick={onBack}
      className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
    >{t("backToGames")}</button></div></div></div></div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"><div className="max-w-2xl mx-auto">{
    /* Header */
  }<div className="flex items-center justify-between mb-6"><button
    onClick={onBack}
    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
  ><ArrowLeft className="w-5 h-5 mr-2" />{t("backToGames")}</button><div className="flex items-center space-x-4"><div className="flex items-center text-gray-600"><Target className="w-5 h-5 mr-2" /><span>{currentQuestion + 1}/{questions.length}</span></div><div className="flex items-center text-blue-600 font-medium"><Trophy className="w-5 h-5 mr-2" /><span>{score} {t("points")}</span></div></div></div>{
    /* Timer */
  }<div className="bg-white rounded-xl shadow-sm p-4 mb-6"><div className="flex items-center justify-between"><div className="flex items-center"><Timer className="w-5 h-5 text-orange-500 mr-2" /><span className="text-gray-700">{t("timeLeft")}</span></div><div className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-500" : "text-orange-500"}`}>{timeLeft}s
            </div></div><div className="mt-2 w-full bg-gray-200 rounded-full h-2"><div
    className={`h-2 rounded-full transition-all duration-1000 ${timeLeft <= 10 ? "bg-red-500" : "bg-orange-500"}`}
    style={{ width: `${timeLeft / 30 * 100}%` }}
  /></div></div>{
    /* Question */
  }<div className="bg-white rounded-xl shadow-sm p-8"><div className="mb-6"><div className="flex items-center justify-between mb-4"><span className={`px-3 py-1 rounded-full text-sm font-medium ${questions[currentQuestion].difficulty === "easy" ? "bg-green-100 text-green-800" : questions[currentQuestion].difficulty === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{questions[currentQuestion].difficulty.charAt(0).toUpperCase() + questions[currentQuestion].difficulty.slice(1)}</span><span className="text-sm text-gray-500">+{questions[currentQuestion].points} {t("points")}</span></div><h3 className="text-xl font-semibold text-gray-900">{questions[currentQuestion].question}</h3></div><div className="grid grid-cols-1 gap-3">{questions[currentQuestion].options.map((option, index) => {
    let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ";
    if (showResult) {
      if (index === questions[currentQuestion].correctAnswer) {
        buttonClass += "border-green-500 bg-green-50 text-green-800";
      } else if (index === selectedAnswer) {
        buttonClass += "border-red-500 bg-red-50 text-red-800";
      } else {
        buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
      }
    } else {
      buttonClass += "border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700";
    }
    return <button
      key={index}
      onClick={() => handleAnswerSelect(index)}
      disabled={showResult}
      className={buttonClass}
    ><div className="flex items-center justify-between"><span>{option}</span>{showResult && index === questions[currentQuestion].correctAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}{showResult && index === selectedAnswer && index !== questions[currentQuestion].correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}</div></button>;
  })}</div>{showResult && <div className="mt-6 p-4 rounded-lg bg-blue-50"><p className="text-blue-800">{selectedAnswer === questions[currentQuestion].correctAnswer ? t("correctAnswer") : t("incorrectAnswer")}</p></div>}</div></div></div>;
};
export default MathGame;
