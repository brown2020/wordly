// components/GameBoard.tsx
import { FC } from "react";
import { CONSTANTS } from "../constants/constants";
import { GameTile } from "./GameTile";
import { LetterState, GameState } from "../types/types";

interface GameBoardProps {
  state: GameState;
}

// Helper function to count letter occurrences
const countLetterOccurrences = (word: string, letter: string): number =>
  [...word].filter((l) => l === letter).length;

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
    {[...Array(CONSTANTS.WORD_LENGTH)].map((_, colIndex) => {
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
    if (rowIndex >= state.currentRow) return LetterState.UNUSED;

    const attempt = state.attempts[rowIndex];
    if (!attempt) return LetterState.UNUSED;

    const letter = attempt[colIndex];
    if (!letter) return LetterState.UNUSED;

    // Check for correct position first
    if (letter === state.wordToGuess[colIndex]) {
      return LetterState.CORRECT;
    }

    // Check for present but in wrong position
    if (state.wordToGuess.includes(letter)) {
      // Count how many times the letter appears in the target word
      const targetCount = countLetterOccurrences(state.wordToGuess, letter);

      // Count how many times the letter appears in correct positions in the attempt
      const correctPositions = [...attempt]
        .map((l, i) =>
          l === letter && state.wordToGuess[i] === letter ? 1 : 0
        )
        .reduce((sum: number, val: number) => sum + val, 0);

      // Count how many times the letter appears in the wrong positions before this position
      const previousWrongPositions = [...attempt]
        .slice(0, colIndex)
        .map((l, i) =>
          l === letter && state.wordToGuess[i] !== letter ? 1 : 0
        )
        .reduce((sum: number, val: number) => sum + val, 0);

      // If we haven't exceeded the target count considering correct positions and previous wrong positions
      if (correctPositions + previousWrongPositions < targetCount) {
        return LetterState.PRESENT;
      }
    }

    return LetterState.ABSENT;
  };

  return (
    <div className="flex flex-col gap-1.5 p-4">
      {[...Array(CONSTANTS.MAX_ATTEMPTS)].map((_, rowIndex) => (
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
