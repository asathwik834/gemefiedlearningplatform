import { useRewards } from "../../contexts/RewardsContext";
import { useState, useEffect } from "react";
import { FlaskConical, Check, X, RotateCcw, ArrowLeft } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
const ChemMixer = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("chem-mixer", scoreVal, { title: "Chem Mixer", subject: "Chemistry" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const { t } = useTranslation();
  useEffect(() => {
    console.log(`Welcome ${currentUser}! Starting Chem Mixer game...`);
  }, [currentUser]);
  const [selectedElements, setSelectedElements] = useState([]);
  const [message, setMessage] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [currentCompound, setCurrentCompound] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const elements = [
    { symbol: "H", name: "Hydrogen", color: "bg-gray-200" },
    { symbol: "O", name: "Oxygen", color: "bg-red-200" },
    { symbol: "C", name: "Carbon", color: "bg-gray-800 text-white" },
    { symbol: "N", name: "Nitrogen", color: "bg-blue-200" },
    { symbol: "Na", name: "Sodium", color: "bg-purple-200" },
    { symbol: "Cl", name: "Chlorine", color: "bg-green-200" }
  ];
  const compounds = [
    { formula: "H\u2082O", name: "Water", elements: ["H", "O", "H"] },
    { formula: "CO\u2082", name: "Carbon Dioxide", elements: ["C", "O", "O"] },
    { formula: "NaCl", name: "Sodium Chloride", elements: ["Na", "Cl"] },
    { formula: "NH\u2083", name: "Ammonia", elements: ["N", "H", "H", "H"] },
    { formula: "CH\u2084", name: "Methane", elements: ["C", "H", "H", "H", "H"] }
  ];
  useEffect(() => {
    newCompound();
  }, []);
  const newCompound = () => {
    const randomIndex = Math.floor(Math.random() * compounds.length);
    setCurrentCompound(compounds[randomIndex]);
    setSelectedElements([]);
    setMessage("");
    setIsCorrect(null);
    setShowHint(false);
  };
  const handleElementClick = (symbol) => {
    if (selectedElements.length < 5) {
      setSelectedElements([...selectedElements, symbol]);
      setMessage("");
    }
  };
  const checkCompound = () => {
    if (!currentCompound) return;
    const isMatch = selectedElements.length === currentCompound.elements.length && selectedElements.every((el, i) => el === currentCompound.elements[i]);
    if (isMatch) {
      setMessage(`Correct! You made ${currentCompound.name} (${currentCompound.formula})`);
      setIsCorrect(true);
      setScore((prev) => prev + 10);
    } else {
      setMessage("That's not quite right. Try again!");
      setIsCorrect(false);
    }
  };
  const clearSelection = () => {
    setSelectedElements([]);
    setMessage("");
    setIsCorrect(null);
  };
  return <div className="p-6 max-w-4xl mx-auto"><div className="flex items-center mb-6"><button
    onClick={onBack}
    className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
    aria-label="Back to games"
  ><ArrowLeft className="w-6 h-6 text-gray-600" /></button><FlaskConical className="w-8 h-8 mr-2 text-purple-600" /><h2 className="text-2xl font-bold text-gray-800">{t("chemMixer") || "Chem Mixer"}</h2><div className="ml-auto bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">{t("score") || "Score"}: {score}</div></div><div className="bg-white rounded-xl shadow-md p-6 mb-6"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-gray-700">{currentCompound ? `Make: ${currentCompound.name}` : "Loading..."}</h3><button
    onClick={() => setShowHint(!showHint)}
    className="text-sm text-blue-600 hover:text-blue-800"
  >{showHint ? t("hideHint") || "Hide Hint" : t("showHint") || "Show Hint"}</button></div>{showHint && currentCompound && <div className="mb-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">{t("hint") || "Hint"}: {currentCompound.formula} = {currentCompound.elements.join(" + ")}</div>}<div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg mb-4 p-4">{selectedElements.length > 0 ? <div className="flex space-x-2 items-center">{selectedElements.map((symbol, index) => <span
    key={index}
    className="px-3 py-2 rounded-md font-mono text-lg bg-blue-100 text-blue-800"
  >{symbol}</span>)}</div> : <p className="text-gray-400">{t("selectElements") || "Select elements to form a compound"}</p>}</div>{message && <div className={`p-3 rounded-lg mb-4 ${isCorrect === true ? "bg-green-100 text-green-800" : isCorrect === false ? "bg-red-100 text-red-800" : "bg-gray-100"}`}>{message}</div>}<div className="flex space-x-3"><button
    onClick={checkCompound}
    disabled={selectedElements.length === 0}
    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
  ><Check className="w-5 h-5 mr-2" />{t("check") || "Check"}</button><button
    onClick={clearSelection}
    disabled={selectedElements.length === 0}
    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
  ><X className="w-5 h-5 mr-2" />{t("clear") || "Clear"}</button><button
    onClick={newCompound}
    className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md flex items-center"
  ><RotateCcw className="w-5 h-5 mr-2" />{t("newCompound") || "New Compound"}</button></div></div><div className="grid grid-cols-3 md:grid-cols-6 gap-3">{elements.map((element) => <button
    key={element.symbol}
    onClick={() => handleElementClick(element.symbol)}
    className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all hover:shadow-md ${element.color} ${selectedElements.length >= 5 ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
    disabled={selectedElements.length >= 5}
    title={element.name}
  ><span className="text-2xl font-bold">{element.symbol}</span><span className="text-xs mt-1">{element.name}</span></button>)}</div>
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
export default ChemMixer;
