import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import NavBar from "./components/NavBar";
import StudentNavBar from "./components/StudentNavBar";
import TeacherNavBar from "./components/TeacherNavBar";
import SignupPage from "./components/SignupPage";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import AdminNavBar from "./components/AdminNavBar";
import AdminDashboard from "./components/AdminDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import GameHub from "./components/GameHub";
import ProgressTracker from "./components/ProgressTracker";
import CBSEClassPage from "./components/CBSEClassPage";
import CBSESubjectPage from "./components/CBSESubjectPage";
import CBSEGamePage from "./components/CBSEGamePage";
import GradeGamesPage from "./components/GradeGamesPage";
import SyllabusPage from "./components/SyllabusPage";
import BoringSectionPage from "./components/BoringSectionPage";
import ProgressGraphsPage from "./components/ProgressGraphsPage";
function App() {
  const { user, isAuthenticated, login, signup, logout } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  const handleLogin = async (email, password, role) => {
    console.log("handleLogin called with:", { email, role });
    try {
      console.log("Calling login with role:", role);
      await login(email, password, role);
      console.log("Login successful, current user:", user);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Invalid email or password"
      };
    }
  };
  const handleSignup = async (userData) => {
    try {
      console.log("Signup data:", userData);
      await signup(userData);
      return { success: true };
    } catch (error) {
      console.error("Signup failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Signup failed. Please try again."
      };
    }
  };
  useEffect(() => {
    console.log("App - Auth State:", { isAuthenticated, user });
  }, [isAuthenticated, user]);
  const location = useLocation();
  const navigate = useNavigate();
  const publicRoutes = ["/", "/about", "/courses", "/contact", "/login", "/signup"];
  const currentPath = location.pathname;
  const isPublicRoute = publicRoutes.some((route) => currentPath === route);
  useEffect(() => {
    if (isAuthenticated && (currentPath === "/login" || currentPath === "/signup")) {
      const from = location.state?.from?.pathname || 
        (user?.role === "admin" ? "/admin" : 
         user?.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, currentPath, location.state, navigate, user?.role]);
  const renderNavBar = () => {
    if (!isAuthenticated && isPublicRoute) {
      return <NavBar />;
    }
    if (isAuthenticated && user?.role === "student") {
      return <StudentNavBar onLogout={logout} />;
    }
    if (isAuthenticated && user?.role === "teacher") {
      return <TeacherNavBar onLogout={logout} />;
    }
    if (isAuthenticated && user?.role === "admin") {
      return <AdminNavBar onLogout={logout} />;
    }
    return null;
  };
  const shouldShowNavBar = !isAuthenticated && isPublicRoute || isAuthenticated;
  return <div className="min-h-screen bg-white">{
    /* Render the appropriate navbar */
  }{shouldShowNavBar && renderNavBar()}<main className={shouldShowNavBar ? "pt-16" : ""}><Routes>{
    /* Public routes */
  }<Route
    path="/"
    element={isAuthenticated ? <Navigate to={user?.role === "admin" ? "/admin" : user?.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard"} replace /> : <HomePage />}
  />{
    /* Public routes that redirect if authenticated */
  }<Route
    path="/about"
    element={isAuthenticated ? <Navigate to={user?.role === "admin" ? "/admin" : user?.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard"} replace /> : <div>About Page</div>}
  /><Route
    path="/courses"
    element={isAuthenticated ? <Navigate to={user?.role === "admin" ? "/admin" : user?.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard"} replace /> : <div>Courses Page</div>}
  /><Route
    path="/contact"
    element={isAuthenticated ? <Navigate to={user?.role === "admin" ? "/admin" : user?.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard"} replace /> : <div>Contact Page</div>}
  />{
    /* Auth routes */
  }<Route
    path="/login"
    element={isAuthenticated ? <Navigate to={user?.role === "admin" ? "/admin" : user?.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard"} replace /> : <LoginPage onLogin={handleLogin} isOnline={isOnline} />}
  /><Route
    path="/signup"
    element={isAuthenticated ? <Navigate to={user?.role === "admin" ? "/admin" : user?.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard"} replace /> : <SignupPage onSignup={handleSignup} />}
  />{
    /* Protected student routes */
  }<Route
    path="/student-dashboard"
    element={<ProtectedRoute requiredRole="student"><StudentDashboard currentUser={user} onLogout={logout} /></ProtectedRoute>}
  /><Route
    path="/games"
    element={<ProtectedRoute requiredRole="student"><GameHub
      currentUser={user?.name || "Student"}
    /></ProtectedRoute>}
  /><Route
    path="/games/grade/:grade"
    element={<ProtectedRoute requiredRole="student"><GradeGamesPage /></ProtectedRoute>}
  /><Route
    path="/cbse/class/:grade"
    element={<ProtectedRoute requiredRole="student"><CBSEClassPage /></ProtectedRoute>}
  /><Route
    path="/cbse/class/:grade/:subject"
    element={<ProtectedRoute requiredRole="student"><CBSESubjectPage /></ProtectedRoute>}
  /><Route
    path="/cbse/class/:grade/:subject/:gameId"
    element={<ProtectedRoute requiredRole="student"><CBSEGamePage /></ProtectedRoute>}
  /><Route
    path="/syllabus"
    element={<ProtectedRoute requiredRole="student"><SyllabusPage /></ProtectedRoute>}
  /><Route
    path="/boring"
    element={<ProtectedRoute requiredRole="student"><BoringSectionPage /></ProtectedRoute>}
  /><Route
    path="/progress"
    element={<ProtectedRoute requiredRole="student"><ProgressTracker
      currentUser={user}
      onLogout={logout}
    /></ProtectedRoute>}
  /><Route
    path="/progress/:period"
    element={<ProtectedRoute requiredRole="student"><ProgressGraphsPage /></ProtectedRoute>}
  />{
    /* Protected teacher routes */
  }<Route
    path="/teacher-dashboard"
    element={<ProtectedRoute requiredRole="teacher"><TeacherDashboard onLogout={logout} /></ProtectedRoute>}
  /><Route
    path="/teacher/*"
    element={<ProtectedRoute requiredRole="teacher"><TeacherDashboard onLogout={logout} /></ProtectedRoute>}
  />{
    /* Protected admin routes */
  }<Route
    path="/admin"
    element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>}
  />{
    /* Redirect old dashboard route */
  }<Route path="/dashboard" element={<Navigate to="/student-dashboard" replace />} />{
    /* Catch-all route */
  }<Route
    path="*"
    element={isAuthenticated ? <Navigate to={user?.role === "admin" ? "/admin" : user?.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard"} replace /> : <Navigate to="/" replace />}
  /></Routes></main></div>;
}
export default App;
