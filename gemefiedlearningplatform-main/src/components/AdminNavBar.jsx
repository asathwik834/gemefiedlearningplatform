import { Link, useLocation } from "react-router-dom";
import { Shield, LogOut } from "lucide-react";

const AdminNavBar = ({ onLogout }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900 text-white shadow-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Shield className="h-6 w-6 text-indigo-400 animate-pulse" />
              <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                SkillSprout Admin
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                    isActive("/admin")
                      ? "bg-slate-800 text-white shadow-inner"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  User Database (CRUD)
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all shadow-md"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavBar;
