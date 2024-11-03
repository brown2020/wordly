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

export const GameTile: FC<GameTileProps> = ({
  letter,
  state,
  isRevealing,
  position,
  isCurrentRow,
}) => {
  const baseClasses =
    "w-16 h-16 border-2 flex items-center justify-center text-2xl font-bold uppercase transition-colors duration-150";

  const getStateClasses = () => {
    if (!letter) return "border-gray-300";
    if (isCurrentRow) return "border-gray-500";

    switch (state) {
      case LetterState.CORRECT:
        return "bg-emerald-500 text-white border-emerald-500";
      case LetterState.PRESENT:
        return "bg-amber-400 text-white border-amber-400";
      case LetterState.ABSENT:
        return "bg-gray-500 text-white border-gray-500";
      default:
        return "border-gray-300";
    }
  };

  const getAnimationClass = () => {
    if (isRevealing) return "animate-flip";
    if (letter && isCurrentRow) return "animate-pop";
    return "";
  };

  return (
    <div
      className={`${baseClasses} ${getStateClasses()} ${getAnimationClass()}`}
      style={{
        transitionDelay: isRevealing ? `${position * 300}ms` : "0ms",
      }}
    >
      {letter}
    </div>
  );
};
