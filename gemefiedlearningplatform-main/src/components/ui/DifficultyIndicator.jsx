const DifficultyIndicator = ({
  difficulty,
  className = "",
  showLabel = true,
  showDescription = false
}) => {
  return <div className={`inline-flex items-center ${className}`}><div className="flex items-center">{[1, 2, 3, 4].map((level) => <div
    key={level}
    className={`w-3 h-3 rounded-full mx-0.5 ${level <= difficulty.level ? difficulty.color : "bg-gray-200"}`}
    aria-hidden="true"
  />)}</div>{showLabel && <span className={`ml-2 text-sm font-medium ${difficulty.color}`}>{difficulty.label}</span>}{showDescription && <p className="mt-1 text-xs text-gray-500">{difficulty.description}</p>}</div>;
};
export default DifficultyIndicator;
