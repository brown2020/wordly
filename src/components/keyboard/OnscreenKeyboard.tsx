"use client";

import { useGameStore } from "@/stores/game-store";

const ROWS = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  ["Enter", ..."ZXCVBNM".split(""), "Back"],
];

const keyStyle = (k: string, state?: string) => {
  const base =
    "px-2 sm:px-3 py-3 rounded-md text-sm sm:text-base font-semibold select-none";
  const map: Record<string, string> = {
    correct: "bg-emerald-600 text-white",
    present: "bg-amber-500 text-white",
    absent: "bg-neutral-500 text-white",
  };
  if (k === "Enter" || k === "Back")
    return `${base} bg-neutral-200 hover:bg-neutral-300`;
  return `${base} ${
    state
      ? map[state] ?? "bg-neutral-300"
      : "bg-neutral-200 hover:bg-neutral-300"
  }`;
};

export default function OnscreenKeyboard() {
  const handleKey = useGameStore((s) => s.handleKey);
  const keyboard = useGameStore((s) => s.keyboard);
  return (
    <div className="flex flex-col items-center gap-2">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-1">
          {row.map((k) => (
            <button
              key={k}
              className={keyStyle(k, keyboard[k])}
              onClick={() => handleKey(k === "Back" ? "Backspace" : k)}
              aria-label={k}
            >
              {k}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
