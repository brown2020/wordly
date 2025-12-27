// components/GameBoard.tsx
import { FC, memo } from "react";
import { GAME } from "@/constants/constants";
import { GameTile } from "./GameTile";
import { useGameStore } from "@/stores/game-store";
import { LetterState } from "@/types/types";
import { useShallow } from "zustand/shallow";

const GameRow: FC<{ rowIndex: number }> = memo(({ rowIndex }) => {
  const {
    currentRow,
    invalidGuess,
    currentGuess,
    guess,
    evaluation,
    isRevealing,
  } = useGameStore(
    useShallow((s) => ({
      currentRow: s.currentRow,
      invalidGuess: s.invalidGuess,
      currentGuess: s.currentGuess,
      guess: s.guesses[rowIndex],
      evaluation: s.evaluations[rowIndex],
      isRevealing: s.isRevealing,
    }))
  );

  const isCurrent = rowIndex === currentRow;
  const isInvalidRow = isCurrent && invalidGuess;
  const isRevealingRow = isRevealing && rowIndex === currentRow - 1;

  return (
    <div className={`flex gap-1.5 ${isInvalidRow ? "animate-shake" : ""}`}>
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
            isRevealing={isRevealingRow}
            position={colIndex}
            isCurrentRow={isCurrent}
            isInvalidGuess={isInvalidRow}
          />
        );
      })}
    </div>
  );
});

GameRow.displayName = "GameRow";

export const GameBoard: FC = () => {
  return (
    <div className="flex flex-col gap-1.5">
      {[...Array(GAME.MAX_ATTEMPTS)].map((_, rowIndex) => (
        <GameRow key={rowIndex} rowIndex={rowIndex} />
      ))}
    </div>
  );
};
