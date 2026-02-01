// components/GameOverModal.tsx
import { FC, useCallback, useState } from "react";
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

export const GameOverModal: FC<GameOverModalProps> = ({
  isWinner,
  wordToGuess,
  numGuesses,
  onPlayAgain,
  onClose,
  isOpen,
}) => {
  const mode = useGameStore((s) => s.mode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-sm w-full text-center relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
          aria-label="Close"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
        {isWinner ? (
          <p className="text-sm uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
            {numGuesses === 1
              ? "Genius"
              : numGuesses === 2
              ? "Magnificent"
              : numGuesses === 3
              ? "Impressive"
              : numGuesses === 4
              ? "Splendid"
              : numGuesses === 5
              ? "Great"
              : "Phew"}
          </p>
        ) : (
          <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-4">
            The word was{" "}
            <span className="text-green-600 dark:text-green-400 font-bold uppercase">
              {wordToGuess}
            </span>
          </p>
        )}

        {/* Countdown to next puzzle (only for daily mode) */}
        {mode === "daily" && (
          <div className="my-6 py-4 border-t border-b border-neutral-200 dark:border-neutral-700">
            <CountdownTimer className="text-center" />
          </div>
        )}

        <div className="flex gap-3 mt-4">
          {(mode === "random" || mode === "archive") && (
            <button
              onClick={onPlayAgain}
              className="flex-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white font-bold py-3 px-6 rounded transition-colors"
            >
              Play Again
            </button>
          )}
          <ShareButton />
        </div>
      </div>
    </div>
  );
};

const ShareButton: FC = () => {
  const { isWinner, guesses, evaluations, mode, solutionId, puzzleNumber } = useGameStore(
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
  }, [isWinner, guesses, evaluations, mode, solutionId, puzzleNumber, hardMode, highContrastMode]);

  return (
    <button
      onClick={share}
      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition-colors"
    >
      {copied ? "Copied!" : "Share"}
    </button>
  );
};
