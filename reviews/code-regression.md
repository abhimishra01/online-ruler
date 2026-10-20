# Code review: regression lens (Kim)
Verdict: the math is right, but the device list is out of date and has gaps; two flow bugs break promises in the spec (verify step, saved-screen choice). 4 must-fix, 6 should-fix.

Method: unit tests run (103 checks pass). Math recomputed by hand and in a real browser (Chrome via Playwright, own contexts, dpr 1, 1.5, 2, 3). Template rules checked on both builds (root build and `SITE_MODE=bingemind` build served under `/online-ruler/`, 18 internal URLs, 0 broken).

## Hand recomputation (all pass)
| Case | Hand result | Tool result |
|---|---|---|
| Card, 428 css px wide, dpr 2 (a screen with 5.0 css px/mm) | 428 / 85.6 x 2 = 10.000 dev px/mm | 10.000, chip "Calibrated with card" only after the match |
| Verify outline, US quarter on that scale | 24.26 x 5.0 = 121.3 css px | 121.297 px |
| Page zoom 125 percent (dpr 2 to 2.5, screen 1440 to 1152 css) | dev stays 10.0, css px/mm = 4.0 | 4.0, same screen key `2880x1800` |
| Size method 13.3 in, 16:10, 1440 wide, dpr 2 | 13.3 x 25.4 x 1.6 / sqrt(3.56) = 286.46 mm; 1440 x 2 / 286.46 = 10.053 | 10.053 |
| Size method 33.78 cm (= 13.299 in) | 10.054 | 10.054 |
| Device "MacBook Air 13 inch (M1)" | 10.053 | 10.053 |
| Guide at 92.075 mm, inch unit | 3.625 in = 3 5/8 | "3 5/8 in = 3.625 in = 92.1 mm" |
| Two guides 92.075 x 53.975 mm, diagonal | 106.73 mm = 4.2026 in, nearest 1/16 = 4 3/16 | "4 3/16 in = 4.202 in = 106.7 mm" |
| 100 mm tick span at dpr 1.5 (mm page) | 100 x 5.669 = 567 device px | ticks at 134/135, 190/191, 247/248 (56.7 px per 10 mm) |
| Card unit constant | ISO/IEC 7810 ID-1 85.60 x 53.98 mm | matches; 3 3/8 x 2 1/8 in correct |
| Coins | US Mint: cent 19.05, nickel 21.21, dime 17.91, quarter 24.26, half 30.61, dollar 26.49. EU: 2c 18.75, 50c 24.25, 1 euro 23.25, 2 euro 25.75 | all match (cent confirmed on one Mint page only) |
| "Calibrated" before the user calibrates | must not appear | Never. Chip reads "Not calibrated: sizes are an estimate" on all 6 pages at 1280, 390, 820, with storage blocked, and after Reset. Device and diagonal methods read "Set from ... : approximate". |

## Extra check 1: device list (134 entries, 7 brands, 49 are Generic)
Checked about 80 named entries against manufacturer pages or manufacturer-published pixel density. Sources: Apple compare pages (iPhone, iPad, Mac), Google Pixel help page (all 11 phones), Samsung support pages (S24 family, S23, S22 sizes, A54, A14, Tab S9, Tab S9 Ultra, Tab A8), Microsoft (Surface Pro 7, Pro 9, Laptop 13.5), Dell (XPS 13), Valve (Steam Deck), Apple Pro Display XDR, Dell S2425H and U2723QE.
Result: no entry has a wrong resolution or wrong aspect. Computed long-side error against the published pixel density is under 1 percent for all but the 3 listed below. Wrong or weak entries:
- Steam Deck: only the 7 in LCD exists. The OLED model is 7.4 in (same 1280x800). OLED owners get -5.4 percent. Add "Steam Deck OLED".
- iPad Pro 11 inch (M4): Apple footnote says 11.1 in as a rectangle; list says 11. Error -1.2 percent.
- Pro Display XDR: 6016 x 3384 at 218 ppi is 31.7 in; list says 32. Error +1.1 percent.
- Dell XPS 13 (3456 x 2160): that OLED panel is the XPS 13 Plus 9320 (13.37 in), not the plain XPS 13. Rename.
- Not verified at all: Galaxy S21, S22 (one Samsung page says 2400 rows, others 2340; aspect effect under 1 percent), S23+ resolution (size 6.6 in is confirmed), all 49 Generic rows (they are marketed sizes by design, not products), MacBook Pro 15 in Retina and the Intel iMac-era entries.
- Gaps (searches return 0 matches): iPhone 17, 17 Pro, 17 Pro Max, iPhone Air, 17e, 16e; Pixel 9a, 10, 10 Pro, 10a, 11; Galaxy S25, S26; MacBook Air or Pro with M4 or M5 in the name; iPad Pro M5, iPad Air M3 and M4; Galaxy Z Fold and Flip; any Lenovo, HP, Dell laptop by name; any named monitor. The first screen of the Device tab shows only the 12 newest iPhones, even on a Windows laptop.
- Source column: holds brand home pages (store.google.com, dell.com, samsung.com/us/mobile), not spec pages. It cannot be audited.
- Recommendation: keep the verified rows, delete or merge unverifiable rows (S21, A14, MacBook Pro 15 Retina, iPhone 8, X, XS and similar old models) unless a spec URL is attached to each row, add the missing 2025/2026 models with a spec URL each, and add a data test that fails when a row has no `source` URL or when diag/aspect imply a PPI outside 80 to 700.
- Note: the diagonal method assumes the long side of the CSS screen spans the long side of the panel. That is right for phones, tablets, laptops and external monitors in full-panel mode. It is wrong for a window on a screen set to a non-native aspect ratio (a stretched mode) or for iOS in Display Zoom with letterboxing. The card method is the only safe fix. The page already says so.

## Findings
| Severity | File:line | Finding | Why | Fix |
|---|---|---|---|---|
| must | src/lib/reference.js:38-94 | Device list stops at 2024 models. "iphone 17", "pixel 10", "galaxy s25", "macbook air m4", "ipad pro m5" all give 0 matches. | Users search by current name; the device shortcut is a P0 feature and the spec asked for 250+ sourced devices. | Add current models with a spec URL each; search aliases (M4, M5, "Air" for iPhone Air). |
| must | src/lib/stage.js:769-770 | Verify step can reuse the object just used. `cal.spec.id` does not exist (objectSpec returns no `id`), so the guard never fires. Reproduced: Coin tab, default US quarter, press "It matches", the check outline is the same US quarter. | The verify step is the feature "no rival has". Checking with the same object proves nothing. | Add `id` to the spec in `objectSpec` and compare it; or pick the check object from the lastMethod. Add a unit test for a pure `pickCheckObject()`. |
| must | src/lib/stage.js:487-491, 80, 806 | "Use the saved one" (screen change notice) is not stored. The chip then says "Calibrated with card, checked" for a screen that was never calibrated, and the next `resize`, `visibilitychange` or dpr event calls `resolveProfile()` and drops it back to "Not calibrated" with the notice again (reproduced). On a phone the address bar causes resize events. | Breaks "never show Calibrated until the user calibrates" and flickers. | Keep an `S.borrowed` flag; show "Using the calibration from another screen: approximate" and keep it until the user calibrates or resets. |
| must | spec section 11 (no file) | No real-hardware results exist. Spec acceptance checks 1 to 3 (card within 0.5 mm on Mac, Windows, iPhone, Android; device shortcut within 5 percent; zoom in Chrome, Firefox, Safari) have no evidence in the repo. The copy "about 20 seconds" and "Chrome, Edge and Firefox keep scale" are untested. Headless emulation cannot prove them. | The brief says no accuracy claim we have not measured. The claims are hedged, but the 20 s and zoom statements are claims. | Owner runs the 4-device card test before launch; until then soften "about 20 seconds" and keep the zoom wording as is. |
| should | src/lib/reference.js:6 | US Mint link is `/learn/coin-and-medal-programs/coin-specifications`. Search shows the current page at `/learn/coins-and-medals/circulating-coins/coin-specifications`. Both return 403 to bots, so a redirect cannot be confirmed. | Every coin citation on the site and in the object table points to it. | Open both in a normal browser; use the page that loads. Test that every `source` host is reachable by a human. |
| should | src/lib/reference.js:81 | Steam Deck OLED missing (see above); -5.4 percent for those owners. | Largest device error found. | Add the 7.4 in entry. |
| should | src/lib/reference.js:28-35 | Source column lists home pages, not spec pages. | Cannot audit rows later. | One spec URL per row. |
| should | src/lib/stage.js:696-720 | Device tab opens with 12 iPhones and no hint of other brands; "Popular devices" is the same on every platform. | A Windows or Android user thinks the list has no match. | Order by detected platform (iOS, Android, Mac, Windows), or show brand chips. |
| should | src/lib/stage.js:80, 806-808 | After a window move to another monitor, the resize handler runs `checkScreen` only on `resize`. Moving a window between two same-size monitors with the same signature keeps the old profile. | Two identical monitors of different density are rare but real (laptop 2880x1800 and a 4K 27 in at scaled 2880x1620 differ). The signature covers different sizes only. | Mention in the notice copy: "Same-size screens share one calibration." |
| should | Template (README/docs) | Default (`npm run build`) sitemap lists `https://bingemind.com/cm/` while canonicals say `/online-ruler/cm/`. | Not live (Bingemind mode is correct). Compare with cash-drawer-counter; if the template has the same pattern, leave it to the template fixer. | One line to the fixer. |
| nice | src/pages/contact.astro, site.config.ts:12 | Default build prints `hello@onlineruler.com` (not owned; Pages copy). | The Pages copy is a live target. | Hide it in non-Bingemind mode or use the Bingemind contact link. |
| nice | src/data/pages.ts:143 | Inch page example says "decimal value (3.626 in)" for 92.1 mm; a snapped guide shows 3.625. | Reader sees a different number. | Use 92.075 mm in the example. |

Template rules: canonical present and correct on every page (Bingemind mode); `X-Robots-Tag: noindex` for pages.dev in `public/_headers`; Pages build adds `noindex` through BASE_URL; legal pages linked in the footer; 404 page has noindex; sitemap-index and sitemap-0 list 10 URLs under `/online-ruler/`; GA and AdSense scripts absent when the IDs are empty (grep for gtag and adsbygoogle: none). All pass.
Known template leftovers: skipped by brief.

Must-fix count: 4.
