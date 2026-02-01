"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GAME } from "@/constants/constants";
import { LetterState, KeyboardState } from "@/types/types";
import {
  normalize,
  getDailyAnswer,
  getRandomAnswer,
  evaluateGuess,
  mergeKeyboardState,
  isValidWord,
  validateHardMode,
} from "@/utils/game-utils";

type GameMode = "daily" | "random";

export type InvalidReason = "not_word" | "hard_mode" | "too_short" | null;

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
  invalidReason: InvalidReason;
  invalidMessage: string;

  // Meta
  mode: GameMode;
  solutionId: string; // YYYY-MM-DD for daily or random seed id
  keyboard: KeyboardState; // letter -> best-known state
  gameInProgress: boolean; // whether a game has been started (for hard mode lock)

  // Actions
  startNewGame: (mode?: GameMode) => void;
  handleKey: (key: string, hardMode?: boolean) => void;
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitGuess: (hardMode?: boolean) => void;
  resetInvalid: () => void;
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
      invalidReason: null,
      invalidMessage: "",
      mode: "daily",
      solutionId: "",
      keyboard: {},
      gameInProgress: false,

      startNewGame: (mode) => {
        const desiredMode = mode ?? get().mode ?? "daily";
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
          invalidReason: null,
          invalidMessage: "",
          keyboard: {},
          gameInProgress: false,
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
          invalidReason: null,
          invalidMessage: "",
        });
      },

      removeLetter: () => {
        const { currentGuess, isGameOver } = get();
        if (isGameOver) return;
        if (currentGuess.length === 0) return;
        set({
          currentGuess: currentGuess.slice(0, -1),
          invalidGuess: false,
          invalidReason: null,
          invalidMessage: "",
        });
      },

      submitGuess: (hardMode = false) => {
        const { currentGuess, answer, guesses, evaluations, isGameOver } = get();
        if (isGameOver) return;

        // Check word length
        if (currentGuess.length !== GAME.WORD_LENGTH) {
          set({
            invalidGuess: true,
            invalidReason: "too_short",
            invalidMessage: "Not enough letters",
          });
          return;
        }

        const guess = normalize(currentGuess);

        // Validate against dictionary
        if (!isValidWord(guess)) {
          set({
            invalidGuess: true,
            invalidReason: "not_word",
            invalidMessage: "Not in word list",
          });
          return;
        }

        // Validate hard mode rules
        if (hardMode && guesses.length > 0) {
          const hardModeError = validateHardMode(guess, guesses, evaluations);
          if (hardModeError) {
            set({
              invalidGuess: true,
              invalidReason: "hard_mode",
              invalidMessage: hardModeError,
            });
            return;
          }
        }

        const evals = evaluateGuess(answer, guess);
        const nextGuesses = [...guesses, guess];
        const nextEvaluations = [...evaluations, evals];
        const isWinner = evals.every((s) => s === "correct");
        const isLast = nextGuesses.length >= GAME.MAX_ATTEMPTS;
        const gameOver = isWinner || isLast;

        set({
          guesses: nextGuesses,
          evaluations: nextEvaluations,
          currentGuess: "",
          currentRow: get().currentRow + 1,
          isRevealing: true,
          isWinner,
          isGameOver: gameOver,
          invalidGuess: false,
          invalidReason: null,
          invalidMessage: "",
          keyboard: mergeKeyboardState(get().keyboard, guess, evals),
          gameInProgress: true,
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

      handleKey: (key, hardMode = false) => {
        if (key === "Enter") {
          get().submitGuess(hardMode);
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

      resetInvalid: () =>
        set({ invalidGuess: false, invalidReason: null, invalidMessage: "" }),
    }),
    {
      name: "wordly-game",
      partialize: (state) => ({
        mode: state.mode,
        solutionId: state.solutionId,
      }),
    }
  )
);
