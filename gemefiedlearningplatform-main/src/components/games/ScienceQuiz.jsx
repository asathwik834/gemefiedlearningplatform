import { useRewards } from "../../contexts/RewardsContext";
import { useState, useEffect } from "react";
import { ArrowLeft, Timer, Trophy, Target, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
const ScienceQuiz = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("science-quiz", scoreVal, { title: "Science Quiz", subject: "Science" });
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
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const questions = [
    {
      id: 1,
      question: "What is the chemical symbol for water?",
      options: ["H2O", "CO2", "O2", "NaCl"],
      correctAnswer: 0,
      explanation: "Water consists of two hydrogen atoms bonded to one oxygen atom, hence H2O.",
      difficulty: "easy",
      points: 10,
      topic: "Chemistry"
    },
    {
      id: 2,
      question: "Which organ in the human body produces insulin?",
      options: ["Liver", "Pancreas", "Kidney", "Heart"],
      correctAnswer: 1,
      explanation: "The pancreas produces insulin, which helps regulate blood sugar levels.",
      difficulty: "medium",
      points: 20,
      topic: "Biology"
    },
    {
      id: 3,
      question: "What is the speed of light in a vacuum?",
      options: ["300,000 km/s", "150,000 km/s", "600,000 km/s", "450,000 km/s"],
      correctAnswer: 0,
      explanation: "Light travels at approximately 300,000 kilometers per second in a vacuum.",
      difficulty: "medium",
      points: 20,
      topic: "Physics"
    },
    {
      id: 4,
      question: "Which planet is known as the 'Red Planet'?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1,
      explanation: "Mars appears red due to iron oxide (rust) on its surface.",
      difficulty: "easy",
      points: 10,
      topic: "Astronomy"
    },
    {
      id: 5,
      question: "What is the process by which plants make their own food?",
      options: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"],
      correctAnswer: 1,
      explanation: "Photosynthesis is the process where plants use sunlight, CO2, and water to produce glucose.",
      difficulty: "easy",
      points: 10,
      topic: "Biology"
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
    }, 3e3);
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
    }, 3e3);
  };
  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(45);
  };
  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(45);
    setGameCompleted(false);
    setCorrectAnswers(0);
  };
  if (gameCompleted) {
    const percentage = correctAnswers / questions.length * 100;
    return <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4"><div className="max-w-2xl mx-auto"><button
      onClick={onBack}
      className="flex items-center text-green-600 hover:text-green-800 mb-6 transition-colors"
    ><ArrowLeft className="w-5 h-5 mr-2" />{t("backToGames")}</button><div className="bg-white rounded-xl shadow-lg p-8 text-center"><Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6" /><h2 className="text-3xl font-bold text-gray-900 mb-4">{t("quizComplete")}</h2><div className="grid grid-cols-3 gap-6 mb-8"><div className="bg-green-50 rounded-lg p-4"><div className="text-2xl font-bold text-green-600">{score}</div><div className="text-sm text-gray-600">{t("totalPoints")}</div></div><div className="bg-blue-50 rounded-lg p-4"><div className="text-2xl font-bold text-blue-600">{correctAnswers}/{questions.length}</div><div className="text-sm text-gray-600">{t("correct")}</div></div><div className="bg-purple-50 rounded-lg p-4"><div className="text-2xl font-bold text-purple-600">{percentage.toFixed(0)}%</div><div className="text-sm text-gray-600">{t("accuracy")}</div></div></div><div className="mb-6">{percentage >= 80 && <div className="bg-green-50 border border-green-200 rounded-lg p-4"><p className="text-green-800">{t("excellentWork")}</p></div>}{percentage >= 60 && percentage < 80 && <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><p className="text-blue-800">{t("goodJob")}</p></div>}{percentage < 60 && <div className="bg-orange-50 border border-orange-200 rounded-lg p-4"><p className="text-orange-800">{t("keepPracticing")}</p></div>}</div><div className="space-y-4"><button
      onClick={restartGame}
      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
    >{t("playAgain")}</button><button
      onClick={onBack}
      className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
    >{t("backToGames")}</button></div></div></div>
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
  return <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4"><div className="max-w-2xl mx-auto">{
    /* Header */
  }<div className="flex items-center justify-between mb-6"><button
    onClick={onBack}
    className="flex items-center text-green-600 hover:text-green-800 transition-colors"
  ><ArrowLeft className="w-5 h-5 mr-2" />{t("backToGames")}</button><div className="flex items-center space-x-4"><div className="flex items-center text-gray-600"><Target className="w-5 h-5 mr-2" /><span>{currentQuestion + 1}/{questions.length}</span></div><div className="flex items-center text-green-600 font-medium"><Trophy className="w-5 h-5 mr-2" /><span>{score} {t("points")}</span></div></div></div>{
    /* Timer */
  }<div className="bg-white rounded-xl shadow-sm p-4 mb-6"><div className="flex items-center justify-between"><div className="flex items-center"><Timer className="w-5 h-5 text-orange-500 mr-2" /><span className="text-gray-700">{t("timeLeft")}</span></div><div className={`text-2xl font-bold ${timeLeft <= 15 ? "text-red-500" : "text-orange-500"}`}>{timeLeft}s
            </div></div><div className="mt-2 w-full bg-gray-200 rounded-full h-2"><div
    className={`h-2 rounded-full transition-all duration-1000 ${timeLeft <= 15 ? "bg-red-500" : "bg-orange-500"}`}
    style={{ width: `${timeLeft / 45 * 100}%` }}
  /></div></div>{
    /* Question */
  }<div className="bg-white rounded-xl shadow-sm p-8"><div className="mb-6"><div className="flex items-center justify-between mb-4"><div className="flex items-center space-x-3"><span className={`px-3 py-1 rounded-full text-sm font-medium ${questions[currentQuestion].difficulty === "easy" ? "bg-green-100 text-green-800" : questions[currentQuestion].difficulty === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{questions[currentQuestion].difficulty.charAt(0).toUpperCase() + questions[currentQuestion].difficulty.slice(1)}</span><span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{questions[currentQuestion].topic}</span></div><span className="text-sm text-gray-500">+{questions[currentQuestion].points} {t("points")}</span></div><h3 className="text-xl font-semibold text-gray-900">{questions[currentQuestion].question}</h3></div><div className="grid grid-cols-1 gap-3">{questions[currentQuestion].options.map((option, index) => {
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
      buttonClass += "border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-700";
    }
    return <button
      key={index}
      onClick={() => handleAnswerSelect(index)}
      disabled={showResult}
      className={buttonClass}
    ><div className="flex items-center justify-between"><span>{option}</span>{showResult && index === questions[currentQuestion].correctAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}{showResult && index === selectedAnswer && index !== questions[currentQuestion].correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}</div></button>;
  })}</div>{showResult && <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200"><div className="flex items-start space-x-3"><Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" /><div><p className="font-medium text-blue-800 mb-1">{selectedAnswer === questions[currentQuestion].correctAnswer ? t("correctAnswer") : t("incorrectAnswer")}</p><p className="text-blue-700 text-sm">{questions[currentQuestion].explanation}</p></div></div></div>}</div></div></div>;
};
export default ScienceQuiz;
