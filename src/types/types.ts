// types/types.ts
export interface WordEntry {
  word: string;
}

export interface GameState {
  wordToGuess: string;
  currentGuess: string;
  attempts: string[];
  isWinner: boolean;
  gameOver: boolean;
  score: number;
  currentRow: number;
  isRevealing: boolean;
  invalidGuess?: boolean;
}

export interface GameEndState {
  isWinner: boolean;
  message: string;
}
