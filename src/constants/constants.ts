// constants/constants.ts

// Storage keys for localStorage
export const STORAGE_KEYS = {
  SCORES: "wordly-scores",
  GAME: "wordly-game",
} as const;

// Game constants - simplified and focused
export const GAME = {
  WORD_LENGTH: 5,
  MAX_ATTEMPTS: 6,
  POINTS_PER_ATTEMPT: 10,
  REVEAL_TIME_MS: 350,
} as const;

// Beautiful tile styling with proper contrast and visibility
export const TILE_STYLES = {
  // Wordle-like sizing: adapt to viewport so the board+keyboard fit vertically.
  // We use min(vw, vh) so short-but-wide windows don't overflow.
  base: [
    "flex items-center justify-center font-bold uppercase border-2",
    "rounded-[0.375rem]",
    "w-[clamp(2.6rem,min(7.5vw,7vh),3.6rem)] h-[clamp(2.6rem,min(7.5vw,7vh),3.6rem)]",
    "text-[clamp(1.25rem,min(4.2vw,3.2vh),1.875rem)]",
    "transition-[transform,background-color,border-color,color] duration-200 select-none cursor-default",
  ].join(" "),
  empty: "border-neutral-300/80 bg-white text-neutral-700",
  filled: "border-neutral-400 bg-white text-neutral-900",
  current: "border-neutral-500 bg-white text-neutral-900",
  correct: "bg-emerald-600 text-white border-emerald-600",
  present: "bg-amber-500 text-white border-amber-500",
  absent: "bg-neutral-600 text-white border-neutral-600",
} as const;

// Elegant layout classes with improved spacing
export const LAYOUT = {
  // Full-height layout so we can pin keyboard to bottom.
  container:
    "mx-auto flex min-h-dvh w-full max-w-[520px] flex-col px-2 sm:px-4",
  header:
    "flex items-center justify-between py-6 border-b border-neutral-200/60 bg-white/80 backdrop-blur-sm",
  board:
    "flex flex-col items-center justify-center gap-2 my-12 animate-fade-in",
} as const;

// Beautiful button variants with sophisticated styling
export const BUTTON = {
  primary:
    "px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-200 transition-all duration-200 shadow-medium hover:shadow-strong transform hover:-translate-y-0.5 font-medium",
  secondary:
    "px-6 py-3 bg-white text-neutral-700 border-2 border-neutral-200 rounded-xl hover:border-neutral-300 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-neutral-200 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5 font-medium",
  accent:
    "px-6 py-3 bg-gradient-to-r from-accent-purple to-accent-pink text-white rounded-xl hover:from-accent-purple/90 hover:to-accent-pink/90 focus:outline-none focus:ring-4 focus:ring-accent-purple/30 transition-all duration-200 shadow-medium hover:shadow-strong transform hover:-translate-y-0.5 font-medium",
} as const;

// Refined game messages
export const MESSAGES = {
  win: "🎉 Congratulations! You won!",
  lose: "Better luck next time! 🎯",
  invalidWord: "Not a valid word 🤔",
  tooShort: "Word must be 5 letters ✏️",
} as const;
