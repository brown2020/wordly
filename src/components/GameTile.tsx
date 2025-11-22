// components/GameTile.tsx
import { FC, memo } from "react";
import { TILE_STYLES } from "../constants/constants";

interface GameTileProps {
  letter: string;
  state: string; // "correct" | "present" | "absent" | "unused"
  isRevealing: boolean;
  position: number;
  isCurrentRow: boolean;
  isInvalidGuess?: boolean;
}

const STATE_STYLES: Record<string, string> = {
  correct: TILE_STYLES.correct,
  present: TILE_STYLES.present,
  absent: TILE_STYLES.absent,
  unused: TILE_STYLES.empty,
} as const;

export const GameTile: FC<GameTileProps> = memo(({
  letter,
  state,
  isRevealing,
  position,
  isCurrentRow,
  isInvalidGuess = false,
}) => {
  const getStateClasses = (): string => {
    if (isInvalidGuess) return "border-red-400 bg-red-50 text-red-700 animate-shake";
    if (!letter) return TILE_STYLES.empty;
    if (isCurrentRow && letter) return TILE_STYLES.current;
    if (letter && state === "unused") return TILE_STYLES.filled; // Filled but not yet evaluated
    return STATE_STYLES[state] ?? TILE_STYLES.empty;
  };

  const getAnimationClass = (): string => {
    if (isRevealing) return "tile-flip";
    if (letter && isCurrentRow) return "animate-bounce-gentle";
    return "";
  };

  const classes = [
    TILE_STYLES.base, 
    getStateClasses(), 
    getAnimationClass(),
    "select-none cursor-default"
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={{
        transitionDelay: isRevealing ? `${position * 150}ms` : "0ms",
        animationDelay: isRevealing ? `${position * 150}ms` : "0ms",
      }}
    >
      {letter}
    </div>
  );
});

GameTile.displayName = "GameTile";
