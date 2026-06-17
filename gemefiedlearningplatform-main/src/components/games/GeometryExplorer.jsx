import { useRewards } from "../../contexts/RewardsContext";
import { useState, useEffect } from "react";
import { Info, Check, X, ArrowRight, Ruler, Shapes, GitBranch } from "lucide-react";
const GeometryExplorer = ({ currentUser, onBack }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("geometry-explorer", scoreVal, { title: "Geometry Explorer", subject: "Mathematics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [shapes, setShapes] = useState([]);
  const [currentTool, setCurrentTool] = useState("select");
  const [currentShape, setCurrentShape] = useState("triangle");
  const [showTutorial, setShowTutorial] = useState(true);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  useEffect(() => {
    startNewLevel();
  }, [level]);
  const startNewLevel = () => {
    setShapes([]);
    setCurrentQuestion(null);
    setUserAnswer("");
    setFeedback(null);
    const newShapes = [];
    newShapes.push(createShape("triangle"));
    if (level > 1) newShapes.push(createShape("square"));
    if (level > 2) newShapes.push(createShape("circle"));
    if (level > 3) newShapes.push(createShape("rectangle"));
    if (level > 4) newShapes.push(createShape("polygon"));
    setShapes(newShapes);
    generateQuestion();
  };
  const createShape = (type) => {
    const size = 50 + Math.random() * 50;
    const centerX = 150 + Math.random() * 200;
    const centerY = 150 + Math.random() * 200;
    switch (type) {
      case "triangle":
        return {
          id: Date.now() + Math.random(),
          type: "triangle",
          points: [
            { x: centerX, y: centerY - size },
            { x: centerX - size, y: centerY + size },
            { x: centerX + size, y: centerY + size }
          ],
          angle: 60
        };
      case "square":
        return {
          id: Date.now() + Math.random(),
          type: "square",
          points: [
            { x: centerX - size, y: centerY - size },
            { x: centerX + size, y: centerY - size },
            { x: centerX + size, y: centerY + size },
            { x: centerX - size, y: centerY + size }
          ],
          angle: 90
        };
      case "circle":
        return {
          id: Date.now() + Math.random(),
          type: "circle",
          points: [{ x: centerX, y: centerY }],
          radius: size
        };
      case "rectangle":
        return {
          id: Date.now() + Math.random(),
          type: "rectangle",
          points: [
            { x: centerX - size, y: centerY - size / 2 },
            { x: centerX + size, y: centerY - size / 2 },
            { x: centerX + size, y: centerY + size / 2 },
            { x: centerX - size, y: centerY + size / 2 }
          ],
          angle: 90
        };
      case "polygon":
        const sides = 5;
        const points = [];
        for (let i = 0; i < sides; i++) {
          const angle = i * 2 * Math.PI / sides - Math.PI / 2;
          points.push({
            x: centerX + size * Math.cos(angle),
            y: centerY + size * Math.sin(angle)
          });
        }
        return {
          id: Date.now() + Math.random(),
          type: "polygon",
          points,
          angle: 180 * (sides - 2) / sides
        };
      default:
        return createShape("triangle");
    }
  };
  const generateQuestion = () => {
    const currentShape2 = shapes[0] || createShape("triangle");
    const shapeName = currentShape2.type.charAt(0).toUpperCase() + currentShape2.type.slice(1);
    const questions = [
      {
        type: "identify",
        question: "What shape is this?",
        options: ["Triangle", "Square", "Circle", "Rectangle", "Pentagon"],
        correctAnswer: shapeName
      },
      {
        type: "measure",
        question: `What is the measure of each angle in a ${shapeName}?`,
        correctAnswer: currentShape2.angle || 60
      },
      {
        type: "theorem",
        question: "What is the Pythagorean theorem?",
        options: [
          "a\xB2 + b\xB2 = c\xB2",
          "\u03C0r\xB2",
          "A = \xBDbh",
          "V = \u03C0r\xB2h"
        ],
        correctAnswer: "a\xB2 + b\xB2 = c\xB2"
      }
    ];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
  };
  const checkAnswer = () => {
    if (!currentQuestion) return;
    const isCorrect = userAnswer.toLowerCase() === currentQuestion.correctAnswer.toString().toLowerCase();
    setFeedback({
      correct: isCorrect,
      message: isCorrect ? "Correct! Well done! \u{1F389}" : `Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`
    });
    if (isCorrect) {
      setScore((prev) => prev + 10 * level);
    }
  };
  const nextQuestion = () => {
    setFeedback(null);
    setUserAnswer("");
    generateQuestion();
  };
  const nextLevel = () => {
    setLevel((prev) => prev + 1);
  };
  const renderShape = (shape) => {
    switch (shape.type) {
      case "circle":
        return <circle
          cx={shape.points[0].x}
          cy={shape.points[0].y}
          r={shape.radius}
          fill="#3b82f6"
          fillOpacity="0.3"
          stroke="#1d4ed8"
          strokeWidth="2"
        />;
      default:
        const points = shape.points.map((p) => `${p.x},${p.y}`).join(" ");
        return <polygon
          points={points}
          fill="#3b82f6"
          fillOpacity="0.3"
          stroke="#1d4ed8"
          strokeWidth="2"
        />;
    }
  };
  return <div className="p-4 max-w-4xl mx-auto"><div className="flex justify-between items-center mb-6"><button
    onClick={onBack}
    className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
    aria-label="Back to games"
  ><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
          Back
        </button><h2 className="text-2xl font-bold text-gray-800">📐 Geometry Explorer</h2><div className="flex items-center space-x-4"><span className="text-gray-600">Level: {level}</span><span className="text-gray-600">Score: {score}</span><button
    onClick={() => setShowTutorial(true)}
    className="p-2 text-blue-500 hover:text-blue-700"
    aria-label="Show tutorial"
  ><Info size={20} /></button></div></div>{showTutorial && <div className="bg-blue-50 p-4 rounded-lg mb-6"><h3 className="text-lg font-semibold mb-2">How to Play:</h3><ul className="list-disc pl-5 space-y-1"><li>Explore different geometric shapes and their properties</li><li>Answer questions about the shapes to earn points</li><li>Use the tools to measure angles and sides</li><li>Complete each level to unlock more complex shapes!</li></ul><div className="mt-4"><h4 className="font-semibold mb-2">Tools:</h4><div className="flex space-x-4"><div className="flex items-center"><Shapes className="w-4 h-4 mr-2" /><span>Select/Move</span></div><div className="flex items-center"><Ruler className="w-4 h-4 mr-2" /><span>Measure</span></div><div className="flex items-center"><GitBranch className="w-4 h-4 mr-2" /><span>Theorems</span></div></div></div><button
    onClick={() => setShowTutorial(false)}
    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
  >
            Got it!
          </button></div>}<div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="md:col-span-2 bg-white rounded-lg shadow-md p-4"><div className="h-96 border-2 border-gray-200 rounded-lg relative overflow-hidden"><svg width="100%" height="100%" className="absolute top-0 left-0">{shapes.map((shape) => <g key={shape.id} className="cursor-move hover:opacity-80">{renderShape(shape)}</g>)}</svg></div><div className="mt-4 flex space-x-2"><button
    onClick={() => setCurrentTool("select")}
    className={`p-2 rounded ${currentTool === "select" ? "bg-blue-100 text-blue-600" : "bg-gray-100"}`}
    title="Select/Move"
  ><Shapes size={20} /></button><button
    onClick={() => setCurrentTool("draw")}
    className={`p-2 rounded ${currentTool === "draw" ? "bg-blue-100 text-blue-600" : "bg-gray-100"}`}
    title="Draw Shape"
  ><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg></button></div></div><div className="bg-white rounded-lg shadow-md p-4"><h3 className="text-lg font-semibold mb-4">Geometry Challenge</h3>{currentQuestion ? <><div className="mb-4 p-3 bg-gray-50 rounded"><p className="font-medium">{currentQuestion.question}</p>{currentQuestion.options ? <div className="mt-3 space-y-2">{currentQuestion.options.map((option, index) => <button
    key={index}
    onClick={() => setUserAnswer(option)}
    className={`w-full text-left p-2 rounded border ${userAnswer === option ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
  >{option}</button>)}</div> : <input
    type="text"
    value={userAnswer}
    onChange={(e) => setUserAnswer(e.target.value)}
    className="mt-2 w-full p-2 border border-gray-300 rounded"
    placeholder="Your answer..."
  />}</div>{feedback ? <div className={`p-3 rounded ${feedback.correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}><div className="flex items-center">{feedback.correct ? <Check className="w-5 h-5 mr-2" /> : <X className="w-5 h-5 mr-2" />}<p>{feedback.message}</p></div><button
    onClick={feedback.correct ? nextLevel : nextQuestion}
    className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
  >{feedback.correct ? "Next Level" : "Next Question"} <ArrowRight className="ml-2 w-4 h-4" /></button></div> : <button
    onClick={checkAnswer}
    disabled={!userAnswer}
    className={`w-full py-2 px-4 rounded ${userAnswer ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-200 text-gray-500 cursor-not-allowed"} transition-colors`}
  >
                  Check Answer
                </button>}</> : <div className="text-center py-8 text-gray-500"><p>Loading question...</p></div>}<div className="mt-6 pt-4 border-t border-gray-200"><h4 className="font-medium mb-2">Quick Tools</h4><div className="grid grid-cols-2 gap-2"><button
    onClick={() => setShapes((prev) => [...prev, createShape("triangle")])}
    className="p-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
  >
                Add Triangle
              </button><button
    onClick={() => setShapes((prev) => [...prev, createShape("square")])}
    className="p-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
  >
                Add Square
              </button><button
    onClick={() => setShapes((prev) => [...prev, createShape("circle")])}
    className="p-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
  >
                Add Circle
              </button><button
    onClick={() => setShapes((prev) => [...prev, createShape("rectangle")])}
    className="p-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
  >
                Add Rectangle
              </button></div></div></div></div><div className="mt-6 p-4 bg-gray-50 rounded-lg"><h3 className="font-semibold mb-2">Geometry Tip:</h3><p className="text-sm text-gray-700">
          Remember, the sum of angles in a triangle is always 180°, and in a quadrilateral it's 360°. 
          For regular polygons, you can find the measure of each interior angle using the formula: 
          (n-2) × 180° / n, where n is the number of sides.
        </p></div>
      {((typeof score !== "undefined" ? score > 0 : (typeof moves !== "undefined" ? moves > 0 : true))) && (
        <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-xl shadow-lg border border-gray-200 max-w-xs animate-fade-in flex flex-col gap-2">
          <div className="text-sm font-semibold text-gray-800">
            Submit Score ({(typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100))} pts)
          </div>
          <button
            onClick={handleSubmitScore}
            disabled={submitted}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all ${
              submitted ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 active:scale-95"
            }`}
          >
            {submitted ? "Score Submitted!" : "Submit Score"}
          </button>
          {submitted && (
            <p className="text-xs text-emerald-600 font-medium">
              ✓ Progress successfully saved to MySQL database!
            </p>
          )}
        </div>
      )}
</div>;
};
export default GeometryExplorer;
