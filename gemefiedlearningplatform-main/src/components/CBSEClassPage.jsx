import { useParams, useNavigate } from "react-router-dom";
const CBSEClassPage = () => {
  const { grade } = useParams();
  const navigate = useNavigate();
  const numericGrade = Number(grade);
  const classLabel = Number.isFinite(numericGrade) ? `Class ${numericGrade}` : "CBSE Class";
  return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-6 md:p-8"><div className="max-w-6xl mx-auto"><div className="flex items-center justify-center mb-6"><h1 className="text-3xl font-bold text-gray-900 text-center">CBSE • {classLabel}</h1></div><div className="flex justify-center mb-6"><button
    onClick={() => navigate("/games")}
    className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
  >
            Back to Games
          </button></div><div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-700 mb-4">
            Welcome to {classLabel}. Choose a subject or module below.
          </p><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">{
    /* Placeholder subject cards; you can wire these to real routes later */
  }<div className="p-4 border rounded-lg hover:shadow-sm transition-shadow"><div className="text-sm text-gray-500 mb-1">Mathematics</div><div className="font-semibold text-gray-900">Core Topics</div><button
    onClick={() => navigate(`/cbse/class/${numericGrade}/mathematics`)}
    className="mt-3 inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
  >
                Explore
              </button></div><div className="p-4 border rounded-lg hover:shadow-sm transition-shadow"><div className="text-sm text-gray-500 mb-1">Science</div><div className="font-semibold text-gray-900">Physics • Chemistry • Biology</div><button
    onClick={() => navigate(`/cbse/class/${numericGrade}/science`)}
    className="mt-3 inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
  >
                Explore
              </button></div><div className="p-4 border rounded-lg hover:shadow-sm transition-shadow"><div className="text-sm text-gray-500 mb-1">Social Science</div><div className="font-semibold text-gray-900">History • Geography • Civics</div><button
    onClick={() => navigate(`/cbse/class/${numericGrade}/social-science`)}
    className="mt-3 inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-700"
  >
                Explore
              </button></div><div className="p-4 border rounded-lg hover:shadow-sm transition-shadow"><div className="text-sm text-gray-500 mb-1">English</div><div className="font-semibold text-gray-900">Reader • Grammar • Writing</div><button
    onClick={() => navigate(`/cbse/class/${numericGrade}/english`)}
    className="mt-3 inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-pink-600 text-white hover:bg-pink-700"
  >
                Explore
              </button></div><div className="p-4 border rounded-lg hover:shadow-sm transition-shadow"><div className="text-sm text-gray-500 mb-1">Hindi</div><div className="font-semibold text-gray-900">पाठ्यपुस्तक • व्याकरण</div><button
    onClick={() => navigate(`/cbse/class/${numericGrade}/hindi`)}
    className="mt-3 inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-rose-600 text-white hover:bg-rose-700"
  >
                Explore
              </button></div></div><div className="mt-6 text-sm text-gray-500">
            Tip: You can link these cards to filtered game views or dedicated curriculum pages.
          </div></div></div></div>;
};
export default CBSEClassPage;
