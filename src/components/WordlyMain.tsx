// WordlyMain.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GameBoard } from "@/components/GameBoard";
import { GameOverModal } from "@/components/GameOverModal";
import { GameHeader } from "@/components/GameHeader";
import StatsModal from "@/components/StatsModal";
import { useGame } from "@/contexts/GameContext";
import { LAYOUT, BUTTON } from "@/constants/constants";

export default function WordlyMain() {
  const { state, handleKeyPress, startNewGame, saveScore } = useGame();
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleKeyPress(event.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  // Handle game over state
  useEffect(() => {
    if (state.gameOver) {
      setShowModal(true);

      // Save score when game is won
      if (state.isWinner) {
        saveScore(state.score, state.attempts.length, state.wordToGuess);

        // Update stats API
        fetch("/api/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            won: true,
            guesses: state.attempts.length,
          }),
        }).catch((error) => console.error("Error updating stats:", error));
      } else {
        // Update stats API for loss
        fetch("/api/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            won: false,
            guesses: 0,
          }),
        }).catch((error) => console.error("Error updating stats:", error));
      }
    }
  }, [state.gameOver, state.isWinner, state.score, state.attempts.length, state.wordToGuess, saveScore]);

  const handlePlayAgain = () => {
    setShowModal(false);
    startNewGame();
  };

  return (
    <div className={LAYOUT.container}>
      {/* Elegant header card */}
      <div className="card mb-8">
        <GameHeader score={state.score} />
      </div>

      {/* Main game area */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {/* Game board with beautiful card styling */}
        <div className="card-elevated p-8 mb-8">
          <GameBoard state={state} />
          
          {/* Attempts counter with elegant styling */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-neutral-100 rounded-full">
              <span className="text-sm font-medium text-neutral-600">
                Attempts: 
              </span>
              <span className="ml-2 text-sm font-bold text-neutral-800">
                {state.attempts.length}/6
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons with beautiful styling */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link
            href="/scores"
            className={`${BUTTON.secondary} flex-1 text-center`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Score History
          </Link>

          <button
            onClick={() => setShowStats(true)}
            className={`${BUTTON.accent} flex-1`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Statistics
          </button>
        </div>
      </main>

      <GameOverModal
        isWinner={state.isWinner}
        wordToGuess={state.wordToGuess}
        numGuesses={state.attempts.length}
        onPlayAgain={handlePlayAgain}
        isOpen={showModal}
      />

      <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} />
    </div>
  );
}
