# Code review: maintainer lens (Kim)
Verdict: clean, small, well-commented code with good input safety; the weak spot is one 825-line browser file with no tests, which is where both real bugs sit. 0 must-fix, 5 should-fix.

Safety check: all dynamic text uses `textContent`; the only `innerHTML` uses are static strings (guide label, device button). `set:html` on page copy comes from our own data file. JSON-LD escapes `<`. Storage is wrapped in try/catch; blocked storage tested (no errors, tool works). Bad stored data is validated (`parseStore` drops bad numbers). Huge or bad input: diagonal field rejects text and sizes outside 3 to 120 in; calibration rejects `dev` outside 1 to 100. No console errors in any run. JS is 11.3 KB gzip (budget 40).

| Severity | File:line | Finding | Why | Fix |
|---|---|---|---|---|
| should | src/lib/stage.js (whole file, 825 lines) | One closure holds state, drawing, guides, calibration, device search, notices and key handling. No tests touch it; the 103 tests cover only `units`, `calibration`, `reference`. | Both regression bugs (verify reuses the same object; "use saved one" not sticky) live here and no test could catch them. | Move the decisions into pure functions in `calibration.js` (`pickCheckObject`, `screenChange`) and test them; split guides and calibration into two modules. |
| should | src/lib/stage.js:824 | `window.__ruler` debug handle is shipped to users. | Pollutes the global, invites outside scripts to change state; it is also what tests rely on. | Expose only when `?debug` or in dev builds. |
| should | src/lib/stage.js:480-500 | `checkScreen` mixes three jobs (pick profile, notices, rerender) with a dead `else if (!(pick.state === 'other'))` branch and a `dataset.kind` flag shared with the pinch notice. | The next change to notices will break the pinch warning. | One notice object with a kind, one function per notice. |
| should | scripts/test-ruler.mjs | Device data test only checks "more than 50 entries" and one iPhone. Nothing checks `source` URLs or plausible PPI per row. | The list was written from memory; this is the review's main finding. | Add the PPI and source checks (see regression report). |
| should | package.json | `wrangler` is a devDependency only for a Cloudflare deploy script that the Bingemind plan does not use. | Large dependency tree with frequent security notices. | Drop it, or run it through `npx` in the deploy script only. |
| nice | src/lib/stage.js:697 | `const mod = { searchDevices, deviceList, panelFor };` and then `mod.x(...)`. | Pointless indirection. | Call the functions directly. |
| nice | src/lib/stage.js:3 | `MM_PER_IN` is imported but unused. | Dead import. | Remove. |
| nice | src/lib/reference.js:101 | `name: brand === 'Generic' ? name : name`. | Both branches equal. | `name`. |
| nice | src/components/Stage.astro:78 | `aria-valuemin="1" aria-valuemax="40" aria-valuenow="4"` do not match what the code sets (css px per mm, about 3 to 17). | Assistive tech reads wrong range before first drag. | Set min 1, max 20, and start at the real value. |

Dependency risk: Astro ^7.3.8, Tailwind 4, sitemap; no runtime dependencies in the browser. Low.
What breaks next: display scaling changes on Safari (no zoom detection), and the device list ageing (new phones each September).

Must-fix count: 0.
