// useWordly.ts
import { useState, useCallback, useRef } from "react";
import { wordList } from "../constants/wordlist";
import { GameState } from "../types/types";
import { CONSTANTS } from "../constants/constants";

const initialState: GameState = {
  wordToGuess: "",
  currentGuess: "",
  attempts: [],
  gameOver: false,
  isWinner: false,
  score: 0,
  difficulty: CONSTANTS.DIFFICULTY_LEVELS.EASY,
  currentRow: 0,
  isRevealing: false,
  invalidGuess: false,
};

export const useWordly = () => {
  const [state, setState] = useState<GameState>(initialState);
  // Use a ref to track active timeouts to prevent race conditions
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const invalidGuessTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startNewGame = useCallback(() => {
    // Clear any pending timeouts to prevent race conditions
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (invalidGuessTimeoutRef.current) {
      clearTimeout(invalidGuessTimeoutRef.current);
      invalidGuessTimeoutRef.current = null;
    }

    const words = wordList.filter((w) => w.difficulty === state.difficulty);
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const wordToGuess = randomWord.word.toUpperCase();

    setState({
      ...initialState,
      wordToGuess,
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
          invalidGuess: false, // Clear invalid state when typing
        }));
      }
    },
    [state.currentGuess]
  );

  const handleBackspace = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentGuess: prev.currentGuess.slice(0, -1),
      invalidGuess: false, // Clear invalid state when typing
    }));
  }, []);

  const updateGameState = useCallback(
    (isWinner: boolean, newAttempts: string[]) => {
      const isLastAttempt = newAttempts.length === CONSTANTS.MAX_ATTEMPTS;
      const gameOver = isWinner || isLastAttempt;

      // Calculate score based on number of attempts
      // Fewer attempts = more points
      const attemptBonus = isWinner
        ? CONSTANTS.POINTS_PER_ATTEMPT *
          (CONSTANTS.MAX_ATTEMPTS - newAttempts.length + 1)
        : 0;

      setState((prev) => ({
        ...prev,
        attempts: newAttempts,
        currentGuess: "",
        currentRow: prev.currentRow + 1,
        isRevealing: true,
        isWinner,
        gameOver,
        score: prev.score + attemptBonus,
        invalidGuess: false, // Clear any invalid state
      }));

      const revealTime = gameOver
        ? 1500
        : CONSTANTS.REVEAL_TIME_MS * CONSTANTS.WORD_LENGTH;

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Store the new timeout reference
      timeoutRef.current = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isRevealing: false,
          gameOver: prev.gameOver, // Keep existing gameOver state
        }));
        timeoutRef.current = null;
      }, revealTime);
    },
    []
  );

  const handleEnter = useCallback(() => {
    if (state.currentGuess.length === CONSTANTS.WORD_LENGTH) {
      // For now, accept any 5-letter word to ensure the game works
      // In a production environment, you would want to validate against a dictionary

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
