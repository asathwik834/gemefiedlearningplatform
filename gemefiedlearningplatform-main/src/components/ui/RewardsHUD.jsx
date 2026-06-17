import { Award, Star } from "lucide-react";
import { useRewards } from "../../contexts/RewardsContext";
const RewardsHUD = () => {
  const { xp, level, badges, getLevelThreshold } = useRewards();
  const currentBase = getLevelThreshold(level);
  const nextThresh = getLevelThreshold(level + 1);
  const span = Math.max(1, nextThresh - currentBase);
  const progress = Math.max(0, Math.min(1, (xp - currentBase) / span));
  return <div className="flex items-center gap-4 bg-white/60 backdrop-blur px-3 py-2 rounded-lg border border-gray-200"><div className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" /><div className="text-sm font-semibold text-gray-800">Lvl {level}</div></div><div className="w-36"><div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${Math.round(progress * 100)}%` }} /></div><div className="mt-1 text-[11px] text-gray-500">XP: {xp - currentBase} / {nextThresh - currentBase}</div></div><div className="flex items-center gap-1 text-sm text-gray-700"><Award className="w-4 h-4 text-purple-500" /><span>{badges.length} badges</span></div></div>;
};
export default RewardsHUD;
