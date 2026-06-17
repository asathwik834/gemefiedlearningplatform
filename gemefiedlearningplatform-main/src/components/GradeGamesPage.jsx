import { useParams } from "react-router-dom";
import GameHub from "./GameHub";
const GradeGamesPage = () => {
  const { grade } = useParams();
  const initial = Number(grade);
  const valid = Number.isFinite(initial) ? initial : void 0;
  return <GameHub currentUser={"Student"} initialGrade={valid} />;
};
export default GradeGamesPage;
