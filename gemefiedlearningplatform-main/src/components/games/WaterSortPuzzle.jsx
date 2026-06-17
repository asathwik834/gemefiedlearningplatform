import { useRewards } from "../../contexts/RewardsContext";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, RotateCcw, Zap } from "lucide-react";
const MAX_TUBES = 4;
const MAX_LIQUID_LEVEL = 4;
const LIQUID_COLORS = {
  acid: "bg-red-500 hover:bg-red-600",
  base: "bg-blue-500 hover:bg-blue-600",
  neutral: "bg-yellow-400 hover:bg-yellow-500",
  empty: "bg-white border-2 border-dashed border-gray-400"
};
const LIQUID_NAMES = {
  acid: "Acid",
  base: "Base",
  neutral: "Neutral",
  empty: "Empty"
};
const LIQUID_DESCRIPTIONS = {
  acid: "Corrosive liquid that reacts with bases",
  base: "Alkaline liquid that reacts with acids",
  neutral: "Safe liquid that mixes with anything",
  empty: "Empty space for pouring liquids"
};
const WaterSortPuzzle = ({ currentUser, onBack }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("water-sort-puzzle", scoreVal, { title: "Water Sort Puzzle", subject: "Science" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const [tubes, setTubes] = useState([]);
  const [selectedTube, setSelectedTube] = useState(null);
  const [moves, setMoves] = useState(0);
  const [level, setLevel] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true);
  const [gameStatus, setGameStatus] = useState("playing");
  const [hint, setHint] = useState(null);
  useEffect(() => {
    startNewGame();
    return () => {
      setTubes([]);
      setSelectedTube(null);
    };
  }, [level]);
  const startNewGame = useCallback(() => {
    const newTubes = [];
    const liquidTypes = ["acid", "base", "neutral"];
    const totalTubes = Math.min(3 + Math.floor(level / 2), 6);
    for (let i = 0; i < totalTubes; i++) {
      newTubes.push({
        id: i,
        liquids: [],
        selected: false,
        isComplete: false
      });
    }
    const tubesToFill = totalTubes - 1;
    const liquidsPerType = Math.ceil(tubesToFill * MAX_LIQUID_LEVEL / liquidTypes.length);
    const allLiquids = [];
    liquidTypes.forEach((type) => {
      allLiquids.push(...Array(liquidsPerType).fill(type));
    });
    const shuffledLiquids = [...allLiquids].sort(() => Math.random() - 0.5);
    for (let i = 0; i < tubesToFill; i++) {
      const tubeLiquids = [];
      for (let j = 0; j < MAX_LIQUID_LEVEL; j++) {
        if (shuffledLiquids.length > 0) {
          tubeLiquids.push(shuffledLiquids.pop());
        }
      }
      newTubes[i].liquids = tubeLiquids;
    }
    setTubes(newTubes);
    setMoves(0);
    setGameStatus("playing");
    setHint(null);
  }, [level]);
  const handleTubeClick = (tubeIndex) => {
    if (gameStatus !== "playing") return;
    const tube = tubes[tubeIndex];
    if (selectedTube === null) {
      if (tube.liquids.length > 0) {
        setSelectedTube(tubeIndex);
        updateTubeSelection(tubeIndex, true);
      }
      return;
    }
    if (selectedTube === tubeIndex) {
      setSelectedTube(null);
      updateTubeSelection(tubeIndex, false);
      return;
    }
    pourLiquid(selectedTube, tubeIndex);
  };
  const updateTubeSelection = (tubeIndex, isSelected) => {
    setTubes(
      (prevTubes) => prevTubes.map(
        (tube, idx) => idx === tubeIndex ? { ...tube, selected: isSelected } : { ...tube, selected: false }
      )
    );
  };
  const canPour = useCallback((from, to) => {
    const fromTube = tubes[from];
    const toTube = tubes[to];
    if (fromTube.liquids.length === 0) return false;
    if (toTube.liquids.length === 0) return true;
    if (toTube.liquids.length >= MAX_LIQUID_LEVEL) return false;
    const fromTopLiquid = fromTube.liquids[fromTube.liquids.length - 1];
    const toTopLiquid = toTube.liquids[toTube.liquids.length - 1];
    return fromTopLiquid === toTopLiquid;
  }, [tubes]);
  const pourLiquid = useCallback((from, to) => {
    if (!canPour(from, to)) {
      setSelectedTube(null);
      updateTubeSelection(from, false);
      setHint("Can't pour these liquids together!");
      setTimeout(() => setHint(null), 2e3);
      return;
    }
    setTubes((prevTubes) => {
      const newTubes = [...prevTubes];
      const fromTube = { ...newTubes[from] };
      const toTube = { ...newTubes[to] };
      const fromLiquids = [...fromTube.liquids];
      const toLiquids = [...toTube.liquids];
      const topLiquid = fromLiquids[fromLiquids.length - 1];
      let pourCount = 0;
      for (let i = fromLiquids.length - 1; i >= 0; i--) {
        if (fromLiquids[i] === topLiquid) {
          pourCount++;
        } else {
          break;
        }
      }
      const availableSpace = MAX_LIQUID_LEVEL - toLiquids.length;
      const actualPour = Math.min(pourCount, availableSpace);
      for (let i = 0; i < actualPour; i++) {
        const liquid = fromLiquids.pop();
        toLiquids.push(liquid);
      }
      fromTube.liquids = fromLiquids;
      toTube.liquids = toLiquids;
      fromTube.isComplete = isTubeComplete(fromTube);
      toTube.isComplete = isTubeComplete(toTube);
      newTubes[from] = fromTube;
      newTubes[to] = toTube;
      return newTubes;
    });
    setMoves((prevMoves) => prevMoves + 1);
    setSelectedTube(null);
    updateTubeSelection(from, false);
    checkLevelComplete();
  }, [canPour]);
  const isTubeComplete = (tube) => {
    if (tube.liquids.length === 0) return true;
    if (tube.liquids.length !== MAX_LIQUID_LEVEL) return false;
    const firstLiquid = tube.liquids[0];
    return tube.liquids.every((liquid) => liquid === firstLiquid);
  };
  const checkLevelComplete = useCallback(() => {
    const allTubesComplete = tubes.every(isTubeComplete);
    if (allTubesComplete) {
      setGameStatus("won");
    }
  }, [tubes]);
  const nextLevel = () => {
    setLevel((prevLevel) => Math.min(prevLevel + 1, 10));
  };
  const restartLevel = useCallback(() => {
    startNewGame();
  }, [startNewGame]);
  const getHint = useCallback(() => {
    for (let i = 0; i < tubes.length; i++) {
      if (tubes[i].liquids.length === 0) continue;
      for (let j = 0; j < tubes.length; j++) {
        if (i === j) continue;
        if (canPour(i, j)) {
          setHint(`Try pouring from tube ${i + 1} to tube ${j + 1}`);
          setTimeout(() => setHint(null), 3e3);
          return;
        }
      }
    }
    setHint("No valid moves found. Try restarting the level.");
    setTimeout(() => setHint(null), 3e3);
  }, [tubes, canPour]);
  const renderLiquid = (type, index, tubeLength) => {
    const height = 100 / MAX_LIQUID_LEVEL;
    return <div
      key={index}
      className={`w-full ${LIQUID_COLORS[type]} transition-all duration-300`}
      style={{
        height: `${height}%`,
        borderTopLeftRadius: index === 0 ? "0.5rem" : "0",
        borderTopRightRadius: index === 0 ? "0.5rem" : "0",
        borderBottomLeftRadius: index === tubeLength - 1 ? "0.5rem" : "0",
        borderBottomRightRadius: index === tubeLength - 1 ? "0.5rem" : "0"
      }}
    />;
  };
  const renderTube = (tube, index) => {
    const isSelected = selectedTube === index;
    const isEmpty = tube.liquids.length === 0;
    const tubeClasses = `
      w-16 h-32 rounded-lg flex flex-col-reverse overflow-hidden
      border-4 ${isSelected ? "border-yellow-400" : "border-gray-300"}
      ${tube.isComplete ? "ring-2 ring-green-500" : ""}
      transition-all duration-200 cursor-pointer
      hover:shadow-lg hover:transform hover:scale-105
    `;
    return <div
      key={tube.id}
      className="flex flex-col items-center mx-2"
      onClick={() => handleTubeClick(index)}
    ><div className={tubeClasses}>{isEmpty ? <div className="w-full h-full bg-gray-100 flex items-center justify-center"><span className="text-gray-400 text-xs">Empty</span></div> : tube.liquids.map(
      (liquid, i) => renderLiquid(liquid, i, tube.liquids.length)
    )}</div><span className="mt-2 text-xs font-medium text-gray-600">
          Tube {index + 1}</span></div>;
  };
  return <div className="p-4 max-w-4xl mx-auto"><div className="flex justify-between items-center mb-6"><button
    onClick={onBack}
    className="text-blue-500 hover:text-blue-700 flex items-center"
  >
          ← Back to Games
        </button><div><h2 className="text-2xl font-bold text-gray-800 flex items-center"><Zap className="text-yellow-500 mr-2" />
            Chemistry Sort Puzzle
          </h2><p className="text-sm text-gray-600">
            Sort the chemicals into matching tubes. Acids and bases don't mix!
          </p></div><div className="flex items-center space-x-4"><div className="bg-white px-3 py-1 rounded-full shadow-sm"><span className="font-medium text-gray-700">Level: {level}</span></div><div className="bg-white px-3 py-1 rounded-full shadow-sm"><span className="font-medium text-gray-700">Moves: {moves}</span></div><button
    onClick={getHint}
    className="p-2 text-purple-500 hover:text-purple-700"
    aria-label="Get hint"
    title="Get hint"
  ><Info size={20} /></button><button
    onClick={restartLevel}
    className="p-2 text-gray-500 hover:text-gray-700"
    aria-label="Restart level"
    title="Restart level"
  ><RotateCcw size={20} /></button></div></div><AnimatePresence>{showTutorial && <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200"
  ><div className="flex justify-between items-start"><div><h3 className="text-lg font-semibold mb-2 text-blue-800">How to Play:</h3><ul className="list-disc pl-5 space-y-1 text-blue-700"><li>Click on a test tube to select it</li><li>Click on another tube to pour liquid from the selected tube</li><li>Match all liquids by type in each tube</li><li>Complete the level by sorting all chemicals correctly!</li></ul><div className="mt-4"><h4 className="font-semibold mb-2 text-blue-800">Chemical Types:</h4><div className="grid grid-cols-3 gap-2">{Object.entries(LIQUID_NAMES).map(([type, name]) => <div key={type} className="flex items-center"><div className={`w-4 h-4 rounded-full ${LIQUID_COLORS[type]} mr-2`} /><div><span className="font-medium">{name}</span><p className="text-xs text-gray-600">{LIQUID_DESCRIPTIONS[type]}</p></div></div>)}</div></div></div><div className="flex space-x-4 mt-6"><button
    onClick={() => setShowTutorial(false)}
    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
  >
                  Got it!
                </button><button
    onClick={restartLevel}
    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors font-medium"
  >
                  Replay Level
                </button></div></div></motion.div>}</AnimatePresence><div className="grid grid-cols-3 gap-4 mt-6">{tubes.map((tube, idx) => <div
    key={idx}
    className={`flex flex-col items-center cursor-pointer transition-transform ${selectedTube === idx ? "transform -translate-y-2" : ""}`}
    onClick={() => handleTubeClick(idx)}
  ><div className="w-16 h-32 bg-gray-100 rounded-b-lg border-2 border-t-0 border-gray-300 flex flex-col-reverse p-1">{tube.liquids.map((liquid, lidx) => <div
    key={lidx}
    className={`h-1/4 w-full ${LIQUID_COLORS[liquid]} ${lidx < tube.liquids.length - 1 ? "border-b border-white" : ""}`}
  />)}</div><div className="w-16 h-4 bg-gray-100 border-l-2 border-r-2 border-t-2 border-gray-300 rounded-t-lg" /></div>)}</div><div className="mt-8 p-4 bg-gray-50 rounded-lg"><h3 className="font-semibold mb-2">Chemistry Tip:</h3><p className="text-sm text-gray-700">
          In chemistry, acids and bases are classified by their pH level. Acids have a pH less than 7, 
          bases have a pH greater than 7, and neutral substances have a pH of 7. 
          When mixing chemicals, it's important to know their properties to avoid dangerous reactions!
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
export default WaterSortPuzzle;
