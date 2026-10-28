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
- Game state and actions live in `src/stores/game-store.ts`. The active board,
  mode, solution id, puzzle number, and score-recorded flag are persisted.
- User settings live in `src/stores/settings-store.ts` and include hard mode,
  dark mode, and high-contrast mode.
- Score history and archive progress are stored in localStorage through
  `src/utils/storage-utils.ts`.
- Puzzle selection, duplicate-letter evaluation, hard-mode checks, puzzle
  numbers, and share text live in `src/utils/game-utils.ts`.
- Hard mode applies every previous evaluation. Green letters stay fixed, and
  the guess must include the largest revealed count of each letter.
- Word validation accepts the local valid-word list immediately. Unknown words
  are accepted only when the dictionary API returns success. HTTP 404 is cached
  as a miss. Other HTTP statuses and network errors are not cached and do not
  accept the guess.
- The active board is persisted with its score-recorded flag. Daily and archive
  puzzles are written to history once per puzzle number.
- Dark mode is the `html.dark` class. Remote image patterns are not configured.

## Validation

- `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` are the
  primary quality gates (also wired in GitHub Actions on `dev`/`main`).
- Unit tests cover guess evaluation, hard-mode rules, share text, dictionary
  fallback, score sanitizing, and the absence of API route handlers / server actions.
- Manual or Playwright validation should cover daily, random, and archive modes;
  hard mode; dark mode; high-contrast mode; sharing; score history; and mobile layout.
- CI must never inline `NEXT_PUBLIC_*` / API keys — use `${{ secrets.* }}` only
  if client env is added later; gate jobs tolerate missing secrets.

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

- Persistence and full browser flows remain thinner than unit-covered evaluation.
- External dictionary validation must continue to fail safely without accepting
  arbitrary invalid guesses. API errors fail closed for words outside the local list.
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
