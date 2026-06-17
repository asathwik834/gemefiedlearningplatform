import { Link, useLocation } from "react-router-dom";
import { Home, Gamepad, BarChart2 } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
const StudentNavBar = ({ onLogout }) => {
  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path;
  };
  return <nav className="bg-indigo-600 text-white shadow-lg"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-16"><div className="flex items-center"><div className="flex-shrink-0"><span className="text-xl font-bold">SkillSprout</span></div><div className="hidden md:block"><div className="ml-10 flex items-center space-x-4"><Link
    to="/student-dashboard"
    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive("/student-dashboard") ? "bg-indigo-700 text-white" : "text-indigo-100 hover:bg-indigo-500 hover:bg-opacity-75"}`}
  ><Home className="h-4 w-4 mr-1" />
                  Dashboard
                </Link><Link
    to="/games"
    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive("/games") ? "bg-indigo-700 text-white" : "text-indigo-100 hover:bg-indigo-500 hover:bg-opacity-75"}`}
  ><Gamepad className="h-4 w-4 mr-1" />
                  Games
                </Link><Link
    to="/progress"
    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive("/progress") ? "bg-indigo-700 text-white" : "text-indigo-100 hover:bg-indigo-500 hover:bg-opacity-75"}`}
  ><BarChart2 className="h-4 w-4 mr-1" />
                  Progress
                </Link></div></div><div className="ml-4"><LanguageSelector /></div></div><div className="hidden md:block"><div className="ml-4 flex items-center md:ml-6"><button
    onClick={onLogout}
    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
  >
                Logout
              </button></div></div></div></div></nav>;
};
export default StudentNavBar;
