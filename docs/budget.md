# Runtime budget

Stated before measurement (until-100 leanness):

- **Critical-path budget:** sum of `.next/static/**/*.js` bytes after `npm run build` **≤ 900 KB**.
- **Critical path:** play loop on `/` (board + keyboard + Zustand game/settings).
- Measure locally after production build; record bytes and pass/fail.
