"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GameBoard } from "@/components/GameBoard";
import { GameOverModal } from "@/components/GameOverModal";
import { GameHeader } from "@/components/GameHeader";
import StatsModal from "@/components/StatsModal";
import { LAYOUT, BUTTON } from "@/constants/constants";
import { useGameStore } from "@/stores/game-store";
import dynamic from "next/dynamic";

const OnscreenKeyboard = dynamic(
  () => import("@/components/keyboard/OnscreenKeyboard"),
  { ssr: false }
);

export default function WordlyMain() {
  const {
    score,
    guesses,
    isGameOver,
    isWinner,
    answer,
    handleKey,
    startNewGame,
  } = useGameStore();
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(false);

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

  // Handle game over state
  useEffect(() => {
    if (isGameOver) {
      setShowModal(true);
      const won = isWinner;
      const numGuesses = guesses.length;
      // Update stats API (edge runtime in-memory)
      fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ won, guesses: won ? numGuesses : 0 }),
      }).catch(() => {});
      // Persist lightweight score history
      try {
        const existing = JSON.parse(
          localStorage.getItem("wordly-scores") || "[]"
        );
        existing.push({
          score,
          attempts: numGuesses,
          word: answer,
          date: new Date().toISOString(),
        });
        localStorage.setItem("wordly-scores", JSON.stringify(existing));
      } catch {}
    }
  }, [isGameOver, isWinner, guesses.length, score, answer]);

  const handlePlayAgain = () => {
    setShowModal(false);
    startNewGame();
  };

  return (
    <div className={LAYOUT.container}>
      {/* Elegant header card */}
      <div className="card mb-8">
        <GameHeader />
      </div>

      {/* Main game area */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {/* Game board with beautiful card styling */}
        <div className="card-elevated p-8 mb-8">
          <GameBoard />

          {/* Attempts counter with elegant styling */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-neutral-100 rounded-full">
              <span className="text-sm font-medium text-neutral-600">
                Attempts:
              </span>
              <span className="ml-2 text-sm font-bold text-neutral-800">
                {guesses.length}/6
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
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Score History
          </Link>

          <button
            onClick={() => setShowStats(true)}
            className={`${BUTTON.accent} flex-1`}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Statistics
          </button>
        </div>

        <div className="mt-6 w-full max-w-md">
          <OnscreenKeyboard />
        </div>
      </main>

      <GameOverModal
        isWinner={isWinner}
        wordToGuess={answer}
        numGuesses={guesses.length}
        onPlayAgain={handlePlayAgain}
        isOpen={showModal}
      />

      <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} />
    </div>
  );
}
