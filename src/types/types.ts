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
  /**
   * Whether the game was won. Older stored score entries may omit this field.
   * When missing, stats fall back to a best-effort heuristic.
   */
  isWin?: boolean;
}
