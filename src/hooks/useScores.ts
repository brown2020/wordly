import { useState, useEffect } from "react";

export type ScoreData = {
  score: number;
  date: string;
  attempts: number;
  word: string;
};

export function useScores() {
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedScores = localStorage.getItem("wordly-scores");
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

