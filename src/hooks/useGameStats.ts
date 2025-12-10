import { useEffect } from "react";
import { useGameStore } from "@/stores/game-store";
import { STORAGE_KEYS } from "@/constants/constants";

export function useGameStats() {
  const { isGameOver, isWinner, guesses, score, answer } = useGameStore();

  useEffect(() => {
    if (isGameOver) {
      const numGuesses = guesses.length;

      // Persist lightweight score history
      try {
        const existing = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.SCORES) || "[]"
        );
        existing.push({
          score,
          attempts: numGuesses,
          word: answer,
          date: new Date().toISOString(),
        });
        localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(existing));
      } catch (err) {
        console.error("Failed to save score to localStorage:", err);
      }
    }
  }, [isGameOver, isWinner, guesses.length, score, answer]);
}
