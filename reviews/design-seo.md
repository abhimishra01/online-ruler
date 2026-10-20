# Design and SEO review (Kim)
Verdict: clearly better than piliapp and realonlineruler in honesty, calibration and phone layout; accessibility, best practices and SEO are 100 everywhere, and performance is 99 or 100 except where the layout shift hits. One real defect (layout shift on the home page on phones). 1 must-fix, 6 should-fix.

## Scores (Lighthouse, Google Chrome headless, local build, no ads, no analytics)
| Page | Form factor | Performance | Accessibility | Best practices | SEO | CLS | LCP |
|---|---|---|---|---|---|---|---|
| / | mobile | 85 | 100 | 100 | 100 | 0.293 | 1.2 s |
| / | desktop | 100 | 100 | 100 | 100 | 0.056 | 0.3 s |
| /phone/ | mobile | 85 | 100 | 100 | 100 | 0.293 | 1.2 s |
| /actual-size/ | mobile | 99 | 100 | 100 | 100 | 0.081 | 1.2 s |
| /inches/, /cm/, /mm/ | mobile | 100 | 100 | 100 | 100 | 0 | 1.2 s |
Requests: 8 on the home page (spec budget 12), 34 KB total, tool JS 11.3 KB gzip (budget 40). No horizontal overflow at 320, 390, 820, 1280 on all 10 pages (scrollWidth equals viewport width).

## Findings
| Severity | Area | Finding | Fix |
|---|---|---|---|
| must | Layout shift | Home, /phone/ and /actual-size/ (unit "cm + in") shift 0.293 / 0.293 / 0.081 on mobile. Culprit: `div#inner`. The ruler thickness variables `--rt` and `--rl` start at 0 and JS sets them after load, so the content jumps right and down once. Spec target: CLS 0 and performance 95+. | Set the defaults in CSS from the page props (`data-edges`, `data-unit`) so first paint already has the final thickness (46, 52, 72, 80 px). |
| should | Phone calibration | At 390x844 the outline starts under the 72 px left ruler (x 62), and the "-0.1 mm / +0.1 mm" buttons are half hidden behind the sticky "My card matches" row until you scroll. | Start the outline at the ruler edge plus 12 px; give the sheet padding-bottom equal to the sticky row. |
| should | Phone nav | Header links (About, Contact) are hidden at 480 px and below with no menu. The other ruler pages are only below the fold. | Add a small menu or put the page chips under the toolbar. |
| should | Accessibility | The status chip has `aria-label="Calibration status. Open calibration."`, which replaces the visible text. Screen-reader users never hear "Not calibrated". Lighthouse flags it (label-content-name-mismatch). | Label = visible text plus ", open calibration". |
| should | Article depth | Word counts: hub 1,200 (spec 1,500 to 2,000); cm 472, inches 451, mm 418, actual-size 618, phone 361 (spec 600 to 900). | Add the missing sections from SPEC 7.3 and 7.4 to each unit page (reading examples, objects, mistakes). Competitor realonlineruler has 2,239 words. |
| should | Visual hierarchy | The H1 is 18 px (16 px on phones) inside the tool; the page is tool-first on purpose, but top cm label "0 cm 1" and the left "0 0" labels touch. | Hide the "cm" suffix when it would collide; offset the left zero label. |
| should | Empty state | The first screen shows a large blank area with only a bottom-left "These sizes are a guess" box. On phones the box covers the lower third. | Fine for tool-first; move the box to the top toolbar line on phones so the ruler is free. |
| nice | Meta | About, Contact, Privacy, Terms descriptions are short (81, 21, 52, 30 characters). Titles of all pages are under 55 characters. | Lengthen the legal descriptions to 100 to 150 characters. |
| nice | Icon / OG | Favicon (gold ruler tile) is clear at 28 px; OG image is 1200 x 630. | None. |
| nice | Dark mode | Both themes keep AA contrast; tick marks, chip dot and gold buttons readable. | None. |

## SEO checks
- Titles (46 to 53 characters), unique H1 per page, one H1 only, heading outline H1 then H2s in order (the hidden calibration dialog has its own H2 and H3 inside the stage; they are `hidden` and not read).
- JSON-LD parsed on all 6 tool pages: WebApplication (+author, publisher), FAQPage; BreadcrumbList on the five landing pages.
- Canonical on every page names `https://bingemind.com/online-ruler/...`; `robots` is `index,follow`; 404 is `noindex`.
- Sitemap (10 URLs) and sitemap-index valid; the Bingemind root owns robots.txt (not emitted).
- Internal links: every landing page has a chip row to the other five; footer lists all; no broken link (18 URLs checked).
- FAQ: 6 to 8 questions per page, 40 to 80 words; written for people. Google limits FAQ rich results, so treat as content only.

## Against the competition (look)
- piliapp: a fixed strip with ads below, broken phone layout (page 1,134 px wide at 390). Ours is cleaner and calibrates.
- realonlineruler: tidy, but opens with a blank "Place a ruler on any edge" screen and labels an estimate "Calibrated . 96.0 PPI". Ours opens with a working ruler and an honest chip.

Must-fix count: 1.
