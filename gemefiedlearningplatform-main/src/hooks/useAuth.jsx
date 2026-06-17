import React, { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext(void 0);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        console.log("Stored user at startup:", storedUser);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("Parsed user:", parsedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          console.log("No stored user found");
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password, role) => {
    try {
      console.log("Login attempt with role:", role);
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      console.log("Login successful, user data:", data.user);
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Login request failed:", error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      console.log("Signup attempt for:", userData.email);
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone_number: userData.phone_number,
          address: userData.address,
          password: userData.password,
          role: userData.role || "student",
          grade: userData.grade,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      console.log("Signup successful, logging in:", data.user);
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      console.error("Signup request failed:", error);
      throw error;
    }
  };

  const logout = () => {
    return new Promise((resolve) => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      resolve();
    });
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated,
    isLoading
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
