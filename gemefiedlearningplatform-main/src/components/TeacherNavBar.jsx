import { Link, useLocation } from "react-router-dom";
import { Home, Users, BarChart2, BookOpen, Settings } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
const TeacherNavBar = ({ onLogout }) => {
  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path;
  };
  return <nav className="bg-indigo-700 text-white shadow-lg"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-16"><div className="flex items-center"><div className="flex-shrink-0"><span className="text-xl font-bold">Teacher Portal</span></div><div className="hidden md:block"><div className="ml-10 flex items-center space-x-4"><Link
    to="/teacher-dashboard"
    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive("/teacher-dashboard") ? "bg-indigo-800 text-white" : "text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75"}`}
  ><Home className="h-4 w-4 mr-1" />
                  Dashboard
                </Link><Link
    to="/teacher/classes"
    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive("/teacher/classes") ? "bg-indigo-800 text-white" : "text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75"}`}
  ><Users className="h-4 w-4 mr-1" />
                  My Classes
                </Link><Link
    to="/teacher/assignments"
    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive("/teacher/assignments") ? "bg-indigo-800 text-white" : "text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75"}`}
  ><BookOpen className="h-4 w-4 mr-1" />
                  Assignments
                </Link><Link
    to="/teacher/reports"
    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive("/teacher/reports") ? "bg-indigo-800 text-white" : "text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75"}`}
  ><BarChart2 className="h-4 w-4 mr-1" />
                  Reports
                </Link></div></div></div><div className="hidden md:block"><div className="ml-4"><LanguageSelector /></div><div className="ml-4 flex items-center space-x-4"><Link
    to="/teacher/settings"
    className="p-1 rounded-full text-indigo-200 hover:text-white focus:outline-none"
  ><Settings className="h-6 w-6" /></Link><button
    onClick={onLogout}
    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50"
  >
                Logout
              </button></div></div></div></div></nav>;
};
export default TeacherNavBar;
