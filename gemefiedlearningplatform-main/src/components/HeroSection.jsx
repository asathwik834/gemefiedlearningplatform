import { Link } from "react-router-dom";
const HeroSection = () => {
  return <div className="relative bg-gray-900">{
    /* Decorative background */
  }<div className="absolute inset-0 overflow-hidden"><div className="absolute inset-0 bg-gray-900 opacity-75" /><div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-indigo-800 opacity-50" /></div><div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8"><h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          SkillSprout
        </h1><p className="mt-6 text-xl text-indigo-100 max-w-3xl">
          LEARN. PLAY. ACHIEVE.
        </p><p className="mt-6 text-lg text-indigo-100 max-w-3xl">
          Interactive games, multilingual content, and offline access to make STEM learning engaging for rural schools.
        </p><div className="mt-10"><Link
    to="/login"
    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
            Get Started
          </Link></div></div></div>;
};
export default HeroSection;
