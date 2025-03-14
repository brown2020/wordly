"use client";

import { useState, useEffect } from "react";

export type ScoreData = {
  score: number;
  date: string;
  guesses: number;
  word: string;
};

export function useScores() {
  const [scores, setScores] = useState<ScoreData[]>([]);

  // Load scores from localStorage on component mount
  useEffect(() => {
    try {
      const savedScores = localStorage.getItem("wordly-scores");
      if (savedScores) {
        setScores(JSON.parse(savedScores));
      }
    } catch (e) {
      console.error("Error loading scores:", e);
    }
  }, []);

  // Save a new score
  const saveScore = (score: number, guesses: number, word: string) => {
    const newScore: ScoreData = {
      score,
      date: new Date().toISOString(),
      guesses,
      word,
    };

    const updatedScores = [...scores, newScore];

    // Keep only the last 10 scores
    const limitedScores =
      updatedScores.length > 10 ? updatedScores.slice(-10) : updatedScores;

    setScores(limitedScores);

    try {
      localStorage.setItem("wordly-scores", JSON.stringify(limitedScores));
    } catch (e) {
      console.error("Error saving scores:", e);
    }
  };

  return {
    scores,
    saveScore,
  };
}
