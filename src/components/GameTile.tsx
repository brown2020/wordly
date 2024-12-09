// components/GameTile.tsx
import { FC } from "react";
import { LetterState } from "../types/types";

interface GameTileProps {
  letter: string;
  state: LetterState;
  isRevealing: boolean;
  position: number;
  isCurrentRow: boolean;
}

const STATE_STYLES: Record<LetterState, string> = {
  [LetterState.CORRECT]: "bg-emerald-500 text-white border-emerald-500",
  [LetterState.PRESENT]: "bg-amber-400 text-white border-amber-400",
  [LetterState.ABSENT]: "bg-gray-500 text-white border-gray-500",
  [LetterState.UNUSED]: "border-gray-300",
} as const;

const BASE_CLASSES =
  "w-16 h-16 border-2 flex items-center justify-center text-2xl font-bold uppercase transition-colors duration-150";

export const GameTile: FC<GameTileProps> = ({
  letter,
  state,
  isRevealing,
  position,
  isCurrentRow,
}) => {
  const getStateClasses = (): string => {
    if (!letter) return "border-gray-300";
    if (isCurrentRow) return "border-gray-500";
    return STATE_STYLES[state] ?? "border-gray-300";
  };

  const getAnimationClass = (): string => {
    if (isRevealing) return "animate-flip";
    if (letter && isCurrentRow) return "animate-pop";
    return "";
  };

  const classes = [BASE_CLASSES, getStateClasses(), getAnimationClass()]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={{
        transitionDelay: isRevealing ? `${position * 300}ms` : "0ms",
      }}
    >
      {letter}
    </div>
  );
};
