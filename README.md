# Wordly

A browser Wordle-style game: guess a five-letter word in six tries with color feedback. Play the shared **daily** puzzle, unlimited **random** practice, or catch up via the **archive**. Stats, settings, and progress persist in `localStorage`.

**Live demo:** [https://wordlyapp.vercel.app](https://wordlyapp.vercel.app)

## Features

- **Daily / random / archive modes** — same daily solution for everyone; practice mode; archive picker for past puzzles
- **Six guesses, five letters** — green / yellow / gray evaluation with duplicate-letter handling
- **Hard mode** — revealed hints must be reused on later guesses
- **On-screen + physical keyboard** — color-coded keys; invalid-guess shake + toast messaging
- **Word validation** — Free Dictionary API (`api.dictionaryapi.dev`) with local `valid-words` fallback and short timeout
- **Stats & scores** — games played, win %, streaks, guess distribution; score history route `/scores`
- **Share** — copy emoji grid results
- **Settings** — hard mode, dark mode, high-contrast mode
- **Countdown** — timer to the next daily puzzle after win/lose

No accounts, Firebase, Stripe, or custom env vars required.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js `^16.3.6` (App Router) |
| UI | React `^19.3.0`, Tailwind CSS `^4.3.3` |
| Language | TypeScript `^6` |
| State | Zustand `^5` |
| Dates | date-fns `^4` |
| Tests | Node.js test runner via `tsx` |
| Lint | ESLint `^10` + TypeScript ESLint |

## Project structure

```
src/
  app/                 # /, /scores (with intercepting route), error/loading/not-found
  components/          # WordlyMain, board, tiles, modals, keyboard, ui
  stores/              # game-store, settings-store
  hooks/               # game controller, stats, scores, archive progress
  utils/               # evaluation, hard mode, share text, storage, dictionary API
  constants/           # game config, wordlist, valid-words
  types/
docs/                  # architecture / budget notes
.github/workflows/ci.yml
```

## Getting started

### Prerequisites

- Node.js 22+
- npm

### Clone and install

```bash
git clone https://github.com/brown2020/wordly.git
cd wordly
npm install
```

### Environment variables

None required. Guess validation optionally calls the public Free Dictionary API; if it fails, the local word list is used.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Node tests under `src/**/*.test.ts` |
| `npm run doctor` | `react-doctor` check |

## Testing and CI

CI on `dev` / `main` and PRs: install → lint → typecheck → test → build. No secrets. Tests cover guess evaluation, hard-mode rules, share text, and route invariants (no privileged API surface).

## Deployment

Hosted on Vercel at [wordlyapp.vercel.app](https://wordlyapp.vercel.app). Client-only persistence; no host secrets required for a basic deploy.

## Contributing

1. Work on `dev`.
2. Run `npm run lint`, `npm run typecheck`, and `npm test` before pushing.
3. Keep evaluation logic in `src/utils/game-utils.ts` covered when changing guess rules.

## License

No `LICENSE` file is present in this repository.
