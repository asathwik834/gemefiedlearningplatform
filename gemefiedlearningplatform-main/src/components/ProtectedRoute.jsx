import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
export const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  console.log("ProtectedRoute - Auth State:", { isAuthenticated, user, isLoading, requiredRole });
  if (isLoading) {
    console.log("ProtectedRoute - Loading auth state...");
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    console.log("ProtectedRoute - User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (requiredRole && user?.role !== requiredRole) {
    console.log(`ProtectedRoute - User role '${user?.role}' does not match required role '${requiredRole}'`);
    return <Navigate to="/" replace />;
  }
  console.log("ProtectedRoute - Rendering protected content for role:", user?.role);
  return <>{children}</>;
};
