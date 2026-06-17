import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const defaultState = {
  xp: 0,
  level: 1,
  badges: [],
  highscores: {}
};

const STORAGE_KEY = "rewards_state_v1";
const RewardsContext = createContext(void 0);

function thresholds(level) {
  if (level <= 1) return 0;
  let sum = 0;
  for (let l = 2; l <= level; l++) {
    sum += 50 + (l - 1) * 50;
  }
  return sum;
}

function getLevelFromXP(xp) {
  let level = 1;
  while (xp >= thresholds(level + 1)) {
    level += 1;
  }
  return level;
}

export const RewardsProvider = ({ children }) => {
  const [state, setState] = useState(defaultState);
  const { user } = useAuth();

  // Load rewards and progress on mount or user login
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        // Fallback to local storage if user is not logged in
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            setState(JSON.parse(raw));
          } else {
            setState(defaultState);
          }
        } catch (err) {
          console.error("Failed to load local rewards state:", err);
        }
        return;
      }

      try {
        console.log(`Fetching rewards and progress for user: ${user.id}`);
        
        // Fetch rewards (points and badges)
        const rewardsRes = await fetch(`http://localhost:5000/api/rewards/${user.id}`);
        const rewardsData = rewardsRes.ok ? await rewardsRes.json() : { points: 0, badges: [] };

        // Fetch student progress
        const progressRes = await fetch(`http://localhost:5000/api/progress/${user.id}`);
        const progressRows = progressRes.ok ? await progressRes.json() : [];

        // Reconstruct highscores map
        const highscores = {};
        progressRows.forEach(row => {
          const gameId = row.game_id;
          if (!highscores[gameId]) {
            highscores[gameId] = [];
          }
          highscores[gameId].push({
            score: row.score,
            meta: { difficulty: row.difficulty, title: gameId },
            timestamp: new Date(row.completed_at).getTime()
          });
        });

        // Sort and slice top 10 scores per game
        for (const gameId in highscores) {
          highscores[gameId].sort((a, b) => b.score - a.score);
          highscores[gameId] = highscores[gameId].slice(0, 10);
        }

        const xp = rewardsData.points || 0;
        const badges = rewardsData.badges || [];
        const level = getLevelFromXP(xp);

        setState({
          xp,
          level,
          badges,
          highscores
        });
      } catch (error) {
        console.error("Error loading user data from backend:", error);
      }
    };

    loadData();
  }, [user]);

  // Keep localStorage as fallback backup
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {}
    }
  }, [state, user]);

  const addXP = useCallback(async (amount) => {
    let targetXp = 0;
    setState((prev) => {
      let xp = Math.max(0, prev.xp + Math.max(0, amount));
      let level = prev.level;
      while (xp >= thresholds(level + 1)) {
        level += 1;
      }
      targetXp = xp;
      return { ...prev, xp, level };
    });

    if (user) {
      fetch("http://localhost:5000/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          points: targetXp,
          badges: state.badges
        })
      }).catch(err => console.error("Error syncing XP to remote:", err));
    }
  }, [user, state.badges]);

  const awardBadge = useCallback(async (badge) => {
    let newBadges = [];
    let shouldAward = false;
    setState((prev) => {
      if (prev.badges.some((b) => b.id === badge.id)) return prev;
      const newBadge = { ...badge, earnedAt: Date.now() };
      newBadges = [...prev.badges, newBadge];
      shouldAward = true;
      return { ...prev, badges: newBadges };
    });

    if (user && shouldAward) {
      fetch("http://localhost:5000/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          points: state.xp,
          badges: newBadges
        })
      }).catch(err => console.error("Error syncing Badge to remote:", err));
    }
  }, [user, state.xp]);

  const recordHighScore = useCallback(async (gameId, score, meta) => {
    if (user) {
      fetch("http://localhost:5000/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          gameId,
          score,
          difficulty: meta?.difficulty || "Beginner"
        })
      }).catch(err => console.error("Error syncing HighScore to remote:", err));
    }

    setState((prev) => {
      const list = prev.highscores[gameId] ? [...prev.highscores[gameId]] : [];
      list.push({ score, meta, timestamp: Date.now() });
      list.sort((a, b) => b.score - a.score);
      const trimmed = list.slice(0, 10);
      return { ...prev, highscores: { ...prev.highscores, [gameId]: trimmed } };
    });
  }, [user]);

  const getLevelThreshold = useCallback((lvl) => thresholds(lvl), []);

  const value = {
    ...state,
    addXP,
    awardBadge,
    recordHighScore,
    getLevelThreshold
  };

  return <RewardsContext.Provider value={value}>{children}</RewardsContext.Provider>;
};

export const useRewards = () => {
  const ctx = useContext(RewardsContext);
  if (!ctx) throw new Error("useRewards must be used within RewardsProvider");
  return ctx;
};
