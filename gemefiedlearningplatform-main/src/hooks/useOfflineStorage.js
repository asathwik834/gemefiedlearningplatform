import { useState, useEffect } from "react";

export const useOfflineStorage = () => {
  const [data, setData] = useState({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const loadStoredData = () => {
      try {
        const stored = localStorage.getItem("gamifiedLearningData");
        if (stored) {
          setData(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading stored data:", error);
      }
    };
    loadStoredData();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const saveData = (key, value) => {
    try {
      const newData = { ...data, [key]: value };
      setData(newData);
      localStorage.setItem("gamifiedLearningData", JSON.stringify(newData));
      if (isOnline) {
        syncToRemote(key, value);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const getData = (key) => {
    return data[key];
  };

  const syncToRemote = async (key, value) => {
    try {
      console.log("Data synced to remote storage:", key, value);
      const storedUser = localStorage.getItem("user");
      if (storedUser && key === "lastScore" && value) {
        const user = JSON.parse(storedUser);
        await fetch("http://localhost:5000/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            gameId: value.gameId,
            score: value.score,
            difficulty: value.difficulty || "Beginner"
          })
        });
      }
    } catch (error) {
      console.error("Error syncing to remote storage:", error);
    }
  };

  const clearData = () => {
    setData({});
    localStorage.removeItem("gamifiedLearningData");
  };

  return {
    data,
    saveData,
    getData,
    clearData,
    isOnline
  };
};
