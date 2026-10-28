# Wordly Current-State Spec

## Purpose

Wordly is a browser word-guessing game inspired by Wordle. Players guess a
five-letter word within six attempts, receive per-letter feedback, and can play
daily, random, or archived puzzles. There is no account system and no server
game state.

## Routes

- `/` renders `src/components/WordlyMain.tsx` from `src/app/page.tsx`.
- `/scores` is a scrollable history page. There is no intercepting scores route.
- `error`, `loading`, and `not-found` are the App Router fallbacks.
- There are no route handlers and no server actions. `/api/*` is a Next.js 404.

## Gameplay

- A guess is five letters. The player has six attempts.
- Evaluation is two-pass: greens are marked first, then yellows consume the
  remaining letter counts, so duplicates are not double-credited.
- **Daily** uses the UTC date and the Wordle epoch of 19 June 2021. Everyone
  shares that puzzle number and answer. The solution list is 143 bundled words,
  so the daily answer repeats every 143 days.
- **Random** draws from that same solution list. Its id is `rand-<timestamp>`.
- **Archive** loads a past puzzle number. Play Again replays that same puzzle.
  Archive with no puzzle number starts a random game instead.
- Daily game-over does not offer Play Again. It shows the countdown to the next
  UTC midnight. Random and archive offer Play Again.
- The first visit opens the help modal.

## Hard mode

- Hard mode can be enabled only before the first successful guess. It can be
  turned off during a game.
- Every previous evaluation counts, not only the latest row.
- A green letter must stay in that position.
- The next guess must contain at least as many of each letter as the largest
  count revealed (green plus yellow) in any earlier row.
- A yellow letter may be typed again in the same wrong position. That is the
  current rule, not official Wordle slot-avoidance.

## Word validation

- Words in `src/constants/valid-words.ts` (1732 words, including every solution)
  are accepted without a network call.
- Any other string must be exactly five letters `a-z` and must receive a
  successful response from `https://api.dictionaryapi.dev/api/v2/entries/en/`.
- HTTP 404 is cached as invalid for the page session.
- Other HTTP statuses and network errors are not cached. They reject the guess.
  They never accept a word that is absent from the local list.
- The solution list is `src/constants/wordlist.ts`.

## Persistence

- Zustand persist stores the active board: answer, guesses, evaluations,
  current guess, row, win/loss, keyboard, mode, solution id, puzzle number,
  in-progress flag, and whether the result was already recorded.
- A reload restores that board. A new game starts only when no answer was
  restored, and only after persist hydration finishes.
- A submission that finishes after `startNewGame` is dropped.
- Settings (`hardMode`, `darkMode`, `highContrastMode`) persist separately.
- Scores and archive completions live in localStorage. Malformed score rows
  are ignored. One daily or archive puzzle number is recorded once.
- `resultRecorded` stops a restored finished game from appending another score.
- Random games are not deduped by word.

## Stats

- Played, win percentage, current streak, max streak, and guess distribution.
- A day counts as a win if any stored game that UTC day was a win.
- If today has only a loss, the current streak is 0. If today is unplayed, a
  win yesterday can continue the streak.
- Records with a missing `isWin` still count as wins when attempts are 1–6.
  New records always store `isWin`.

## Presentation

- Dark mode adds `html.dark`. Tailwind `dark:` utilities use that class, not
  `prefers-color-scheme`. Tokens for primary, accent, and shadows are in
  `src/app/globals.css`.
- High contrast changes correct/present tile and key colors and the share emoji.
- The document scrolls. `/scores` is not clipped to the viewport.
- The image optimizer has no remote host patterns.
- Physical keyboard input is ignored while help, stats, settings, archive, or
  game-over is open.

## Environment

No environment variables. No Firebase, Stripe, or server secrets.

## Validation

- Quality gates: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
- CI on `dev` and `main` runs those gates with Node 22. It must not inline
  `NEXT_PUBLIC_*` or API keys.
- Unit tests cover evaluation, hard mode, share text, dictionary fallback,
  score sanitizing, archive restart, a full winning submission, and the absence
  of API routes.
- Browser coverage (daily, random, archive, themes, share, mobile) is still manual.

## Boundaries

- `src/app/` stays thin.
- `src/components/` render UI and delegate decisions.
- `src/stores/` own game and settings state.
- `src/hooks/` own browser events and persistence side effects.
- `src/utils/` own rules and storage helpers.
- `src/constants/` own word lists, storage keys, and class strings.

## Known limits

- Answers are in the client bundle. The daily word is computable offline.
- Unknown guesses depend on the public dictionary host.
- Stats mix daily, random, and archive results into one streak.
- The `/scores` table does not follow the dark-mode class.
- The unused `score` field on a history row renders as `-`.
