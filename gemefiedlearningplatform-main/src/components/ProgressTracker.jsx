import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Target, BookOpen, Zap, Star } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useRewards } from "../contexts/RewardsContext";
const ProgressTracker = ({ currentUser: user }) => {
  const userName = typeof user === "string" ? user : user?.name || "Student";
  const currentUser = typeof user === "string" ? { id: "1", name: user, email: "", role: "student" } : user;
  const { t } = useTranslation();
  const [selectedTimeRange, setSelectedTimeRange] = useState("month");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const navigate = useNavigate();
  const rewards = useRewards();
  function startOfWeek(d) {
    const date = new Date(d);
    const day = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  function getLastWeeks(n) {
    const now = /* @__PURE__ */ new Date();
    let end = startOfWeek(now);
    const buckets = [];
    for (let i = n - 1; i >= 0; i--) {
      const start = new Date(end);
      start.setDate(start.getDate() - 7);
      buckets.push({ label: `Week ${n - i}`, start, end });
      end = start;
    }
    return buckets.reverse();
  }
  const weeklyData = useMemo(() => {
    const buckets = getLastWeeks(4);
    return buckets.map((b) => {
      let gamesPlayed = 0;
      const scores = [];
      for (const gameId of Object.keys(rewards.highscores)) {
        const list = rewards.highscores[gameId] || [];
        list.forEach((h) => {
          const ts = new Date(h.timestamp);
          if (ts >= b.start && ts < b.end) {
            gamesPlayed += 1;
            if (typeof h.score === "number") scores.push(h.score);
          }
        });
      }
      const accuracy = scores.length ? Math.round(scores.reduce((a, c) => a + c, 0) / scores.length) : 0;
      const xp = scores.reduce((a, c) => a + c, 0);
      return { week: b.label, xp, gamesPlayed, accuracy };
    });
  }, [rewards.highscores]);
  const subjectProgress = useMemo(() => {
    const bySubject = {};
    Object.keys(rewards.highscores).forEach((gameId) => {
      (rewards.highscores[gameId] || []).forEach((h) => {
        const subj = h.meta?.subject || "General";
        const title = h.meta?.title || gameId;
        if (!bySubject[subj]) bySubject[subj] = { xp: 0, titles: [] };
        const sc = typeof h.score === "number" ? h.score : 0;
        bySubject[subj].xp += sc;
        bySubject[subj].titles.push(title);
      });
    });
    const colorMap = {
      Mathematics: "bg-blue-500",
      Science: "bg-green-500",
      Physics: "bg-purple-500",
      Chemistry: "bg-orange-500",
      English: "bg-pink-500",
      Hindi: "bg-rose-500",
      Sanskrit: "bg-amber-500",
      "Social Science": "bg-indigo-500",
      General: "bg-slate-500"
    };
    const items = Object.keys(bySubject).map((subj) => {
      const xp = bySubject[subj].xp;
      const level = Math.max(1, Math.floor(xp / 500) + 1);
      const nextCap = level * 500;
      const xpIntoLevel = xp % 500;
      const xpToNext = Math.max(0, nextCap - xpIntoLevel);
      const recent = Array.from(new Set(bySubject[subj].titles.slice(-5))).reverse().slice(0, 3);
      return {
        subject: subj,
        currentLevel: level,
        xp: xpIntoLevel,
        xpToNext,
        totalXP: xp,
        color: colorMap[subj] || "bg-slate-500",
        recentActivities: recent.length ? recent : ["Keep playing to build recent activities"]
      };
    });
    items.sort((a, b) => b.totalXP - a.totalXP);
    return items;
  }, [rewards.highscores]);
  const achievements = [
    { title: "Math Wizard", description: "Complete 50 math problems", progress: 45, total: 50, icon: "\u{1F9EE}" },
    { title: "Science Explorer", description: "Play 25 science games", progress: 18, total: 25, icon: "\u{1F52C}" },
    { title: "Streak Master", description: "Maintain 30-day streak", progress: 12, total: 30, icon: "\u{1F525}" },
    { title: "Perfect Score", description: "Get 100% on 10 quizzes", progress: 6, total: 10, icon: "\u{1F3AF}" }
  ];
  const totalXP = rewards.xp;
  const averageAccuracy = weeklyData.length ? Math.round(weeklyData.reduce((sum, w) => sum + w.accuracy, 0) / weeklyData.length) : 0;
  return <div className="min-h-screen bg-gray-50 p-6"><div className="space-y-6">{
    /* Header */
  }<div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold text-gray-800 mb-2">{userName}'s Progress
            </h1><p className="text-gray-600">{t("trackYourLearning")}</p></div><select
    value={selectedTimeRange}
    onChange={(e) => {
      const val = e.target.value;
      setSelectedTimeRange(val);
      if (["week", "month", "quarter", "year"].includes(val)) {
        navigate(`/progress/${val}`);
      }
    }}
    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  ><option value="week">{t("thisWeek")}</option><option value="month">{t("thisMonth")}</option><option value="quarter">{t("thisQuarter")}</option><option value="year">{t("thisYear")}</option></select></div>{
    /* Quick links to detailed graphs */
  }<div className="flex items-center gap-2"><Link to="/progress/week" className="px-3 py-1.5 text-sm rounded-md border bg-white text-gray-700 hover:bg-gray-100">
            View This Week Graphs
          </Link><Link to="/progress/month" className="px-3 py-1.5 text-sm rounded-md border bg-white text-gray-700 hover:bg-gray-100">
            View This Month Graphs
          </Link></div>{
    /* Overview Cards */
  }<div className="grid grid-cols-1 md:grid-cols-4 gap-4"><div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white"><div className="flex items-center justify-between"><div><p className="text-blue-100">{t("totalXP")}</p><p className="text-3xl font-bold">{totalXP.toLocaleString()}</p></div><Zap className="w-10 h-10 text-blue-200" /></div><div className="mt-2 text-blue-100 text-sm">
              +{weeklyData[weeklyData.length - 1].xp} {t("thisWeek")}</div></div><div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white"><div className="flex items-center justify-between"><div><p className="text-green-100">{t("accuracy")}</p><p className="text-3xl font-bold">{averageAccuracy.toFixed(0)}%</p></div><Target className="w-10 h-10 text-green-200" /></div><div className="mt-2 text-green-100 text-sm">
              +{(weeklyData[weeklyData.length - 1].accuracy - weeklyData[weeklyData.length - 2].accuracy).toFixed(0)}% {t("improvement")}</div></div><div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white"><div className="flex items-center justify-between"><div><p className="text-purple-100">{t("gamesPlayed")}</p><p className="text-3xl font-bold">{weeklyData.reduce((sum, week) => sum + week.gamesPlayed, 0)}</p></div><BookOpen className="w-10 h-10 text-purple-200" /></div><div className="mt-2 text-purple-100 text-sm">{weeklyData[weeklyData.length - 1].gamesPlayed} {t("thisWeek")}</div></div><div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white"><div className="flex items-center justify-between"><div><p className="text-orange-100">{t("currentStreak")}</p><p className="text-3xl font-bold">12</p></div><Calendar className="w-10 h-10 text-orange-200" /></div><div className="mt-2 text-orange-100 text-sm">{t("days")}</div></div></div>{
    /* Weekly Progress Chart */
  }<div className="bg-white rounded-xl shadow-sm p-6"><h3 className="text-lg font-semibold text-gray-900 mb-6">{t("weeklyProgress")}</h3><div className="space-y-4">{weeklyData.map((week) => <div key={week.week} className="flex items-center space-x-4"><div className="w-20 text-sm text-gray-600">{week.week}</div><div className="flex-1 grid grid-cols-3 gap-4"><div className="bg-blue-50 rounded-lg p-3"><div className="text-sm text-gray-600">XP</div><div className="text-lg font-semibold text-blue-600">{week.xp}</div><div className="w-full bg-blue-200 rounded-full h-2 mt-1"><div
    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
    style={{ width: `${week.xp / 700 * 100}%` }}
  /></div></div><div className="bg-green-50 rounded-lg p-3"><div className="text-sm text-gray-600">{t("games")}</div><div className="text-lg font-semibold text-green-600">{week.gamesPlayed}</div><div className="w-full bg-green-200 rounded-full h-2 mt-1"><div
    className="bg-green-600 h-2 rounded-full transition-all duration-300"
    style={{ width: `${week.gamesPlayed / 20 * 100}%` }}
  /></div></div><div className="bg-purple-50 rounded-lg p-3"><div className="text-sm text-gray-600">{t("accuracy")}</div><div className="text-lg font-semibold text-purple-600">{week.accuracy}%</div><div className="w-full bg-purple-200 rounded-full h-2 mt-1"><div
    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
    style={{ width: `${week.accuracy}%` }}
  /></div></div></div></div>)}</div></div>{
    /* Subject Progress */
  }<div className="bg-white rounded-xl shadow-sm p-6"><h3 className="text-lg font-semibold text-gray-900 mb-6">{t("subjectProgress")}</h3><div className="space-y-6">{subjectProgress.map((subject) => <div key={subject.subject} className="space-y-4"><div className="flex justify-between items-center"><h4 className="font-medium text-gray-900">{subject.subject}</h4><span className="text-sm text-gray-600">
                    Level {subject.currentLevel} • {subject.xp} / {subject.xp + subject.xpToNext} XP
                  </span></div><div className="w-full bg-gray-200 rounded-full h-3"><div
    className={`h-3 rounded-full ${subject.color} transition-all duration-300`}
    style={{ width: `${subject.xp / (subject.xp + subject.xpToNext) * 100}%` }}
  /></div><div className="bg-gray-50 rounded-lg p-4"><div className="text-sm font-medium text-gray-700 mb-2">{t("recentActivities")}</div><ul className="space-y-2">{subject.recentActivities.map((activity, idx) => <li key={idx} className="text-sm text-gray-600 flex items-start"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" /><span>{activity}</span></li>)}</ul></div></div>)}</div></div>{
    /* Achievements Progress */
  }<div className="bg-white rounded-xl shadow-sm p-6"><h3 className="text-lg font-semibold text-gray-900 mb-6">{t("achievementProgress")}</h3><div className="space-y-4">{achievements.map((achievement, index) => <div key={index} className="border-2 border-gray-200 rounded-lg p-4"><div className="flex items-start space-x-3"><span className="text-2xl">{achievement.icon}</span><div className="flex-1"><h4 className="font-medium text-gray-900">{achievement.title}</h4><p className="text-sm text-gray-600 mb-2">{achievement.description}</p><div className="flex justify-between text-sm text-gray-600 mb-1"><span>{achievement.progress}/{achievement.total}</span><span>{Math.round(achievement.progress / achievement.total * 100)}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div
    className={`h-2 rounded-full transition-all duration-300 ${achievement.progress === achievement.total ? "bg-yellow-500" : "bg-blue-500"}`}
    style={{ width: `${achievement.progress / achievement.total * 100}%` }}
  /></div>{achievement.progress === achievement.total && <div className="mt-2 flex items-center text-yellow-600 text-sm"><Star className="w-4 h-4 mr-1" />{t("completed")}!
                      </div>}</div></div></div>)}</div></div>{
    /* Study Time Analytics */
  }<div className="bg-white rounded-xl shadow-sm p-6"><h3 className="text-lg font-semibold text-gray-900 mb-6">{t("studyTimeAnalytics")}</h3><div className="grid grid-cols-7 gap-2">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => <div key={day} className="text-center"><div className="text-xs text-gray-600 mb-2">{day}</div><div className="space-y-1">{[45, 30, 60, 25, 50, 20, 35].map((minutes, timeIndex) => <div
    key={timeIndex}
    className={`h-3 rounded ${minutes > 40 ? "bg-green-500" : minutes > 25 ? "bg-yellow-500" : "bg-gray-300"}`}
    title={`${minutes} minutes`}
  />)}</div><div className="text-xs text-gray-500 mt-1">{[45, 30, 60, 25, 50, 20, 35][index]}m</div></div>)}</div><div className="flex items-center justify-between mt-4 text-sm text-gray-600"><div className="flex items-center space-x-4"><div className="flex items-center"><div className="w-3 h-3 bg-gray-300 rounded mr-2" /><span>{t("lessActive")}</span></div><div className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded mr-2" /><span>{t("moderate")}</span></div><div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded mr-2" /><span>{t("veryActive")}</span></div></div><span>{t("totalThisWeek")}: 4.5 {t("hours")}</span></div></div></div></div>;
};
export default ProgressTracker;
