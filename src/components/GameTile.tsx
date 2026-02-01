// components/GameTile.tsx
import { FC, memo } from "react";
import { TILE_STYLES, TILE_STYLES_HC } from "@/constants/constants";
import type { LetterState } from "@/types/types";

interface GameTileProps {
  letter: string;
  state: LetterState;
  isRevealing: boolean;
  position: number;
  isCurrentRow: boolean;
  isInvalidGuess?: boolean;
  highContrastMode?: boolean;
}

const getStateStyles = (highContrast: boolean): Record<LetterState, string> => ({
  correct: highContrast ? TILE_STYLES_HC.correct : TILE_STYLES.correct,
  present: highContrast ? TILE_STYLES_HC.present : TILE_STYLES.present,
  absent: highContrast ? TILE_STYLES_HC.absent : TILE_STYLES.absent,
  unused: TILE_STYLES.empty,
});

export const GameTile: FC<GameTileProps> = memo(
  ({
    letter,
    state,
    isRevealing,
    position,
    isCurrentRow,
    isInvalidGuess = false,
    highContrastMode = false,
  }) => {
    const STATE_STYLES = getStateStyles(highContrastMode);

    const stateClasses = (() => {
      if (isInvalidGuess) return "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      if (!letter) return TILE_STYLES.empty;
      if (isCurrentRow) return TILE_STYLES.current;
      if (state === "unused") return TILE_STYLES.filled;
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
