// constants/constants.ts
type StyleValue = string;

type StylesType = {
  TILE: {
    BASE: StyleValue;
    EMPTY: StyleValue;
    FILLED: StyleValue;
    CURRENT: StyleValue;
    CORRECT: StyleValue;
    PRESENT: StyleValue;
    ABSENT: StyleValue;
  };
  BUTTON: {
    BASE: StyleValue;
    SIZE: {
      DEFAULT: StyleValue;
      LARGE: StyleValue;
    };
    VARIANT: {
      PRIMARY: StyleValue;
      SECONDARY: StyleValue;
      DANGER: StyleValue;
    };
  };
  LAYOUT: {
    CONTAINER: StyleValue;
    HEADER: StyleValue;
    BOARD: StyleValue;
    CONTROLS: StyleValue;
  };
  ANIMATIONS: {
    SHAKE: StyleValue;
    POP: StyleValue;
    FLIP: StyleValue;
    BOUNCE: StyleValue;
  };
  INPUT: {
    BASE: StyleValue;
    DEFAULT: StyleValue;
    ERROR: StyleValue;
    DISABLED: StyleValue;
  };
};

export const CONSTANTS = {
  WORD_LENGTH: 5,
  MAX_ATTEMPTS: 6,
  POINTS_PER_ATTEMPT: 10,
  ANIMATION_DURATION: 500,
  REVEAL_TIME_MS: 350,
  DIFFICULTY_LEVELS: {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
  } as const,
} as const;

export const STYLES: StylesType = {
  TILE: {
    BASE: "w-14 h-14 flex items-center justify-center text-2xl font-bold border-2 rounded-sm transition-colors duration-100",
    EMPTY: "border-gray-200 bg-white",
    FILLED: "border-gray-400 bg-white",
    CURRENT: "border-gray-600 bg-white",
    CORRECT: "bg-emerald-500 text-white border-emerald-500",
    PRESENT: "bg-amber-400 text-white border-amber-400",
    ABSENT: "bg-gray-500 text-white border-gray-500",
  },
  BUTTON: {
    BASE: "rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200",
    SIZE: {
      DEFAULT: "px-4 py-2",
      LARGE: "px-6 py-3",
    },
    VARIANT: {
      PRIMARY:
        "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 disabled:opacity-50",
      SECONDARY:
        "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 disabled:opacity-50",
      DANGER: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    },
  },
  LAYOUT: {
    CONTAINER: "w-full max-w-screen-sm mx-auto px-4",
    HEADER: "flex items-center justify-between py-4 border-b border-gray-200",
    BOARD: "flex flex-col items-center justify-center gap-1 my-8",
    CONTROLS: "flex flex-col items-center gap-4",
  },
  ANIMATIONS: {
    SHAKE: "animate-shake",
    POP: "animate-pop",
    FLIP: "animate-flip",
    BOUNCE: "animate-bounce",
  },
  INPUT: {
    BASE: "border rounded-md transition-all duration-200 focus:outline-none focus:ring-2",
    DEFAULT:
      "px-4 py-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500",
    ERROR: "px-4 py-2 border-red-300 focus:border-red-500 focus:ring-red-500",
    DISABLED: "bg-gray-100 cursor-not-allowed",
  },
};

export const MESSAGES = {
  ERRORS: {
    INVALID_WORD: "Not a valid word",
    TOO_SHORT: "Word must be 5 letters",
    GAME_OVER: "Game is already over",
  },
  SUCCESS: {
    CORRECT_GUESS: "Congratulations! You won!",
    HINT_USED: "Hint revealed!",
  },
  INFO: {
    HINT_AVAILABLE: "Hint available! Use it to reveal a letter.",
    HINT_UNAVAILABLE: "Hints are available after 3 attempts.",
    REVEALING: "Checking your guess...",
  },
};

export const GAME_CONFIG = {
  HINT: {
    MIN_ATTEMPTS_FOR_HINT: 3,
    POINTS_PENALTY: 5,
  },
  SCORING: {
    BASE_POINTS: 10,
    MULTIPLIER: {
      EASY: 1,
      MEDIUM: 1.5,
      HARD: 2,
    },
  },
  DIFFICULTY: {
    EASY: {
      LABEL: "Easy",
      VALUE: 1,
    },
    MEDIUM: {
      LABEL: "Medium",
      VALUE: 2,
    },
    HARD: {
      LABEL: "Hard",
      VALUE: 3,
    },
  },
};

// Type exports
export type DifficultyLevel =
  (typeof CONSTANTS.DIFFICULTY_LEVELS)[keyof typeof CONSTANTS.DIFFICULTY_LEVELS];
