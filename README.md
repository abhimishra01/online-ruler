# Online Ruler

Free on-screen ruler, true to size after a credit card calibration. Live target: https://bingemind.com/online-ruler/
Astro (static) + Tailwind 4. No backend.

## Where the logic lives
- `src/lib/units.js`: unit math, 1/16 fractions, tick plans.
- `src/lib/calibration.js`: calibration math, per-screen saved record, "use the saved one" (borrowed) rule, check-object rule, status words.
- `src/lib/reference.js`: coins, paper and the device list. Every device row needs a manufacturer spec URL (host allow-list in `SOURCE_HOSTS`). `npm test` fails on a row with no source or an implausible PPI. To add a device, add one row to `RAW`.
- `src/lib/stage.js`: the browser stage (canvas rulers, guides, calibration sheet). Not unit tested; keep decisions in `calibration.js`.
- `src/data/pages.ts` and `faq.ts`: copy for the home page and five landing pages.

## Commands
`npm run dev`, `npm test`, `npm run build`, `npm run build:bingemind` (SITE_MODE=bingemind, output `dist-bingemind/`, indexable, has the sitemap).
The default build and the GitHub Pages build (`PAGES_BASE=/online-ruler/ PAGES_SITE=https://abhimishra01.github.io`) are `noindex` and have no sitemap. Canonical links always name bingemind.com/online-ruler/.
Add `?debug` to a page URL to expose `window.__ruler` for browser tests.
