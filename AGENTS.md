# Agent Guide

## Project

Wordly is a Next.js App Router word game built with React, TypeScript, Tailwind
CSS, and Zustand. The primary UI is `src/app/page.tsx`, which renders
`src/components/WordlyMain.tsx`.

## Commands

- `npm run dev`: start the local Next.js dev server.
- `npm run lint`: run ESLint across the repository.
- `npm run build`: create the production build.
- `npm run start`: serve a production build.

Before committing source changes, run `npm run lint` and `npm run build` when
practical. There is no dedicated test script in `package.json` at this time.

## Architecture Notes

- `src/stores/game-store.ts` owns active game state and game actions.
- `src/stores/settings-store.ts` owns persisted user preferences.
- `src/hooks/useGameController.ts` initializes games, listens for keyboard
  input, and opens the game-over modal.
- `src/hooks/useGameStats.ts`, `src/hooks/useScores.ts`, and
  `src/hooks/useArchiveProgress.ts` coordinate browser storage reads/writes.
- `src/utils/game-utils.ts` owns deterministic puzzle selection, guess
  evaluation, hard-mode validation, and share text.
- `src/utils/dictionary-api.ts` owns remote word validation and fallback
  behavior.
- `src/constants/wordlist.ts` contains solution words; `src/constants/valid-words.ts`
  contains local valid guesses.

## Operating Rules

- Preserve product behavior unless the task explicitly calls for a change.
- Keep game logic changes small and verify with lint and build.
- Treat browser-only APIs (`localStorage`, `window`, `document`, `fetch`) as
  client-side concerns.
- Avoid broad dependency updates unless the change is verified and lockfile
  churn is directly tied to kept package changes.
- Prefer deleting unused code or narrowing an existing module before adding new
  abstraction.
- Update `SPEC.md` when implementation, validation, or known risk changes.

## Current Risks

- The app has no automated test suite; validation currently depends on lint,
  production build, and manual browser workflows.
- Word validation depends on an external dictionary API and must retain a safe
  local fallback path.
- Local storage records include legacy-compatible fields, so migrations should
  be additive and defensive.
