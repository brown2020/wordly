// components/GameOverModal.tsx
import { FC } from "react";

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

        <button
          onClick={onPlayAgain}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};
