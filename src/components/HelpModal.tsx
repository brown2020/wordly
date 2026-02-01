"use client";

import { FC } from "react";
import { Modal } from "./ui/Modal";
import { useSettingsStore } from "@/stores/settings-store";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const highContrastMode = useSettingsStore((s) => s.highContrastMode);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How To Play">
      <div className="space-y-4">
        <p className="text-neutral-700 dark:text-neutral-300">
          Guess the <strong>WORDLY</strong> in 6 tries.
        </p>

        <ul className="list-disc list-inside space-y-2 text-neutral-700 dark:text-neutral-300">
          <li>Each guess must be a valid 5-letter word.</li>
          <li>
            The color of the tiles will change to show how close your guess was
            to the word.
          </li>
        </ul>

        <hr className="border-neutral-200 dark:border-neutral-700" />

        <p className="font-bold text-neutral-900 dark:text-white">Examples</p>

        {/* Example 1: Correct */}
        <div className="space-y-2">
          <div className="flex gap-1">
            <ExampleTile letter="W" state="correct" highContrast={highContrastMode} />
            <ExampleTile letter="E" state="empty" />
            <ExampleTile letter="A" state="empty" />
            <ExampleTile letter="R" state="empty" />
            <ExampleTile letter="Y" state="empty" />
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            <strong>W</strong> is in the word and in the correct spot.
          </p>
        </div>

        {/* Example 2: Present */}
        <div className="space-y-2">
          <div className="flex gap-1">
            <ExampleTile letter="P" state="empty" />
            <ExampleTile letter="I" state="present" highContrast={highContrastMode} />
            <ExampleTile letter="L" state="empty" />
            <ExampleTile letter="L" state="empty" />
            <ExampleTile letter="S" state="empty" />
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            <strong>I</strong> is in the word but in the wrong spot.
          </p>
        </div>

        {/* Example 3: Absent */}
        <div className="space-y-2">
          <div className="flex gap-1">
            <ExampleTile letter="V" state="empty" />
            <ExampleTile letter="A" state="empty" />
            <ExampleTile letter="G" state="empty" />
            <ExampleTile letter="U" state="absent" />
            <ExampleTile letter="E" state="empty" />
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            <strong>U</strong> is not in the word in any spot.
          </p>
        </div>

        <hr className="border-neutral-200 dark:border-neutral-700" />

        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          A new puzzle is available each day!
        </p>
      </div>
    </Modal>
  );
};

interface ExampleTileProps {
  letter: string;
  state: "correct" | "present" | "absent" | "empty";
  highContrast?: boolean;
}

const ExampleTile: FC<ExampleTileProps> = ({ letter, state, highContrast = false }) => {
  const baseClasses =
    "w-10 h-10 flex items-center justify-center text-lg font-bold uppercase border-2";

  const stateClasses = {
    empty: "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white",
    correct: highContrast
      ? "bg-orange-500 border-orange-500 text-white"
      : "bg-green-600 border-green-600 text-white",
    present: highContrast
      ? "bg-cyan-500 border-cyan-500 text-white"
      : "bg-yellow-500 border-yellow-500 text-white",
    absent: "bg-neutral-500 border-neutral-500 text-white",
  };

  return (
    <div className={`${baseClasses} ${stateClasses[state]}`}>{letter}</div>
  );
};

export default HelpModal;
