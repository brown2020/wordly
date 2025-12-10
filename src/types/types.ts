// types/types.ts

export type LetterState = "correct" | "present" | "absent" | "unused";

export type KeyboardState = Record<
  string,
  Exclude<LetterState, "unused"> | undefined
>;

export interface ScoreData {
  score: number;
  date: string;
  attempts: number;
  word: string;
}
