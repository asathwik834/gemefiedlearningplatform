import { useRewards } from "../../contexts/RewardsContext";
import { useState, useEffect } from "react";
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Trophy, Target } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
const PhysicsSimulator = ({ onBack, currentUser }) => {
  const rewards = useRewards();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitScore = async () => {
    try {
      const scoreVal = typeof score !== "undefined" ? score : (typeof moves !== "undefined" ? Math.max(10, 100 - moves) : 100);
      await rewards.addXP(scoreVal);
      await rewards.recordHighScore("physics-simulator", scoreVal, { title: "Physics Simulator", subject: "Physics" });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const { t } = useTranslation();
  const [currentSim, setCurrentSim] = useState("pendulum");
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [pendulumAngle, setPendulumAngle] = useState(45);
  const [gravity, setGravity] = useState(9.8);
  const [length, setLength] = useState(1);
  const [animationFrame, setAnimationFrame] = useState(0);
  const simulations = [
    {
      id: "pendulum",
      name: t("pendulumMotion"),
      description: t("pendulumDesc"),
      difficulty: "easy",
      points: 50,
      completed: false
    },
    {
      id: "projectile",
      name: t("projectileMotion"),
      description: t("projectileDesc"),
      difficulty: "medium",
      points: 75,
      completed: false
    },
    {
      id: "wave",
      name: t("waveMotion"),
      description: t("waveDesc"),
      difficulty: "hard",
      points: 100,
      completed: false
    }
  ];
  useEffect(() => {
    let interval;
    if (isPlaying && currentSim === "pendulum") {
      interval = setInterval(() => {
        setAnimationFrame((prev) => prev + 1);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSim]);
  const calculatePendulumPosition = () => {
    const time = animationFrame * 0.05;
    const angularFrequency = Math.sqrt(gravity / length);
    const currentAngle = pendulumAngle * Math.PI / 180 * Math.cos(angularFrequency * time);
    const x = Math.sin(currentAngle) * 150;
    const y = Math.cos(currentAngle) * 150;
    return { x, y };
  };
  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setScore(score + 10);
    }
  };
  const handleReset = () => {
    setIsPlaying(false);
    setAnimationFrame(0);
    setScore(score + 5);
  };
  const handleParameterChange = (param, value) => {
    if (param === "angle") setPendulumAngle(value);
    if (param === "gravity") setGravity(value);
    if (param === "length") setLength(value);
    setScore(score + 2);
  };
  const pendulumPos = currentSim === "pendulum" ? calculatePendulumPosition() : { x: 0, y: 0 };
  return <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4"><div className="max-w-6xl mx-auto">{
    /* Header */
  }<div className="flex items-center justify-between mb-6"><button
    onClick={onBack}
    className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
  ><ArrowLeft className="w-5 h-5 mr-2" />{t("backToGames")}</button><div className="flex items-center space-x-4"><div className="flex items-center text-purple-600 font-medium"><Trophy className="w-5 h-5 mr-2" /><span>{score} {t("points")}</span></div></div></div><div className="grid grid-cols-1 lg:grid-cols-4 gap-6">{
    /* Simulation List */
  }<div className="bg-white rounded-xl shadow-sm p-6"><h3 className="text-lg font-semibold text-gray-900 mb-4">{t("simulations")}</h3><div className="space-y-3">{simulations.map((sim) => <button
    key={sim.id}
    onClick={() => setCurrentSim(sim.id)}
    className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${currentSim === sim.id ? "border-purple-300 bg-purple-50" : "border-gray-200 hover:border-purple-200 hover:bg-purple-25"}`}
  ><div className="font-medium text-gray-900">{sim.name}</div><div className="text-sm text-gray-600">{sim.description}</div><div className="flex items-center justify-between mt-2"><span className={`px-2 py-1 rounded text-xs ${sim.difficulty === "easy" ? "bg-green-100 text-green-800" : sim.difficulty === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{sim.difficulty}</span><span className="text-xs text-purple-600">+{sim.points} pts</span></div></button>)}</div></div>{
    /* Simulation Display */
  }<div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"><div className="flex items-center justify-between mb-6"><h3 className="text-lg font-semibold text-gray-900">{simulations.find((s) => s.id === currentSim)?.name}</h3><div className="flex items-center space-x-2"><button
    onClick={handlePlay}
    className={`p-2 rounded-lg transition-colors ${isPlaying ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
  >{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button><button
    onClick={handleReset}
    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
  ><RotateCcw className="w-5 h-5" /></button></div></div>{
    /* Simulation Canvas */
  }<div className="relative bg-gray-50 rounded-lg h-96 flex items-center justify-center overflow-hidden">{currentSim === "pendulum" && <svg width="400" height="350" className="absolute">{
    /* Pivot Point */
  }<circle cx="200" cy="50" r="5" fill="#374151" />{
    /* String */
  }<line
    x1="200"
    y1="50"
    x2={200 + pendulumPos.x}
    y2={50 + pendulumPos.y}
    stroke="#374151"
    strokeWidth="2"
  />{
    /* Pendulum Bob */
  }<circle
    cx={200 + pendulumPos.x}
    cy={50 + pendulumPos.y}
    r="15"
    fill="#8B5CF6"
    className="drop-shadow-md"
  />{
    /* Arc showing motion range */
  }<path
    d={`M ${200 - Math.sin(pendulumAngle * Math.PI / 180) * 150} ${50 + Math.cos(pendulumAngle * Math.PI / 180) * 150} A 150 150 0 0 1 ${200 + Math.sin(pendulumAngle * Math.PI / 180) * 150} ${50 + Math.cos(pendulumAngle * Math.PI / 180) * 150}`}
    stroke="#D1D5DB"
    strokeWidth="1"
    strokeDasharray="5,5"
    fill="none"
  /></svg>}{currentSim === "projectile" && <div className="text-center text-gray-600"><Target className="w-16 h-16 mx-auto mb-4 text-gray-400" /><p>{t("selectProjectile")}</p></div>}{currentSim === "wave" && <div className="text-center text-gray-600"><Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" /><p>{t("selectWave")}</p></div>}</div>{
    /* Status */
  }<div className="mt-4 p-3 bg-blue-50 rounded-lg"><div className="flex items-center justify-between text-sm"><span className="text-blue-700">{t("status")}: {isPlaying ? t("running") : t("paused")}</span><span className="text-blue-600">{t("time")}: {(animationFrame * 0.05).toFixed(1)}s
                </span></div></div></div>{
    /* Controls */
  }<div className="bg-white rounded-xl shadow-sm p-6"><h3 className="text-lg font-semibold text-gray-900 mb-4">{t("controls")}</h3>{currentSim === "pendulum" && <div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">{t("initialAngle")}: {pendulumAngle}°
                  </label><input
    type="range"
    min="10"
    max="80"
    value={pendulumAngle}
    onChange={(e) => handleParameterChange("angle", Number(e.target.value))}
    className="w-full"
    disabled={isPlaying}
  /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">{t("gravity")}: {gravity} m/s²
                  </label><input
    type="range"
    min="1"
    max="20"
    step="0.1"
    value={gravity}
    onChange={(e) => handleParameterChange("gravity", Number(e.target.value))}
    className="w-full"
    disabled={isPlaying}
  /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">{t("length")}: {length} m
                  </label><input
    type="range"
    min="0.5"
    max="2"
    step="0.1"
    value={length}
    onChange={(e) => handleParameterChange("length", Number(e.target.value))}
    className="w-full"
    disabled={isPlaying}
  /></div></div>}{
    /* Physics Info */
  }<div className="mt-6 p-4 bg-purple-50 rounded-lg"><h4 className="font-medium text-purple-900 mb-2">{t("didYouKnow")}</h4>{currentSim === "pendulum" && <p className="text-sm text-purple-700">{t("pendulumFact")}</p>}</div>{
    /* Achievement Progress */
  }<div className="mt-6"><h4 className="font-medium text-gray-900 mb-2">{t("progress")}</h4><div className="space-y-2"><div className="flex justify-between text-sm"><span>{t("experimentsRun")}</span><span>5/10</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-purple-600 h-2 rounded-full w-1/2" /></div></div></div></div></div></div>
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
export default PhysicsSimulator;
