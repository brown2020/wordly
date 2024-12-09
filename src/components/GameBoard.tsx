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
  <div className="flex gap-1.5">
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

    // Check for correct position first
    if (letter === state.wordToGuess[colIndex]) {
      return LetterState.CORRECT;
    }

    // Check for present but in wrong position
    if (state.wordToGuess.includes(letter)) {
      const targetCount = countLetterOccurrences(state.wordToGuess, letter);
      const correctCount = countLetterOccurrences(
        attempt
          .slice(0, CONSTANTS.WORD_LENGTH)
          .split("")
          .filter((l, i) => state.wordToGuess[i] === l)
          .join(""),
        letter
      );
      const previousCount = countLetterOccurrences(
        attempt.slice(0, colIndex),
        letter
      );

      if (previousCount + correctCount < targetCount) {
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
