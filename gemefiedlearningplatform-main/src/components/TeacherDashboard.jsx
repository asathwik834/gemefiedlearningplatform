import { useState } from "react";
import { BarChart3, Users, TrendingUp, Award, Calendar, Download, Filter } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
const TeacherDashboard = ({ onLogout }) => {
  const { t } = useTranslation();
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };
  const classStats = {
    totalStudents: 32,
    activeToday: 28,
    averageEngagement: 87,
    totalGamesPlayed: 1456,
    averageScore: 78,
    improvementRate: 15
  };
  const studentData = [
    {
      id: "1",
      name: "Priya Sharma",
      grade: 8,
      totalXP: 2450,
      gamesPlayed: 45,
      averageScore: 89,
      lastActive: "2 hours ago",
      strongSubjects: ["Mathematics", "Physics"],
      weakSubjects: ["Chemistry"],
      streak: 12
    },
    {
      id: "2",
      name: "Arjun Patel",
      grade: 9,
      totalXP: 1980,
      gamesPlayed: 38,
      averageScore: 76,
      lastActive: "1 day ago",
      strongSubjects: ["Science", "Mathematics"],
      weakSubjects: ["Physics"],
      streak: 8
    },
    {
      id: "3",
      name: "Sneha Kumar",
      grade: 7,
      totalXP: 1750,
      gamesPlayed: 32,
      averageScore: 82,
      lastActive: "3 hours ago",
      strongSubjects: ["Chemistry", "Science"],
      weakSubjects: ["Mathematics"],
      streak: 15
    },
    {
      id: "4",
      name: "Vikram Singh",
      grade: 10,
      totalXP: 3200,
      gamesPlayed: 67,
      averageScore: 91,
      lastActive: "30 minutes ago",
      strongSubjects: ["Physics", "Mathematics", "Chemistry"],
      weakSubjects: [],
      streak: 20
    }
  ];
  const subjectPerformance = [
    { subject: "Mathematics", average: 85, improvement: 12 },
    { subject: "Science", average: 79, improvement: 18 },
    { subject: "Physics", average: 73, improvement: 22 },
    { subject: "Chemistry", average: 71, improvement: 15 }
  ];
  return <div className="min-h-screen bg-gray-50"><div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">{
    /* Header */
  }<div><h2 className="text-2xl font-bold text-gray-900">{t("teacherDashboard")}</h2><p className="text-gray-600">{t("monitorProgress")}</p></div><div className="flex items-center space-x-3"><select
    value={selectedTimeRange}
    onChange={(e) => setSelectedTimeRange(e.target.value)}
    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  ><option value="day">{t("today")}</option><option value="week">{t("thisWeek")}</option><option value="month">{t("thisMonth")}</option><option value="quarter">{t("thisQuarter")}</option></select><button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Download className="w-4 h-4" /><span>{t("exportData")}</span></button></div></div>{
    /* Key Metrics */
  }<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"><div className="bg-white rounded-xl shadow-sm p-4"><div className="flex items-center"><Users className="w-8 h-8 text-blue-600" /><div className="ml-3"><p className="text-sm font-medium text-gray-500">{t("totalStudents")}</p><p className="text-2xl font-bold text-gray-900">{classStats.totalStudents}</p></div></div></div><div className="bg-white rounded-xl shadow-sm p-4"><div className="flex items-center"><TrendingUp className="w-8 h-8 text-green-600" /><div className="ml-3"><p className="text-sm font-medium text-gray-500">{t("activeToday")}</p><p className="text-2xl font-bold text-gray-900">{classStats.activeToday}</p></div></div></div><div className="bg-white rounded-xl shadow-sm p-4"><div className="flex items-center"><BarChart3 className="w-8 h-8 text-purple-600" /><div className="ml-3"><p className="text-sm font-medium text-gray-500">{t("engagement")}</p><p className="text-2xl font-bold text-gray-900">{classStats.averageEngagement}%</p></div></div></div><div className="bg-white rounded-xl shadow-sm p-4"><div className="flex items-center"><Award className="w-8 h-8 text-yellow-600" /><div className="ml-3"><p className="text-sm font-medium text-gray-500">{t("avgScore")}</p><p className="text-2xl font-bold text-gray-900">{classStats.averageScore}%</p></div></div></div><div className="bg-white rounded-xl shadow-sm p-4"><div className="flex items-center"><Calendar className="w-8 h-8 text-orange-600" /><div className="ml-3"><p className="text-sm font-medium text-gray-500">{t("gamesPlayed")}</p><p className="text-2xl font-bold text-gray-900">{classStats.totalGamesPlayed}</p></div></div></div><div className="bg-white rounded-xl shadow-sm p-4"><div className="flex items-center"><TrendingUp className="w-8 h-8 text-indigo-600" /><div className="ml-3"><p className="text-sm font-medium text-gray-500">{t("improvement")}</p><p className="text-2xl font-bold text-gray-900">+{classStats.improvementRate}%</p></div></div></div></div><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{
    /* Subject Performance */
  }<div className="bg-white rounded-xl shadow-sm p-6"><h3 className="text-lg font-semibold text-gray-900 mb-4">{t("subjectPerformance")}</h3><div className="space-y-4">{subjectPerformance.map((subject) => <div key={subject.subject}><div className="flex justify-between items-center mb-2"><span className="font-medium text-gray-900">{subject.subject}</span><div className="flex items-center space-x-2"><span className="text-sm text-gray-600">{subject.average}%</span><span className="text-sm text-green-600">+{subject.improvement}%</span></div></div><div className="w-full bg-gray-200 rounded-full h-2"><div
    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
    style={{ width: `${subject.average}%` }}
  /></div></div>)}</div></div>{
    /* Recent Activity */
  }<div className="bg-white rounded-xl shadow-sm p-6"><h3 className="text-lg font-semibold text-gray-900 mb-4">{t("recentActivity")}</h3><div className="space-y-3"><div className="flex items-center justify-between p-3 bg-green-50 rounded-lg"><div className="flex items-center space-x-3"><div className="w-2 h-2 bg-green-500 rounded-full" /><span className="text-sm text-gray-900">Priya completed Math Quest</span></div><span className="text-xs text-gray-500">2 min ago</span></div><div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"><div className="flex items-center space-x-3"><div className="w-2 h-2 bg-blue-500 rounded-full" /><span className="text-sm text-gray-900">Vikram earned Physics Badge</span></div><span className="text-xs text-gray-500">15 min ago</span></div><div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"><div className="flex items-center space-x-3"><div className="w-2 h-2 bg-purple-500 rounded-full" /><span className="text-sm text-gray-900">Sneha started Science Explorer</span></div><span className="text-xs text-gray-500">1 hour ago</span></div><div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"><div className="flex items-center space-x-3"><div className="w-2 h-2 bg-orange-500 rounded-full" /><span className="text-sm text-gray-900">Class average improved by 5%</span></div><span className="text-xs text-gray-500">2 hours ago</span></div></div></div></div>{
    /* Student Performance Table */
  }<div className="bg-white rounded-xl shadow-sm"><div className="p-6 border-b border-gray-200"><div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-gray-900">{t("studentPerformance")}</h3><div className="flex items-center space-x-3"><select
    value={selectedGrade}
    onChange={(e) => setSelectedGrade(e.target.value)}
    className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  ><option value="all">{t("allGrades")}</option><option value="6">{t("grade")} 6</option><option value="7">{t("grade")} 7</option><option value="8">{t("grade")} 8</option><option value="9">{t("grade")} 9</option><option value="10">{t("grade")} 10</option></select><Filter className="w-4 h-4 text-gray-400" /></div></div></div><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("student")}</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("grade")}</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("totalXP")}</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("gamesPlayed")}</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("avgScore")}</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("streak")}</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("lastActive")}</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("actions")}</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{studentData.map((student) => <tr key={student.id} className="hover:bg-gray-50"><td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center"><span className="text-sm font-medium text-gray-700">{student.name.split(" ").map((n) => n[0]).join("")}</span></div><div className="ml-4"><div className="text-sm font-medium text-gray-900">{student.name}</div><div className="text-sm text-gray-500">{t("strong")}: {student.strongSubjects.join(", ")}</div></div></div></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.grade}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.totalXP.toLocaleString()}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.gamesPlayed}</td><td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><span className="text-sm text-gray-900">{student.averageScore}%</span><div className="ml-2 w-16 bg-gray-200 rounded-full h-2"><div
    className="bg-blue-600 h-2 rounded-full"
    style={{ width: `${student.averageScore}%` }}
  /></div></div></td><td className="px-6 py-4 whitespace-nowrap"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">{student.streak} {t("days")}</span></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.lastActive}</td><td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button
    onClick={onLogout}
    className="flex items-center text-gray-700 hover:text-blue-600"
  ><span className="mr-2">Logout</span><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg></button></td></tr>)}</tbody></table></div></div></div>;
};
export default TeacherDashboard;
