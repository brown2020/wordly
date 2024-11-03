// WordlyMain.tsx
"use client";

import { useEffect, useState } from "react";
import { GameBoard } from "@/components/GameBoard";
import { GameOverModal } from "@/components/GameOverModal";
import { useWordly } from "@/hooks/useWordly";
import { STYLES } from "@/constants/constants";

export default function WordlyMain() {
  const { state, handleKeyPress, startNewGame } = useWordly();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyPress(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  useEffect(() => {
    if (state.gameOver) {
      setShowModal(true); // Show modal when game ends
    }
  }, [state.gameOver]);

  const handlePlayAgain = () => {
    setShowModal(false);
    startNewGame(); // Start a new game only after closing the modal
  };

  return (
    <div className={STYLES.LAYOUT.CONTAINER}>
      <header className="flex justify-between items-center p-5 border-b">
        <h1 className="text-2xl font-bold">Wordly</h1>
        <div className="text-sm">
          Score: <span className="font-bold">{state.score}</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <GameBoard state={state} />

        <div className="mt-4 text-sm text-gray-600">
          Attempts: {state.attempts.length}/6
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <GameOverModal
          isWinner={state.isWinner}
          wordToGuess={state.wordToGuess}
          numGuesses={state.attempts.length}
          onPlayAgain={handlePlayAgain} // Start new game after modal closes
        />
      )}
    </div>
  );
}
