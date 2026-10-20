// Guide helpers. Pure, so the tests can run them without a browser.

/** True when a press landed on the guide's remove button. The guide itself has class gx or gy, so match the button only. */
export function isRemoveTarget(target) {
  return !!(target && typeof target.closest === 'function' && target.closest('button[data-remove]'));
}

/**
 * Where a new guide goes, in CSS pixels from the ruler zero.
 * `visible` is the length of the free axis, `freeFrom` the first spot clear of the text and controls,
 * `existing` the pixel positions of guides already on that axis. Each new guide steps along from the last.
 */
export function pickGuidePx({ visible, freeFrom, existing = [], step = 56, margin = 30 }) {
  const lo = Math.min(Math.max(freeFrom, margin), Math.max(margin, visible * 0.6));
  const hi = Math.max(lo, visible - margin);
  const span = Math.max(step, hi - lo);
  let px = lo + ((existing.length * step) % span);
  for (let i = 0; i < 40 && existing.some((e) => Math.abs(e - px) < 12); i++) px = lo + ((px - lo + step / 2) % span);
  return Math.max(margin, Math.min(hi, px));
}
