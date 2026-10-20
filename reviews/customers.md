# Mock-customer test (Kim)
Verdict: people trust this more than the two rivals the owner named, and the card step is clear; they leave unhappy when the device list does not know their phone or laptop, and when a long object does not fit on a phone. Top gaps are listed at the end.

How this was run: five personas (their words are my reading of what the page showed them, not real people), each using the built page in a real Chrome (Playwright) at the right size and pixel ratio: phones with touch emulation and mobile mode. Typing, clicking and dragging were real. Time per task is the number of steps, because a script cannot read at human speed; the 30 s judgement below is mine from the step count and what I saw on screen. Rivals were opened live: piliapp cm-ruler (it served its Hindi page from my network; layout was the same) and realonlineruler.com, at 1280 and 390.

## The five people
**1. Maria, 34, quilter, iPhone 15 (393 px wide, 3x). Task: cut squares of 2 1/2 in.**
Landed on the inch page from "inch ruler online". She saw "Not calibrated" and the orange box, tapped "Calibrate with a card", dragged the grip until the card matched (the card is shown on its short side, 53.98 mm; the screen says why). 5 taps to a calibrated ruler plus a check. Then she hit the problem (checked by position maths, a guide at 2 1/2 in sideways falls at x 394 on a 393 px screen): with the left ruler in the way, a portrait phone has about 63 mm of width, so 2 1/2 in (63.5 mm) does not fit sideways; she had to use the vertical ruler. "Would I click it on Google? Yes, the title says 1/16 marks. Done under 30 s? The calibration yes, the 2 1/2 in no, I had to turn the phone. I trust it because it says 'estimate' first. I would bookmark it if the measurement stayed in view while I cut."

**2. Dave, 52, hobby woodworker, Windows laptop 15.6 in (1366x768), mouse. Task: read a 3/4 in bolt.**
No card at hand (he is at his desk, he does have one in his wallet, but he tries the Device tab first). He typed "dell inspiron": 0 matches. "hp 15": 0. "lenovo": 0. The list opened with 12 iPhones. He found "Windows laptop 15.6 inch (16:9)" only by typing "laptop 15.6". Result: 100.5 css px per inch, the chip says "Set from device size: approximate". "I would have used the card if the page told me it is better. It does, in a small line. I do not trust a ruler that says approximate for a bolt." Would come back: maybe.

**3. Priya, 27, bead jeweler, Pixel 8 (412 px, 2.6x), mm page. Task: 6 mm bead.**
Chose "Device", searched "pixel 8": 3 matches (8, 8 Pro, 8a). Result within 1 percent (by my calculation: list long side 143.6 mm vs 142.4 mm from the published 428 ppi). "A mm tick is about 5 px here, my bead edge sits between ticks, I wish there was a zoom or a bigger scale." She asked for a magnifier. She liked the guides and the "Copy" button.

**4. James, 41, designer, MacBook Air M2 (1470x956, 2x). Task: check print size of a 4 in sticker.**
Typed "macbook air m2": 0 matches; "macbook air 13": 2 matches ("M1" and "M2, M3"), picked the second. Result 5.06 css px per mm, within 0.3 percent of the panel size. I did not run a second method for him; the two methods can only be compared on real hardware. "The page that explains why 96 PPI is wrong is the reason I trust it. Would click it over the others: yes. Missing: save as PDF or a printable 1:1 sheet (the spec says that is a separate tool)." Also noted that after a Safari zoom he would get a wrong size and the page cannot tell him (no Safari zoom warning).

**5. Ken, 68, retired, iPad (820x1180, 2x), low tech. Task: measure a coin.**
Home page showed the ruler and the orange box. He ignored the box, opened Options, tapped "Add vertical guide", and read "Width 7.12 cm = 71.2 mm = 2 13/16 in", an estimate (the chip said so, in small orange text). He did not know what the guide measured ("from the edge"). The unit buttons and big tap targets were fine. "The words 'guide' and 'Options' mean nothing to me. Where is the button for 'measure'? I did not read the line that said the result was a guess." He would come back only if shown one clear first step.

## What the rivals did to the same people
- realonlineruler: opens on an empty "Place a ruler on any edge" screen (Ken: "what is this?"). It says "Calibrated . 96.0 PPI" on a desktop and "Calibrated . 153.3 PPI . iPhone 12" on a generic phone it merely guessed. Maria and Priya would have trusted a wrong number. Its card step needs the card held at the screen edge. Strong content (2,239 words).
- piliapp: a single 30 cm strip with three empty ad boxes, and at 390 px the page is 1,134 px wide, so the ruler is cut off. Only James, who knew it, would use it.
- Ours: shows a working ruler at once, says "estimate", asks for the card in one tap, checks it with a second object, remembers it. Phone layout fits (no overflow at 320, 390, 820).

## Ranked change list (personas who asked)
| Rank | Severity | Change | Asked by |
|---|---|---|---|
| 1 | must | Device list must know current and popular models (iPhone 17, Pixel 10, Galaxy S25, MacBook M4, named Windows laptops) and open with the user's platform, not 12 iPhones. | Dave, James, Priya (3/5) |
| 2 | should | Make the first step unmissable for non-technical people: one big "Measure" path (calibrate, then guide) with plain words; explain "guide" ("drag from the ruler to mark the end"). | Ken, Maria (2/5) |
| 3 | should | Long objects on a phone: remove the left ruler's 46 px in portrait, or default the phone to the vertical ruler, and say how long the screen is ("14 cm tall"). | Maria, Priya (2/5) |
| 4 | should | After the card step, show a visible "Calibrated, checked" badge on the ruler, and keep the status chip readable (bigger, not only orange). | Dave, Ken (2/5) |
| 5 | should | Zoom or magnifier for mm work, and a way to nudge a guide by 0.1 mm. | Priya (1/5) |
| 6 | nice | Safari zoom warning; printable 1:1 sheet link. | James (1/5) |
| 7 | nice | Keep the measurement in view while the user lifts the object (a "Hold" pin). | Maria (1/5) |

Top 5 changes to make first: (1) device list currency and platform-aware first screen, (2) plain first step and a word for "guide", (3) phone portrait width and vertical default, (4) clearer "Calibrated, checked" state, (5) fix the layout shift on the home page.
