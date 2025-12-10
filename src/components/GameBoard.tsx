// components/GameBoard.tsx
import { FC, memo } from "react";
import { GAME } from "@/constants/constants";
import { GameTile } from "./GameTile";
import { useGameStore } from "@/stores/game-store";
import { LetterState } from "@/types/types";

const GameRow: FC<{ rowIndex: number }> = memo(({ rowIndex }) => {
  const currentRow = useGameStore((s) => s.currentRow);
  const invalidGuess = useGameStore((s) => s.invalidGuess);
  const currentGuess = useGameStore((s) => s.currentGuess);
  const guess = useGameStore((s) => s.guesses[rowIndex]);
  const evaluation = useGameStore((s) => s.evaluations[rowIndex]);
  const isRevealing = useGameStore((s) => s.isRevealing);

  const isCurrent = rowIndex === currentRow;

  return (
    <div
      className={`flex gap-1.5 ${
        isCurrent && invalidGuess ? "[animation:var(--animate-shake)]" : ""
      }`}
    >
      {[...Array(GAME.WORD_LENGTH)].map((_, colIndex) => {
        const letter = isCurrent
          ? currentGuess[colIndex] || ""
          : guess?.[colIndex] || "";
        const state: LetterState = isCurrent
          ? "unused"
          : (evaluation?.[colIndex] as LetterState) ?? "unused";

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
});

GameRow.displayName = "GameRow";

export const GameBoard: FC = () => {
  return (
    <div className="flex flex-col gap-1.5 p-4">
      {[...Array(GAME.MAX_ATTEMPTS)].map((_, rowIndex) => (
        <GameRow key={rowIndex} rowIndex={rowIndex} />
      ))}
    </div>
  );
};
