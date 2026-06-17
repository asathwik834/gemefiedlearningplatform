import { useState } from "react";
import { BookOpen, Gamepad, Trophy, Zap, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
const defaultTranslations = {
  mathematics: "Mathematics",
  science: "Science",
  physics: "Physics",
  chemistry: "Chemistry",
  firstSteps: "First Steps",
  firstStepsDesc: "Complete your first lesson",
  mathWizard: "Math Wizard",
  mathWizardDesc: "Complete 10 math lessons",
  streakMaster: "Streak Master",
  streakMasterDesc: "Maintain a 7-day streak",
  scienceExplorer: "Science Explorer",
  scienceExplorerDesc: "Complete all science modules",
  dashboard: "Dashboard",
  level: "Level",
  logout: "Logout",
  welcomeBack: "Welcome back",
  readyToLearn: "Ready to learn something new?",
  totalXP: "Total XP",
  dayStreak: "Day Streak",
  achievements: "Achievements",
  subjectProgress: "Subject Progress",
  recentActivity: "Recent Activity",
  unlockedOn: "Unlocked on",
  completedQuiz: "Completed Quiz",
  watchedVideo: "Watched Video",
  solvedProblem: "Solved Problem"
};
const StudentDashboard = ({ currentUser }) => {
  const { t = (key) => defaultTranslations[key] || key } = useTranslation?.() || {};
  const [totalXP] = useState(1250);
  const [currentLevel] = useState(8);
  const [streak] = useState(7);
  const [subjects] = useState([
    { id: "math", name: t("mathematics"), progress: 75, level: 5, xp: 380, color: "bg-blue-500" },
    { id: "science", name: t("science"), progress: 60, level: 4, xp: 290, color: "bg-green-500" },
    { id: "physics", name: t("physics"), progress: 45, level: 3, xp: 220, color: "bg-purple-500" },
    { id: "chemistry", name: t("chemistry"), progress: 30, level: 2, xp: 150, color: "bg-orange-500" }
  ]);
  const [achievements] = useState([
    { id: "1", title: t("firstSteps"), description: t("firstStepsDesc"), icon: "\u{1F3AF}", unlocked: true, date: "2024-01-15" },
    { id: "2", title: t("mathWizard"), description: t("mathWizardDesc"), icon: "\u{1F9EE}", unlocked: true, date: "2024-01-20" },
    { id: "3", title: t("streakMaster"), description: t("streakMasterDesc"), icon: "\u{1F525}", unlocked: true, date: "2024-01-25" },
    { id: "4", title: t("scienceExplorer"), description: t("scienceExplorerDesc"), icon: "\u{1F52C}", unlocked: false }
  ]);
  const recentActivities = [
    { subject: t("mathematics"), activity: t("completedQuiz"), points: 50, time: "2 hours ago" },
    { subject: t("science"), activity: t("watchedVideo"), points: 25, time: "5 hours ago" },
    { subject: t("physics"), activity: t("solvedProblem"), points: 75, time: "1 day ago" }
  ];
  return <div className="min-h-screen bg-gray-50">{
    /* Gradient Welcome Block */
  }<div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex flex-col md:flex-row justify-between items-start md:items-center"><div className="mb-4 md:mb-0"><h1 className="text-2xl md:text-3xl font-bold">{t("welcomeBack")}, {currentUser?.name || "Student"}!</h1><p className="text-blue-100">{t("readyToLearn")}</p></div><Link
    to="/boring?subject=mathematics"
    className="flex items-center justify-center space-x-2 bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors font-medium"
  ><Gamepad className="w-5 h-5" /><span>Play Math Challenge</span></Link></div>{
    /* Stats Grid */
  }<div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"><div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"><div className="text-3xl font-bold">{streak}</div><div className="text-sm text-blue-100">Day Streak</div></div><div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"><div className="text-3xl font-bold">{currentLevel}</div><div className="text-sm text-blue-100">Level</div></div><div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"><div className="text-3xl font-bold">{achievements.filter((a) => a.unlocked).length}</div><div className="text-sm text-blue-100">Achievements</div></div><div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"><div className="text-3xl font-bold">{totalXP}</div><div className="text-sm text-blue-100">Total XP</div></div></div></div></div>{
    /* Main Content */
  }<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{
    /* Subject Progress */
  }<div className="bg-white rounded-xl shadow-sm p-6"><div className="flex items-center mb-6"><BookOpen className="w-6 h-6 text-blue-600 mr-3" /><h3 className="text-xl font-semibold text-gray-900">{t("subjectProgress")}</h3></div><div className="space-y-4">{subjects.map((subject) => <div key={subject.id} className="space-y-2"><div className="flex justify-between items-center"><span className="font-medium text-gray-900">{subject.name}</span><div className="flex items-center space-x-2"><span className="text-sm text-gray-600">{t("level")} {subject.level}</span><span className="text-sm font-medium text-blue-600">{subject.xp} XP</span></div></div><div className="relative"><div className="w-full bg-gray-200 rounded-full h-3"><div
    className={`h-3 rounded-full ${subject.color} transition-all duration-300`}
    style={{ width: `${subject.progress}%` }}
  /></div><span className="absolute right-2 top-0 text-xs text-gray-600 font-medium">{subject.progress}%
                    </span></div></div>)}</div></div>{
    /* Recent Achievements */
  }<div className="bg-white rounded-xl shadow-sm p-6"><div className="flex items-center mb-6"><Trophy className="w-6 h-6 text-yellow-600 mr-3" /><h3 className="text-xl font-semibold text-gray-900">{t("achievements")}</h3></div><div className="space-y-4">{achievements.map((achievement) => <div
    key={achievement.id}
    className={`p-4 rounded-lg border-2 transition-all ${achievement.unlocked ? "border-yellow-200 bg-yellow-50" : "border-gray-200 bg-gray-50 opacity-60"}`}
  ><div className="flex items-start space-x-3"><span className="text-2xl">{achievement.icon}</span><div className="flex-1"><h4 className="font-medium text-gray-900">{achievement.title}</h4><p className="text-sm text-gray-600">{achievement.description}</p>{achievement.unlocked && achievement.date && <p className="text-xs text-yellow-600 mt-1">{t("unlockedOn")} {achievement.date}</p>}</div>{achievement.unlocked && <Zap className="w-5 h-5 text-yellow-500" />}</div></div>)}</div></div>{
    /* Recent Activity */
  }<div className="lg:col-span-2"><div className="bg-white rounded-xl shadow-sm p-6"><div className="flex items-center mb-6"><TrendingUp className="w-6 h-6 text-green-600 mr-3" /><h3 className="text-xl font-semibold text-gray-900">{t("recentActivity")}</h3></div><div className="space-y-4">{recentActivities.map((activity, index) => <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div className="flex items-center space-x-4"><div className="w-2 h-2 bg-blue-500 rounded-full" /><div><span className="font-medium text-gray-900">{activity.subject}</span><span className="text-gray-600 ml-2">- {activity.activity}</span></div></div><div className="flex items-center space-x-3"><span className="text-sm font-medium text-green-600">+{activity.points} XP</span><span className="text-sm text-gray-500">{activity.time}</span></div></div>)}</div></div></div></div></div></div>;
};
export default StudentDashboard;
