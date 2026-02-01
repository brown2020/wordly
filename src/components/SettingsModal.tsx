"use client";

import { FC } from "react";
import { Modal } from "./ui/Modal";
import { useSettingsStore } from "@/stores/settings-store";
import { useGameStore } from "@/stores/game-store";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { hardMode, darkMode, highContrastMode, toggleHardMode, toggleDarkMode, toggleHighContrastMode } =
    useSettingsStore();
  const gameInProgress = useGameStore((s) => s.gameInProgress);
  const mode = useGameStore((s) => s.mode);
  const startNewGame = useGameStore((s) => s.startNewGame);

  const handleModeChange = (newMode: "daily" | "random") => {
    if (newMode !== mode) {
      startNewGame(newMode);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-6">
        {/* Game Mode */}
        <SettingRow
          title="Game Mode"
          description="Switch between Daily puzzle and Random practice"
        >
          <div className="flex gap-2">
            <button
              onClick={() => handleModeChange("daily")}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                mode === "daily"
                  ? "bg-neutral-800 text-white dark:bg-white dark:text-neutral-800"
                  : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => handleModeChange("random")}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                mode === "random"
                  ? "bg-neutral-800 text-white dark:bg-white dark:text-neutral-800"
                  : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300"
              }`}
            >
              Random
            </button>
          </div>
        </SettingRow>

        <hr className="border-neutral-200 dark:border-neutral-700" />

        {/* Hard Mode */}
        <SettingRow
          title="Hard Mode"
          description="Any revealed hints must be used in subsequent guesses"
        >
          <ToggleSwitch
            enabled={hardMode}
            onToggle={toggleHardMode}
            disabled={gameInProgress && !hardMode}
          />
        </SettingRow>
        {gameInProgress && !hardMode && (
          <p className="text-xs text-neutral-500 -mt-4">
            Hard Mode can only be enabled at the start of a round
          </p>
        )}

        <hr className="border-neutral-200 dark:border-neutral-700" />

        {/* Dark Theme */}
        <SettingRow title="Dark Theme" description="Toggle dark mode appearance">
          <ToggleSwitch enabled={darkMode} onToggle={toggleDarkMode} />
        </SettingRow>

        <hr className="border-neutral-200 dark:border-neutral-700" />

        {/* High Contrast Mode */}
        <SettingRow
          title="High Contrast Mode"
          description="For improved color vision"
        >
          <ToggleSwitch
            enabled={highContrastMode}
            onToggle={toggleHighContrastMode}
          />
        </SettingRow>
      </div>
    </Modal>
  );
};

interface SettingRowProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingRow: FC<SettingRowProps> = ({ title, description, children }) => (
  <div className="flex items-center justify-between">
    <div className="flex-1 pr-4">
      <h3 className="font-medium text-neutral-900 dark:text-white">{title}</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
    </div>
    {children}
  </div>
);

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({
  enabled,
  onToggle,
  disabled = false,
}) => (
  <button
    onClick={onToggle}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      disabled
        ? "bg-neutral-200 dark:bg-neutral-700 cursor-not-allowed opacity-50"
        : enabled
        ? "bg-green-500"
        : "bg-neutral-300 dark:bg-neutral-600"
    }`}
    role="switch"
    aria-checked={enabled}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

export default SettingsModal;
