import { useCallback, useEffect, useState } from "react";
import { ScoreData } from "@/types/types";
import { readScores, SCORES_UPDATED_EVENT } from "@/utils/storage-utils";

export function useScores() {
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadScores = useCallback(() => {
    try {
      setScores(readScores());
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
    window.addEventListener(SCORES_UPDATED_EVENT, handleScoresUpdate);
    return () => {
      window.removeEventListener("storage", handleScoresUpdate);
      window.removeEventListener(SCORES_UPDATED_EVENT, handleScoresUpdate);
    };
  }, [loadScores]);

  return { scores, loading };
}

