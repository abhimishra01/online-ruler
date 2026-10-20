# Fix summary (Tony, 2026-10-20)

## Fixed
- **Device list**: rebuilt with a manufacturer spec URL on every row. Added iPhone 17, 17 Pro, 17 Pro Max, iPhone Air, 16e, Pixel 10 family, 10a, 9a, Galaxy S25 family and S25 Edge, MacBook Air and Pro (M-series names searchable: "macbook air m4"), iPad Pro (M4, M5), Steam Deck OLED (7.4 in), Surface Pro 13 inch. Fixed iPad Pro 11 (11.1), Pro Display XDR (31.6), XPS 13 Plus naming (13.37 in OLED). Removed all Generic rows and every row without a source (iPhone 8, X, XS, Galaxy S21, S22, S23, A14, A54, Tab S9, old iPad Pro, old MacBooks, iMac 27, Surface Laptop 13.5, plain XPS 13). Data test: https manufacturer host, plausible PPI (80 to 700), unique names, search for current models. First device screen is platform aware (iOS, Android, Mac, Windows).
- **Verify step** never uses the calibration object (`pickCheckObject`, used option disabled, unit tested).
- **"Use the saved one"** is stored per screen (`borrowed` in the saved record), survives resize and reload, shows "Using the calibration from another screen: approximate", never "Calibrated". Unit tested.
- **CLS**: ruler thickness set in CSS from data attributes; hints shown by CSS, not script. Lighthouse (Google Chrome, local build): home and /phone/ mobile 100/100/100/100, CLS 0, LCP 1.2 s; desktop 100 across and CLS 0.
- **Phone**: /phone/ defaults to the vertical (left) ruler; calibration outline starts 12 px right of the ruler; 0.1 mm buttons moved into the sticky row so nothing hides; "Menu" below 481 px (links plus all ruler pages); chip label now visible text plus hidden ", Opens calibration" (no aria-label mismatch); green "Calibrated, checked" badge; plain "Step 1" callout; "Add guide" button and a line that says what a guide is.
- **Articles**: hub 1,643 words, unit pages 732 to 969 (spec 1,500 to 2,000 and 600 to 900). New sections are worked examples, reading steps, reference sizes, limits and troubleshooting. No new accuracy claims; the copy says accuracy is not yet measured.
- **Default build**: no sitemap, no robots Sitemap line (its URLs did not match the canonical). Contact is the Bingemind page in every build; hello@onlineruler.com is gone. ads.txt dropped in Bingemind mode.
- Smaller: US Mint URL changed to the page that the Mint's own search lists; copy now says "status chip ... Card tab" (was "Calibrate button"); inch example uses 3.625; grip ARIA range; `window.__ruler` only with `?debug`; dead code and unused import removed; README rewritten.
- Pages checks: `PAGES_BASE` build served under /online-ruler/: home, about, privacy, phone, icons, manifest all 200, noindex present, canonical on bingemind.com. Bingemind build: index,follow, 10-URL sitemap. dist-pages removed.

## Rejected
- Drop `wrangler`: the template deploy script uses it; left alone.
- Split `stage.js` into modules and one notice object: larger refactor than this pass; decisions that had bugs now live in tested `calibration.js`.
- Rename `obj*` to `reference*`: churn without user value.
- Magnifier, Safari zoom warning, Hold pin, printable sheet: new features, out of scope for a single-purpose tool.

## Left for the owner
- **Real-hardware card test** (Mac, Windows, iPhone, Android) before launch. No evidence exists in the repo; we make no accuracy claim.
- **Source pages that block bots** (Samsung, Dell, Microsoft support, US Mint return 403 or JS pages to scripts): I confirmed the figures through search results of those manufacturer sites, but open each once in a normal browser. iPhone 11 to 15 rows cite Apple's "Identify your iPhone model" page (sizes) and the iPhone 15 spec page; pixel counts there are from earlier checks against Apple compare pages.
- Pixel 8 Pro, 9 Pro and 9 Pro XL pages returned 200 but did not show the pixel count to the script.
- Same-size monitors share one calibration (review item): not changed.
- Zero labels "0 cm" and "0 0" still sit close at the corner.

## Phase 2 SEO pages (not built)
1. cm to inches chart 2. mm to inches chart 3. how to read a ruler in inches 4. credit card size in mm and inches 5. common coin sizes for calibration 6. is my printout actual size 7. ruler in Word, PowerPoint and Google Docs 8. 1 inch on screen 9. 1 cm on screen 10. 5 mm on screen 11. 10 cm ruler 12. 6 inch ruler 13. 12 inch ruler 14. 15 cm ruler 15. ring size ruler 16. bead size in mm 17. A4 size in inches 18. US Letter size in mm 19. what size is my screen 20. ruler on screen for Windows and Mac
