import { useState, useEffect } from "react";
import { ScoreData } from "@/types/types";
import { STORAGE_KEYS } from "@/constants/constants";

export function useScores() {
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SCORES);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setScores(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("Error loading scores:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { scores, loading };
}

