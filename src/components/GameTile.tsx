// components/GameTile.tsx
import { FC, memo } from "react";
import { TILE_STYLES } from "@/constants/constants";
import type { LetterState } from "@/types/types";

interface GameTileProps {
  letter: string;
  state: LetterState;
  isRevealing: boolean;
  position: number;
  isCurrentRow: boolean;
  isInvalidGuess?: boolean;
}

const STATE_STYLES: Record<LetterState, string> = {
  correct: TILE_STYLES.correct,
  present: TILE_STYLES.present,
  absent: TILE_STYLES.absent,
  unused: TILE_STYLES.empty,
} as const;

export const GameTile: FC<GameTileProps> = memo(
  ({
    letter,
    state,
    isRevealing,
    position,
    isCurrentRow,
    isInvalidGuess = false,
  }) => {
    const stateClasses = (() => {
      if (isInvalidGuess) return "border-red-400 bg-red-50 text-red-700";
      if (!letter) return TILE_STYLES.empty;
      if (isCurrentRow) return TILE_STYLES.current;
      if (state === "unused") return TILE_STYLES.filled; // Filled but not yet evaluated
      return STATE_STYLES[state];
    })();

    const classes = [
      TILE_STYLES.base,
      stateClasses,
      isRevealing ? "tile-flip" : "",
      "select-none cursor-default",
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
  }
);

GameTile.displayName = "GameTile";
