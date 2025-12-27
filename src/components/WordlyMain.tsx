"use client";

import { useState } from "react";
import { GameBoard } from "@/components/GameBoard";
import { GameOverModal } from "@/components/GameOverModal";
import { GameHeader } from "@/components/GameHeader";
import StatsModal from "@/components/StatsModal";
import { GAME, LAYOUT } from "@/constants/constants";
import dynamic from "next/dynamic";
import { useGameController } from "@/hooks/useGameController";
import { AttemptsCounter } from "@/components/AttemptsCounter";
import { GameControls } from "@/components/GameControls";

const OnscreenKeyboard = dynamic(
  () => import("@/components/keyboard/OnscreenKeyboard"),
  { ssr: false }
);

export default function WordlyMain() {
  const { showModal, handlePlayAgain, guesses, isWinner, answer } =
    useGameController();

  const [showStats, setShowStats] = useState(false);

  return (
    <div className={LAYOUT.container}>
      {/* Wordle-like frame: header top, board centered, keyboard bottom */}
      <div className="sticky top-0 z-20 -mx-2 sm:-mx-4 border-b border-neutral-200/70 bg-white/80 px-2 backdrop-blur-sm sm:px-4">
        <GameHeader />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center py-3">
        <div className="flex flex-col items-center gap-3">
          <GameBoard />
          <AttemptsCounter
            attempts={guesses.length}
            maxAttempts={GAME.MAX_ATTEMPTS}
          />
        </div>
      </main>

      <footer className="pt-2 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="w-full">
          <OnscreenKeyboard />
          <div className="mt-3">
            <GameControls onShowStats={() => setShowStats(true)} />
          </div>
        </div>
      </footer>

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
