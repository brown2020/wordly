# Wordly Current-State Spec

## Purpose

Wordly is a browser word-guessing game inspired by Wordle. Players guess a
five-letter word within six attempts, receive per-letter feedback, and can play
daily, random, or archived puzzles.

## Current Implementation

- The home route (`src/app/page.tsx`) renders the main client game container in
  `src/components/WordlyMain.tsx`.
- The root layout (`src/app/layout.tsx`) provides metadata, viewport settings,
  global CSS, and a full-height body.
- The game board is composed from `src/components/GameBoard.tsx` and
  `src/components/GameTile.tsx`.
- Keyboard input comes from both a browser keydown listener in
  `src/hooks/useGameController.ts` and the client-only onscreen keyboard in
  `src/components/keyboard/OnscreenKeyboard.tsx`.
- Game state and actions live in `src/stores/game-store.ts`, with persisted
  mode, solution id, and puzzle number.
- User settings live in `src/stores/settings-store.ts` and include hard mode,
  dark mode, and high-contrast mode.
- Score history and archive progress are stored in localStorage through
  `src/utils/storage-utils.ts`.
- Puzzle selection, duplicate-letter evaluation, hard-mode checks, puzzle
  numbers, and share text live in `src/utils/game-utils.ts`.
- Word validation currently calls the free dictionary API from
  `src/utils/dictionary-api.ts`.

## Validation

- `npm run lint` is the primary static quality gate.
- `npm run build` is the primary integration/build gate.
- No dedicated automated test script is currently configured.
- Manual validation should cover daily, random, and archive modes; hard mode;
  dark mode; high-contrast mode; sharing; score history; and mobile layout.

## Architecture Boundaries

- `src/app/` should stay thin and route-oriented.
- `src/components/` should render UI and delegate game decisions to stores,
  hooks, or utilities.
- `src/stores/` owns mutable game/settings state.
- `src/hooks/` bridges stores, browser events, and persistence side effects.
- `src/utils/` owns pure or service-like logic.
- `src/constants/` owns word lists, game constants, storage keys, and class-name
  constants.

## Quality Risks

- The lack of automated tests leaves core word-evaluation and persistence
  behavior under-protected.
- External dictionary validation must fail safely without accepting arbitrary
  invalid guesses.
- The public README and assistant guidance can drift from the actual component
  tree and package versions.
- Archive, daily, and score persistence all write to localStorage and should
  remain defensive around malformed legacy data.

## Improvement Goals

- Keep lint and build passing on `dev`.
- Add small, focused tests when the project gains a test runner.
- Preserve the Wordle-like gameplay contract while tightening validation,
  persistence, and documentation accuracy.
- Prefer narrow fixes and low-risk cleanup over broad rewrites.
