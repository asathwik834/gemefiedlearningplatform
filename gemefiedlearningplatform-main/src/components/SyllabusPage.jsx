import { Link } from "react-router-dom";
const grades = [6, 7, 8, 9, 10, 11, 12];
const subjects = ["science", "mathematics", "social-science", "english", "hindi", "sanskrit"];
const SyllabusPage = () => {
  return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-6 md:p-8"><div className="max-w-6xl mx-auto"><h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Syllabus</h1><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{
    /* State syllabus by grade (routes to grade-filtered GameHub) */
  }<div className="bg-white rounded-xl shadow-sm p-6"><h2 className="text-xl font-semibold text-gray-900 mb-4">State (Grades 6–12)</h2><div className="space-y-6">{grades.map((g) => <div key={`state-${g}`} className="border rounded-lg p-4"><div className="mb-3"><Link to={`/games/grade/${g}`} className="inline-block px-3 py-2 rounded-md border bg-blue-50 text-blue-700 hover:bg-blue-100">
                      State {g}</Link></div><div className="text-sm text-gray-500 mb-2">Subjects</div><div className="flex flex-col gap-2">{subjects.map((s) => <Link key={`state-${g}-${s}`} to={`/games/grade/${g}`} className="w-full px-3 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-100 text-left">{s}</Link>)}</div></div>)}</div><p className="mt-4 text-sm text-gray-600">Opens the grade-specific games. Subject filtering for State can be added on request.</p></div>{
    /* CBSE syllabus by class and subject */
  }<div className="bg-white rounded-xl shadow-sm p-6"><h2 className="text-xl font-semibold text-gray-900 mb-4">CBSE (Classes 6–12)</h2><div className="space-y-6">{grades.map((g) => <div key={`cbse-${g}`} className="border rounded-lg p-4"><div className="font-medium text-gray-800 mb-3">Class {g}</div><div className="flex flex-col gap-2">{subjects.map((s) => <Link key={`${g}-${s}`} to={`/cbse/class/${g}/${s}`} className="w-full px-3 py-2 rounded-md border bg-green-50 text-green-700 hover:bg-green-100 text-left">{s}</Link>)}</div></div>)}</div><p className="mt-4 text-sm text-gray-600">Opens subject landing pages with chapter filters and game tiles.</p></div></div></div></div>;
};
export default SyllabusPage;
