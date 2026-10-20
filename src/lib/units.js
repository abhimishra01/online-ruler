// Pure length math for the ruler: no DOM, no storage. Tested by scripts/test-ruler.mjs.
// All lengths are millimeters unless a name says otherwise.

export const MM_PER_IN = 25.4;

export const mmToIn = (mm) => mm / MM_PER_IN;
export const inToMm = (inch) => inch * MM_PER_IN;

export const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** Trim trailing zeros: fmt(3.5, 3) = "3.5", fmt(3, 2) = "3". */
export function fmt(n, digits) {
  if (!Number.isFinite(n)) return '0';
  const s = n.toFixed(digits);
  const t = s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
  return t === '-0' ? '0' : t;
}

/**
 * Round a length in mm to the nearest 1/denom inch and reduce the fraction.
 * 92.075 mm -> { whole: 3, num: 5, den: 8, text: "3 5/8" }
 */
export function toFraction(mm, denom = 16) {
  const sign = mm < 0 ? -1 : 1;
  const steps = Math.round(Math.abs(mmToIn(mm)) * denom);
  const whole = Math.floor(steps / denom);
  let num = steps % denom;
  let den = denom;
  if (num > 0) {
    const g = gcd(num, den);
    num /= g;
    den /= g;
  } else {
    den = 1;
  }
  const body = num === 0 ? String(whole) : whole === 0 ? `${num}/${den}` : `${whole} ${num}/${den}`;
  const text = sign < 0 && steps > 0 ? `-${body}` : body;
  return { sign, whole, num, den, text, decimal: (sign * steps) / denom };
}

/** One length in every unit, as display text. */
export function formatLength(mm) {
  const frac = toFraction(mm);
  return {
    mm: `${fmt(mm, 1)} mm`,
    cm: `${fmt(mm / 10, 2)} cm`,
    inch: `${fmt(mmToIn(mm), 3)} in`,
    fraction: `${frac.text} in`,
  };
}

/** The line shown under the guides, led by the unit the user chose. */
export function readoutText(mm, unit) {
  const f = formatLength(mm);
  if (unit === 'in') return `${f.fraction} = ${f.inch} = ${f.mm}`;
  if (unit === 'mm') return `${f.mm} = ${f.cm} = ${f.fraction}`;
  return `${f.cm} = ${f.mm} = ${f.fraction}`;
}

/** Size of one tick step in the unit the user nudges by, in mm (px needs the scale). */
export function stepMm(unit, cssPxPerMm) {
  if (unit === 'in') return MM_PER_IN / 16;
  if (unit === 'px') return 1 / cssPxPerMm;
  return 1;
}

/**
 * Tick plan for one scale. Steps are counted from zero. Levels go from the longest tick to the shortest.
 * Each level is "every N steps". A level shows a label when it has one.
 */
export function tickPlan(unit, cssPxPerMm) {
  if (unit === 'in') {
    return {
      unit, stepMm: MM_PER_IN / 16,
      levels: [
        { every: 16, ratio: 1, label: (i) => String(i / 16) },
        { every: 8, ratio: 0.78, label: () => '½' },
        { every: 4, ratio: 0.6 },
        { every: 2, ratio: 0.45 },
        { every: 1, ratio: 0.3 },
      ],
    };
  }
  if (unit === 'mm') {
    return {
      unit, stepMm: 1,
      levels: [
        { every: 10, ratio: 1, label: (i) => String(i) },
        { every: 5, ratio: 0.66 },
        { every: 1, ratio: 0.4 },
      ],
    };
  }
  if (unit === 'px') {
    return {
      unit, stepMm: 10 / cssPxPerMm, // one step = 10 CSS pixels
      levels: [
        { every: 10, ratio: 1, label: (i) => String(i * 10) },
        { every: 5, ratio: 0.66 },
        { every: 1, ratio: 0.4 },
      ],
    };
  }
  return { // cm: a tick per mm, a number per cm
    unit: 'cm', stepMm: 1,
    levels: [
      { every: 10, ratio: 1, label: (i) => String(i / 10) },
      { every: 5, ratio: 0.66 },
      { every: 1, ratio: 0.4 },
    ],
  };
}

/** Which level a step index belongs to (0 = longest), or -1 for none. */
export function levelOf(plan, i) {
  for (let k = 0; k < plan.levels.length; k++) if (i % plan.levels[k].every === 0) return k;
  return -1;
}

/**
 * Every tick that fits in lengthMm, skipping levels that would be packed closer than minDevPx device pixels.
 * Returns [{ i, mm, level, ratio, label }].
 */
export function ticksFor(plan, lengthMm, devPxPerMm, minDevPx = 4) {
  const spacing = (lvl) => plan.levels[lvl].every * plan.stepMm * devPxPerMm;
  let finest = plan.levels.length - 1;
  while (finest > 0 && spacing(finest) < minDevPx) finest--;
  const out = [];
  const count = Math.floor(lengthMm / plan.stepMm + 1e-9);
  for (let i = 0; i <= count; i++) {
    const level = levelOf(plan, i);
    if (level < 0 || level > finest) continue;
    const L = plan.levels[level];
    out.push({ i, mm: i * plan.stepMm, level, ratio: L.ratio, label: L.label ? L.label(i) : null });
  }
  return out;
}

/** Round a tick position to a whole device pixel so lines stay sharp. */
export const snapDev = (mm, devPxPerMm) => Math.round(mm * devPxPerMm);

/** Snap a position in mm to the nearest tick step of the unit. */
export function snapMm(mm, unit, cssPxPerMm) {
  const s = stepMm(unit, cssPxPerMm);
  return Math.round(mm / s) * s;
}
