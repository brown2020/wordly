import { useEffect } from "react";
import { useGameStore } from "@/stores/game-store";

export function useGameStats() {
  const { isGameOver, isWinner, guesses, score, answer } = useGameStore();

  useEffect(() => {
    if (isGameOver) {
      const won = isWinner;
      const numGuesses = guesses.length;

      // Update stats API (edge runtime in-memory)
      fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ won, guesses: won ? numGuesses : 0 }),
      }).catch((err) => console.error("Failed to update stats:", err));

      // Persist lightweight score history
      try {
        const existing = JSON.parse(
          localStorage.getItem("wordly-scores") || "[]"
        );
        existing.push({
          score,
          attempts: numGuesses,
          word: answer,
          date: new Date().toISOString(),
        });
        localStorage.setItem("wordly-scores", JSON.stringify(existing));
      } catch (err) {
        console.error("Failed to save score to localStorage:", err);
      }
    }
  }, [isGameOver, isWinner, guesses.length, score, answer]);
}

