import { useState, useEffect, useCallback } from "react";
import { ArchiveRecord } from "@/types/types";
import {
  ARCHIVE_UPDATED_EVENT,
  readArchiveRecords,
  upsertArchiveRecord,
} from "@/utils/storage-utils";

export function useArchiveProgress() {
  const [completedPuzzles, setCompletedPuzzles] = useState<Map<number, ArchiveRecord>>(new Map());

  const loadArchiveProgress = useCallback(() => {
    try {
      const map = new Map<number, ArchiveRecord>();
      readArchiveRecords().forEach((record) => {
        map.set(record.puzzleNumber, record);
      });
      setCompletedPuzzles(map);
    } catch (err) {
      console.error("Failed to load archive progress:", err);
    }
  }, []);

  // Load completed puzzles from localStorage
  useEffect(() => {
    loadArchiveProgress();
    const handleArchiveUpdate = () => loadArchiveProgress();
    window.addEventListener("storage", handleArchiveUpdate);
    window.addEventListener(ARCHIVE_UPDATED_EVENT, handleArchiveUpdate);
    return () => {
      window.removeEventListener("storage", handleArchiveUpdate);
      window.removeEventListener(ARCHIVE_UPDATED_EVENT, handleArchiveUpdate);
    };
  }, [loadArchiveProgress]);

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
          upsertArchiveRecord(record);
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
