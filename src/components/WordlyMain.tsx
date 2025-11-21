"use client";

import { useState } from "react";
import { GameBoard } from "@/components/GameBoard";
import { GameOverModal } from "@/components/GameOverModal";
import { GameHeader } from "@/components/GameHeader";
import StatsModal from "@/components/StatsModal";
import { LAYOUT } from "@/constants/constants";
import dynamic from "next/dynamic";
import { useGameController } from "@/hooks/useGameController";
import { AttemptsCounter } from "@/components/AttemptsCounter";
import { GameControls } from "@/components/GameControls";

const OnscreenKeyboard = dynamic(
  () => import("@/components/keyboard/OnscreenKeyboard"),
  { ssr: false }
);

export default function WordlyMain() {
  const {
    showModal,
    setShowModal,
    handlePlayAgain,
    guesses,
    isWinner,
    answer,
  } = useGameController();

  const [showStats, setShowStats] = useState(false);

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
          <AttemptsCounter attempts={guesses.length} maxAttempts={6} />
        </div>

        {/* Action buttons with beautiful styling */}
        <GameControls onShowStats={() => setShowStats(true)} />

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
