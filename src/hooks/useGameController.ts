import { useEffect, useState } from "react";
import { useGameStore } from "@/stores/game-store";
import { useGameStats } from "./useGameStats";

export function useGameController() {
  const {
    guesses,
    isGameOver,
    isWinner,
    answer,
    handleKey,
    startNewGame,
  } = useGameStore();
  
  const [showModal, setShowModal] = useState(false);

  // Handle stats persistence
  useGameStats();

  // Handle keyboard input
  useEffect(() => {
    // Ensure a game is initialized (random by default)
    if (!answer) {
      startNewGame("random");
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      handleKey(event.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKey, answer, startNewGame]);

  // Handle game over modal
  useEffect(() => {
    if (isGameOver) {
      // Small delay to allow reveal animation to finish or just for UX
      const timer = setTimeout(() => setShowModal(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [isGameOver]);

  const handlePlayAgain = () => {
    setShowModal(false);
    startNewGame();
  };

  return {
    showModal,
    setShowModal,
    handlePlayAgain,
    guesses,
    isWinner,
    answer,
  };
}
