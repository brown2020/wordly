"use client";

import { useState, useEffect } from "react";
import { GameBoard } from "@/components/GameBoard";
import { GameOverModal } from "@/components/GameOverModal";
import { GameHeader } from "@/components/GameHeader";
import StatsModal from "@/components/StatsModal";
import SettingsModal from "@/components/SettingsModal";
import HelpModal from "@/components/HelpModal";
import ArchiveModal from "@/components/ArchiveModal";
import { Toast } from "@/components/ui/Toast";
import { LAYOUT } from "@/constants/constants";
import dynamic from "next/dynamic";
import { useGameController } from "@/hooks/useGameController";
import { useGameStore } from "@/stores/game-store";
import { useSettingsStore } from "@/stores/settings-store";

const OnscreenKeyboard = dynamic(
  () => import("@/components/keyboard/OnscreenKeyboard"),
  { ssr: false }
);

export default function WordlyMain() {
  const { showModal, handlePlayAgain, closeModal, guesses, isWinner, answer } =
    useGameController();

  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  // Get toast message from game store
  const invalidMessage = useGameStore((s) => s.invalidMessage);
  const invalidGuess = useGameStore((s) => s.invalidGuess);
  const resetInvalid = useGameStore((s) => s.resetInvalid);

  // Get dark mode setting
  const darkMode = useSettingsStore((s) => s.darkMode);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Show help on first visit
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem("wordly-seen-help");
    if (!hasSeenHelp) {
      setShowHelp(true);
      localStorage.setItem("wordly-seen-help", "true");
    }
  }, []);

  return (
    <div className={LAYOUT.container}>
      {/* Toast for validation messages */}
      <Toast
        message={invalidMessage}
        isVisible={invalidGuess && !!invalidMessage}
        onHide={resetInvalid}
      />

      {/* Header with icons */}
      <div className="sticky top-0 z-20 -mx-2 sm:-mx-4 border-b border-neutral-200 dark:border-neutral-700 bg-white/95 dark:bg-neutral-900/95 px-2 backdrop-blur-sm sm:px-4">
        <GameHeader
          onShowHelp={() => setShowHelp(true)}
          onShowStats={() => setShowStats(true)}
          onShowSettings={() => setShowSettings(true)}
          onShowArchive={() => setShowArchive(true)}
        />
      </div>

      {/* Game board */}
      <main className="flex flex-1 flex-col items-center justify-center py-4">
        <GameBoard />
      </main>

      {/* Keyboard */}
      <footer className="pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        <OnscreenKeyboard />
      </footer>

      {/* Modals */}
      <GameOverModal
        isWinner={isWinner}
        wordToGuess={answer}
        numGuesses={guesses.length}
        onPlayAgain={handlePlayAgain}
        onClose={closeModal}
        isOpen={showModal}
      />

      <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} />
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <ArchiveModal isOpen={showArchive} onClose={() => setShowArchive(false)} />
    </div>
  );
}
