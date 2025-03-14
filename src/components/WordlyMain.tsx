// WordlyMain.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { GameBoard } from "@/components/GameBoard";
import { GameOverModal } from "@/components/GameOverModal";
import { GameHeader } from "@/components/GameHeader";
import StatsModal from "@/components/StatsModal";
import { useWordly } from "@/hooks/useWordly";
import { useScores } from "@/hooks/useScores";
import { useKeyboardInput } from "@/hooks/useKeyboardInput";
import { STYLES } from "@/constants/constants";

export default function WordlyMain() {
  const { state, handleKeyPress, startNewGame } = useWordly();
  const { saveScore } = useScores();
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
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

      // Save score when game is over
      if (state.isWinner) {
        saveScore(state.score, state.attempts.length, state.wordToGuess);

        // Update stats API
        fetch("/api/stats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            won: true,
            guesses: state.attempts.length,
          }),
        }).catch((error) => {
          console.error("Error updating stats:", error);
        });
      } else {
        // Update stats API for loss
        fetch("/api/stats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            won: false,
            guesses: 0,
          }),
        }).catch((error) => {
          console.error("Error updating stats:", error);
        });
      }
    }
  }, [
    state.gameOver,
    state.isWinner,
    state.score,
    state.attempts.length,
    state.wordToGuess,
    saveScore,
  ]);

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

        <div className="mt-6 flex space-x-4">
          <Link
            href="/scores"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Score History
          </Link>

          <button
            onClick={() => setShowStats(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            View Statistics
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
