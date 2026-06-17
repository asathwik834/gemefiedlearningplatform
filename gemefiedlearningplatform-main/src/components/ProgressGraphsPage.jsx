import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import { useRewards } from "../contexts/RewardsContext";
import { useParams, Link } from "react-router-dom";
function startOfWeek(d) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}
function startOfMonth(d) {
  const date = new Date(d.getFullYear(), d.getMonth(), 1);
  date.setHours(0, 0, 0, 0);
  return date;
}
function startOfQuarter(d) {
  const q = Math.floor(d.getMonth() / 3);
  const date = new Date(d.getFullYear(), q * 3, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}
function startOfYear(d) {
  const date = new Date(d.getFullYear(), 0, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}
function getBuckets(period) {
  const now = /* @__PURE__ */ new Date();
  const buckets = [];
  if (period === "week") {
    let end = startOfWeek(now);
    for (let i = 3; i >= 0; i--) {
      const start = new Date(end);
      start.setDate(start.getDate() - 7);
      buckets.push({ label: `W${4 - i}`, start, end });
      end = start;
    }
  } else if (period === "month") {
    let cursor = startOfMonth(now);
    for (let i = 5; i >= 0; i--) {
      const end = new Date(cursor);
      const start = new Date(cursor);
      start.setMonth(start.getMonth() - 1);
      buckets.push({ label: end.toLocaleString("default", { month: "short" }), start, end });
      cursor = start;
    }
  } else if (period === "quarter") {
    let cursor = startOfQuarter(now);
    for (let i = 3; i >= 0; i--) {
      const end = new Date(cursor);
      const start = new Date(cursor);
      start.setMonth(start.getMonth() - 3);
      const q = Math.floor(end.getMonth() / 3) + 1;
      buckets.push({ label: `Q${q}`, start, end });
      cursor = start;
    }
  } else {
    let cursor = startOfYear(now);
    for (let i = 1; i >= 0; i--) {
      const end = new Date(cursor);
      const start = new Date(cursor);
      start.setFullYear(start.getFullYear() - 1);
      buckets.push({ label: `${end.getFullYear()}`, start, end });
      cursor = start;
    }
  }
  return buckets.reverse();
}
const ProgressGraphsPage = () => {
  const { period } = useParams();
  const normalized = period === "week" || period === "month" || period === "quarter" || period === "year" ? period : "week";
  const titleMap = { week: "This Week", month: "This Month", quarter: "This Quarter", year: "This Year" };
  const title = titleMap[normalized];
  const rewards = useRewards();
  const buckets = getBuckets(normalized);
  const chartData = buckets.map((b) => {
    const scores = [];
    let games = 0;
    for (const gameId of Object.keys(rewards.highscores)) {
      const list = rewards.highscores[gameId] || [];
      list.forEach((h) => {
        const ts = new Date(h.timestamp);
        if (ts >= b.start && ts < b.end) {
          games += 1;
          if (typeof h.score === "number") scores.push(h.score);
        }
      });
    }
    const avgScore = scores.length ? Math.round(scores.reduce((a, c) => a + c, 0) / scores.length) : 0;
    return { label: b.label, games, avgScore };
  });
  return <div className="min-h-screen bg-gray-50 p-6"><div className="max-w-5xl mx-auto"><div className="flex items-center justify-between mb-6"><h1 className="text-2xl md:text-3xl font-bold text-gray-900">Progress Graphs — {title}</h1><div className="flex gap-2 flex-wrap"><Link to="/progress" className="px-3 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-100">Back</Link>{["week", "month", "quarter", "year"].filter((p) => p !== normalized).map((p) => <Link key={p} to={`/progress/${p}`} className="px-3 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-100">{titleMap[p]}</Link>)}</div></div>{
    /* Games Played (Bar) */
  }<div className="bg-white rounded-xl shadow-sm p-6 mb-6"><h2 className="text-lg font-semibold text-gray-900 mb-4">Games Played ({title})</h2><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis allowDecimals={false} /><Tooltip /><Legend /><Bar dataKey="games" name="Games" fill="#2563eb" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></div>{
    /* Average Score (Line) */
  }<div className="bg-white rounded-xl shadow-sm p-6"><h2 className="text-lg font-semibold text-gray-900 mb-4">Average Score ({title})</h2><div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis domain={[0, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="avgScore" name="Avg Score" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div></div></div></div>;
};
export default ProgressGraphsPage;
