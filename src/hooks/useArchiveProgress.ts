import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "@/constants/constants";

interface ArchiveRecord {
  puzzleNumber: number;
  attempts: number;
  isWin: boolean;
  completedAt: string;
}

export function useArchiveProgress() {
  const [completedPuzzles, setCompletedPuzzles] = useState<Map<number, ArchiveRecord>>(new Map());

  // Load completed puzzles from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ARCHIVE_COMPLETED);
      if (raw) {
        const parsed: ArchiveRecord[] = JSON.parse(raw);
        const map = new Map<number, ArchiveRecord>();
        parsed.forEach((record) => {
          map.set(record.puzzleNumber, record);
        });
        setCompletedPuzzles(map);
      }
    } catch (err) {
      console.error("Failed to load archive progress:", err);
    }
  }, []);

  // Mark a puzzle as completed
  const markCompleted = useCallback(
    (puzzleNumber: number, attempts: number, isWin: boolean) => {
      const record: ArchiveRecord = {
        puzzleNumber,
        attempts,
        isWin,
        completedAt: new Date().toISOString(),
      };

      setCompletedPuzzles((prev) => {
        const next = new Map(prev);
        next.set(puzzleNumber, record);

        // Persist to localStorage
        try {
          const arr = Array.from(next.values());
          localStorage.setItem(STORAGE_KEYS.ARCHIVE_COMPLETED, JSON.stringify(arr));
        } catch (err) {
          console.error("Failed to save archive progress:", err);
        }

        return next;
      });
    },
    []
  );

  // Check if a puzzle is completed
  const isCompleted = useCallback(
    (puzzleNumber: number): boolean => {
      return completedPuzzles.has(puzzleNumber);
    },
    [completedPuzzles]
  );

  // Get record for a puzzle
  const getRecord = useCallback(
    (puzzleNumber: number): ArchiveRecord | undefined => {
      return completedPuzzles.get(puzzleNumber);
    },
    [completedPuzzles]
  );

  // Get completion stats
  const getStats = useCallback(() => {
    const records = Array.from(completedPuzzles.values());
    const wins = records.filter((r) => r.isWin).length;
    return {
      total: records.length,
      wins,
      losses: records.length - wins,
    };
  }, [completedPuzzles]);

  return {
    completedPuzzles,
    markCompleted,
    isCompleted,
    getRecord,
    getStats,
  };
}
