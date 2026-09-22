# Architecture

## Map

```
Browser
  └─ Next.js App Router (static /, /scores, intercepting /scores)
       └─ page.tsx → WordlyMain (client)
            ├─ GameBoard / GameTile / OnscreenKeyboard / modals
            ├─ useGameStore + useSettingsStore (Zustand + persist)
            ├─ localStorage: game + settings + scores + archive
            └─ dictionary-api (optional remote word check + local fallback)
```

## Authority per write

| Path | Fact | Writer | Cache / durability |
| --- | --- | --- | --- |
| start_new_game | answer, guesses, mode, puzzleNumber | `useGameStore.startNewGame` | zustand persist (mode/solutionId/puzzleNumber) |
| submit_guess | guesses, evaluations, keyboard, win/lose | `useGameStore.submitGuess` | in-memory + persist partial |
| toggle_settings | hard/dark/highContrast | `useSettingsStore` toggles | localStorage via persist |
| persist_scores | score history | `useScores` / storage-utils | localStorage only |
| archive_progress | completed puzzles | `useArchiveProgress` | localStorage only |

No server cache. Reload restores persisted game meta + settings + scores; live board comes from store hydrate.

## Server / client

All interactive gameplay is client (`"use client"`). Routes under `src/app` are thin Server Components that render client trees. No route handlers or server actions. Unauthorized `/api/*` returns Next 404 — there is no privileged mutation surface. Word validation authority for gameplay is client-side (API + local word list); the remote dictionary never authorizes a privileged write.

## Change exercises

1. **Data:** change Wordle epoch or `wordList` length in `game-utils` / constants — daily index and archive dates shift; UI shell unchanged.
2. **Access:** adding a future `/api/scores` would require a new route file and explicit auth; today access is "everyone mutates local state; nobody mutates server state" proven by absent routes + 404.
