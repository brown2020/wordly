// WordlyMain.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { GameBoard } from "@/components/GameBoard";
import { GameOverModal } from "@/components/GameOverModal";
import { GameHeader } from "@/components/GameHeader";
import { useWordly } from "@/hooks/useWordly";
import { useKeyboardInput } from "@/hooks/useKeyboardInput";
import { STYLES } from "@/constants/constants";

export default function WordlyMain() {
  const { state, handleKeyPress, startNewGame } = useWordly();
  const [showModal, setShowModal] = useState(false);
  const startNewGameRef = useRef(startNewGame);

  // Update the ref when startNewGame changes
  useEffect(() => {
    startNewGameRef.current = startNewGame;
  }, [startNewGame]);

  // Initialize game only once when component mounts
  useEffect(() => {
    startNewGameRef.current();
    // Empty dependency array ensures this only runs once on mount
  }, []);

  // Handle keyboard input
  useKeyboardInput(handleKeyPress);

  // Handle game over state
  useEffect(() => {
    if (state.gameOver) {
      setShowModal(true);
    }
  }, [state.gameOver]);

  const handlePlayAgain = useCallback(() => {
    setShowModal(false);
    startNewGame();
  }, [startNewGame]);

  return (
    <div className={STYLES.LAYOUT.CONTAINER}>
      <GameHeader score={state.score} />

      <main className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <GameBoard state={state} />
        <div className="mt-4 text-sm text-gray-600">
          Attempts: {state.attempts.length}/6
        </div>
      </main>

      <GameOverModal
        isWinner={state.isWinner}
        wordToGuess={state.wordToGuess}
        numGuesses={state.attempts.length}
        onPlayAgain={handlePlayAgain}
        isOpen={showModal}
      />
    </div>
  );
}
