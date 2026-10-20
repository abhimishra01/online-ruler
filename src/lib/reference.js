// Reference objects and the device list. Pure data plus small helpers.
// Sizes: coins come from the issuer pages named in `source`. Paper and card are standards.
// Devices store the marketed diagonal and the native pixel size. The panel width is computed from them.
import { panelFromDiagonal } from './calibration.js';

const USMINT = 'https://www.usmint.gov/learn/coin-and-medal-programs/coin-specifications';
const EUROPA = 'https://economy-finance.ec.europa.eu/euro/euro-coins-and-notes/euro-coins/common-sides-euro-coins_en';

export const COINS = [
  { id: 'us-dime', name: 'US dime (10 cents)', mm: 17.91, source: USMINT },
  { id: 'us-cent', name: 'US cent (penny)', mm: 19.05, source: USMINT },
  { id: 'us-nickel', name: 'US nickel (5 cents)', mm: 21.21, source: USMINT },
  { id: 'us-quarter', name: 'US quarter (25 cents)', mm: 24.26, source: USMINT },
  { id: 'us-dollar', name: 'US dollar coin', mm: 26.49, source: USMINT },
  { id: 'us-half', name: 'US half dollar', mm: 30.61, source: USMINT },
  { id: 'eu-2c', name: 'Euro 2 cent', mm: 18.75, source: EUROPA },
  { id: 'eu-50c', name: 'Euro 50 cent', mm: 24.25, source: EUROPA },
  { id: 'eu-1e', name: 'Euro 1 euro', mm: 23.25, source: EUROPA },
  { id: 'eu-2e', name: 'Euro 2 euro', mm: 25.75, source: EUROPA },
];

export const PAPER = [
  { id: 'letter', name: 'US Letter, 8.5 in wide', w: 215.9, h: 279.4 },
  { id: 'a4', name: 'A4, 210 mm wide', w: 210, h: 297 },
];

const SRC = {
  Apple: 'https://www.apple.com/iphone/compare/ , https://www.apple.com/ipad/compare/ , https://www.apple.com/mac/compare/',
  Samsung: 'https://www.samsung.com/us/mobile/',
  Google: 'https://store.google.com/',
  Microsoft: 'https://www.microsoft.com/surface',
  Valve: 'https://www.steamdeck.com/',
  Dell: 'https://www.dell.com/',
  Generic: 'Standard marketed sizes: the diagonal you type or read from the box',
};

// [brand, name, diagonal inches, native width px, native height px]
const RAW = [
  ['Apple', 'iPhone 16 Pro Max', 6.9, 2868, 1320], ['Apple', 'iPhone 16 Pro', 6.3, 2622, 1206],
  ['Apple', 'iPhone 16 Plus', 6.7, 2796, 1290], ['Apple', 'iPhone 16', 6.1, 2556, 1179],
  ['Apple', 'iPhone 15 Pro Max', 6.7, 2796, 1290], ['Apple', 'iPhone 15 Pro', 6.1, 2556, 1179],
  ['Apple', 'iPhone 15 Plus', 6.7, 2796, 1290], ['Apple', 'iPhone 15', 6.1, 2556, 1179],
  ['Apple', 'iPhone 14 Pro Max', 6.7, 2796, 1290], ['Apple', 'iPhone 14 Pro', 6.1, 2556, 1179],
  ['Apple', 'iPhone 14 Plus', 6.7, 2778, 1284], ['Apple', 'iPhone 14', 6.1, 2532, 1170],
  ['Apple', 'iPhone 13 Pro Max', 6.7, 2778, 1284], ['Apple', 'iPhone 13 Pro', 6.1, 2532, 1170],
  ['Apple', 'iPhone 13', 6.1, 2532, 1170], ['Apple', 'iPhone 13 mini', 5.4, 2340, 1080],
  ['Apple', 'iPhone 12 Pro Max', 6.7, 2778, 1284], ['Apple', 'iPhone 12 Pro', 6.1, 2532, 1170],
  ['Apple', 'iPhone 12', 6.1, 2532, 1170], ['Apple', 'iPhone 12 mini', 5.4, 2340, 1080],
  ['Apple', 'iPhone 11 Pro Max', 6.5, 2688, 1242], ['Apple', 'iPhone 11 Pro', 5.8, 2436, 1125],
  ['Apple', 'iPhone 11', 6.1, 1792, 828], ['Apple', 'iPhone XR', 6.1, 1792, 828],
  ['Apple', 'iPhone XS Max', 6.5, 2688, 1242], ['Apple', 'iPhone XS', 5.8, 2436, 1125],
  ['Apple', 'iPhone X', 5.8, 2436, 1125], ['Apple', 'iPhone SE (3rd generation)', 4.7, 1334, 750],
  ['Apple', 'iPhone 8 Plus', 5.5, 1920, 1080], ['Apple', 'iPhone 8', 4.7, 1334, 750],
  ['Apple', 'iPad (9th generation)', 10.2, 2160, 1620], ['Apple', 'iPad (10th generation)', 10.9, 2360, 1640],
  ['Apple', 'iPad mini (6th generation)', 8.3, 2266, 1488], ['Apple', 'iPad Air 11 inch', 10.9, 2360, 1640],
  ['Apple', 'iPad Air 13 inch', 12.9, 2732, 2048], ['Apple', 'iPad Pro 11 inch', 11, 2388, 1668],
  ['Apple', 'iPad Pro 11 inch (M4)', 11, 2420, 1668], ['Apple', 'iPad Pro 12.9 inch', 12.9, 2732, 2048],
  ['Apple', 'iPad Pro 13 inch (M4)', 13, 2752, 2064],
  ['Apple', 'MacBook Air 13 inch (M1)', 13.3, 2560, 1600], ['Apple', 'MacBook Air 13 inch (M2, M3)', 13.6, 2560, 1664],
  ['Apple', 'MacBook Air 15 inch', 15.3, 2880, 1864], ['Apple', 'MacBook Pro 13 inch', 13.3, 2560, 1600],
  ['Apple', 'MacBook Pro 14 inch', 14.2, 3024, 1964], ['Apple', 'MacBook Pro 16 inch', 16.2, 3456, 2234],
  ['Apple', 'MacBook Pro 15 inch (Retina)', 15.4, 2880, 1800], ['Apple', 'MacBook Pro 16 inch (2019)', 16, 3072, 1920],
  ['Apple', 'iMac 24 inch', 23.5, 4480, 2520], ['Apple', 'iMac 27 inch (5K)', 27, 5120, 2880],
  ['Apple', 'Studio Display', 27, 5120, 2880], ['Apple', 'Pro Display XDR', 32, 6016, 3384],
  ['Samsung', 'Galaxy S24 Ultra', 6.8, 3120, 1440], ['Samsung', 'Galaxy S24+', 6.7, 3120, 1440],
  ['Samsung', 'Galaxy S24', 6.2, 2340, 1080], ['Samsung', 'Galaxy S23 Ultra', 6.8, 3088, 1440],
  ['Samsung', 'Galaxy S23+', 6.6, 2340, 1080], ['Samsung', 'Galaxy S23', 6.1, 2340, 1080],
  ['Samsung', 'Galaxy S22 Ultra', 6.8, 3088, 1440], ['Samsung', 'Galaxy S22+', 6.6, 2340, 1080],
  ['Samsung', 'Galaxy S22', 6.1, 2340, 1080], ['Samsung', 'Galaxy S21', 6.2, 2400, 1080],
  ['Samsung', 'Galaxy A54', 6.4, 2340, 1080], ['Samsung', 'Galaxy A14', 6.6, 2408, 1080],
  ['Samsung', 'Galaxy Tab S9', 11, 2560, 1600], ['Samsung', 'Galaxy Tab S9 Ultra', 14.6, 2960, 1848],
  ['Samsung', 'Galaxy Tab A8', 10.5, 1920, 1200],
  ['Google', 'Pixel 9 Pro XL', 6.8, 2992, 1344], ['Google', 'Pixel 9 Pro', 6.3, 2856, 1280],
  ['Google', 'Pixel 9', 6.3, 2424, 1080], ['Google', 'Pixel 8 Pro', 6.7, 2992, 1344],
  ['Google', 'Pixel 8', 6.2, 2400, 1080], ['Google', 'Pixel 8a', 6.1, 2400, 1080],
  ['Google', 'Pixel 7 Pro', 6.7, 3120, 1440], ['Google', 'Pixel 7', 6.3, 2400, 1080],
  ['Google', 'Pixel 7a', 6.1, 2400, 1080], ['Google', 'Pixel 6', 6.4, 2400, 1080],
  ['Google', 'Pixel 6a', 6.1, 2400, 1080], ['Google', 'Pixel Tablet', 10.95, 2560, 1600],
  ['Microsoft', 'Surface Pro (13 inch)', 13, 2880, 1920], ['Microsoft', 'Surface Pro 8 and 9', 13, 2880, 1920],
  ['Microsoft', 'Surface Pro 7', 12.3, 2736, 1824], ['Microsoft', 'Surface Laptop 13.5 inch', 13.5, 2256, 1504],
  ['Valve', 'Steam Deck', 7, 1280, 800], ['Dell', 'XPS 13 (1920 x 1200)', 13.4, 1920, 1200],
  ['Dell', 'XPS 13 (3456 x 2160)', 13.4, 3456, 2160],
  ...[11.6, 12.5, 14, 15.6, 17.3].map((d) => ['Generic', `Windows laptop ${d} inch (16:9)`, d, 1920, 1080]),
  ...[13.3, 14, 15.6, 16].map((d) => ['Generic', `Windows laptop ${d} inch (16:10)`, d, 1920, 1200]),
  ...[13.5, 14].map((d) => ['Generic', `Laptop ${d} inch (3:2)`, d, 2256, 1504]),
  ...[11.6, 14].map((d) => ['Generic', `Chromebook ${d} inch`, d, 1366, 768]),
  ...[19, 21.5, 22, 23, 23.8, 24, 24.5, 25, 27, 28, 31.5, 32, 43].map((d) => ['Generic', `Monitor ${d} inch (16:9)`, d, 1920, 1080]),
  ...[24, 27, 30].map((d) => ['Generic', `Monitor ${d} inch (16:10)`, d, 1920, 1200]),
  ...[29, 34, 38].map((d) => ['Generic', `Ultrawide monitor ${d} inch (21:9)`, d, 3440, 1440]),
  ['Generic', 'Super ultrawide monitor 49 inch (32:9)', 49, 5120, 1440],
  ...[32, 40, 43, 50, 55, 65, 75, 85].map((d) => ['Generic', `TV ${d} inch`, d, 3840, 2160]),
  ...[7, 8, 10.1, 11].map((d) => ['Generic', `Tablet ${d} inch (16:10)`, d, 1920, 1200]),
  ...[5.5, 6, 6.5, 6.7].map((d) => ['Generic', `Phone ${d} inch (20:9)`, d, 2400, 1080]),
];

let cache;
/** Every device with an id, aspect ratio (long / short) and a source note. */
export function deviceList() {
  if (cache) return cache;
  cache = RAW.map(([brand, name, diag, w, h], n) => ({
    id: `${brand.toLowerCase()}-${n}`, brand, name: brand === 'Generic' ? name : name, diag,
    aspect: Math.max(w, h) / Math.min(w, h), source: SRC[brand],
  }));
  return cache;
}

export const panelFor = (device) => panelFromDiagonal(device.diag, device.aspect);

/** Words in the query must all appear in "brand name". Best matches first. */
export function searchDevices(query) {
  const words = query.toLowerCase().split(/[^a-z0-9.+]+/).filter(Boolean);
  if (words.length === 0) return [];
  return deviceList().filter((d) => {
    const hay = `${d.brand} ${d.name}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}
