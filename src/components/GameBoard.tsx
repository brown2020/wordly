// components/GameBoard.tsx
import { FC } from "react";
import { CONSTANTS } from "../constants/constants";
import { GameTile } from "./GameTile";
import { LetterState, GameState } from "../types/types";

interface GameBoardProps {
  state: GameState;
}

export const GameBoard: FC<GameBoardProps> = ({ state }) => {
  const getLetterState = (rowIndex: number, colIndex: number): LetterState => {
    // Only evaluate completed rows
    if (rowIndex >= state.currentRow) return LetterState.UNUSED;

    const attempt = state.attempts[rowIndex];
    if (!attempt) return LetterState.UNUSED;

    const letter = attempt[colIndex];
    if (letter === state.wordToGuess[colIndex]) {
      return LetterState.CORRECT;
    }

    if (state.wordToGuess.includes(letter)) {
      // Count occurrences in target word
      const targetCount = [...state.wordToGuess].filter(
        (l) => l === letter
      ).length;
      // Count correct positions before this index
      const correctCount = attempt
        .split("")
        .filter((l, i) => l === letter && state.wordToGuess[i] === l).length;
      // Count appearances before this position
      const previousCount = attempt
        .slice(0, colIndex)
        .split("")
        .filter((l) => l === letter).length;

      if (previousCount + correctCount < targetCount) {
        return LetterState.PRESENT;
      }
    }

    return LetterState.ABSENT;
  };

  return (
    <div className="flex flex-col gap-1.5 p-4">
      {[...Array(CONSTANTS.MAX_ATTEMPTS)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5">
          {[...Array(CONSTANTS.WORD_LENGTH)].map((_, colIndex) => {
            let letter = "";

            // Current row shows current guess
            if (rowIndex === state.currentRow) {
              letter = state.currentGuess[colIndex] || "";
            }
            // Previous rows show submitted attempts
            else if (rowIndex < state.currentRow) {
              letter = state.attempts[rowIndex]?.[colIndex] || "";
            }

            return (
              <GameTile
                key={`${rowIndex}-${colIndex}`}
                letter={letter}
                state={getLetterState(rowIndex, colIndex)}
                isRevealing={
                  state.isRevealing && rowIndex === state.currentRow - 1
                }
                position={colIndex}
                isCurrentRow={rowIndex === state.currentRow}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
