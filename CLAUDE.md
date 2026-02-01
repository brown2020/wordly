# CLAUDE.md - AI Assistant Guide for Wordly

This document provides essential information for AI assistants working with the Wordly codebase.

## Project Overview

Wordly is a Wordle-inspired word guessing game built with Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, and Zustand 5. It features daily and random game modes, statistics tracking, and persistent localStorage state.

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
npm run lint && npm run build
```

## Project Structure

```
src/
├── app/                    # Next.js App Router (pages & layouts)
│   ├── layout.tsx          # Root layout, metadata, viewport config
│   ├── page.tsx            # Home page (renders WordlyMain)
│   ├── globals.css         # Global styles, animations, custom classes
│   ├── error.tsx           # Error boundary
│   ├── loading.tsx         # Loading state
│   ├── not-found.tsx       # 404 page
│   └── scores/             # Score history routes
│       ├── page.tsx        # Full scores page
│       └── (..)scores/     # Intercepting route for modal
│
├── components/             # React components (all client components)
│   ├── WordlyMain.tsx      # Main game container, orchestrates layout
│   ├── GameBoard.tsx       # 6x5 game grid (memoized rows)
│   ├── GameTile.tsx        # Individual letter tile (memoized)
│   ├── GameHeader.tsx      # Logo, score display, mode toggle
│   ├── GameControls.tsx    # Navigation buttons
│   ├── GameOverModal.tsx   # Win/lose modal with share functionality
│   ├── GameOverCounter.tsx # Attempts display (X/6)
│   ├── StatsModal.tsx      # Statistics display modal
│   ├── ScoresClient.tsx    # Score history table
│   ├── keyboard/
│   │   └── OnscreenKeyboard.tsx  # Interactive keyboard (dynamic import)
│   └── ui/
│       ├── Modal.tsx       # Generic modal wrapper
│       └── icons.tsx       # SVG icon components
│
├── stores/                 # Zustand state management
│   └── game-store.ts       # Central game state with persist middleware
│
├── hooks/                  # Custom React hooks
│   ├── useGameController.ts # Game orchestration, keyboard listeners
│   ├── useGameStats.ts     # Stats persistence to localStorage
│   └── useScores.ts        # Load scores from localStorage
│
├── utils/                  # Utility functions
│   ├── game-utils.ts       # Core game logic (evaluate, share text, etc.)
│   └── stats-utils.ts      # Statistics calculations
│
├── constants/              # Application constants
│   ├── constants.ts        # Game config, styles, messages, storage keys
│   └── wordlist.ts         # Curated 5-letter word dictionary
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

**Memoization:**
- `GameTile` and `GameRow` use `React.memo()` to prevent unnecessary re-renders
- Zustand selectors use `useShallow()` for fine-grained updates

### TypeScript

**Strict mode is enabled.** Always provide type annotations.

**Path alias:** Use `@/*` for imports from `src/`:
```typescript
import { GAME } from "@/constants/constants";
import { LetterState } from "@/types/types";
```

**Core Types (`src/types/types.ts`):**
```typescript
type LetterState = "correct" | "present" | "absent" | "unused";
type KeyboardState = Record<string, Exclude<LetterState, "unused"> | undefined>;
type GameMode = "daily" | "random";

interface ScoreData {
  score: number;
  date: string;
  attempts: number;
  word: string;
  isWin?: boolean;
}
```

### Styling

**Tailwind class organization order:**
1. Layout (display, position, sizing): `flex`, `grid`, `w-`, `h-`
2. Spacing (padding, margin, gaps): `p-`, `m-`, `gap-`
3. Colors & effects: `bg-`, `text-`, `shadow-`, `border-`
4. Transitions & animations: `transition-`, `animate-`

**Custom CSS classes in `globals.css`:**
- `.card` - Semi-transparent background with backdrop blur
- `.card-elevated` - Higher elevation card
- `.gradient-text` - Blue-to-purple gradient text
- `.tile-flip` - Game tile flip animation

**Game tile colors:**
- Correct: `bg-emerald-500`
- Present: `bg-amber-500`
- Absent: `bg-neutral-600`

### State Management (Zustand)

**Store location:** `src/stores/game-store.ts`

**Key state shape:**
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
  score: number;
  isRevealing: boolean;
  isGameOver: boolean;
  isWinner: boolean;
  invalidGuess: boolean;
}
```

**Persisted to localStorage:** `mode`, `solutionId`, `score`

**Accessing state:**
```typescript
import { useGameStore } from "@/stores/game-store";
import { useShallow } from "zustand/react/shallow";

// Single value
const answer = useGameStore((s) => s.answer);

// Multiple values (use useShallow to prevent unnecessary re-renders)
const { guesses, evaluations } = useGameStore(
  useShallow((s) => ({ guesses: s.guesses, evaluations: s.evaluations }))
);
```

## Key Game Logic

**Location:** `src/utils/game-utils.ts`

- `evaluateGuess(answer, guess)` - Two-pass evaluation algorithm handling duplicate letters
- `getDailyAnswer()` - Returns deterministic daily word based on UTC date
- `getRandomAnswer()` - Returns random word with timestamp ID
- `computeDailyIndex(date)` - Days since June 19, 2021 (Wordle epoch)
- `getShareText()` - Generates emoji grid for sharing results

**Scoring:** Points = `(6 - guessCount) * 10`, zero for losses

## localStorage Keys

Defined in `src/constants/constants.ts`:

| Key | Purpose |
|-----|---------|
| `wordly-game` | Game state (mode, solutionId, score) |
| `wordly-scores` | Score history array |
| `wordly-stats` | Statistics data |

## Animation Timing

**Tile reveal:** Staggered by `position * 150ms`
**Game over modal:** Shows after `1500ms` (after all tiles revealed)
**Reveal end:** `REVEAL_TIME_MS * WORD_LENGTH`

## Common Tasks

### Adding a New Component

1. Create file in appropriate `src/components/` subdirectory
2. Add `"use client"` directive at top
3. Define props interface with TypeScript
4. Use `memo()` if component receives frequently-changing props
5. Set `displayName` for React DevTools

### Modifying Game Logic

1. Core logic lives in `src/utils/game-utils.ts`
2. State mutations happen through Zustand actions in `src/stores/game-store.ts`
3. Side effects (keyboard listeners, stats persistence) handled in hooks

### Adding a New Route

1. Create folder under `src/app/`
2. Add `page.tsx` with Server or Client Component
3. For modals, consider using intercepting routes pattern (see `scores/`)

### Updating Styles

1. Tailwind config: `tailwind.config.js` (colors, animations, shadows)
2. Global styles: `src/app/globals.css`
3. Component styles: Use Tailwind classes inline
4. Constants: `src/constants/constants.ts` (TILE_STYLES, BUTTON classes)

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code formatting (not CSS)
- `refactor:` - Code restructuring
- `perf:` - Performance improvements
- `test:` - Test additions
- `chore:` - Maintenance tasks (dependencies, config)

## Validation Checklist

Before submitting changes:

1. `npm run lint` - No linting errors
2. `npm run build` - Build succeeds without errors
3. Test locally with `npm run dev`
4. Verify TypeScript has no type errors
5. Test both game modes (daily and random)
6. Test on mobile viewport if UI changes were made

## Important Notes

- **Daily words** are tied to UTC date, not user's local timezone
- **Word evaluation** handles duplicate letters correctly (two-pass algorithm)
- **No test suite** currently exists - manual testing required
- **No strict dictionary validation** - any 5-letter combination is accepted
- **Streak calculation** resets if no win on yesterday or today
- **Browser support** targets ES2017+ browsers
