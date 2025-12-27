// components/GameOverModal.tsx
import { FC, useCallback } from "react";
import { useGameStore } from "@/stores/game-store";
import { getShareText } from "@/utils/game-utils";
import { useShallow } from "zustand/shallow";

interface GameOverModalProps {
  isWinner: boolean;
  wordToGuess: string;
  numGuesses: number;
  onPlayAgain: () => void;
  isOpen: boolean;
}

export const GameOverModal: FC<GameOverModalProps> = ({
  isWinner,
  wordToGuess,
  numGuesses,
  onPlayAgain,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold mb-4">
          {isWinner ? "🎉 Congratulations!" : "😔 Game Over"}
        </h2>

        <div className="mb-6">
          <p className="text-lg mb-2">
            {isWinner
              ? `You won in ${numGuesses} ${
                  numGuesses === 1 ? "try" : "tries"
                }!`
              : `Better luck next time!`}
          </p>
          <p className="text-md font-medium">
            The word was:{" "}
            <span className="text-emerald-600 font-bold">{wordToGuess}</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Play Again
          </button>
          <ShareButton />
        </div>
      </div>
    </div>
  );
};

const ShareButton: FC = () => {
  const { isWinner, guesses, evaluations, mode, solutionId } = useGameStore(
    useShallow((s) => ({
      isWinner: s.isWinner,
      guesses: s.guesses,
      evaluations: s.evaluations,
      mode: s.mode,
      solutionId: s.solutionId,
    }))
  );

  const share = useCallback(async () => {
    const text = getShareText({
      isWinner,
      guesses,
      evaluations,
      mode,
      solutionId,
    });
    try {
      await navigator.clipboard.writeText(text);
      alert("Results copied to clipboard!");
    } catch {
      if (navigator.share) {
        try {
          await navigator.share({ text });
        } catch {
          // User cancelled or share failed
        }
      }
    }
  }, [isWinner, guesses, evaluations, mode, solutionId]);

  return (
    <button
      onClick={share}
      className="px-5 py-3 bg-neutral-800 text-white rounded-lg font-semibold"
    >
      Share
    </button>
  );
};
