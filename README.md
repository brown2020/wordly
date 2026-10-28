# Wordly

A browser Wordle-style game: guess a five-letter word in six tries with color feedback. Play the shared **daily** puzzle, unlimited **random** practice, or past puzzles from the **archive**. Stats, settings, and the active board persist in `localStorage`.

**Live demo:** [https://wordlyapp.vercel.app](https://wordlyapp.vercel.app)

## Features

- **Daily / random / archive** — one UTC daily solution for everyone; unlimited practice; archive picker for past puzzle numbers
- **Six guesses, five letters** — green / yellow / gray evaluation, including duplicate letters
- **Hard mode** — greens stay fixed across every earlier guess, and the guess must include the largest revealed count of each letter. Hard mode can be turned on only before the first guess
- **On-screen and physical keyboard** — color-coded keys. Physical keys are ignored while a modal is open
- **Word validation** — the bundled valid-word list is accepted locally. Unknown five-letter words need a successful Free Dictionary API response. HTTP 404 is cached as a miss. Other HTTP errors and network failures are not cached and do not accept the guess
- **Stats and scores** — games played, win %, current and max streak, guess distribution, and a `/scores` history page. A loss today breaks the current streak. Each daily or archive puzzle is recorded once
- **Share** — copy an emoji grid. Hard mode adds `*`. High contrast uses the orange/blue squares
- **Settings** — hard mode, dark mode (`html.dark`, not the OS color scheme), high-contrast tiles
- **Countdown** — time until the next UTC daily puzzle after a daily win or loss

No accounts, Firebase, Stripe, or environment variables.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js `^16.4.3` (App Router) |
| UI | React `^19.3.1`, Tailwind CSS `^4.3.3` |
| Language | TypeScript `^6.0.3` |
| State | Zustand `^5.0.16` |
| Dates | date-fns `^4.4.0` |
| Tests | Node.js test runner via `tsx` `^4.23.15` |
| Lint | ESLint `^10.13.0` and typescript-eslint `^8.72.1` |

## Project structure

```
src/
  app/                 # /, /scores, error, loading, not-found
  components/          # WordlyMain, board, tiles, modals, keyboard, ui
  stores/              # game-store, settings-store
  hooks/               # game controller, stats, scores, archive progress
  utils/               # evaluation, hard mode, share text, storage, dictionary API
  constants/           # game config, 143 solutions, 1732 valid guesses
  types/
docs/                  # architecture and budget notes
SPEC.md                # current behavior
roadmap.md             # next steps and known gaps
.github/workflows/ci.yml
```

Theme tokens and the dark-mode variant live in `src/app/globals.css`.

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

None. The app does not read environment variables. Unknown guesses may call the public Free Dictionary API; if that call fails, the guess is rejected unless it is already in the local word list.

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
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Node tests under `src/**/*.test.ts` |
| `npm run doctor` | `react-doctor` check |

## Testing and CI

CI on `dev`, `main`, and pull requests runs install, lint, typecheck, test, and build. No secrets. Tests cover guess evaluation, hard mode, share text, dictionary fallback, score rows, archive restart, and the absence of API routes.

## Deployment

Hosted on Vercel at [wordlyapp.vercel.app](https://wordlyapp.vercel.app). Persistence is in the browser. A basic deploy does not need host environment variables.

## Contributing

1. Work on `dev`.
2. Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` before pushing.
3. Keep guess rules in `src/utils/game-utils.ts` covered when they change.

## License

[GNU Affero General Public License v3.0](LICENSE.md) (AGPL-3.0).
