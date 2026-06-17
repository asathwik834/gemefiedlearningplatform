import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { class6Games } from "../cbse/class6Games";
import { class7Games } from "../cbse/class7Games";
import { class8Games } from "../cbse/class8Games";
import { class9Games } from "../cbse/class9Games";
import { class10Games } from "../cbse/class10Games";
import { class11Games } from "../cbse/class11Games";
import { class12Games } from "../cbse/class12Games";
const subjectTitleMap = {
  science: "Science",
  mathematics: "Mathematics",
  "social-science": "Social Science",
  english: "English",
  hindi: "Hindi"
};
function getGamesFor(grade, subject) {
  if (grade === 6) {
    return class6Games[subject] || [];
  }
  if (grade === 7) {
    return class7Games[subject] || [];
  }
  if (grade === 8) {
    return class8Games[subject] || [];
  }
  if (grade === 9) {
    return class9Games[subject] || [];
  }
  if (grade === 10) {
    return class10Games[subject] || [];
  }
  if (grade === 11) {
    return class11Games[subject] || [];
  }
  if (grade === 12) {
    return class12Games[subject] || [];
  }
  return [];
}
const CBSESubjectPage = () => {
  const navigate = useNavigate();
  const { grade: gradeParam, subject } = useParams();
  const grade = Number(gradeParam);
  const games = getGamesFor(grade, subject || "");
  const [chapterFilter, setChapterFilter] = React.useState("All");
  const chapters = React.useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    games.forEach((g) => set.add(g.chapter));
    return ["All", ...Array.from(set)];
  }, [games]);
  const title = `${subjectTitleMap[subject || ""] || "Subject"} \u2022 Class ${Number.isFinite(grade) ? grade : ""}`;
  return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-6 md:p-8"><div className="max-w-6xl mx-auto"><div className="flex items-center justify-between mb-6"><h1 className="text-3xl font-bold text-gray-900">{title}</h1><div className="flex gap-2"><button onClick={() => navigate(`/cbse/class/${grade}`)} className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-50">Back to Class</button><button onClick={() => navigate("/games")} className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-50">Back to Games</button></div></div>{
    /* Chapter Filters */
  }{games.length > 0 && <div className="mb-4 flex flex-wrap gap-2">{chapters.map((ch) => <button
    key={ch}
    onClick={() => setChapterFilter(ch)}
    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${chapterFilter === ch ? "bg-blue-600 text-white border-blue-700" : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"}`}
  >{ch}</button>)}</div>}{games.length === 0 ? <div className="bg-white rounded-xl shadow-sm p-6 text-gray-700">No games available yet for this subject.</div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{(chapterFilter === "All" ? games : games.filter((g) => g.chapter === chapterFilter)).map((g) => <Link key={g.id} to={`/cbse/class/${grade}/${subject}/${g.id}`} className="group"><div className="p-5 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow h-full"><div className="text-xs text-gray-500 mb-1">{subjectTitleMap[g.subject]} • {g.chapter}</div><div className="font-semibold text-gray-900 mb-1">{g.title}</div><div className="text-sm text-gray-600">{g.description}</div><div className="mt-3 inline-flex text-blue-700 group-hover:text-blue-800 text-sm">Play →</div></div></Link>)}</div>}</div></div>;
};
export default CBSESubjectPage;
