import { useEffect, useState } from "react";
import { useGameStore } from "@/stores/game-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useGameStats } from "./useGameStats";
import { useShallow } from "zustand/shallow";

export function useGameController() {
  const { guesses, isGameOver, isWinner, answer, startNewGame } = useGameStore(
    useShallow((s) => ({
      guesses: s.guesses,
      isGameOver: s.isGameOver,
      isWinner: s.isWinner,
      answer: s.answer,
      startNewGame: s.startNewGame,
    }))
  );

  const [showModal, setShowModal] = useState(false);

  // Handle stats persistence
  useGameStats();

  // Handle keyboard input
  useEffect(() => {
    // Ensure a game is initialized (use persisted mode when available)
    if (!useGameStore.getState().answer) {
      useGameStore.getState().startNewGame();
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      const hardMode = useSettingsStore.getState().hardMode;
      useGameStore.getState().handleKey(event.key, hardMode);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const closeModal = () => {
    setShowModal(false);
  };

  return {
    showModal,
    handlePlayAgain,
    closeModal,
    guesses,
    isWinner,
    answer,
  };
}
