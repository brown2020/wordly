# CLAUDE.md - AI Assistant Guide for Wordle Clone

This document provides essential information for AI assistants working with this Wordle clone codebase.

## Project Overview

A faithful Wordle clone built with Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, and Zustand 5. Features daily puzzles, random practice mode, hard mode, dark theme, high contrast mode, and comprehensive statistics tracking.

**Live Demo:** https://wordlyapp.vercel.app

## Essential Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint checks
```

**Before committing changes, always run:**
```bash
npx eslint ./src --ext .ts,.tsx && npm run build
```

## Project Structure

```
src/
├── app/                    # Next.js App Router (pages & layouts)
│   ├── layout.tsx          # Root layout, metadata, viewport config
│   ├── page.tsx            # Home page (renders WordlyMain)
│   ├── globals.css         # Global styles, dark mode, animations
│   ├── error.tsx           # Error boundary
│   ├── loading.tsx         # Loading state
│   ├── not-found.tsx       # 404 page
│   └── scores/             # Score history routes (legacy)
│
├── components/             # React components (all client components)
│   ├── WordlyMain.tsx      # Main game container, orchestrates layout
│   ├── GameBoard.tsx       # 6x5 game grid (memoized rows)
│   ├── GameTile.tsx        # Individual letter tile (memoized)
│   ├── GameHeader.tsx      # Header with help, stats, settings icons
│   ├── GameOverModal.tsx   # Win/lose modal with countdown timer
│   ├── StatsModal.tsx      # Statistics display modal
│   ├── SettingsModal.tsx   # Settings (hard mode, dark mode, etc.)
│   ├── HelpModal.tsx       # How to play instructions
│   ├── CountdownTimer.tsx  # Timer until next daily puzzle
│   ├── keyboard/
│   │   └── OnscreenKeyboard.tsx  # Interactive keyboard (dynamic import)
│   └── ui/
│       ├── Modal.tsx       # Generic modal wrapper
│       ├── Toast.tsx       # Toast notification component
│       └── icons.tsx       # SVG icon components
│
├── stores/                 # Zustand state management
│   ├── game-store.ts       # Central game state with validation
│   └── settings-store.ts   # User preferences (hardMode, darkMode, etc.)
│
├── hooks/                  # Custom React hooks
│   ├── useGameController.ts # Game orchestration, keyboard listeners
│   ├── useGameStats.ts     # Stats persistence to localStorage
│   └── useScores.ts        # Load scores from localStorage
│
├── utils/                  # Utility functions
│   ├── game-utils.ts       # Core game logic, validation, share text
│   └── stats-utils.ts      # Statistics calculations
│
├── constants/              # Application constants
│   ├── constants.ts        # Game config, tile styles, storage keys
│   ├── wordlist.ts         # Solution words dictionary
│   └── valid-words.ts      # Valid guess words dictionary
│
└── types/                  # TypeScript type definitions
    └── types.ts            # LetterState, KeyboardState, ScoreData
```

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js | 16 |
| UI Library | React | 19 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS | 4 |
| State | Zustand | 5 |
| Date Utils | date-fns | 4 |
| Linting | ESLint | 9 (flat config) |

## Key Features

### Game Modes
- **Daily Mode** - One puzzle per day, same for all players
- **Random Mode** - Unlimited practice games (accessible via settings)

### Settings (via gear icon)
- **Hard Mode** - Must use revealed hints in subsequent guesses
- **Dark Mode** - Dark theme for reduced eye strain
- **High Contrast Mode** - Orange/cyan colors for accessibility

### UI Elements
- **Toast notifications** - Show validation errors ("Not in word list", etc.)
- **Countdown timer** - Time until next daily puzzle (in game over modal)
- **Help modal** - How to play instructions (shows on first visit)
- **Share button** - Copies emoji grid to clipboard

## Code Conventions

### Component Patterns

**Client vs Server Components:**
- `layout.tsx` - Server Component (metadata, viewport)
- All components in `components/` use `"use client"` directive
- `OnscreenKeyboard.tsx` - Dynamically imported with `ssr: false`

**Component Structure:**
```typescript
"use client";

import { FC, memo } from "react";

interface ComponentProps {
  prop1: string;
  prop2?: number;
}

export const ComponentName: FC<ComponentProps> = memo(({ prop1, prop2 }) => {
  // Implementation
});

ComponentName.displayName = "ComponentName";
```

### TypeScript

**Strict mode is enabled.** Always provide type annotations.

**Path alias:** Use `@/*` for imports from `src/`:
```typescript
import { GAME } from "@/constants/constants";
import { LetterState } from "@/types/types";
```

**Core Types:**
```typescript
type LetterState = "correct" | "present" | "absent" | "unused";
type KeyboardState = Record<string, Exclude<LetterState, "unused"> | undefined>;
type GameMode = "daily" | "random";
type InvalidReason = "not_word" | "hard_mode" | "too_short" | null;
```

### Styling

**Dark mode support:** All components use `dark:` variant classes.

**Game tile colors (standard):**
- Correct: `bg-green-600`
- Present: `bg-yellow-500`
- Absent: `bg-neutral-500`

**Game tile colors (high contrast):**
- Correct: `bg-orange-500`
- Present: `bg-cyan-500`
- Absent: `bg-neutral-500`

### State Management

**Game Store (`game-store.ts`):**
```typescript
interface GameStoreState {
  answer: string;
  guesses: string[];
  evaluations: LetterState[][];
  currentGuess: string;
  currentRow: number;
  mode: "daily" | "random";
  solutionId: string;
  keyboard: KeyboardState;
  isRevealing: boolean;
  isGameOver: boolean;
  isWinner: boolean;
  invalidGuess: boolean;
  invalidReason: InvalidReason;
  invalidMessage: string;
  gameInProgress: boolean;  // For hard mode lock
}
```

**Settings Store (`settings-store.ts`):**
```typescript
interface SettingsState {
  hardMode: boolean;
  darkMode: boolean;
  highContrastMode: boolean;
}
```

## Key Game Logic

**Location:** `src/utils/game-utils.ts`

- `isValidWord(word)` - Checks against valid words dictionary
- `validateHardMode(guess, prevGuesses, prevEvals)` - Hard mode validation
- `evaluateGuess(answer, guess)` - Two-pass evaluation for duplicate letters
- `getPuzzleNumber(date)` - Days since June 19, 2021 (Wordle epoch)
- `getShareText(state, hardMode, highContrastMode)` - Generates emoji grid

## localStorage Keys

| Key | Purpose |
|-----|---------|
| `wordly-game` | Game state (mode, solutionId) |
| `wordly-scores` | Game history for statistics |
| `wordly-settings` | User preferences |
| `wordly-seen-help` | Whether help was shown |

## Validation Rules

1. **Word length** - Must be exactly 5 letters
2. **Dictionary check** - Word must be in valid-words.ts
3. **Hard mode** (if enabled):
   - Correct letters must stay in same position
   - Present letters must be used somewhere

## Common Tasks

### Modifying Word Lists

- **Solution words:** `src/constants/wordlist.ts`
- **Valid guesses:** `src/constants/valid-words.ts`

### Updating Colors/Themes

1. Standard colors: `src/constants/constants.ts` (TILE_STYLES)
2. High contrast: `src/constants/constants.ts` (TILE_STYLES_HC)
3. Keyboard colors: `src/components/keyboard/OnscreenKeyboard.tsx`

### Adding New Settings

1. Add to `SettingsState` interface in `settings-store.ts`
2. Add toggle in `SettingsModal.tsx`
3. Use setting via `useSettingsStore` hook

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code formatting (not CSS)
- `refactor:` - Code restructuring
- `perf:` - Performance improvements
- `chore:` - Maintenance tasks

## Validation Checklist

Before submitting changes:

1. `npx eslint ./src --ext .ts,.tsx` - No linting errors
2. `npm run build` - Build succeeds without errors
3. Test locally with `npm run dev`
4. Test both game modes (daily and random)
5. Test dark mode and high contrast mode
6. Test hard mode validation
7. Test on mobile viewport if UI changes were made

## Important Notes

- **Daily words** are tied to UTC date, not user's local timezone
- **Word validation** is strict - only words in valid-words.ts are accepted
- **Hard mode** can only be enabled at the start of a game
- **Puzzle number** in share text matches original Wordle numbering
- **No test suite** currently exists - manual testing required
- **Browser support** targets ES2017+ browsers
