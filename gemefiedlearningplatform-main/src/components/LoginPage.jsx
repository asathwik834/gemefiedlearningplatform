import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { WifiOff } from "lucide-react";
const LoginPage = ({ onLogin, isOnline }) => {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Selected role changed to:", role);
  }, [role]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter both email and password");
      return;
    }
    try {
      setIsLoading(true);
      const result = await onLogin(email, password, role);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"><div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"><div className="text-center mb-8"><h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back to SkillSprout</h1><p className="text-gray-600">Sign in to continue your learning journey</p></div>{error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}<form onSubmit={handleSubmit} className="space-y-6"><div><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label><input
    id="email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    placeholder="Enter your email address"
    required
  /></div><div><label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label><input
    id="password"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    placeholder="Enter your password"
    required
  /></div><div className="flex space-x-6"><div className="flex items-center"><input
    id="student"
    name="role"
    type="radio"
    checked={role === "student"}
    onChange={() => setRole("student")}
    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
  /><label htmlFor="student" className="ml-2 block text-sm text-gray-700">
                Student
              </label></div><div className="flex items-center"><input
    id="teacher"
    name="role"
    type="radio"
    checked={role === "teacher"}
    onChange={() => setRole("teacher")}
    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
  /><label htmlFor="teacher" className="ml-2 block text-sm text-gray-700">
                Teacher
              </label></div></div><div className="flex items-center justify-between"><div className="flex items-center"><input
    id="remember-me"
    name="remember-me"
    type="checkbox"
    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
  /><label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label></div><div className="text-sm"><a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </a></div></div><div><button
    type="submit"
    disabled={isLoading || !isOnline}
    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading || !isOnline ? "opacity-50 cursor-not-allowed" : ""}`}
  >{isLoading ? "Signing in..." : "Sign in"}{!isOnline && <WifiOff className="ml-2 h-4 w-4" />}</button></div></form><div className="mt-6"><div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">New to SkillSprout?</span></div></div></div></div></div>;
};
export default LoginPage;
