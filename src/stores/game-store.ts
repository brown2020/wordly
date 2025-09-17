"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { wordList } from "@/constants/wordlist";
import { GAME } from "@/constants/constants";

export type LetterState = "correct" | "present" | "absent" | "unused";

type GameMode = "daily" | "random";

type KeyboardState = Record<string, Exclude<LetterState, "unused"> | undefined>;

export interface GameStoreState {
  // Core game state
  answer: string;
  guesses: string[]; // past submitted guesses
  evaluations: LetterState[][]; // per-guess evaluations
  currentGuess: string;
  currentRow: number;
  isRevealing: boolean;
  isGameOver: boolean;
  isWinner: boolean;
  invalidGuess: boolean;

  // Meta
  mode: GameMode;
  solutionId: string; // YYYY-MM-DD for daily or random seed id
  keyboard: KeyboardState; // letter -> best-known state
  score: number; // simple cumulative score like existing app

  // Actions
  startNewGame: (mode?: GameMode) => void;
  handleKey: (key: string) => void;
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitGuess: () => void;
  resetInvalid: () => void;
}

function normalize(word: string): string {
  return word.trim().toUpperCase();
}

function computeDailyIndex(date: Date): number {
  // Deterministic index based on UTC date
  const epoch = Date.UTC(2021, 5, 19); // Wordle epoch-ish (June 19, 2021)
  const dayMs = 24 * 60 * 60 * 1000;
  const today = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
  const day = Math.floor((today - epoch) / dayMs);
  return ((day % wordList.length) + wordList.length) % wordList.length;
}

function getDailyAnswer(): { answer: string; id: string } {
  const now = new Date();
  const index = computeDailyIndex(now);
  const ans = normalize(wordList[index].word);
  const id = now.toISOString().slice(0, 10); // YYYY-MM-DD
  return { answer: ans, id };
}

function getRandomAnswer(): { answer: string; id: string } {
  const index = Math.floor(Math.random() * wordList.length);
  const ans = normalize(wordList[index].word);
  const id = `rand-${Date.now()}`;
  return { answer: ans, id };
}

function isValidWord(word: string): boolean {
  const upper = normalize(word);
  return wordList.some((w) => normalize(w.word) === upper);
}

function evaluateGuess(answer: string, guess: string): LetterState[] {
  const a = answer.split("");
  const g = guess.split("");

  const result: LetterState[] = Array(g.length).fill("absent");

  // Count of letters in answer not yet matched
  const remainingCounts: Record<string, number> = {};

  // First pass: mark correct and tally remaining letters
  for (let i = 0; i < g.length; i++) {
    if (g[i] === a[i]) {
      result[i] = "correct";
    } else {
      const ch = a[i];
      remainingCounts[ch] = (remainingCounts[ch] ?? 0) + 1;
    }
  }

  // Second pass: mark present where counts remain
  for (let i = 0; i < g.length; i++) {
    if (result[i] === "correct") continue;
    const ch = g[i];
    const count = remainingCounts[ch] ?? 0;
    if (count > 0) {
      result[i] = "present";
      remainingCounts[ch] = count - 1;
    } else {
      result[i] = "absent";
    }
  }

  return result;
}

function mergeKeyboardState(
  prev: KeyboardState,
  guess: string,
  evals: LetterState[]
): KeyboardState {
  // Priority: correct > present > absent
  const priority: Record<Exclude<LetterState, "unused">, number> = {
    correct: 3,
    present: 2,
    absent: 1,
  };
  const next: KeyboardState = { ...prev };
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i];
    const newState = evals[i] as Exclude<LetterState, "unused">;
    const existing = next[letter];
    if (!existing || priority[newState] > priority[existing]) {
      next[letter] = newState;
    }
  }
  return next;
}

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      answer: "",
      guesses: [],
      evaluations: [],
      currentGuess: "",
      currentRow: 0,
      isRevealing: false,
      isGameOver: false,
      isWinner: false,
      invalidGuess: false,
      mode: "random",
      solutionId: "",
      keyboard: {},
      score: 0,

      startNewGame: (mode) => {
        const desiredMode = mode ?? get().mode ?? "random";
        const { answer, id } =
          desiredMode === "daily" ? getDailyAnswer() : getRandomAnswer();
        set({
          answer,
          solutionId: id,
          mode: desiredMode,
          guesses: [],
          evaluations: [],
          currentGuess: "",
          currentRow: 0,
          isRevealing: false,
          isGameOver: false,
          isWinner: false,
          invalidGuess: false,
          keyboard: {},
        });
      },

      addLetter: (letter) => {
        const { currentGuess, isGameOver } = get();
        if (isGameOver) return;
        if (!/^[a-zA-Z]$/.test(letter)) return;
        if (currentGuess.length >= GAME.WORD_LENGTH) return;
        set({
          currentGuess: (currentGuess + normalize(letter)).slice(
            0,
            GAME.WORD_LENGTH
          ),
          invalidGuess: false,
        });
      },

      removeLetter: () => {
        const { currentGuess, isGameOver } = get();
        if (isGameOver) return;
        if (currentGuess.length === 0) return;
        set({ currentGuess: currentGuess.slice(0, -1), invalidGuess: false });
      },

      submitGuess: () => {
        const { currentGuess, answer, guesses, isGameOver } = get();
        if (isGameOver) return;
        if (currentGuess.length !== GAME.WORD_LENGTH) {
          set({ invalidGuess: true });
          return;
        }
        // Allow any 5-letter guess to avoid overly strict dictionary blocks

        const guess = normalize(currentGuess);
        const evals = evaluateGuess(answer, guess);
        const nextGuesses = [...guesses, guess];
        const nextEvaluations = [...get().evaluations, evals];
        const isWinner = evals.every((s) => s === "correct");
        const isLast = nextGuesses.length >= GAME.MAX_ATTEMPTS;
        const gameOver = isWinner || isLast;
        const addedScore = isWinner
          ? GAME.POINTS_PER_ATTEMPT * (GAME.MAX_ATTEMPTS - nextGuesses.length)
          : 0;

        set({
          guesses: nextGuesses,
          evaluations: nextEvaluations,
          currentGuess: "",
          currentRow: get().currentRow + 1,
          isRevealing: true,
          isWinner,
          isGameOver: gameOver,
          invalidGuess: false,
          keyboard: mergeKeyboardState(get().keyboard, guess, evals),
          score: get().score + addedScore,
        });

        // End reveal after animation duration
        const revealMs = (GAME.REVEAL_TIME_MS || 350) * GAME.WORD_LENGTH;
        setTimeout(() => {
          // Avoid toggling if a new game started
          if (get().guesses.length === nextGuesses.length) {
            set({ isRevealing: false });
          }
        }, revealMs);
      },

      handleKey: (key) => {
        if (key === "Enter") {
          get().submitGuess();
          return;
        }
        if (key === "Backspace" || key === "Delete") {
          get().removeLetter();
          return;
        }
        if (/^[a-zA-Z]$/.test(key)) {
          get().addLetter(key);
        }
      },

      resetInvalid: () => set({ invalidGuess: false }),
    }),
    {
      name: "wordly-game", // persist basic game meta and score, not guesses
      partialize: (state) => ({
        mode: state.mode,
        solutionId: state.solutionId,
        score: state.score,
      }),
    }
  )
);

export function getShareText(
  state: Pick<
    GameStoreState,
    "isWinner" | "guesses" | "evaluations" | "mode" | "solutionId"
  >
) {
  const { isWinner, guesses, evaluations, mode, solutionId } = state;
  const header =
    mode === "daily"
      ? `Wordly ${solutionId} ${isWinner ? guesses.length : "X"}/6`
      : `Wordly ${isWinner ? guesses.length : "X"}/6`;
  const rows = evaluations
    .map((evalRow) =>
      evalRow
        .map((s) => (s === "correct" ? "🟩" : s === "present" ? "🟨" : "⬛"))
        .join("")
    )
    .join("\n");
  return `${header}\n${rows}`;
}
