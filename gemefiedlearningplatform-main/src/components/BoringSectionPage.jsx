import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { trickGames } from "../cbse/trickGames";
const BoringSectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const rawParam = (params.get("subject") || "").toLowerCase();
  const normalize = (s) => {
    if (!s) return "";
    if (["math", "maths", "mathematics"].includes(s)) return "mathematics";
    if (["sci", "science"].includes(s)) return "science";
    if (["sst", "social", "social-science", "socialscience"].includes(s)) return "social-science";
    if (["eng", "english"].includes(s)) return "english";
    if (["hin", "hindi"].includes(s)) return "hindi";
    if (["san", "sanskrit"].includes(s)) return "sanskrit";
    return s;
  };
  const subjParam = normalize(rawParam);
  const filtered = useMemo(() => {
    if (!subjParam) return trickGames;
    return trickGames.filter((tg) => tg.subject.toLowerCase() === subjParam);
  }, [subjParam]);
  useEffect(() => {
    if (!subjParam) return;
    const pool = filtered.length > 0 ? filtered : trickGames;
    if (pool.length > 0) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      navigate(`/cbse/class/${pick.grade}/${pick.subject}/${pick.gameId}?focus=1`, { replace: true });
    }
  }, [subjParam, filtered, navigate]);
  const grouped = trickGames.reduce((acc, tg) => {
    acc[tg.grade] = acc[tg.grade] || [];
    acc[tg.grade].push(tg);
    return acc;
  }, {});
  const grades = Object.keys(grouped).map(Number).sort((a, b) => a - b);
  return <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100 p-6 md:p-8"><div className="max-w-6xl mx-auto"><h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Trick Games (Focus Zone)</h1><p className="text-center text-gray-700 mb-6">These games are challenging and need extra attention. Try them when you want to level up your thinking.</p><div className="space-y-6">{grades.map((g) => <div key={g} className="bg-white rounded-xl shadow-sm p-5"><div className="text-lg font-semibold text-gray-900 mb-3">Class {g}</div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">{grouped[g].map((item) => <Link key={`${g}-${item.subject}-${item.gameId}`} to={`/cbse/class/${g}/${item.subject}/${item.gameId}?focus=1`} className="group"><div className="p-4 border rounded-lg hover:shadow-md transition-shadow h-full"><div className="text-xs text-gray-500 mb-1">{item.subject}{item.chapter ? ` \u2022 ${item.chapter}` : ""}</div><div className="font-semibold text-gray-900 mb-1">{item.title}</div><div className="text-sm text-blue-700 group-hover:text-blue-800">Play →</div></div></Link>)}</div></div>)}</div></div></div>;
};
export default BoringSectionPage;
