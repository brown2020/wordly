import { useCallback, useEffect, useState } from "react";
import { ScoreData } from "@/types/types";
import { STORAGE_KEYS } from "@/constants/constants";

export function useScores() {
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadScores = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SCORES);
      if (!raw) {
        setScores([]);
        return;
      }
      const parsed = JSON.parse(raw);
      setScores(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("Error loading scores:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScores();
    const handleScoresUpdate = () => loadScores();
    window.addEventListener("storage", handleScoresUpdate);
    window.addEventListener("wordly:scores-updated", handleScoresUpdate);
    return () => {
      window.removeEventListener("storage", handleScoresUpdate);
      window.removeEventListener("wordly:scores-updated", handleScoresUpdate);
    };
  }, [loadScores]);

  return { scores, loading };
}

