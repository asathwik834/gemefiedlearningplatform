import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";
import { RewardsProvider } from "./contexts/RewardsContext";
import "./index.css";
createRoot(document.getElementById("root")).render(
  <StrictMode><BrowserRouter><AuthProvider><RewardsProvider><App /></RewardsProvider></AuthProvider></BrowserRouter></StrictMode>
);
