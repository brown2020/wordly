// useWordly.ts
import { useState, useCallback } from "react";
import { wordList } from "../constants/wordlist";
import { GameState } from "../types/types";
import { CONSTANTS } from "../constants/constants";

const initialState: GameState = {
  wordToGuess: "",
  currentGuess: "",
  attempts: [],
  gameOver: false,
  isWinner: false, // Add isWinner to track win status
  score: 0,
  difficulty: CONSTANTS.DIFFICULTY_LEVELS.EASY,
  currentRow: 0,
  isRevealing: false,
};

export const useWordly = () => {
  const [state, setState] = useState<GameState>(initialState);

  const startNewGame = useCallback(() => {
    const words = wordList.filter((w) => w.difficulty === state.difficulty);
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setState({
      ...initialState,
      wordToGuess: randomWord.word.toUpperCase(),
      score: state.score,
      difficulty: state.difficulty,
    });
  }, [state.difficulty, state.score]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (state.gameOver) return;

      if (
        /^[a-zA-Z]$/.test(key) &&
        state.currentGuess.length < CONSTANTS.WORD_LENGTH
      ) {
        setState((prev) => ({
          ...prev,
          currentGuess: prev.currentGuess + key.toUpperCase(),
        }));
        return;
      }

      if (key === "Backspace" && state.currentGuess.length > 0) {
        setState((prev) => ({
          ...prev,
          currentGuess: prev.currentGuess.slice(0, -1),
        }));
        return;
      }

      if (
        key === "Enter" &&
        state.currentGuess.length === CONSTANTS.WORD_LENGTH
      ) {
        const isWinner = state.currentGuess === state.wordToGuess;
        const newAttempts = [...state.attempts, state.currentGuess];
        const isLastAttempt = newAttempts.length === CONSTANTS.MAX_ATTEMPTS;

        setState((prev) => ({
          ...prev,
          attempts: newAttempts,
          currentGuess: "",
          currentRow: prev.currentRow + 1,
          isRevealing: true,
          isWinner, // Update isWinner based on the outcome
          gameOver: isWinner || isLastAttempt,
          score: isWinner
            ? prev.score + CONSTANTS.POINTS_PER_ATTEMPT
            : prev.score,
        }));

        if (isWinner || isLastAttempt) {
          setTimeout(() => {
            setState((prev) => ({
              ...prev,
              isRevealing: false,
              gameOver: true,
            }));
          }, 1500);
        } else {
          setTimeout(() => {
            setState((prev) => ({
              ...prev,
              isRevealing: false,
            }));
          }, CONSTANTS.REVEAL_TIME_MS * CONSTANTS.WORD_LENGTH);
        }
      }
    },
    [state.currentGuess, state.attempts, state.wordToGuess, state.gameOver]
  );

  return {
    state,
    handleKeyPress,
    startNewGame,
  };
};
