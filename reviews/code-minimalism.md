# Code review: minimalism lens (Kim)
Verdict: already lean (11 KB gzip JS, 4 requests of own code, 2 CSS files); only small deletions remain. 0 must-fix, 3 should-fix.

| Severity | File:line | Finding | Why | Fix |
|---|---|---|---|---|
| should | src/lib/reference.js:38-94 | The device list has 49 Generic rows (36 percent) that duplicate what the Size tab already does (type diagonal, pick shape). Examples: Monitor 23, 22, 24.5, 25, 28; TV 32 to 85 in; Tablet 7, 8, 10.1, 11; Phone 5.5 to 6.7. | Each one is a second way to give a number, and none has a source. | Keep a short generic set (laptop 13.3, 14, 15.6, 16; monitor 24, 27, 32; TV by size via the Size tab) or drop all Generic rows and point to the Size tab. |
| should | src/data/faq.ts:60-61 | `faqIds` and `faq` exports are never used. | Dead code. | Delete. |
| should | src/pages/ads.txt.ts, src/components/AdSlot.astro, src/components/Analytics.astro | In Bingemind mode the root site owns `ads.txt`; the tool's `ads.txt` is a comment only and is served at `/online-ruler/ads.txt`, where AdSense ignores it. | Dead route in production. | Skip it in Bingemind mode like robots.txt. (AdSlot and Analytics are template parts that must stay.) |
| nice | src/lib/stage.js:3, 697, reference.js:101 | Unused import, `mod` indirection, ternary with equal branches. | See maintainer report. | Delete. |
| nice | src/lib/units.js:61-65, 94-103 | `px` unit machinery (plan, step, snap) is about 25 lines. | The spec lists px as P0, so keep. | None. |
| nice | public/ | `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `favicon-32.png`, `favicon.svg`, `site.webmanifest` all used. | Nothing to remove. | None. |

No template demo code left (no demo-ruler text counter). Screenshots folder is git-ignored. Known template leftovers: skipped by brief.

Must-fix count: 0.
