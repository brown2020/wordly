"use client";

import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from "react";
import { wordList } from "@/constants/wordlist";
import { GAME } from "@/constants/constants";
import { GameState } from "@/types/types";

// Simplified game state
const initialState: GameState = {
  wordToGuess: "",
  currentGuess: "",
  attempts: [],
  gameOver: false,
  isWinner: false,
  score: 0,
  currentRow: 0,
  isRevealing: false,
  invalidGuess: false,
};

// Action types for reducer
type GameAction =
  | { type: "START_NEW_GAME"; wordToGuess: string }
  | { type: "ADD_LETTER"; letter: string }
  | { type: "REMOVE_LETTER" }
  | { type: "SUBMIT_GUESS" }
  | { type: "SET_REVEALING"; isRevealing: boolean }
  | { type: "GAME_OVER"; isWinner: boolean; score: number }
  | { type: "CLEAR_INVALID" };

// Game reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_NEW_GAME":
      return {
        ...initialState,
        wordToGuess: action.wordToGuess,
        score: state.score, // Preserve total score
      };

    case "ADD_LETTER":
      if (state.currentGuess.length < GAME.WORD_LENGTH) {
        return {
          ...state,
          currentGuess: state.currentGuess + action.letter.toUpperCase(),
          invalidGuess: false,
        };
      }
      return state;

    case "REMOVE_LETTER":
      return {
        ...state,
        currentGuess: state.currentGuess.slice(0, -1),
        invalidGuess: false,
      };

    case "SUBMIT_GUESS":
      const isWinner = state.currentGuess === state.wordToGuess;
      const newAttempts = [...state.attempts, state.currentGuess];
      const isLastAttempt = newAttempts.length === GAME.MAX_ATTEMPTS;
      const gameOver = isWinner || isLastAttempt;

      return {
        ...state,
        attempts: newAttempts,
        currentGuess: "",
        currentRow: state.currentRow + 1,
        isRevealing: true,
        isWinner,
        gameOver,
        invalidGuess: false,
      };

    case "SET_REVEALING":
      return {
        ...state,
        isRevealing: action.isRevealing,
      };

    case "GAME_OVER":
      return {
        ...state,
        gameOver: true,
        isWinner: action.isWinner,
        score: state.score + action.score,
      };

    case "CLEAR_INVALID":
      return {
        ...state,
        invalidGuess: false,
      };

    default:
      return state;
  }
}

// Context type
interface GameContextType {
  state: GameState;
  startNewGame: () => void;
  handleKeyPress: (key: string) => void;
  saveScore: (score: number, attempts: number, word: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Start new game
  const startNewGame = useCallback(() => {
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    dispatch({ type: "START_NEW_GAME", wordToGuess: randomWord.word.toUpperCase() });
  }, []);

  // Handle keyboard input
  const handleKeyPress = useCallback((key: string) => {
    if (state.gameOver) return;

    if (/^[a-zA-Z]$/.test(key)) {
      dispatch({ type: "ADD_LETTER", letter: key });
    } else if (key === "Backspace" && state.currentGuess.length > 0) {
      dispatch({ type: "REMOVE_LETTER" });
    } else if (key === "Enter" && state.currentGuess.length === GAME.WORD_LENGTH) {
      dispatch({ type: "SUBMIT_GUESS" });
    }
  }, [state.gameOver, state.currentGuess.length]);

  // Save score to localStorage
  const saveScore = useCallback((score: number, attempts: number, word: string) => {
    try {
      const scores = JSON.parse(localStorage.getItem("wordly-scores") || "[]");
      const newScore = {
        score,
        attempts,
        word,
        date: new Date().toISOString(),
      };
      scores.push(newScore);
      localStorage.setItem("wordly-scores", JSON.stringify(scores));
    } catch (error) {
      console.error("Error saving score:", error);
    }
  }, []);

  // Handle revealing animation
  useEffect(() => {
    if (state.isRevealing) {
      const revealTime = state.gameOver ? 1500 : GAME.REVEAL_TIME_MS * GAME.WORD_LENGTH;
      
      timeoutRef.current = setTimeout(() => {
        dispatch({ type: "SET_REVEALING", isRevealing: false });
        
        // Calculate and add score if game is won
        if (state.isWinner && state.gameOver) {
          const attemptBonus = GAME.POINTS_PER_ATTEMPT * (GAME.MAX_ATTEMPTS - state.attempts.length);
          dispatch({ type: "GAME_OVER", isWinner: true, score: attemptBonus });
        }
      }, revealTime);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state.isRevealing, state.gameOver, state.isWinner, state.attempts.length]);

  // Initialize game on mount
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const value = {
    state,
    startNewGame,
    handleKeyPress,
    saveScore,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Custom hook to use the game context
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
