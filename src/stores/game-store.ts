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
} from "@/utils/game-utils";

type GameMode = "daily" | "random";

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
