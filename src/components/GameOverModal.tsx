"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useGameStore } from "@/stores/game-store";
import { useSettingsStore } from "@/stores/settings-store";
import { getShareText } from "@/utils/game-utils";
import { useShallow } from "zustand/shallow";
import CountdownTimer from "./CountdownTimer";
import { CloseIcon } from "./ui/icons";

interface GameOverModalProps {
  isWinner: boolean;
  wordToGuess: string;
  numGuesses: number;
  onPlayAgain: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const WIN_TITLES = [
  "Genius",
  "Magnificent",
  "Impressive",
  "Splendid",
  "Great",
  "Phew",
] as const;

function winTitleForGuesses(numGuesses: number): string {
  const index = Math.min(Math.max(numGuesses, 1), WIN_TITLES.length) - 1;
  return WIN_TITLES[index];
}

const ResultHeadline: FC<{
  isWinner: boolean;
  wordToGuess: string;
  numGuesses: number;
}> = ({ isWinner, wordToGuess, numGuesses }) => {
  if (isWinner) {
    return (
      <p className="mb-2 text-sm uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        {winTitleForGuesses(numGuesses)}
      </p>
    );
  }
  return (
    <p className="mb-4 text-lg font-medium text-neutral-700 dark:text-neutral-300">
      The word was{" "}
      <span className="font-bold uppercase text-green-600 dark:text-green-400">
        {wordToGuess}
      </span>
    </p>
  );
};

export const GameOverModal: FC<GameOverModalProps> = ({
  isWinner,
  wordToGuess,
  numGuesses,
  onPlayAgain,
  onClose,
  isOpen,
}) => {
  const mode = useGameStore((s) => s.mode);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showPlayAgain = mode === "random" || mode === "archive";

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 open:flex open:items-center open:justify-center"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      aria-labelledby="game-over-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Dismiss game over dialog"
        onClick={onClose}
      />
      <div className="relative z-10 m-4 w-full max-w-sm rounded-lg bg-white p-6 text-center dark:bg-neutral-800">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
          aria-label="Close"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <h2 id="game-over-title" className="sr-only">
          {isWinner ? "You won" : "Game over"}
        </h2>

        <ResultHeadline
          isWinner={isWinner}
          wordToGuess={wordToGuess}
          numGuesses={numGuesses}
        />

        {mode === "daily" && (
          <div className="my-6 border-t border-b border-neutral-200 py-4 dark:border-neutral-700">
            <CountdownTimer className="text-center" />
          </div>
        )}

        <div className="mt-4 flex gap-3">
          {showPlayAgain && (
            <button
              type="button"
              onClick={onPlayAgain}
              className="flex-1 rounded bg-neutral-200 px-6 py-3 font-bold text-neutral-900 transition-colors hover:bg-neutral-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
            >
              Play Again
            </button>
          )}
          <ShareButton />
        </div>
      </div>
    </dialog>
  );
};

const ShareButton: FC = () => {
  const { isWinner, guesses, evaluations, mode, solutionId, puzzleNumber } =
    useGameStore(
      useShallow((s) => ({
        isWinner: s.isWinner,
        guesses: s.guesses,
        evaluations: s.evaluations,
        mode: s.mode,
        solutionId: s.solutionId,
        puzzleNumber: s.puzzleNumber,
      }))
    );

  const { hardMode, highContrastMode } = useSettingsStore(
    useShallow((s) => ({
      hardMode: s.hardMode,
      highContrastMode: s.highContrastMode,
    }))
  );

  const [copied, setCopied] = useState(false);

  const share = useCallback(async () => {
    const text = getShareText(
      { isWinner, guesses, evaluations, mode, solutionId, puzzleNumber },
      hardMode,
      highContrastMode
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      if (navigator.share) {
        try {
          await navigator.share({ text });
        } catch {
          // User cancelled or share failed
        }
      }
    }
  }, [
    isWinner,
    guesses,
    evaluations,
    mode,
    solutionId,
    puzzleNumber,
    hardMode,
    highContrastMode,
  ]);

  return (
    <button
      type="button"
      onClick={share}
      className="flex-1 rounded bg-green-700 px-6 py-3 font-bold text-white transition-colors hover:bg-green-800"
    >
      {copied ? "Copied!" : "Share"}
    </button>
  );
};
