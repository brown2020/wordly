import { useEffect, useRef } from "react";
import { useGameStore } from "@/stores/game-store";
import { STORAGE_KEYS } from "@/constants/constants";
import { useShallow } from "zustand/shallow";

export function useGameStats() {
  const { isGameOver, isWinner, guessesLength, answer, solutionId, mode, puzzleNumber } =
    useGameStore(
      useShallow((s) => ({
        isGameOver: s.isGameOver,
        isWinner: s.isWinner,
        guessesLength: s.guesses.length,
        answer: s.answer,
        solutionId: s.solutionId,
        mode: s.mode,
        puzzleNumber: s.puzzleNumber,
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

    // Persist game history for statistics
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SCORES);
      const parsed = raw ? JSON.parse(raw) : [];
      const existing = Array.isArray(parsed) ? parsed : [];

      existing.push({
        attempts: guessesLength,
        word: answer,
        isWin: isWinner,
        date: new Date().toISOString(),
        mode,
        puzzleNumber,
      });
      localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(existing));
      window.dispatchEvent(new Event("wordly:scores-updated"));

      // Also save to archive progress if it's an archive or daily puzzle
      if ((mode === "archive" || mode === "daily") && puzzleNumber !== null) {
        try {
          const archiveRaw = localStorage.getItem(STORAGE_KEYS.ARCHIVE_COMPLETED);
          const archiveParsed = archiveRaw ? JSON.parse(archiveRaw) : [];
          const archiveExisting = Array.isArray(archiveParsed) ? archiveParsed : [];

          // Check if this puzzle is already recorded
          const alreadyRecorded = archiveExisting.some(
            (r: { puzzleNumber: number }) => r.puzzleNumber === puzzleNumber
          );

          if (!alreadyRecorded) {
            archiveExisting.push({
              puzzleNumber,
              attempts: guessesLength,
              isWin: isWinner,
              completedAt: new Date().toISOString(),
            });
            localStorage.setItem(
              STORAGE_KEYS.ARCHIVE_COMPLETED,
              JSON.stringify(archiveExisting)
            );
          }
        } catch (archiveErr) {
          console.error("Failed to save archive progress:", archiveErr);
        }
      }

      lastSavedRef.current = {
        solutionId,
        guessesLength,
        isWinner,
        savedAt: now,
      };
    } catch (err) {
      console.error("Failed to save game to localStorage:", err);
    }
  }, [isGameOver, isWinner, guessesLength, answer, solutionId, mode, puzzleNumber]);
}

