"use client";

import { FC, useState, useMemo } from "react";
import { Modal } from "./ui/Modal";
import { useArchiveProgress } from "@/hooks/useArchiveProgress";
import { getCurrentPuzzleNumber } from "@/utils/game-utils";
import { useGameStore } from "@/stores/game-store";

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Format puzzle number to date
function puzzleNumberToDate(puzzleNumber: number): string {
  const epoch = Date.UTC(2021, 5, 19); // June 19, 2021
  const dayMs = 24 * 60 * 60 * 1000;
  const date = new Date(epoch + puzzleNumber * dayMs);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const PUZZLES_PER_PAGE = 20;

export const ArchiveModal: FC<ArchiveModalProps> = ({ isOpen, onClose }) => {
  const { isCompleted, getRecord } = useArchiveProgress();
  const startNewGame = useGameStore((s) => s.startNewGame);
  const currentPuzzle = getCurrentPuzzleNumber();

  // Pagination state - start from the most recent puzzles
  const [page, setPage] = useState(0);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil((currentPuzzle + 1) / PUZZLES_PER_PAGE);
  }, [currentPuzzle]);

  // Get puzzles for current page (most recent first)
  const puzzlesOnPage = useMemo(() => {
    const startPuzzle = currentPuzzle - page * PUZZLES_PER_PAGE;
    const puzzles: number[] = [];
    for (let i = 0; i < PUZZLES_PER_PAGE && startPuzzle - i >= 0; i++) {
      puzzles.push(startPuzzle - i);
    }
    return puzzles;
  }, [currentPuzzle, page]);

  const handleSelectPuzzle = (puzzleNumber: number) => {
    startNewGame("archive", puzzleNumber);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Puzzle Archive" maxWidth="max-w-lg">
      <div className="space-y-4">
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Play past daily puzzles. Select a puzzle to play.
        </p>

        {/* Puzzle grid */}
        <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
          {puzzlesOnPage.map((puzzleNumber) => {
            const completed = isCompleted(puzzleNumber);
            const record = getRecord(puzzleNumber);
            const isToday = puzzleNumber === currentPuzzle;

            return (
              <button
                key={puzzleNumber}
                onClick={() => handleSelectPuzzle(puzzleNumber)}
                className={`
                  p-3 rounded-lg border text-left transition-colors
                  ${
                    completed
                      ? record?.isWin
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-neutral-400 bg-neutral-100 dark:bg-neutral-700"
                      : "border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">
                      #{puzzleNumber}
                      {isToday && (
                        <span className="ml-2 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">
                          Today
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {puzzleNumberToDate(puzzleNumber)}
                    </div>
                  </div>
                  {completed && (
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${
                          record?.isWin
                            ? "text-green-600 dark:text-green-400"
                            : "text-neutral-500"
                        }`}
                      >
                        {record?.isWin ? `${record.attempts}/6` : "X/6"}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {record?.isWin ? "Solved" : "Failed"}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 text-sm rounded-md bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:not-disabled:bg-neutral-200 dark:hover:not-disabled:bg-neutral-600 transition-colors"
          >
            Newer
          </button>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1.5 text-sm rounded-md bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:not-disabled:bg-neutral-200 dark:hover:not-disabled:bg-neutral-600 transition-colors"
          >
            Older
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ArchiveModal;
