// types/types.ts
export interface WordEntry {
  word: string;
  difficulty: 1 | 2 | 3;
}

export interface GameState {
  wordToGuess: string;
  currentGuess: string;
  attempts: string[];
  isWinner: boolean;
  gameOver: boolean;
  score: number;
  difficulty: 1 | 2 | 3;
  currentRow: number;
  isRevealing: boolean;
  invalidGuess?: boolean;
}

export enum LetterState {
  CORRECT = "correct",
  PRESENT = "present",
  ABSENT = "absent",
  UNUSED = "unused",
}

export interface GameEndState {
  isWinner: boolean;
  message: string;
}
