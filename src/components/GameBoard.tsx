// components/GameBoard.tsx
import { FC } from "react";
import { GAME } from "@/constants/constants";
import { GameTile } from "./GameTile";
import { useGameStore } from "@/stores/game-store";

type LetterState = "correct" | "present" | "absent" | "unused";

const GameRow: FC<{ rowIndex: number }> = ({ rowIndex }) => {
  const {
    currentRow,
    invalidGuess,
    currentGuess,
    guesses,
    isRevealing,
    evaluations,
  } = useGameStore();

  return (
    <div
      className={`flex gap-1.5 ${
        rowIndex === currentRow && invalidGuess
          ? "[animation:var(--animate-shake)]"
          : ""
      }`}
    >
      {[...Array(GAME.WORD_LENGTH)].map((_, colIndex) => {
        const isCurrent = rowIndex === currentRow;
        const letter = isCurrent
          ? currentGuess[colIndex] || ""
          : guesses[rowIndex]?.[colIndex] || "";
        const state: LetterState = isCurrent
          ? letter
            ? "unused"
            : "unused"
          : (evaluations[rowIndex]?.[colIndex] as LetterState) ?? "unused";

        return (
          <GameTile
            key={`${rowIndex}-${colIndex}`}
            letter={letter}
            state={state}
            isRevealing={isRevealing && rowIndex === currentRow - 1}
            position={colIndex}
            isCurrentRow={isCurrent}
            isInvalidGuess={isCurrent && invalidGuess}
          />
        );
      })}
    </div>
  );
};

export const GameBoard: FC = () => {
  return (
    <div className="flex flex-col gap-1.5 p-4">
      {[...Array(GAME.MAX_ATTEMPTS)].map((_, rowIndex) => (
        <GameRow key={rowIndex} rowIndex={rowIndex} />
      ))}
    </div>
  );
};
