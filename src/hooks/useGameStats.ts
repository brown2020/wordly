import { useEffect, useRef } from "react";
import { useGameStore } from "@/stores/game-store";
import { useShallow } from "zustand/shallow";
import { appendScoreRecord, upsertArchiveRecord } from "@/utils/storage-utils";

export function useGameStats() {
  const {
    isGameOver,
    isWinner,
    guessesLength,
    answer,
    solutionId,
    mode,
    puzzleNumber,
  } =
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
      appendScoreRecord({
        attempts: guessesLength,
        word: answer,
        isWin: isWinner,
        date: new Date().toISOString(),
        mode,
        puzzleNumber,
      });

      // Also save to archive progress if it's an archive or daily puzzle
      if ((mode === "archive" || mode === "daily") && puzzleNumber !== null) {
        try {
          upsertArchiveRecord({
            puzzleNumber,
            attempts: guessesLength,
            isWin: isWinner,
            completedAt: new Date().toISOString(),
          });
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
  }, [
    isGameOver,
    isWinner,
    guessesLength,
    answer,
    solutionId,
    mode,
    puzzleNumber,
  ]);
}

