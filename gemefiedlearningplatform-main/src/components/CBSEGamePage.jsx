import { useNavigate, useParams, useLocation } from "react-router-dom";
import { class6Games } from "../cbse/class6Games";
import { class7Games } from "../cbse/class7Games";
import { class8Games } from "../cbse/class8Games";
import { class9Games } from "../cbse/class9Games";
import { class10Games } from "../cbse/class10Games";
import { class11Games } from "../cbse/class11Games";
import { class12Games } from "../cbse/class12Games";
import GameSkeleton from "./games/skeletons/GameSkeleton";
function getGame(grade, subject, gameId) {
  const maps = {
    6: class6Games,
    7: class7Games,
    8: class8Games,
    9: class9Games,
    10: class10Games,
    11: class11Games,
    12: class12Games
  };
  const bySubject = maps[grade];
  if (!bySubject) return void 0;
  const list = bySubject[subject] || [];
  return list.find((g) => g.id === gameId);
}
const CBSEGamePage = () => {
  const navigate = useNavigate();
  const { grade: gradeParam, subject = "", gameId = "" } = useParams();
  const grade = Number(gradeParam);
  const location = useLocation();
  const focusMode = new URLSearchParams(location.search).get("focus") === "1";
  const game = getGame(grade, subject, gameId);
  if (!game) {
    return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-6 md:p-8"><div className="max-w-4xl mx-auto"><div className="bg-white rounded-xl shadow-sm p-6"><div className="text-gray-800 font-semibold mb-2">Game not found</div><p className="text-gray-700 mb-4">We couldn't find this game for Class {grade} • {subject}.</p><div className="flex gap-2"><button onClick={() => navigate(`/cbse/class/${grade}/${subject}`)} className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-50">Back to Subject</button><button onClick={() => navigate(`/cbse/class/${grade}`)} className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-50">Back to Class</button></div></div></div></div>;
  }
  return <GameSkeleton
    game={game}
    focusMode={focusMode}
    onBack={() => navigate(`/cbse/class/${grade}/${subject}`)}
  />;
};
export default CBSEGamePage;
