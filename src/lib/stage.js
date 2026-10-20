// The ruler stage: canvas rulers on up to four edges, drag guides, calibration and the saved record.
// Runs only in the browser. The math lives in units.js and calibration.js and is tested without a DOM.
import { toFraction, fmt, readoutText, tickPlan, ticksFor, snapMm, stepMm, formatLength } from './units.js';
import {
  CARD, devPxPerMmFromObject, devPxPerMmFromPanel, panelFromDiagonal, estimateCssPxPerMm, screenSignature,
  loadStore, saveStore, pickProfile, pickCheckObject, withProfile, withBorrowed, withoutProfile, statusFor,
} from './calibration.js';
import { isRemoveTarget, pickGuidePx } from './guides.js';
import { COINS, PAPER, deviceList, searchDevices, panelFor, popularDevices, platformOf } from './reference.js';

const PREFS_KEY = 'bm.ruler.prefs.v1';
const EDGES = ['top', 'right', 'bottom', 'left'];
const MAX_GUIDES = 8;
const $ = (id) => document.getElementById(id);

function safeStorage() { try { return window.localStorage; } catch { return null; } }
const blockedStore = { getItem() { throw new Error('no storage'); }, setItem() { throw new Error('no storage'); } };

export function initStage() {
  const stage = $('stage');
  if (!stage) return;
  const store$ = safeStorage() || blockedStore;
  const canvas = $('rc');
  const ctx = canvas.getContext('2d');
  const inner = $('inner');
  const guidesEl = $('guides');
  const objEl = $('obj');
  const handle = $('obj-h');
  const calEl = $('cal');
  const noticeEl = $('notice');
  const readoutEl = $('readout');
  const liveEl = $('live');

  // ---------- state
  const S = {
    unit: stage.dataset.unit || 'both',
    edges: { top: false, right: false, bottom: false, left: false },
    paper: 'auto',
    snap: true,
    cross: false,
    guides: [],
    nextId: 1,
    store: loadStore(store$),
    sig: '',
    profile: null,
    estDev: 0,
    otherScreen: false,
    borrowed: false,
  };
  for (const e of (stage.dataset.edges || 'top,left').split(',')) if (e in S.edges) S.edges[e] = true;
  try {
    const p = JSON.parse(store$.getItem(PREFS_KEY) || 'null');
    if (p && typeof p === 'object') {
      if (p.edges && typeof p.edges === 'object' && !stage.dataset.edgesForced) for (const e of EDGES) if (typeof p.edges[e] === 'boolean') S.edges[e] = p.edges[e];
      if (['auto', 'light', 'dark', 'contrast'].includes(p.paper)) S.paper = p.paper;
      if (typeof p.snap === 'boolean') S.snap = p.snap;
      if (typeof p.cross === 'boolean') S.cross = p.cross;
    }
  } catch { /* storage blocked: defaults */ }
  const savePrefs = () => {
    try { store$.setItem(PREFS_KEY, JSON.stringify({ edges: S.edges, paper: S.paper, snap: S.snap, cross: S.cross })); } catch { /* ignore */ }
  };

  // ---------- scale
  const dprNow = () => window.devicePixelRatio || 1;
  const screenNow = () => ({ w: window.screen.width, h: window.screen.height, dpr: dprNow() });
  const coarse = () => matchMedia('(pointer: coarse)').matches;
  const minSide = () => Math.min(window.screen.width, window.screen.height);

  function resolveProfile() {
    const { w, h, dpr } = screenNow();
    S.sig = screenSignature(w, h, dpr);
    S.estDev = estimateCssPxPerMm({ coarse: coarse(), minSide: minSide() }) * dpr;
    const pick = pickProfile(S.store, S.sig);
    const before = S.profile;
    S.otherScreen = pick.state === 'other';
    S.borrowed = pick.state === 'borrowed';
    S.profile = pick.state === 'match' || pick.state === 'borrowed' ? pick.profile : null;
    return { pick, changed: before !== S.profile };
  }
  /** Device pixels per millimeter at this moment. Zoom does not change it. */
  const devPerMm = () => (S.profile ? S.profile.devPxPerMm : S.estDev);
  const cssPerMm = () => devPerMm() / dprNow();

  // ---------- layout
  // Same rule as the CSS that sets the ruler thickness before the script runs, so nothing jumps.
  const phoneQuery = matchMedia('(max-width: 599px)');
  const isPhone = () => phoneQuery.matches;
  const thick = () => (S.unit === 'both' ? (isPhone() ? 72 : 80) : isPhone() ? 46 : 52);
  const tickMax = () => (S.unit === 'both' ? (isPhone() ? 18 : 24) : isPhone() ? 26 : 28);
  function layout() {
    const t = thick();
    for (const [e, v] of [['top', '--rt'], ['right', '--rr'], ['bottom', '--rb'], ['left', '--rl']]) {
      stage.style.setProperty(v, (S.edges[e] ? t : 0) + 'px');
    }
    stage.dataset.phone = isPhone() ? '1' : '0';
  }

  /** Zero sits at the inner corner of the rulers, so no length is hidden under a ruler. */
  const origin = () => ({ ox: S.edges.left ? thick() : 0, oy: S.edges.top ? thick() : 0 });

  // ---------- colors
  function colors() {
    const dark = document.documentElement.dataset.theme === 'dark';
    const mode = S.paper === 'auto' ? (dark ? 'dark' : 'light') : S.paper;
    if (mode === 'dark') return { bg: '#1d2024', ink: '#eceeed', edge: '#6b7078', hi: false };
    if (mode === 'contrast') return { bg: '#ffe14d', ink: '#000000', edge: '#000000', hi: true };
    return { bg: '#ffffff', ink: '#16181b', edge: '#878c93', hi: false };
  }

  // ---------- drawing (device pixels throughout)
  function draw() {
    const dpr = dprNow();
    const W = stage.clientWidth, H = stage.clientHeight;
    const cw = Math.max(1, Math.round(W * dpr)), ch = Math.max(1, Math.round(H * dpr));
    if (canvas.width !== cw) canvas.width = cw;
    if (canvas.height !== ch) canvas.height = ch;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    const col = colors();
    const dev = devPerMm();
    const css = dev / dpr;
    const T = Math.round(thick() * dpr);
    const TM = Math.round(tickMax() * dpr);
    const units = S.unit === 'both' ? ['cm', 'in'] : [S.unit];
    const fs = Math.round((S.unit === 'both' ? 11 : 12) * dpr);
    const tw0 = Math.max(1, Math.round(dpr * (col.hi ? 2 : 1.5)));
    const tw1 = Math.max(1, Math.round(dpr * (col.hi ? 1.5 : 1)));
    ctx.font = `600 ${fs}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
    ctx.textBaseline = 'middle';

    const { ox, oy } = origin();
    const oxDev = Math.round(ox * dpr), oyDev = Math.round(oy * dpr);
    const rect = (edge, a, dA, dB, tw) => {
      const h = Math.floor(tw / 2);
      if (edge === 'top') ctx.fillRect(a - h, dA, tw, dB - dA);
      else if (edge === 'bottom') ctx.fillRect(a - h, ch - dB, tw, dB - dA);
      else if (edge === 'left') ctx.fillRect(dA, a - h, dB - dA, tw);
      else ctx.fillRect(cw - dB, a - h, dB - dA, tw);
    };
    const point = (edge, a, d) => (edge === 'top' ? [a, d] : edge === 'bottom' ? [a, ch - d] : edge === 'left' ? [d, a] : [cw - d, a]);

    for (const edge of EDGES) {
      if (!S.edges[edge]) continue;
      const horizontal = edge === 'top' || edge === 'bottom';
      const base = horizontal ? oxDev : oyDev;
      const lengthMm = ((horizontal ? cw : ch) - base) / dev;
      ctx.fillStyle = col.bg;
      if (horizontal) ctx.fillRect(0, edge === 'top' ? 0 : ch - T, cw, T);
      else ctx.fillRect(edge === 'left' ? 0 : cw - T, 0, T, ch);
      ctx.fillStyle = col.edge;
      if (horizontal) ctx.fillRect(0, edge === 'top' ? T - 1 : ch - T, cw, 1);
      else ctx.fillRect(edge === 'left' ? T - 1 : cw - T, 0, 1, ch);

      units.forEach((unit, u) => {
        const plan = tickPlan(unit, css);
        const ticks = ticksFor(plan, lengthMm, dev);
        const fromInner = units.length === 2 && u === 1;
        const stacked = !horizontal && units.length === 2 && isPhone();
        const labelD = units.length === 2
          ? (fromInner ? T - TM - Math.round(9 * dpr) : TM + Math.round(9 * dpr))
          : TM + Math.round(12 * dpr);
        for (const t of ticks) {
          const a = base + Math.round(t.mm * dev);
          const rel = a - base;
          const len = Math.max(2, Math.round(t.ratio * TM));
          const tw = t.level === 0 ? tw0 : tw1;
          ctx.fillStyle = col.ink;
          if (fromInner) rect(edge, a, T - 1 - len, T - 1, tw); else rect(edge, a, 0, len, tw);
          if (t.label) {
            const text = t.i === 0 ? (horizontal ? `0 ${unit}` : '0') : t.label;
            const [px, py] = point(edge, a, labelD);
            ctx.fillStyle = col.ink;
            const w = ctx.measureText(text).width;
            if (horizontal) {
              const lead = rel < w / 2 + 3 * dpr;
              ctx.textAlign = lead ? 'left' : 'center';
              ctx.fillText(text, lead ? a + 3 * dpr : px, py);
            } else {
              const y = rel < fs ? a + fs * 0.7 : py;
              const y0 = t.i === 0 ? a + fs * 0.9 : y;
              if (stacked) {
                // Phone, two units on one side: cm sits right-aligned and inch left-aligned either side of the middle,
                // and fraction labels are dropped, so no two labels touch.
                if (unit === 'in' && t.i !== 0 && /\D/.test(text)) continue;
                const outerSide = !fromInner; // cm label sits on the outer half, toward the screen edge
                const d = outerSide ? T / 2 - 4 * dpr : T / 2 + 4 * dpr;
                const [lx] = point(edge, a, d);
                ctx.textAlign = (outerSide ? 'right' : 'left') === 'right' ? (edge === 'left' ? 'right' : 'left') : (edge === 'left' ? 'left' : 'right');
                ctx.fillText(text, lx, y0);
              } else {
                ctx.textAlign = 'center';
                ctx.fillText(text, px, y0);
              }
            }
          }
        }
      });
    }
    // Corners where two rulers meet.
    ctx.fillStyle = col.bg;
    const cs = [['top', 'left', 0, 0], ['top', 'right', cw - T, 0], ['bottom', 'left', 0, ch - T], ['bottom', 'right', cw - T, ch - T]];
    for (const [a, b, x, y] of cs) if (S.edges[a] && S.edges[b]) ctx.fillRect(x, y, T, T);
    placeGuides();
  }

  // ---------- length text
  function shortLen(mm) {
    if (S.unit === 'in') return `${toFraction(mm).text} in`;
    if (S.unit === 'mm') return `${fmt(mm, 1)} mm`;
    if (S.unit === 'px') return `${Math.round(mm * cssPerMm())} px`;
    return `${fmt(mm / 10, 2)} cm`;
  }
  function longLen(mm) {
    if (S.unit === 'px') return `${Math.round(mm * cssPerMm())} px = ${formatLength(mm).cm} = ${formatLength(mm).fraction}`;
    return readoutText(mm, S.unit === 'both' ? 'cm' : S.unit);
  }
  const snapUnit = () => (S.unit === 'both' ? 'cm' : S.unit);

  // ---------- guides
  function makeGuideEl(g) {
    const el = document.createElement('div');
    el.className = `guide g${g.axis}`;
    el.tabIndex = 0;
    el.style.setProperty('--ls', String(g.id % 4)); // stagger labels so neighbours do not overlap
    el.setAttribute('role', 'slider');
    el.setAttribute('aria-orientation', g.axis === 'x' ? 'horizontal' : 'vertical');
    el.setAttribute('aria-label', `${g.axis === 'x' ? 'Vertical' : 'Horizontal'} guide ${g.id}`);
    el.innerHTML = '<span class="gl"><span class="gt"></span><button type="button" class="gdel" data-remove aria-label="Remove guide" tabindex="-1">×</button></span>';
    el.addEventListener('pointerdown', (e) => {
      if (isRemoveTarget(e.target)) return;
      e.preventDefault();
      startDrag(g, e);
    });
    el.addEventListener('dblclick', () => removeGuide(g));
    el.querySelector('[data-remove]').addEventListener('click', (e) => { e.stopPropagation(); removeGuide(g); });
    el.addEventListener('keydown', (e) => {
      const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (dir) {
        e.preventDefault();
        const step = stepMm(snapUnit(), cssPerMm()) * (e.shiftKey ? 10 : 1);
        moveGuide(g, g.mm + dir * step, true);
        announce();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        removeGuide(g);
      }
    });
    guidesEl.appendChild(el);
    g.el = el;
    g.label = el.querySelector('.gt');
  }
  function extentMm(axis) {
    const { ox, oy } = origin();
    return (axis === 'x' ? stage.clientWidth - ox : stage.clientHeight - oy) / cssPerMm();
  }
  /** Spot for a button-made guide: in the visible area, clear of the title and controls, stepped from the last one. */
  function freeSpotMm(axis) {
    const r = stage.getBoundingClientRect();
    const { ox, oy } = origin();
    const t = thick();
    const vis = axis === 'x' ? r.width - ox - (S.edges.right ? t : 0) : r.height - oy - (S.edges.bottom ? t : 0);
    let from = 0;
    if (axis === 'x') {
      for (const el of stage.querySelectorAll('.head h1, .head .lede, .head .hint')) {
        const b = el.getBoundingClientRect();
        if (b.width && b.height && getComputedStyle(el).display !== 'none') from = Math.max(from, b.right - r.left - ox + 40);
      }
    } else {
      const bar = stage.querySelector('.bar');
      if (bar) from = bar.getBoundingClientRect().bottom - r.top - oy + 40;
    }
    const existing = S.guides.filter((g) => g.axis === axis).map((g) => g.mm * cssPerMm());
    const px = pickGuidePx({ visible: vis, freeFrom: from, existing });
    return Math.max(px / cssPerMm(), 1);
  }
  function addGuide(axis, mm, silent) {
    if (S.guides.length >= MAX_GUIDES) { say('You can have up to 8 guides. Remove one first.'); return null; }
    const g = { id: S.nextId++, axis, mm: 0, el: null, label: null };
    S.guides.push(g);
    makeGuideEl(g);
    moveGuide(g, mm, false);
    if (!silent) announce();
    return g;
  }
  function moveGuide(g, mm, snap) {
    let v = Math.max(0, Math.min(extentMm(g.axis), mm));
    if (snap && S.snap) v = Math.max(0, snapMm(v, snapUnit(), cssPerMm()));
    g.mm = v;
    g.touched = ++touchCounter;
    placeGuide(g);
    renderReadout();
  }
  let touchCounter = 0;
  function placeGuide(g) {
    const { ox, oy } = origin();
    const px = g.mm * cssPerMm();
    if (g.axis === 'x') g.el.style.left = `${ox + px}px`; else g.el.style.top = `${oy + px}px`;
    const t = shortLen(g.mm);
    g.label.textContent = t;
    g.el.setAttribute('aria-valuetext', t);
    g.el.setAttribute('aria-valuenow', String(Math.round(g.mm * 10) / 10));
  }
  function placeGuides() { for (const g of S.guides) placeGuide(g); }
  function removeGuide(g) {
    g.el.remove();
    S.guides = S.guides.filter((x) => x !== g);
    renderReadout();
    announce();
  }
  function clearGuides() { for (const g of [...S.guides]) g.el.remove(); S.guides = []; renderReadout(); announce(); }

  let drag = null;
  function startDrag(g, e) {
    drag = { g, id: e.pointerId };
    g.el.classList.add('is-drag');
    g.el.focus({ preventScroll: true });
    dragMove(e);
  }
  function dragMove(e) {
    if (!drag) return;
    const r = stage.getBoundingClientRect();
    const { ox, oy } = origin();
    const mm = drag.g.axis === 'x' ? (e.clientX - r.left - ox) / cssPerMm() : (e.clientY - r.top - oy) / cssPerMm();
    moveGuide(drag.g, mm, true);
  }
  window.addEventListener('pointermove', (e) => { if (drag && e.pointerId === drag.id) dragMove(e); });
  const endDrag = (e) => {
    if (drag && e.pointerId === drag.id) { drag.g.el.classList.remove('is-drag'); drag = null; announce(); }
  };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // Pull a guide out of a ruler: the guide is perpendicular to the ruler, at the spot you press.
  for (const hit of stage.querySelectorAll('.hit')) {
    hit.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const r = stage.getBoundingClientRect();
      const axis = hit.dataset.edge === 'top' || hit.dataset.edge === 'bottom' ? 'x' : 'y';
      const { ox, oy } = origin();
      const px = axis === 'x' ? e.clientX - r.left - ox : e.clientY - r.top - oy;
      const near = S.guides.find((g) => g.axis === axis && Math.abs(g.mm * cssPerMm() - px) < 12);
      if (near) return startDrag(near, e);
      const g = addGuide(axis, px / cssPerMm(), true);
      if (g) startDrag(g, e);
    });
  }

  // ---------- readout
  function spanFor(axis) {
    const list = S.guides.filter((g) => g.axis === axis).sort((a, b) => b.touched - a.touched);
    if (list.length === 0) return null;
    const r = list.length === 1 ? { mm: list[0].mm, note: 'from the edge' } : { mm: Math.abs(list[0].mm - list[1].mm), note: 'between the last two guides' };
    return r.mm >= 0.05 ? r : null; // never show a zero length
  }
  function readoutLines() {
    const x = spanFor('x'), y = spanFor('y');
    const rows = [];
    if (x) rows.push({ name: 'Width', ...x });
    if (y) rows.push({ name: 'Height', ...y });
    if (x && y) rows.push({ name: 'Diagonal', mm: Math.hypot(x.mm, y.mm), note: 'across the box' });
    return rows;
  }
  function renderReadout() {
    const rows = readoutLines();
    readoutEl.replaceChildren();
    readoutEl.hidden = rows.length === 0;
    for (const r of rows) {
      const line = document.createElement('div');
      line.className = 'ro-row';
      const text = longLen(r.mm);
      const k = document.createElement('span');
      k.className = 'ro-k';
      k.textContent = r.name;
      const v = document.createElement('span');
      v.className = 'ro-v';
      v.textContent = text;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn ro-copy';
      b.textContent = 'Copy';
      b.setAttribute('aria-label', `Copy ${r.name.toLowerCase()}: ${text}`);
      b.addEventListener('click', () => copyText(`${r.name}: ${text}`));
      line.append(k, v, b);
      readoutEl.appendChild(line);
    }
  }
  function announce() {
    const rows = readoutLines();
    liveEl.textContent = rows.length ? rows.map((r) => `${r.name} ${longLen(r.mm)}`).join('. ') : `${S.guides.length} guides`;
  }
  function say(msg) { liveEl.textContent = msg; showToast(msg); }
  let toastTimer;
  function showToast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2200);
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); say('Copied'); } catch { say('Copy is blocked. Select the text and copy it.'); }
  }

  // ---------- crosshair
  const cross = $('cross');
  stage.addEventListener('pointermove', (e) => {
    if (!S.cross || drag || calOpen) return;
    const r = stage.getBoundingClientRect();
    const { ox, oy } = origin();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    cross.hidden = false;
    cross.style.setProperty('--cx', `${x}px`);
    cross.style.setProperty('--cy', `${y}px`);
    $('cross-l').textContent = `${shortLen(Math.max(0, x - ox) / cssPerMm())}, ${shortLen(Math.max(0, y - oy) / cssPerMm())}`;
    cross.dataset.flip = x > r.width - 150 ? 'l' : 'r';
  });
  stage.addEventListener('pointerleave', () => { cross.hidden = true; });

  // ---------- controls
  function paintControls() {
    for (const b of document.querySelectorAll('#seg [data-unit]')) b.setAttribute('aria-checked', String(b.dataset.unit === S.unit));
    for (const e of EDGES) { const c = $('edge-' + e); if (c) c.checked = S.edges[e]; }
    $('opt-snap').checked = S.snap;
    $('opt-cross').checked = S.cross;
    $('opt-paper').value = S.paper;
    cross.hidden = true;
    paintStatus();
  }
  function paintStatus() {
    const st = statusFor(S.profile, S.borrowed);
    for (const chip of document.querySelectorAll('[data-cal-chip]')) {
      chip.dataset.kind = st.kind;
      chip.title = st.text;
      chip.querySelector('[data-cal-chip-text]').textContent = st.short;
    }
    $('opt-reset').hidden = !S.profile && !S.borrowed;
  }
  function rerender() { layout(); paintControls(); draw(); renderReadout(); }

  for (const b of document.querySelectorAll('#seg [data-unit]')) {
    b.addEventListener('click', () => { S.unit = b.dataset.unit; rerender(); announce(); });
  }
  for (const e of EDGES) {
    $('edge-' + e).addEventListener('change', (ev) => { S.edges[e] = ev.target.checked; savePrefs(); rerender(); });
  }
  $('opt-snap').addEventListener('change', (e) => { S.snap = e.target.checked; savePrefs(); });
  $('opt-cross').addEventListener('change', (e) => { S.cross = e.target.checked; savePrefs(); cross.hidden = true; });
  $('opt-paper').addEventListener('change', (e) => { S.paper = e.target.value; savePrefs(); draw(); });
  $('btn-guide').addEventListener('click', () => {
    const vertical = (S.edges.left || S.edges.right) && !(S.edges.top || S.edges.bottom);
    const axis = vertical ? 'y' : 'x';
    addGuide(axis, freeSpotMm(axis));
  });
  $('opt-add-x').addEventListener('click', () => addGuide('x', freeSpotMm('x')));
  $('opt-add-y').addEventListener('click', () => addGuide('y', freeSpotMm('y')));
  $('opt-clear').addEventListener('click', clearGuides);
  $('opt-reset').addEventListener('click', () => {
    S.store = withoutProfile(S.store, S.sig);
    saveStore(store$, S.store);
    resolveProfile();
    rerender();
    say('Calibration removed for this screen');
  });
  const moreBtn = $('btn-more'), more = $('more');
  moreBtn.addEventListener('click', () => {
    const open = more.hidden;
    more.hidden = !open;
    moreBtn.setAttribute('aria-expanded', String(open));
  });
  for (const b of document.querySelectorAll('[data-cal-open]')) b.addEventListener('click', () => openCal());

  // ---------- full screen, wake lock, keys
  const fsBtn = $('btn-full');
  const fsOk = !!(document.fullscreenEnabled && stage.requestFullscreen);
  fsBtn.hidden = !fsOk;
  if (!fsOk) $('hint-full').remove();
  async function toggleFull() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen(); else await stage.requestFullscreen();
    } catch { say('Full screen is blocked in this browser.'); }
  }
  fsBtn.addEventListener('click', toggleFull);
  document.addEventListener('fullscreenchange', () => { fsBtn.setAttribute('aria-pressed', String(!!document.fullscreenElement)); draw(); });

  let wake = null;
  async function keepAwake() {
    try { if ('wakeLock' in navigator && document.visibilityState === 'visible') wake = await navigator.wakeLock.request('screen'); } catch { wake = null; }
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { keepAwake(); checkScreen(); } });
  if (coarse()) { keepAwake(); }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const tag = (e.target && e.target.tagName) || '';
    if (/INPUT|SELECT|TEXTAREA/.test(tag) || e.target.isContentEditable) return;
    if (e.key === 'Escape' && calOpen) { closeCal(); return; }
    if (e.key === 'f' || e.key === 'F') { if (fsOk) { e.preventDefault(); toggleFull(); } }
    else if (e.key === 'c' || e.key === 'C') { S.cross = !S.cross; $('opt-cross').checked = S.cross; savePrefs(); cross.hidden = true; say(S.cross ? 'Crosshair on' : 'Crosshair off'); }
  });

  // ---------- notices
  function setNotice(html, actions) {
    noticeEl.replaceChildren();
    if (!html) { noticeEl.hidden = true; return; }
    const p = document.createElement('p');
    p.textContent = html;
    noticeEl.appendChild(p);
    const row = document.createElement('div');
    row.className = 'row';
    for (const a of actions || []) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn' + (a.primary ? ' primary' : '');
      b.textContent = a.label;
      b.addEventListener('click', a.run);
      row.appendChild(b);
    }
    if (actions && actions.length) noticeEl.appendChild(row);
    noticeEl.hidden = false;
  }
  let flashTimer = 0;
  function checkScreen() {
    const before = S.sig;
    const prevProfile = S.profile;
    const { pick } = resolveProfile();
    if (pick.state === 'other') {
      setNotice('This looks like another screen. Calibrate it, or keep the saved calibration of your other screen.', [
        { label: 'Calibrate this screen', primary: true, run: () => { setNotice(''); openCal(); } },
        { label: 'Use the saved one', run: () => {
          const key = S.store.active && S.store.profiles[S.store.active] ? S.store.active : Object.keys(S.store.profiles)[0];
          S.store = withBorrowed(S.store, S.sig, key); // stored for this screen: it stays after a resize or a reload
          saveStore(store$, S.store);
          resolveProfile();
          setNotice(''); rerender();
        } },
      ]);
    } else if (pick.state === 'match' && before && before !== S.sig && prevProfile !== S.profile) {
      setNotice('Switched to the saved calibration for this screen.', []);
      clearTimeout(flashTimer);
      flashTimer = setTimeout(() => setNotice(''), 4000);
    } else if (noticeEl.dataset.kind !== 'pinch') {
      setNotice('');
    }
    rerender();
  }
  function checkPinch() {
    const vv = window.visualViewport;
    if (vv && Math.abs(vv.scale - 1) > 0.02) {
      noticeEl.dataset.kind = 'pinch';
      setNotice('Pinch zoom is on, so the ruler is not true size. Zoom out to 100 percent.', []);
    } else if (noticeEl.dataset.kind === 'pinch') {
      noticeEl.dataset.kind = '';
      setNotice('');
    }
  }
  if (window.visualViewport) window.visualViewport.addEventListener('resize', checkPinch);

  // ---------- calibration panel
  let calOpen = false;
  const cal = { tab: 'card', rotated: false, cssW: 300, spec: null, usedId: null };
  const tabs = ['card', 'coin', 'device', 'size'];

  function objectSpec() {
    if (cal.tab === 'card') {
      const portrait = cal.rotated;
      return { kind: 'rect', wMm: portrait ? CARD.h : CARD.w, hMm: portrait ? CARD.w : CARD.h, method: 'card', id: 'card', name: 'credit card' };
    }
    const id = $('coin-select').value;
    const coin = COINS.find((c) => c.id === id);
    if (coin) return { kind: 'circle', wMm: coin.mm, hMm: coin.mm, method: 'coin', id: coin.id, name: coin.name };
    const paper = PAPER.find((p) => p.id === id);
    return { kind: 'bar', wMm: paper.w, hMm: paper.w / 8, method: 'paper', id: paper.id, name: paper.name };
  }
  function availableWidth() { return stage.clientWidth - (S.edges.left ? thick() : 0) - (S.edges.right ? thick() : 0); }

  function showObject(spec, startCssW) {
    objEl.hidden = false;
    objEl.dataset.kind = spec.kind;
    cal.spec = spec;
    cal.cssW = startCssW;
    // Put it near the middle of the free area.
    const free = availableWidth();
    const left = (S.edges.left ? thick() : 0) + Math.max(8, (free - cal.cssW) / 2 - (stage.clientWidth > 900 ? 120 : 0));
    const top = (S.edges.top ? thick() : 0) + (isPhone() ? 30 : 140);
    // Keep the outline clear of the left ruler, and leave room on the right for the grip.
    const minLeft = (S.edges.left ? thick() : 0) + 12;
    objEl.style.left = `${Math.max(minLeft, Math.min(left, stage.clientWidth - cal.cssW - 50))}px`;
    objEl.style.top = `${top}px`;
    sizeObject();
  }
  function sizeObject() {
    const s = cal.spec;
    objEl.style.width = `${cal.cssW}px`;
    let h = cal.spec.kind === 'bar' ? 36 : (cal.cssW * s.hMm) / s.wMm;
    // On a phone the sheet covers the lower half. Only the width matters, so cut the outline above the sheet.
    objEl.classList.remove('cut');
    if (isPhone()) {
      const free = stage.clientHeight * 0.5 - (S.edges.bottom ? thick() : 0) - objEl.offsetTop - 6;
      if (h > free) { h = Math.max(70, free); objEl.classList.add('cut'); }
    }
    objEl.style.height = `${h}px`;
    handle.setAttribute('aria-valuenow', String(Math.round((cal.cssW / s.wMm) * 100) / 100));
    handle.setAttribute('aria-valuetext', `${s.name}, ${fmt(cal.cssW / (cal.spec.wMm), 3)} CSS pixels per millimeter`);
    $('obj-l').textContent = `${s.name}: ${fmt(s.wMm, 2)} mm`;
  }
  function nudge(deltaMm) {
    cal.cssW = Math.max(40, cal.cssW + deltaMm * (cal.cssW / cal.spec.wMm));
    sizeObject();
  }

  // Dragging the outline, its right handle, and pinch.
  const pts = new Map();
  let objDrag = null;
  objEl.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#obj-h')) return;
    e.preventDefault();
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 1) objDrag = { mode: 'move', x: e.clientX, y: e.clientY, l: objEl.offsetLeft, t: objEl.offsetTop };
    if (pts.size === 2) { const [a, b] = [...pts.values()]; objDrag = { mode: 'pinch', d: Math.hypot(a.x - b.x, a.y - b.y), w: cal.cssW }; }
  });
  handle.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    objDrag = { mode: 'size', id: e.pointerId, left: objEl.getBoundingClientRect().left };
    handle.focus({ preventScroll: true });
  });
  window.addEventListener('pointermove', (e) => {
    if (!objDrag) return;
    if (objDrag.mode === 'size' && e.pointerId === objDrag.id) {
      cal.cssW = Math.max(40, e.clientX - objDrag.left);
      sizeObject();
    } else if (pts.has(e.pointerId)) {
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (objDrag.mode === 'move' && pts.size === 1) {
        objEl.style.left = `${objDrag.l + e.clientX - objDrag.x}px`;
        objEl.style.top = `${objDrag.t + e.clientY - objDrag.y}px`;
      } else if (objDrag.mode === 'pinch' && pts.size === 2) {
        const [a, b] = [...pts.values()];
        cal.cssW = Math.max(40, (objDrag.w * Math.hypot(a.x - b.x, a.y - b.y)) / objDrag.d);
        sizeObject();
      }
    }
  });
  const objUp = (e) => { pts.delete(e.pointerId); if (objDrag && (objDrag.mode === 'size' ? e.pointerId === objDrag.id : pts.size === 0)) objDrag = null; };
  window.addEventListener('pointerup', objUp);
  window.addEventListener('pointercancel', objUp);
  handle.addEventListener('keydown', (e) => {
    const d = { ArrowRight: 0.1, ArrowUp: 0.1, ArrowLeft: -0.1, ArrowDown: -0.1 }[e.key];
    if (d) { e.preventDefault(); nudge(d * (e.shiftKey ? 10 : 1)); }
  });

  function setTab(tab) {
    cal.tab = tab;
    for (const t of tabs) {
      $('tab-' + t).setAttribute('aria-selected', String(t === tab));
      $('tab-' + t).tabIndex = t === tab ? 0 : -1;
      $('pane-' + t).hidden = t !== tab;
    }
    if (tab === 'card' || tab === 'coin') {
      if (tab === 'coin') fillCoinNote();
      const spec = objectSpec();
      const cur = cssPerMm();
      let w = spec.wMm * cur;
      if (spec.kind === 'bar' && w > availableWidth() - 62) w = availableWidth() - 62;
      showObject(spec, Math.max(60, Math.min(w, availableWidth() - 62)));
    } else {
      objEl.hidden = true;
    }
    $('cal-error').textContent = '';
  }
  function fillCoinNote() {
    const id = $('coin-select').value;
    const c = COINS.find((x) => x.id === id);
    const link = $('coin-src');
    if (c) { link.hidden = false; link.href = c.source; } else { link.hidden = true; }
    const p = PAPER.find((x) => x.id === id);
    $('coin-note').textContent = p ? 'Hold the paper flat on the screen and match its width to the bar. Paper does not fit on most phones.' : 'Lay the coin flat on the screen and match its edge to the circle.';
  }
  function openCal(tab) {
    calOpen = true;
    calEl.hidden = false;
    $('cal-pick').hidden = false;
    $('cal-verify').hidden = true;
    $('cal-done').hidden = true;
    const wantsRotate = (CARD.w * cssPerMm()) > availableWidth() - 60;
    cal.rotated = wantsRotate;
    $('card-rot-note').hidden = !wantsRotate;
    setTab(tab || cal.tab);
    stage.classList.add('is-cal');
    $('cal-h').focus();
  }
  function closeCal() {
    calOpen = false;
    calEl.hidden = true;
    objEl.hidden = true;
    stage.classList.remove('is-cal');
    paintStatus();
    for (const b of document.querySelectorAll('[data-cal-open]')) { if (b.offsetParent) { b.focus({ preventScroll: true }); break; } }
  }
  $('cal-close').addEventListener('click', closeCal);
  for (const t of tabs) {
    $('tab-' + t).addEventListener('click', () => setTab(t));
    $('tab-' + t).addEventListener('keydown', (e) => {
      const i = tabs.indexOf(t);
      const n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
      if (n === null) return;
      e.preventDefault();
      const to = tabs[(n + tabs.length) % tabs.length];
      setTab(to);
      $('tab-' + to).focus();
    });
  }
  $('card-rotate').addEventListener('click', () => { cal.rotated = !cal.rotated; setTab('card'); });
  $('coin-select').addEventListener('change', () => setTab('coin'));
  for (const b of document.querySelectorAll('[data-nudge]')) b.addEventListener('click', () => nudge(Number(b.dataset.nudge)));
  for (const b of document.querySelectorAll('[data-fit]')) b.addEventListener('click', () => confirmObject());

  function profileBase(method, devPxPerMm, extra) {
    const { w, h, dpr } = screenNow();
    return { method, devPxPerMm, cssPxPerMmAtCal: devPxPerMm / dpr, dprAtCal: dpr, screenW: w, screenH: h, ts: Date.now(), ...extra };
  }
  function applyProfile(profile) {
    S.store = withProfile(S.store, S.sig, profile);
    saveStore(store$, S.store);
    S.profile = profile;
    S.otherScreen = false;
    setNotice('');
    rerender();
  }
  function confirmObject() {
    const spec = cal.spec;
    const dev = devPxPerMmFromObject(cal.cssW, spec.wMm, dprNow());
    if (!(dev > 1 && dev < 100)) { $('cal-error').textContent = 'That size looks wrong. Try again.'; return; }
    cal.usedId = spec.id;
    applyProfile(profileBase(spec.method, dev, { objectName: spec.name }));
    goVerify();
  }

  // Device and diagonal methods.
  function renderDeviceResults() {
    const q = $('dev-q').value.trim();
    const list = q ? searchDevices(q) : popularDevices(platformOf({ userAgent: navigator.userAgent, platform: navigator.platform, maxTouchPoints: navigator.maxTouchPoints }));
    const ul = $('dev-list');
    ul.replaceChildren();
    $('dev-count').textContent = q ? `${list.length} match${list.length === 1 ? '' : 'es'}` : 'Popular devices for this kind of screen. Type to search.';
    for (const d of list.slice(0, 40)) {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'dev';
      b.innerHTML = '<span class="dn"></span><span class="dd"></span>';
      b.querySelector('.dn').textContent = d.name;
      b.querySelector('.dd').textContent = d.computed ? `${d.diag} in, computed from size and resolution` : `${d.brand}, ${d.diag} in`;
      b.addEventListener('click', () => {
        const panel = panelFor(d);
        const dev = devPxPerMmFromPanel(panel.longMm, Math.max(window.screen.width, window.screen.height), dprNow());
        applyProfile(profileBase('device', dev, { deviceId: d.id, objectName: d.name }));
        cal.usedId = null;
        goVerify();
      });
      li.appendChild(b);
      ul.appendChild(li);
    }
  }
  $('dev-q').addEventListener('input', renderDeviceResults);
  $('tab-device').addEventListener('click', renderDeviceResults);
  $('size-apply').addEventListener('click', () => {
    let d = Number($('size-d').value.replace(',', '.'));
    if (!(d > 0)) { $('cal-error').textContent = 'Type the screen size, for example 15.6.'; return; }
    if ($('size-u').value === 'cm') d /= 2.54;
    if (d < 3 || d > 120) { $('cal-error').textContent = 'That size looks wrong. Screens are 3 to 120 inches across the diagonal.'; return; }
    const aspectSel = $('size-a').value;
    const aspect = aspectSel === 'auto' ? Math.max(window.screen.width, window.screen.height) / Math.min(window.screen.width, window.screen.height) : Number(aspectSel);
    const panel = panelFromDiagonal(d, aspect);
    const dev = devPxPerMmFromPanel(panel.longMm, Math.max(window.screen.width, window.screen.height), dprNow());
    $('cal-error').textContent = '';
    applyProfile(profileBase('diagonal', dev, { diagIn: d, aspect }));
    cal.usedId = null;
    goVerify();
  });

  // Verify: show a second object at its true size on the new scale.
  function checkChoices() {
    const sel = $('check-select');
    if (!sel.options.length) {
      const add = (id, label) => { const o = document.createElement('option'); o.value = id; o.textContent = label; sel.appendChild(o); };
      for (const c of COINS) add(c.id, c.name);
      add('card', 'Credit card');
    }
    // The object used to calibrate cannot prove the calibration, so it is not offered.
    for (const o of sel.options) o.disabled = o.value === cal.usedId;
  }
  function paintCheck() {
    const id = $('check-select').value;
    const coin = COINS.find((c) => c.id === id);
    const spec = coin
      ? { kind: 'circle', wMm: coin.mm, hMm: coin.mm, id, name: coin.name, method: 'check' }
      : { kind: 'rect', wMm: CARD.w, hMm: CARD.h, id: 'card', name: 'credit card', method: 'check' };
    cal.spec = spec;
    cal.cssW = spec.wMm * cssPerMm();
    showObject(spec, cal.cssW);
    objEl.dataset.check = '1';
    objEl.querySelector('#obj-h').hidden = true;
  }
  function goVerify() {
    $('cal-pick').hidden = true;
    $('cal-done').hidden = true;
    $('cal-verify').hidden = false;
    checkChoices();
    $('check-select').value = pickCheckObject(cal.usedId);
    paintCheck();
    $('verify-yes').focus();
  }
  $('check-select').addEventListener('change', paintCheck);
  const finishVerify = () => {
    objEl.dataset.check = '';
    objEl.querySelector('#obj-h').hidden = false;
    objEl.hidden = true;
    $('cal-verify').hidden = true;
    $('cal-done').hidden = false;
    paintStatus();
    $('done-text').textContent = S.profile.verified
      ? 'Saved on this screen. Your check matched.'
      : 'Saved on this screen. You can check it later with a coin or card.';
    $('done-close').focus();
  };
  $('verify-yes').addEventListener('click', () => {
    applyProfile({ ...S.profile, verified: true });
    finishVerify();
  });
  $('verify-skip').addEventListener('click', finishVerify);
  $('verify-no').addEventListener('click', () => {
    objEl.dataset.check = '';
    objEl.querySelector('#obj-h').hidden = false;
    $('cal-verify').hidden = true;
    $('cal-pick').hidden = false;
    setTab(cal.tab === 'coin' ? 'coin' : 'card');
    $('cal-error').textContent = 'The check did not match. Try the card method again and zoom in on the edges.';
  });
  $('done-close').addEventListener('click', closeCal);

  // ---------- start
  function frame() { layout(); draw(); }
  let raf = 0;
  const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { checkScreen(); }); };
  new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }).observe(stage);
  window.addEventListener('resize', schedule);
  window.addEventListener('orientationchange', schedule);
  function watchDpr() {
    const mq = matchMedia(`(resolution: ${dprNow()}dppx)`);
    mq.addEventListener('change', () => { schedule(); watchDpr(); }, { once: true });
  }
  watchDpr();
  document.documentElement.addEventListener('themechange', draw);
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  resolveProfile();
  if (S.otherScreen) checkScreen(); else rerender();
  if (stage.dataset.openCal === '1') openCal('card');
  if (/[?&]debug\b/.test(location.search)) window.__ruler = { S, devPerMm, cssPerMm, addGuide, openCal, draw };
}
