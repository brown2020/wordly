"use client";

import { useGameStore } from "@/stores/game-store";

const ROWS = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  ["Enter", ..."ZXCVBNM".split(""), "Back"],
];

const getKeyClasses = (k: string, state?: string) => {
  const base = [
    "select-none",
    "inline-flex items-center justify-center",
    "rounded-md",
    "font-semibold uppercase",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/60",
    "active:translate-y-[1px]",
    "h-[clamp(2.6rem,6vh,3.25rem)]",
    "text-[clamp(0.75rem,1.8vh,0.95rem)]",
    "px-0",
  ].join(" ");

  const stateMap: Record<string, string> = {
    correct: "bg-emerald-600 text-white",
    present: "bg-amber-500 text-white",
    absent: "bg-neutral-600 text-white",
  };

  const chrome = state
    ? stateMap[state] ?? "bg-neutral-300 text-neutral-900"
    : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-400";

  const isWide = k === "Enter" || k === "Back";
  const width = isWide
    ? "flex-[1.5] min-w-[3.6rem] max-w-[5.5rem]"
    : "flex-1 min-w-[1.9rem] max-w-[3.25rem]";

  return `${base} ${width} ${chrome}`;
};

export default function OnscreenKeyboard() {
  const handleKey = useGameStore((s) => s.handleKey);
  const keyboard = useGameStore((s) => s.keyboard);
  return (
    <div className="mx-auto w-full max-w-[520px] select-none">
      <div className="flex flex-col gap-2">
        {ROWS.map((row, i) => (
          <div
            key={i}
            className={[
              "flex w-full justify-center gap-1.5",
              i === 1 ? "px-[clamp(0.35rem,1.2vw,0.75rem)]" : "",
            ].join(" ")}
          >
            {row.map((k) => (
              <button
                key={k}
                type="button"
                className={getKeyClasses(k, keyboard[k])}
                onClick={() => handleKey(k === "Back" ? "Backspace" : k)}
                aria-label={k === "Back" ? "Backspace" : k}
              >
                {k === "Back" ? "⌫" : k}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
