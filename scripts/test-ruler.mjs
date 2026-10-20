import assert from 'node:assert/strict';
import {
  MM_PER_IN, mmToIn, inToMm, toFraction, fmt, formatLength, readoutText, tickPlan, levelOf, ticksFor, snapMm, snapDev, stepMm,
} from '../src/lib/units.js';
import {
  CARD, cssPxPerMm, devPxPerMmFromObject, panelFromDiagonal, devPxPerMmFromPanel, estimateCssPxPerMm, screenSignature,
  emptyStore, parseStore, pickProfile, pickCheckObject, withProfile, withBorrowed, withoutProfile, loadStore, saveStore, statusFor, STORE_KEY,
} from '../src/lib/calibration.js';
import { COINS, PAPER, deviceList, searchDevices, panelFor, popularDevices, platformOf, SOURCE_HOSTS } from '../src/lib/reference.js';

let checks = 0;
const eq = (a, b, msg) => { checks++; assert.deepEqual(a, b, msg); };
const near = (a, b, tol, msg) => { checks++; assert.ok(Math.abs(a - b) <= tol, `${msg || ''} ${a} vs ${b}`); };

// ---- conversion
eq(MM_PER_IN, 25.4);
near(mmToIn(25.4), 1, 1e-12);
near(inToMm(2), 50.8, 1e-12);

// ---- fractions (nearest 1/16, reduced)
eq(toFraction(92.075).text, '3 5/8', '92.075 mm = 3 5/8 in');
eq(toFraction(92.1).text, '3 5/8');
eq(toFraction(25.4).text, '1');
eq(toFraction(25.4 / 2).text, '1/2', '8/16 reduces to 1/2');
eq(toFraction(25.4 * 11 / 16).text, '11/16', '11/16 stays');
eq(toFraction(25.4 * 4 / 16).text, '1/4');
eq(toFraction(25.4 * 6 / 16).text, '3/8');
eq(toFraction(25.4 * 17 / 16).text, '1 1/16');
eq(toFraction(0).text, '0');
eq(toFraction(25.4 * 0.03).text, '0', 'under 1/32 rounds to zero');
eq(toFraction(25.4 * 0.04).text, '1/16');
eq(toFraction(-25.4 * 1.5).text, '-1 1/2');
eq(toFraction(25.4 * 3, 8).text, '3');
eq(toFraction(85.6).text, '3 3/8', 'a card is 3 3/8 in wide');
eq(toFraction(53.98).text, '2 1/8', 'a card is 2 1/8 in tall');

// ---- number text
eq(fmt(3.5, 3), '3.5');
eq(fmt(3, 2), '3');
eq(fmt(92.1, 1), '92.1');
eq(fmt(-0.0001, 2), '0');
eq(formatLength(92.075).fraction, '3 5/8 in');
eq(formatLength(92.1), { mm: '92.1 mm', cm: '9.21 cm', inch: '3.626 in', fraction: '3 5/8 in' });
eq(readoutText(92.075, 'in'), '3 5/8 in = 3.625 in = 92.1 mm');
eq(readoutText(100, 'cm'), '10 cm = 100 mm = 3 15/16 in');
eq(readoutText(100, 'mm'), '100 mm = 10 cm = 3 15/16 in');

// ---- tick plan: inches
{
  const plan = tickPlan('in', 3.78);
  eq(plan.levels.length, 5);
  eq(levelOf(plan, 0), 0);
  eq(levelOf(plan, 16), 0);
  eq(levelOf(plan, 8), 1);
  eq(levelOf(plan, 4), 2);
  eq(levelOf(plan, 12), 2);
  eq(levelOf(plan, 2), 3);
  eq(levelOf(plan, 1), 4);
  const t = ticksFor(plan, 25.4 * 2, 3.78 * 2); // two inches
  eq(t.length, 33, '33 ticks from 0 to 2 in');
  eq(t.filter((x) => x.level === 0).map((x) => x.label), ['0', '1', '2']);
  eq(t.find((x) => x.i === 24).label, '½', 'half-inch mark gets a fraction label');
  near(t[16].mm, 25.4, 1e-9);
  eq(t[1].ratio < t[8].ratio, true, 'longer tick for the bigger fraction');
}
// ---- tick plan: cm and mm
{
  const cm = ticksFor(tickPlan('cm', 3.78), 50, 7.5);
  eq(cm.length, 51);
  eq(cm.filter((x) => x.label).map((x) => x.label), ['0', '1', '2', '3', '4', '5']);
  const mm = ticksFor(tickPlan('mm', 3.78), 50, 7.5);
  eq(mm.filter((x) => x.label).map((x) => x.label), ['0', '10', '20', '30', '40', '50'], 'mm numbers every 10 mm');
  eq(mm.filter((x) => x.level === 1).map((x) => x.i), [5, 15, 25, 35, 45]);
}
// ---- dense ticks are dropped
{
  const dense = ticksFor(tickPlan('in', 1), 25.4 * 2, 1.5, 4); // 1.5 device px per mm: 1/16 in = 2.4 px
  eq(dense.every((x) => x.level <= 3), true, 'tiny fractions are hidden when packed tight');
  const sparse = ticksFor(tickPlan('in', 1), 25.4, 8, 4);
  eq(sparse.some((x) => x.level === 4), true);
}
// ---- px plan
{
  const plan = tickPlan('px', 4);
  near(plan.stepMm * 4, 10, 1e-9, '10 CSS px per step');
  const t = ticksFor(plan, 250 / 4, 4);
  eq(t.filter((x) => x.label).map((x) => x.label), ['0', '100', '200']);
}
eq(snapDev(10.04, 7.5), 75);
near(snapMm(92.4, 'in', 3.78), 25.4 * 58 / 16, 1e-9);
near(snapMm(92.4, 'mm', 3.78), 92, 1e-9);
near(stepMm('px', 4), 0.25, 1e-12);

// ---- calibration: card
{
  // A card drawn 323.5 css px wide at dpr 2 on a screen where it is really 85.6 mm.
  const dev = devPxPerMmFromObject(323.5, CARD.w, 2);
  near(dev, 7.5584, 1e-3);
  near(cssPxPerMm(dev, 2), 3.7792, 1e-3);
  // Same screen at 125 percent page zoom: devicePixelRatio is 2.5, so css px per mm grows by 1.25.
  // The drawn width in device pixels does not change with zoom:
  near(cssPxPerMm(dev, 2) * 2, cssPxPerMm(dev, 2.5) * 2.5, 1e-9);
}
// ---- calibration: panel and diagonal
{
  const p = panelFromDiagonal(13.3, 16 / 10);
  near(p.longMm, 286.4, 0.2, '13.3 inch 16:10 is about 286.4 mm wide');
  near(p.shortMm, 179.0, 0.2);
  const p2 = panelFromDiagonal(27, 16 / 9);
  near(p2.longMm, 597.7, 0.3, '27 inch 16:9 is about 597.7 mm wide');
  near(p2.longMm * p2.longMm + p2.shortMm * p2.shortMm, (27 * 25.4) ** 2, 1e-6);
  // The same Mac at two scaling settings: the result follows screen.width.
  const a = devPxPerMmFromPanel(p.longMm, 1440, 2) / 2;
  const b = devPxPerMmFromPanel(p.longMm, 1280, 2) / 2;
  near(a, 5.028, 0.01, 'css px per mm at 1440 wide');
  near(b, 4.469, 0.01, 'css px per mm at 1280 wide');
}
eq(Math.round(estimateCssPxPerMm({ coarse: false, minSide: 800 }) * 25.4), 96);
eq(Math.round(estimateCssPxPerMm({ coarse: true, minSide: 390 }) * 25.4), 160);
eq(Math.round(estimateCssPxPerMm({ coarse: true, minSide: 820 }) * 25.4), 132);

// ---- signature
eq(screenSignature(1440, 900, 2), '2880x1800');
eq(screenSignature(900, 1440, 2), '2880x1800', 'orientation does not matter');
eq(screenSignature(1152, 720, 2.5), '2880x1800', 'page zoom does not change the key');
eq(screenSignature(1280, 800, 2), '2560x1600');

// ---- storage
{
  eq(parseStore(null), emptyStore());
  eq(parseStore(''), emptyStore());
  eq(parseStore('{bad json'), emptyStore());
  eq(parseStore('{"v":2,"profiles":{}}'), emptyStore());
  eq(parseStore('{"v":1,"profiles":null}'), emptyStore());
  eq(parseStore('{"v":1,"profiles":{"a":{"devPxPerMm":-3}},"active":"a"}'), emptyStore(), 'bad numbers are dropped');
  let s = withProfile(emptyStore(), '2880x1800', { method: 'card', devPxPerMm: 7.5, ts: 1 });
  eq(pickProfile(s, '2880x1800').state, 'match');
  eq(pickProfile(s, '1920x1080').state, 'other');
  eq(pickProfile(emptyStore(), '1920x1080').state, 'none');
  // "Use the saved one" is stored for the current screen and survives a reload.
  const b = withBorrowed(s, '1920x1080', '2880x1800');
  eq(pickProfile(b, '1920x1080').state, 'borrowed');
  eq(pickProfile(b, '1920x1080').profile.devPxPerMm, 7.5);
  eq(pickProfile(parseStore(JSON.stringify(b)), '1920x1080').state, 'borrowed', 'borrow survives save and load');
  eq(pickProfile(b, '1366x768').state, 'other', 'another screen is still asked');
  eq(pickProfile(withProfile(b, '1920x1080', { method: 'card', devPxPerMm: 5, ts: 2 }), '1920x1080').state, 'match', 'calibrating this screen ends the borrow');
  eq(pickProfile(withoutProfile(b, '1920x1080'), '1920x1080').state, 'other', 'reset removes the borrow');
  eq(pickProfile(withoutProfile(b, '2880x1800'), '1920x1080').state, 'none', 'deleting the source drops the borrow');
  eq(withBorrowed(s, '1920x1080', 'nope'), s, 'cannot borrow a missing profile');
  const round = parseStore(JSON.stringify(s));
  eq(round.active, '2880x1800');
  eq(withoutProfile(round, '2880x1800'), emptyStore());
  const mem = {}; // fake storage
  const ok = { getItem: (k) => mem[k] ?? null, setItem: (k, v) => { mem[k] = v; } };
  eq(saveStore(ok, s), true);
  eq(loadStore(ok).profiles['2880x1800'].devPxPerMm, 7.5);
  eq(typeof mem[STORE_KEY], 'string');
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  eq(loadStore(blocked), emptyStore(), 'blocked storage gives an empty store');
  eq(saveStore(blocked, s), false, 'blocked storage does not throw');
}
// ---- check step uses a different object
eq(pickCheckObject('card'), 'us-quarter');
eq(pickCheckObject('us-quarter'), 'card', 'a coin is checked with the card');
eq(pickCheckObject('letter'), 'card');
eq(pickCheckObject(null), 'card');
for (const used of ['card', 'us-quarter', 'us-dime', 'eu-2e', 'a4', null]) eq(pickCheckObject(used) !== used, true, `check object differs from ${used}`);
// ---- status words
eq(statusFor(null).kind, 'estimate');
eq(/calibrated/i.test(statusFor(null).text) && !/not calibrated/i.test(statusFor(null).text), false, 'estimate never says calibrated');
eq(/^Calibrated/.test(statusFor({ method: 'device' }).text), false, 'device shortcut is not called calibrated');
eq(statusFor({ method: 'card' }).text, 'Calibrated with card');
eq(statusFor({ method: 'card', verified: true }, true).kind, 'device', 'a borrowed calibration is never called calibrated');
eq(/^Calibrated/.test(statusFor({ method: 'card', verified: true }, true).text), false);
eq(statusFor({ method: 'card', verified: true }).text, 'Calibrated with card, checked');
for (const t of [statusFor(null).text, statusFor({ method: 'card' }).text]) eq(/\d\s*(%|percent)/i.test(t), false, 'no accuracy numbers in the chip');

// ---- reference data
eq(PAPER.find((p) => p.id === 'letter').w, 215.9);
eq(PAPER.find((p) => p.id === 'a4').w, 210);
eq(COINS.every((c) => c.mm > 10 && c.mm < 40 && c.source.startsWith('https://')), true, 'every coin names its source');
eq(COINS.find((c) => c.id === 'us-quarter').mm, 24.26);
eq(COINS.find((c) => c.id === 'us-cent').mm, 19.05);
eq(new Set(COINS.map((c) => c.id)).size, COINS.length, 'coin ids are unique');
{
  const list = deviceList();
  eq(list.length > 60, true, 'device list has entries');
  eq(new Set(list.map((d) => d.id)).size, list.length, 'device ids are unique');
  eq(new Set(list.map((d) => d.name)).size, list.length, 'device names are unique');
  eq(list.every((d) => d.diag > 3 && d.diag < 100 && d.aspect >= 1 && d.aspect < 4), true, 'sane diagonals and aspects');
  eq(list.some((d) => d.brand === 'Generic'), false, 'no generic rows: the Size tab covers them');
  // Every row names a manufacturer page and its density is plausible.
  for (const d of list) {
    const u = new URL(d.source);
    eq(u.protocol === 'https:' && SOURCE_HOSTS.includes(u.hostname), true, `${d.name}: source must be an https manufacturer page`);
    const ppi = Math.hypot(d.w, d.h) / d.diag;
    eq(ppi >= 80 && ppi <= 700, true, `${d.name}: ${Math.round(ppi)} ppi is not plausible`);
  }
  // Current models must be findable by the names people type.
  for (const q of ['iphone 17', 'iphone air', 'pixel 10', 'galaxy s25', 'macbook air m4', 'ipad pro m5', 'steam deck oled', 'xps 13 plus', 'surface pro']) {
    eq(searchDevices(q).length > 0, true, `search finds "${q}"`);
  }
  near(list.find((d) => d.name === 'Steam Deck OLED').diag, 7.4, 0, 'Steam Deck OLED is 7.4 in');
  near(list.find((d) => /iPad Pro 11/.test(d.name)).diag, 11.1, 0, 'iPad Pro 11 is 11.1 in');
  const hit = searchDevices('macbook air 13');
  eq(hit.length > 0 && /macbook air/i.test(hit[0].name), true, 'search finds a MacBook Air');
  eq(searchDevices('zzzzqq').length, 0);
  const iphone = list.find((d) => /iPhone 15$/.test(d.name));
  near(panelFor(iphone).longMm, 140.7, 1.5, 'iPhone 15 screen is about 140.7 mm tall');
  // Platform-aware first screen.
  eq(platformOf({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', platform: 'iPhone' }), 'ios');
  eq(platformOf({ userAgent: 'Mozilla/5.0 (Macintosh)', platform: 'MacIntel', maxTouchPoints: 5 }), 'ios', 'iPad in desktop mode');
  eq(platformOf({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', platform: 'MacIntel' }), 'mac');
  eq(platformOf({ userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 9)', platform: 'Linux armv8l' }), 'android');
  eq(platformOf({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', platform: 'Win32' }), 'windows');
  for (const p of ['ios', 'android', 'mac', 'windows']) {
    const pop = popularDevices(p);
    eq(pop.length > 0 && pop.every((d) => d.platform === p), true, `popular list for ${p} is its own platform`);
  }
}

console.log(`ok: ${checks} checks passed`);
