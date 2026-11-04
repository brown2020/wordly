# Wordly roadmap

Punchlist after the 2 Nov 2026 dependency pass. Nothing here is a secret or
a deploy step. Promotion from `dev` to `main` stays a separate QA decision.

## Next steps

1. Add a Playwright pass for daily, random, archive, hard mode, dark mode,
   high contrast, share, `/scores`, and a narrow viewport. Unit tests do not
   cover the browser.
2. Move to TypeScript 7 when `typescript-eslint` supports it. TypeScript
   `7.0.2` is current and `tsc` typechecks this repo, but typescript-eslint
   `8.72.1` throws `typescript-eslint does not support TS 7.0` (supported
   range `>=4.8.4 <6.1.0`). The app stays on TypeScript `6.0.3`, the newest
   6.x release.
3. Teach `/scores` the same `html.dark` theme as the game, or read the
   persisted setting on that route.
4. Decide whether hard mode should also reject a yellow letter reused in the
   same wrong position. The built rule only requires greens to stay put and
   revealed letter counts to be met.
5. Give the history table a real score, or remove the column that always
   shows `-`.
6. Split streaks by mode so a random win does not extend the daily streak.
7. Pin `actions/checkout` and `actions/setup-node` to commit SHAs in CI.

## Known bugs and gaps

- The solution list has 143 words, so the UTC daily puzzle repeats on that
  cycle. Answers are in the client bundle.
- Words outside the local list fail closed when `api.dictionaryapi.dev`
  returns anything other than success. A Cloudflare challenge or HTTP 5xx
  rejects that guess and is not cached. Bundled words are unaffected.
- Older score rows that omit `isWin` are treated as wins when the attempt
  count is 1–6.
- Help, stats, settings, and archive modals do not trap focus and do not
  close on Escape. The game-over dialog does.
- The help example says "WORDLY", which is six letters.
- `legacy-peer-deps=true` is set so installs tolerate the TypeScript 6 /
  typescript-eslint peer range, and eslint-plugin-react `7.37.5` which
  still declares ESLint `<=9`. Do not remove it until those ranges match
  the installed packages.
- `@types/node` stays on 24.x (`^24.19.2`) so the types match the Node 24
  runtime. Do not move it to 26.x.
- `minimatch` `11.0.4` is overridden for `eslint`, `@eslint/config-array`,
  and `@typescript-eslint/typescript-estree` (GHSA-g3hv-75wg-m249, fixed in
  11.0.1). eslint-plugin-react still depends on minimatch `3.1.5` and calls
  it as a function. Minimatch 11's CommonJS export is not that function, so
  that copy stays on 3.1.5 and `npm audit` still reports it.

## Open issues

No GitHub issues are tracked in this repo from this pass. There is no
Firebase, Stripe, or required environment variable. CI does not need secrets.
