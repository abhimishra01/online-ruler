# Online Ruler

Free on-screen ruler, true to size after a card calibration. Live target: https://bingemind.com/online-ruler/
Astro (static) + Tailwind 4. No backend. Pure logic in `src/lib/` (`units.js`, `calibration.js`, `reference.js`), tested by `npm test`.
Commands: `npm run dev`, `npm test`, `npm run build`, `npm run build:bingemind` (SITE_MODE=bingemind, dist-bingemind/).
