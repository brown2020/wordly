import { useEffect, useState } from "react";
import { useGameStore } from "@/stores/game-store";
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

  // Restore a persisted game before starting a new one. Hydration is async.
  useEffect(() => {
    let cancelled = false;
    const startIfNeeded = () => {
      if (cancelled) return;
      if (!useGameStore.getState().answer) {
        useGameStore.getState().startNewGame();
      }
    };

    const unsub = useGameStore.persist.onFinishHydration(startIfNeeded);
    if (useGameStore.persist.hasHydrated()) {
      startIfNeeded();
    }
    return () => {
      cancelled = true;
      unsub();
    };
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
