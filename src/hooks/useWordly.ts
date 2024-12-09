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

  const handleLetterInput = useCallback(
    (key: string) => {
      if (state.currentGuess.length < CONSTANTS.WORD_LENGTH) {
        setState((prev) => ({
          ...prev,
          currentGuess: prev.currentGuess + key.toUpperCase(),
        }));
      }
    },
    [state.currentGuess]
  );

  const handleBackspace = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentGuess: prev.currentGuess.slice(0, -1),
    }));
  }, []);

  const updateGameState = useCallback(
    (isWinner: boolean, newAttempts: string[]) => {
      const isLastAttempt = newAttempts.length === CONSTANTS.MAX_ATTEMPTS;
      const gameOver = isWinner || isLastAttempt;

      setState((prev) => ({
        ...prev,
        attempts: newAttempts,
        currentGuess: "",
        currentRow: prev.currentRow + 1,
        isRevealing: true,
        isWinner,
        gameOver,
        score: isWinner
          ? prev.score + CONSTANTS.POINTS_PER_ATTEMPT
          : prev.score,
      }));

      const revealTime = gameOver
        ? 1500
        : CONSTANTS.REVEAL_TIME_MS * CONSTANTS.WORD_LENGTH;

      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isRevealing: false,
          ...(gameOver && { gameOver: true }),
        }));
      }, revealTime);
    },
    []
  );

  const handleEnter = useCallback(() => {
    if (state.currentGuess.length === CONSTANTS.WORD_LENGTH) {
      const isWinner = state.currentGuess === state.wordToGuess;
      const newAttempts = [...state.attempts, state.currentGuess];
      updateGameState(isWinner, newAttempts);
    }
  }, [state.currentGuess, state.attempts, state.wordToGuess, updateGameState]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (state.gameOver) return;

      if (/^[a-zA-Z]$/.test(key)) {
        handleLetterInput(key);
      } else if (key === "Backspace" && state.currentGuess.length > 0) {
        handleBackspace();
      } else if (key === "Enter") {
        handleEnter();
      }
    },
    [
      state.gameOver,
      state.currentGuess,
      handleLetterInput,
      handleBackspace,
      handleEnter,
    ]
  );

  return {
    state,
    handleKeyPress,
    startNewGame,
  };
};
