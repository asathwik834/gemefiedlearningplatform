import { createContext, useContext } from "react";
import { useAdaptiveDifficulty } from "../hooks/useAdaptiveDifficulty";
const defaultContext = {
  currentDifficulty: {
    level: 1,
    label: "Beginner",
    description: "Basic concepts with guided assistance",
    color: "bg-green-100 text-green-800"
  },
  updatePerformance: () => ({
    level: 1,
    label: "Beginner",
    description: "Basic concepts with guided assistance",
    color: "bg-green-100 text-green-800"
  }),
  getRecommendedGrade: () => ({ grade: 6, confidence: 0 }),
  getSkillSuggestions: () => [],
  difficultyLevels: [
    { level: 1, label: "Beginner", description: "Basic concepts", color: "bg-green-100 text-green-800" },
    { level: 2, label: "Intermediate", description: "Standard problems", color: "bg-blue-100 text-blue-800" },
    { level: 3, label: "Advanced", description: "Challenging problems", color: "bg-yellow-100 text-yellow-800" },
    { level: 4, label: "Expert", description: "Complex problems", color: "bg-red-100 text-red-800" }
  ],
  isLoading: false
};
const AdaptiveDifficultyContext = createContext(defaultContext);
export const AdaptiveDifficultyProvider = ({ children }) => {
  const adaptiveDifficulty = useAdaptiveDifficulty("global");
  return <AdaptiveDifficultyContext.Provider value={adaptiveDifficulty}>{children}</AdaptiveDifficultyContext.Provider>;
};
export const useAdaptiveDifficultyContext = () => {
  const context = useContext(AdaptiveDifficultyContext);
  if (!context) {
    throw new Error("useAdaptiveDifficultyContext must be used within an AdaptiveDifficultyProvider");
  }
  return context;
};
export default AdaptiveDifficultyContext;
