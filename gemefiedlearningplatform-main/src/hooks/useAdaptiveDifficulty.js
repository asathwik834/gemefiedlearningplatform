import { useState } from "react";
const DIFFICULTY_LEVELS = [
  { level: 1, label: "Beginner", description: "Basic concepts with guided assistance", color: "bg-green-100 text-green-800" },
  { level: 2, label: "Intermediate", description: "Standard problems with hints", color: "bg-blue-100 text-blue-800" },
  { level: 3, label: "Advanced", description: "Challenging problems", color: "bg-yellow-100 text-yellow-800" },
  { level: 4, label: "Expert", description: "Complex problems requiring deep understanding", color: "bg-red-100 text-red-800" }
];
export const useAdaptiveDifficulty = (_gameId) => {
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [currentDifficulty, setCurrentDifficulty] = useState(DIFFICULTY_LEVELS[0]);
  const [isLoading] = useState(false);
  const calculateDifficulty = (metrics) => {
    if (metrics.length === 0) return DIFFICULTY_LEVELS[0];
    const recentMetrics = metrics.slice(-5);
    const avgScore = recentMetrics.reduce((sum, m) => sum + m.score, 0) / recentMetrics.length;
    const avgAccuracy = recentMetrics.reduce((sum, m) => sum + m.accuracy, 0) / recentMetrics.length;
    if (avgScore > 80 && avgAccuracy > 0.8) {
      return DIFFICULTY_LEVELS[Math.min(3, currentDifficulty.level + 1)];
    } else if (avgScore < 40 || avgAccuracy < 0.4) {
      return DIFFICULTY_LEVELS[Math.max(0, currentDifficulty.level - 1)];
    }
    return currentDifficulty;
  };
  const updatePerformance = (newMetrics) => {
    const updatedMetrics = [
      ...performanceHistory,
      { ...newMetrics, date: /* @__PURE__ */ new Date() }
    ];
    setPerformanceHistory(updatedMetrics);
    const newDifficulty = calculateDifficulty(updatedMetrics);
    setCurrentDifficulty(newDifficulty);
    return newDifficulty;
  };
  const getRecommendedGrade = () => {
    if (performanceHistory.length === 0) return { grade: 6, confidence: 0 };
    const avgScore = performanceHistory.reduce((sum, m) => sum + m.score, 0) / performanceHistory.length;
    const grade = Math.min(12, Math.max(6, Math.floor(6 + avgScore / 100 * 6)));
    const confidence = Math.min(100, Math.max(0, avgScore));
    return { grade, confidence };
  };
  const getSkillSuggestions = () => {
    const suggestions = [];
    if (performanceHistory.length === 0) {
      return ["Complete more games to get personalized suggestions"];
    }
    const recent = performanceHistory[performanceHistory.length - 1];
    if (recent.accuracy < 0.5) {
      suggestions.push("Review basic concepts before moving to advanced problems");
    }
    if (recent.timeSpent > 300) {
      suggestions.push("Practice time management skills");
    }
    if (recent.attempts > 3) {
      suggestions.push("Try to understand the problem fully before attempting to solve");
    }
    return suggestions.length > 0 ? suggestions : ["Great job! Keep up the good work!"];
  };
  return {
    currentDifficulty,
    updatePerformance,
    getRecommendedGrade,
    getSkillSuggestions,
    difficultyLevels: DIFFICULTY_LEVELS,
    isLoading
  };
};
export default useAdaptiveDifficulty;
