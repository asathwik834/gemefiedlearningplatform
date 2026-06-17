import React from "react";
import { useNavigate } from "react-router-dom";
const GradeSelector = ({
  selectedGrade,
  onGradeSelect,
  recommendedGrade
}) => {
  const grades = Array.from({ length: 7 }, (_, i) => i + 6);
  const allGrades = Array.from({ length: 7 }, (_, i) => i + 6);
  const [showCBSE, setShowCBSE] = React.useState(false);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("grade_selector_cbse_open");
      if (saved !== null) {
        setShowCBSE(saved === "1");
      }
    } catch {
    }
  }, []);
  React.useEffect(() => {
    try {
      localStorage.setItem("grade_selector_cbse_open", showCBSE ? "1" : "0");
    } catch {
    }
  }, [showCBSE]);
  return <div className="mb-8 flex flex-col items-center"><h3 className="text-lg font-medium text-gray-900 mb-4 text-center">State</h3><div className="flex items-center gap-3 justify-center"><button
    onClick={() => setShowMenu((v) => !v)}
    className={`inline-flex items-center gap-2 py-3 px-4 rounded-lg text-center transition-colors border ${selectedGrade ? "bg-blue-600 text-white border-blue-700" : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200"}`}
  >
          State
          <span className="text-xs opacity-80">▾</span></button><button
    onClick={() => setShowCBSE((v) => !v)}
    className={`py-3 px-4 rounded-lg text-center transition-colors border ${showCBSE ? "bg-green-600 text-white border-green-700" : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200"}`}
  >
          CBSE
        </button><button
    onClick={() => navigate("/syllabus")}
    className={`py-3 px-4 rounded-lg text-center transition-colors border bg-white text-gray-700 hover:bg-gray-100 border-gray-200`}
  >
          Syllabus
        </button><button
    onClick={() => navigate("/boring")}
    className={`py-3 px-4 rounded-lg text-center transition-colors border bg-white text-gray-700 hover:bg-gray-100 border-gray-200`}
  >
          Boring Section
        </button>{showMenu && <div className="mt-3 p-3 bg-white border rounded-lg shadow-md mx-auto w-56 max-h-80 overflow-y-auto"><div className="flex flex-col gap-2">{allGrades.map((g) => <button
    key={`all-${g}`}
    onClick={() => {
      onGradeSelect(g);
      navigate(`/games/grade/${g}`);
      setShowMenu(false);
    }}
    className={`w-full text-left py-2.5 px-3 rounded-lg transition-colors border ${selectedGrade === g ? "bg-blue-600 text-white border-blue-700" : recommendedGrade === g ? "bg-blue-100 text-blue-700 border-2 border-blue-300 font-medium" : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200"}`}
  >
                  State {g}</button>)}</div></div>}</div>{showCBSE && <div className="mt-3 max-w-4xl mx-auto w-full"><div className="flex items-center justify-between mb-2"><div className="text-sm font-medium text-gray-700 text-center">Select CBSE Class</div>{typeof recommendedGrade === "number" && <div className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Recommended: Class {recommendedGrade}</div>}</div><div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 place-items-center">{grades.map((grade) => <button
    key={`cbse-${grade}`}
    onClick={() => {
      onGradeSelect(grade);
      navigate(`/cbse/class/${grade}`);
    }}
    className={`py-2.5 px-2 rounded-lg text-center transition-colors border ${selectedGrade === grade ? "bg-green-600 text-white border-green-700" : recommendedGrade === grade ? "bg-blue-100 text-blue-700 border-2 border-blue-300 font-medium" : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200"}`}
  >
                Class {grade}</button>)}</div></div>}</div>;
};
export default GradeSelector;
