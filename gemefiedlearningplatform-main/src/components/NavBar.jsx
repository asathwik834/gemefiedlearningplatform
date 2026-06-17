import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <nav className="bg-white shadow-md"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex justify-between h-16">{
    /* Logo and main navigation */
  }<div className="flex items-center"><div className="flex-shrink-0 flex items-center"><div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold">SS</div><span className="ml-2 text-xl font-bold text-gray-900">SkillSprout</span></div><div className="hidden md:ml-10 md:flex md:space-x-8"><Link to="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium">
                Home
              </Link><a href="#about" className="text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium">
                About
              </a><a href="#courses" className="text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium">
                Courses
              </a><a href="#contact" className="text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium">
                Contact
              </a></div></div>{
    /* Right side navigation */
  }<div className="hidden md:ml-6 md:flex md:items-center"><div className="mr-4"><LanguageSelector /></div>{
    /* Login/Signup Buttons */
  }<div className="flex space-x-4"><Link
    to="/login"
    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
  >
                Login
              </Link><Link
    to="/signup"
    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
  >
                Sign Up
              </Link></div></div>{
    /* Mobile menu button */
  }<div className="-mr-2 flex items-center md:hidden"><button
    type="button"
    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
    onClick={() => setIsMenuOpen(!isMenuOpen)}
  ><span className="sr-only">Open main menu</span>{isMenuOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}</button></div></div></div>{
    /* Mobile menu */
  }{isMenuOpen && <div className="md:hidden"><div className="pt-2 pb-3 space-y-1"><Link to="/" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link><a href="#about" className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
              About
            </a><a href="#courses" className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
              Courses
            </a><a href="#contact" className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
              Contact
            </a></div><div className="pt-4 pb-3 border-t border-gray-200"><div className="px-4 mb-4"><LanguageSelector /></div><div className="mt-3 space-y-1 px-4"><Link
    to="/login"
    className="block w-full text-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md"
    onClick={() => setIsMenuOpen(false)}
  >
                Login
              </Link><Link
    to="/signup"
    className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md mt-2"
    onClick={() => setIsMenuOpen(false)}
  >
                Sign Up
              </Link></div></div></div>}</nav>;
};
export default NavBar;
