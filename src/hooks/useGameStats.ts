import { useEffect, useRef } from "react";
import { useGameStore } from "@/stores/game-store";
import { STORAGE_KEYS } from "@/constants/constants";
import { useShallow } from "zustand/shallow";

export function useGameStats() {
  const { isGameOver, isWinner, guessesLength, score, answer, solutionId } =
    useGameStore(
    useShallow((s) => ({
      isGameOver: s.isGameOver,
      isWinner: s.isWinner,
      guessesLength: s.guesses.length,
      score: s.score,
      answer: s.answer,
      solutionId: s.solutionId,
    }))
    );

  const lastSavedRef = useRef<{
    solutionId: string;
    guessesLength: number;
    isWinner: boolean;
    savedAt: number;
  } | null>(null);

  useEffect(() => {
    if (!isGameOver) return;
    const now = Date.now();
    const lastSaved = lastSavedRef.current;
    if (
      lastSaved &&
      lastSaved.solutionId === solutionId &&
      lastSaved.guessesLength === guessesLength &&
      lastSaved.isWinner === isWinner &&
      now - lastSaved.savedAt < 1000
    ) {
      return;
    }

    // Persist lightweight score history
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SCORES);
      const parsed = raw ? JSON.parse(raw) : [];
      const existing = Array.isArray(parsed) ? parsed : [];

      existing.push({
        score,
        attempts: guessesLength,
        word: answer,
        isWin: isWinner,
        date: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(existing));
      window.dispatchEvent(new Event("wordly:scores-updated"));
      lastSavedRef.current = {
        solutionId,
        guessesLength,
        isWinner,
        savedAt: now,
      };
    } catch (err) {
      console.error("Failed to save score to localStorage:", err);
    }
  }, [isGameOver, isWinner, guessesLength, score, answer, solutionId]);
}

