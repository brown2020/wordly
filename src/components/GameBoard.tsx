// components/GameBoard.tsx
import { FC } from "react";
import { GAME } from "@/constants/constants";
import { GameTile } from "./GameTile";
import { GameState } from "@/types/types";

interface GameBoardProps {
  state: GameState;
}

type LetterState = "correct" | "present" | "absent" | "unused";

const GameRow: FC<{
  rowIndex: number;
  state: GameState;
  getLetterState: (rowIndex: number, colIndex: number) => LetterState;
}> = ({ rowIndex, state, getLetterState }) => (
  <div
    className={`flex gap-1.5 ${
      rowIndex === state.currentRow && state.invalidGuess
        ? "[animation:var(--animate-shake)]"
        : ""
    }`}
  >
    {[...Array(GAME.WORD_LENGTH)].map((_, colIndex) => {
      const letter =
        rowIndex === state.currentRow
          ? state.currentGuess[colIndex] || ""
          : state.attempts[rowIndex]?.[colIndex] || "";

      return (
        <GameTile
          key={`${rowIndex}-${colIndex}`}
          letter={letter}
          state={getLetterState(rowIndex, colIndex)}
          isRevealing={state.isRevealing && rowIndex === state.currentRow - 1}
          position={colIndex}
          isCurrentRow={rowIndex === state.currentRow}
          isInvalidGuess={rowIndex === state.currentRow && state.invalidGuess}
        />
      );
    })}
  </div>
);

export const GameBoard: FC<GameBoardProps> = ({ state }) => {
  const getLetterState = (rowIndex: number, colIndex: number): LetterState => {
    if (rowIndex >= state.currentRow) return "unused";

    const attempt = state.attempts[rowIndex];
    if (!attempt) return "unused";

    const letter = attempt[colIndex];
    if (!letter) return "unused";

    // Check for correct position first
    if (letter === state.wordToGuess[colIndex]) {
      return "correct";
    }

    // Check for present but in wrong position
    if (state.wordToGuess.includes(letter)) {
      // Count how many times this letter appears in the target word
      const targetCount = state.wordToGuess
        .split("")
        .filter((l) => l === letter).length;

      // Count how many times we've already marked this letter as correct
      const correctPositions = attempt
        .split("")
        .filter((l, i) => l === letter && l === state.wordToGuess[i]).length;

      // Count how many times we've marked this letter as present in previous positions
      const previousWrongPositions = attempt
        .slice(0, colIndex)
        .split("")
        .filter(
          (l, i) =>
            l === letter &&
            l !== state.wordToGuess[i] &&
            state.wordToGuess.includes(l)
        ).length;

      // If we haven't exceeded the target count considering correct positions and previous wrong positions
      if (correctPositions + previousWrongPositions < targetCount) {
        return "present";
      }
    }

    return "absent";
  };

  return (
    <div className="flex flex-col gap-1.5 p-4">
      {[...Array(GAME.MAX_ATTEMPTS)].map((_, rowIndex) => (
        <GameRow
          key={rowIndex}
          rowIndex={rowIndex}
          state={state}
          getLetterState={getLetterState}
        />
      ))}
    </div>
  );
};
