// constants/constants.ts
// Game constants - simplified and focused
export const GAME = {
  WORD_LENGTH: 5,
  MAX_ATTEMPTS: 6,
  POINTS_PER_ATTEMPT: 10,
  REVEAL_TIME_MS: 350,
} as const;

// Beautiful tile styling with proper contrast and visibility
export const TILE_STYLES = {
  base: "w-16 h-16 flex items-center justify-center text-2xl font-bold border-2 rounded-xl transition-all duration-300 shadow-tile hover:shadow-tile-hover transform hover:-translate-y-0.5",
  empty: "border-neutral-300 bg-white text-neutral-400",
  filled: "border-neutral-400 bg-white text-neutral-800 shadow-medium", 
  current: "border-primary-400 bg-primary-50 text-primary-800 ring-2 ring-primary-200",
  correct: "bg-emerald-500 text-white border-emerald-500 shadow-medium animate-bounce-gentle",
  present: "bg-amber-500 text-white border-amber-500 shadow-medium animate-bounce-gentle",
  absent: "bg-neutral-500 text-white border-neutral-500 shadow-soft",
} as const;

// Elegant layout classes with improved spacing
export const LAYOUT = {
  container: "w-full max-w-lg mx-auto px-6 py-8",
  header: "flex items-center justify-between py-6 border-b border-neutral-200/60 bg-white/80 backdrop-blur-sm",
  board: "flex flex-col items-center justify-center gap-2 my-12 animate-fade-in",
} as const;

// Beautiful button variants with sophisticated styling
export const BUTTON = {
  primary: "px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-200 transition-all duration-200 shadow-medium hover:shadow-strong transform hover:-translate-y-0.5 font-medium",
  secondary: "px-6 py-3 bg-white text-neutral-700 border-2 border-neutral-200 rounded-xl hover:border-neutral-300 hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-neutral-200 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5 font-medium",
  accent: "px-6 py-3 bg-gradient-to-r from-accent-purple to-accent-pink text-white rounded-xl hover:from-accent-purple/90 hover:to-accent-pink/90 focus:outline-none focus:ring-4 focus:ring-accent-purple/30 transition-all duration-200 shadow-medium hover:shadow-strong transform hover:-translate-y-0.5 font-medium",
} as const;

// Refined game messages
export const MESSAGES = {
  win: "🎉 Congratulations! You won!",
  lose: "Better luck next time! 🎯",
  invalidWord: "Not a valid word 🤔",
  tooShort: "Word must be 5 letters ✏️",
} as const;
