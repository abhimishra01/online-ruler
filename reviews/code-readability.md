# Code review: readability lens (Kim)
Verdict: a new engineer can read it. Names and comments are good; the gaps are the device-data sources, one misleading comment, and a few copy and UI-word mismatches. 0 must-fix, 5 should-fix.

| Severity | File:line | Finding | Why | Fix |
|---|---|---|---|---|
| should | src/lib/reference.js:2-3, 27-35 | Header says "coins come from the issuer pages named in `source`" and devices "store the marketed diagonal", but device `source` is a brand home page. Marketed diagonals differ from real ones in a few rows (iPad Pro 11 M4 is 11.1, XDR is 31.7). | A maintainer cannot tell where a number came from or which rows are "marketed" and which "measured". | One spec URL per row; a comment on the diagonal rule. |
| should | src/lib/stage.js:515-516 | `cal` state object mixes `tab`, `step`, `kind`, `spec`, `verifyId`, `lastMethod`; `verifyId` and `step` are never read. | Misleading names; the verify bug hides in this tangle. | Remove unused fields; name the check object `checkSpec`. |
| should | src/data/pages.ts (cm, inches, mm, actual-size, FAQ `card`) | Copy says "Open Calibrate and choose Credit card" but the UI has no "Calibrate" button (it is the status chip, or "Calibrate with a card", then a "Card" tab). Home page says "Press the status button". | Reader hunts for a button that is not there. | "Press the status chip at the top left, then the Card tab." Use one name for the chip everywhere. |
| should | src/data/pages.ts:143 | Inch page quotes "3.626 in" for 3 5/8; the tool shows 3.625 when the guide snaps. | Two numbers for one example. | Use 92.075 mm. |
| should | src/components/Stage.astro:78 | ARIA range on the grip (1 to 40, now 4) does not match what the code writes (css px per mm). | Stale placeholder numbers. | Set real min, max and now. |
| nice | src/site.config.ts:5,12 | Comments say "reserved .com (not bought)" and keep `hello@onlineruler.com`; the default build prints that address. | Misleads the next owner; sends mail to a domain we do not own. | State "do not use until bought"; hide it in non-Bingemind mode. |
| nice | README.md | Accurate but 5 lines. No note on the device list, how to add a device, or the Bingemind vs Pages build. | New engineer must read the code. | Add 6 lines. |
| nice | src/lib/stage.js | "Edge", "ruler", "stage", "outline", "object", "profile" are used loosely ("object" is a coin, card or paper bar). | Hard to grep. | Rename `obj*` to `reference*` in ids and comments. |

Placeholder text scan: About, Contact, Privacy, Terms, FAQ and all six articles contain no leftover "TODO", "lorem" or demo text. Developer credit matches briefs/credit.md (footer line, About "Who made this", JSON-LD author and publisher). The About phone line is identical to sites/cash-drawer-counter/src/pages/about.astro. No em dashes anywhere in the built HTML. No British spellings found (color, centimeter, millimeter, inches used; "meter" only in a US sense). US English and plain sentences hold. Mixed units: the status chip says "sizes are an estimate" but About says "Before you calibrate, the ruler is an estimate" (same meaning, fine). Known template leftovers: skipped by brief.

Must-fix count: 0.
