import { useState, useEffect } from "react";
import { ScoreData } from "@/types/types";
import { STORAGE_KEYS } from "@/constants/constants";

export function useScores() {
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedScores = localStorage.getItem(STORAGE_KEYS.SCORES);
      if (savedScores) {
        setScores(JSON.parse(savedScores));
      }
    } catch (error) {
      console.error("Error loading scores:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { scores, loading };
}

