// Reference objects and the device list. Pure data plus small helpers.
// Sizes: coins come from the issuer pages named in `source`. Paper and card are standards.
// Devices store the manufacturer's stated diagonal and the native pixel size. The panel width is computed from them.
import { panelFromDiagonal } from './calibration.js';

const USMINT = 'https://www.usmint.gov/learn/coins-and-medals/circulating-coins/coin-specifications';
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

// Every device row names the manufacturer page it comes from. `diag` is the marketed diagonal as the
// manufacturer states it (rectangle, rounded corners ignored). Pixel size is the native panel resolution.
// To add a device: add a row, use a manufacturer spec URL, run `npm test` (it checks the URL host and the PPI).
export const SOURCE_HOSTS = ['www.apple.com', 'support.apple.com', 'store.google.com', 'www.samsung.com', 'learn.microsoft.com', 'support.microsoft.com', 'www.steamdeck.com', 'www.dell.com'];

const A = {
  compare: 'https://www.apple.com/iphone/compare/',
  i17: 'https://www.apple.com/iphone-17/specs/',
  air: 'https://www.apple.com/iphone-air/specs/',
  i16: 'https://www.apple.com/iphone-16/specs/',
  i15: 'https://support.apple.com/en-us/111831',
  ident: 'https://support.apple.com/en-us/108044',
  ipad: 'https://www.apple.com/ipad/compare/',
  ipadPro: 'https://www.apple.com/ipad-pro/specs/',
  ipadAir: 'https://www.apple.com/ipad-air/specs/',
  mba: 'https://www.apple.com/macbook-air/specs/',
  mbp: 'https://www.apple.com/macbook-pro/specs/',
  imac: 'https://www.apple.com/imac/specs/',
  studio: 'https://www.apple.com/studio-display/specs/',
  xdr: 'https://www.apple.com/pro-display-xdr/specs/',
};
const G = (slug) => `https://store.google.com/product/${slug}_specs`;
const S = {
  s25: 'https://www.samsung.com/us/smartphones/galaxy-s25/',
  s25u: 'https://www.samsung.com/us/smartphones/galaxy-s25-ultra/',
  s25e: 'https://www.samsung.com/us/smartphones/galaxy-s25-edge/',
  s24: 'https://www.samsung.com/us/smartphones/galaxy-s24/',
  s24u: 'https://www.samsung.com/us/smartphones/galaxy-s24-ultra/',
};
const MS = {
  pro13: 'https://learn.microsoft.com/en-us/surface/tech-specs/surface-pro-snapdragon-tech-specs',
  pro9: 'https://support.microsoft.com/en-us/surface/models/surface-pro-9-features-and-specs',
  pro7: 'https://support.microsoft.com/en-us/surface/models/surface-pro-7-specs-and-features',
};
const DECK = 'https://www.steamdeck.com/en/tech';
/** Marks a row computed from size and resolution. It has no manufacturer page. */
export const SIZE = 'by-size';
const XPS = 'https://www.dell.com/support/manuals/en-ai/xps-13-9320-laptop/xps-13-9320-setup-and-specifications/display';

// [brand, name, diagonal inches, native width px, native height px, platform, source URL, extra search words]
const RAW = [
  ['Apple', 'iPhone 17 Pro Max', 6.9, 2868, 1320, 'ios', A.compare], ['Apple', 'iPhone 17 Pro', 6.3, 2622, 1206, 'ios', A.compare],
  ['Apple', 'iPhone Air', 6.5, 2736, 1260, 'ios', A.air], ['Apple', 'iPhone 17', 6.3, 2622, 1206, 'ios', A.i17],
  ['Apple', 'iPhone 16e', 6.1, 2532, 1170, 'ios', A.compare],
  ['Apple', 'iPhone 16 Pro Max', 6.9, 2868, 1320, 'ios', A.compare], ['Apple', 'iPhone 16 Pro', 6.3, 2622, 1206, 'ios', A.compare],
  ['Apple', 'iPhone 16 Plus', 6.7, 2796, 1290, 'ios', A.i16], ['Apple', 'iPhone 16', 6.1, 2556, 1179, 'ios', A.i16],
  ['Apple', 'iPhone 15 Pro Max', 6.7, 2796, 1290, 'ios', A.ident], ['Apple', 'iPhone 15 Pro', 6.1, 2556, 1179, 'ios', A.ident],
  ['Apple', 'iPhone 15 Plus', 6.7, 2796, 1290, 'ios', A.ident], ['Apple', 'iPhone 15', 6.1, 2556, 1179, 'ios', A.i15],
  ['Apple', 'iPhone 14 Pro Max', 6.7, 2796, 1290, 'ios', A.ident], ['Apple', 'iPhone 14 Pro', 6.1, 2556, 1179, 'ios', A.ident],
  ['Apple', 'iPhone 14 Plus', 6.7, 2778, 1284, 'ios', A.ident], ['Apple', 'iPhone 14', 6.1, 2532, 1170, 'ios', A.ident],
  ['Apple', 'iPhone 13 Pro Max', 6.7, 2778, 1284, 'ios', A.ident], ['Apple', 'iPhone 13 Pro', 6.1, 2532, 1170, 'ios', A.ident],
  ['Apple', 'iPhone 13', 6.1, 2532, 1170, 'ios', A.ident], ['Apple', 'iPhone 13 mini', 5.4, 2340, 1080, 'ios', A.ident],
  ['Apple', 'iPhone 12 Pro Max', 6.7, 2778, 1284, 'ios', A.ident], ['Apple', 'iPhone 12 Pro', 6.1, 2532, 1170, 'ios', A.ident],
  ['Apple', 'iPhone 12', 6.1, 2532, 1170, 'ios', A.ident], ['Apple', 'iPhone 12 mini', 5.4, 2340, 1080, 'ios', A.ident],
  ['Apple', 'iPhone 11', 6.1, 1792, 828, 'ios', A.ident], ['Apple', 'iPhone SE (3rd generation)', 4.7, 1334, 750, 'ios', A.ident],
  ['Apple', 'iPad (10th generation and iPad A16)', 10.9, 2360, 1640, 'ios', A.ipad, 'ipad 11th'],
  ['Apple', 'iPad (9th generation)', 10.2, 2160, 1620, 'ios', A.ipad],
  ['Apple', 'iPad mini (6th generation and A17 Pro)', 8.3, 2266, 1488, 'ios', A.ipad, 'ipad mini 7'],
  ['Apple', 'iPad Air 11 inch (M2, M3)', 10.9, 2360, 1640, 'ios', A.ipadAir], ['Apple', 'iPad Air 13 inch (M2, M3)', 12.9, 2732, 2048, 'ios', A.ipadAir],
  ['Apple', 'iPad Pro 11 inch (M4, M5)', 11.1, 2420, 1668, 'ios', A.ipadPro], ['Apple', 'iPad Pro 13 inch (M4, M5)', 13, 2752, 2064, 'ios', A.ipadPro],
  ['Apple', 'MacBook Air 13 inch (M2 to M5)', 13.6, 2560, 1664, 'mac', A.mba, 'm2 m3 m4 m5 13.6'],
  ['Apple', 'MacBook Air 15 inch (M2 to M5)', 15.3, 2880, 1864, 'mac', A.mba, 'm2 m3 m4 m5'],
  ['Apple', 'MacBook Pro 14 inch (M3 to M5)', 14.2, 3024, 1964, 'mac', A.mbp, 'm3 m4 m5 pro max'],
  ['Apple', 'MacBook Pro 16 inch (M3 to M5)', 16.2, 3456, 2234, 'mac', A.mbp, 'm3 m4 m5 pro max'],
  ['Apple', 'iMac 24 inch', 23.5, 4480, 2520, 'mac', A.imac, 'm1 m3 m4'],
  ['Apple', 'Studio Display', 27, 5120, 2880, 'mac', A.studio], ['Apple', 'Pro Display XDR', 31.6, 6016, 3384, 'mac', A.xdr],
  ['Samsung', 'Galaxy S25 Ultra', 6.9, 3120, 1440, 'android', S.s25u], ['Samsung', 'Galaxy S25 Edge', 6.7, 3120, 1440, 'android', S.s25e],
  ['Samsung', 'Galaxy S25+', 6.7, 3120, 1440, 'android', S.s25, 'plus'], ['Samsung', 'Galaxy S25', 6.2, 2340, 1080, 'android', S.s25],
  ['Samsung', 'Galaxy S24 Ultra', 6.8, 3120, 1440, 'android', S.s24u], ['Samsung', 'Galaxy S24+', 6.7, 3120, 1440, 'android', S.s24, 'plus'],
  ['Samsung', 'Galaxy S24', 6.2, 2340, 1080, 'android', S.s24],
  ['Google', 'Pixel 10 Pro XL', 6.8, 2992, 1344, 'android', G('pixel_10_pro_xl')], ['Google', 'Pixel 10 Pro', 6.3, 2856, 1280, 'android', G('pixel_10_pro')],
  ['Google', 'Pixel 10', 6.3, 2424, 1080, 'android', G('pixel_10')], ['Google', 'Pixel 10a', 6.3, 2424, 1080, 'android', G('pixel_10a')],
  ['Google', 'Pixel 9a', 6.3, 2424, 1080, 'android', G('pixel_9a')],
  ['Google', 'Pixel 9 Pro XL', 6.8, 2992, 1344, 'android', G('pixel_9_pro_xl')], ['Google', 'Pixel 9 Pro', 6.3, 2856, 1280, 'android', G('pixel_9_pro')],
  ['Google', 'Pixel 9', 6.3, 2424, 1080, 'android', G('pixel_9')],
  ['Google', 'Pixel 8 Pro', 6.7, 2992, 1344, 'android', G('pixel_8_pro')], ['Google', 'Pixel 8', 6.2, 2400, 1080, 'android', G('pixel_8')],
  ['Google', 'Pixel 8a', 6.1, 2400, 1080, 'android', G('pixel_8a')],
  ['Google', 'Pixel 7 Pro', 6.7, 3120, 1440, 'android', G('pixel_7_pro')], ['Google', 'Pixel 7', 6.3, 2400, 1080, 'android', G('pixel_7')],
  ['Google', 'Pixel 7a', 6.1, 2400, 1080, 'android', G('pixel_7a')], ['Google', 'Pixel 6', 6.4, 2400, 1080, 'android', G('pixel_6')],
  ['Google', 'Pixel 6a', 6.1, 2400, 1080, 'android', G('pixel_6a')], ['Google', 'Pixel Tablet', 10.95, 2560, 1600, 'android', G('pixel_tablet')],
  ['Microsoft', 'Surface Pro 13 inch (11th Edition)', 13, 2880, 1920, 'windows', MS.pro13, 'copilot snapdragon'],
  ['Microsoft', 'Surface Pro 9', 13, 2880, 1920, 'windows', MS.pro9], ['Microsoft', 'Surface Pro 7', 12.3, 2736, 1824, 'windows', MS.pro7],
  ['Valve', 'Steam Deck (LCD)', 7, 1280, 800, 'windows', DECK], ['Valve', 'Steam Deck OLED', 7.4, 1280, 800, 'windows', DECK],
  ['Dell', 'XPS 13 Plus (OLED 3456 x 2160)', 13.37, 3456, 2160, 'windows', XPS, '9320'],
  // By size: no model, no manufacturer page. The panel is computed from the diagonal and the resolution, and the list says so.
  ['Monitor', '21.5 inch monitor, 1920 x 1080 (Full HD)', 21.5, 1920, 1080, 'windows', SIZE, 'monitor screen display '],
  ['Monitor', '23.8 inch monitor, 1920 x 1080 (Full HD)', 23.8, 1920, 1080, 'windows', SIZE, 'monitor screen display 24'],
  ['Monitor', '23.8 inch monitor, 2560 x 1440 (QHD)', 23.8, 2560, 1440, 'windows', SIZE, 'monitor screen display 24'],
  ['Monitor', '24 inch monitor, 1920 x 1080 (Full HD)', 24, 1920, 1080, 'windows', SIZE, 'monitor screen display '],
  ['Monitor', '24 inch monitor, 1920 x 1200 (WUXGA)', 24, 1920, 1200, 'windows', SIZE, 'monitor screen display wuxga 16:10'],
  ['Monitor', '24.5 inch monitor, 1920 x 1080 (Full HD)', 24.5, 1920, 1080, 'windows', SIZE, 'monitor screen display 25'],
  ['Monitor', '27 inch monitor, 1920 x 1080 (Full HD)', 27, 1920, 1080, 'windows', SIZE, 'monitor screen display '],
  ['Monitor', '27 inch monitor, 2560 x 1440 (QHD)', 27, 2560, 1440, 'windows', SIZE, 'monitor screen display qhd 1440p'],
  ['Monitor', '27 inch monitor, 3840 x 2160 (4K)', 27, 3840, 2160, 'windows', SIZE, 'monitor screen display 4k uhd'],
  ['Monitor', '31.5 inch monitor, 2560 x 1440 (QHD)', 31.5, 2560, 1440, 'windows', SIZE, 'monitor screen display 32 qhd 1440p'],
  ['Monitor', '31.5 inch monitor, 3840 x 2160 (4K)', 31.5, 3840, 2160, 'windows', SIZE, 'monitor screen display 32 4k uhd'],
  ['Monitor', '32 inch monitor, 3840 x 2160 (4K)', 32, 3840, 2160, 'windows', SIZE, 'monitor screen display 4k uhd'],
  ['Monitor', '34 inch monitor, 3440 x 1440 (UWQHD)', 34, 3440, 1440, 'windows', SIZE, 'monitor screen display ultrawide uwqhd curved'],
  ['Monitor', '49 inch monitor, 5120 x 1440 (DQHD)', 49, 5120, 1440, 'windows', SIZE, 'monitor screen display super ultrawide dqhd'],
  ['TV', '32 inch TV, 1366 x 768 (HD)', 32, 1366, 768, 'windows', SIZE, 'TV screen display hd 720p'],
  ['TV', '32 inch TV, 1920 x 1080 (Full HD)', 32, 1920, 1080, 'windows', SIZE, 'TV screen display full hd 1080p'],
  ['TV', '40 inch TV, 1920 x 1080 (Full HD)', 40, 1920, 1080, 'windows', SIZE, 'TV screen display full hd 1080p'],
  ['TV', '43 inch TV, 1920 x 1080 (Full HD)', 43, 1920, 1080, 'windows', SIZE, 'TV screen display full hd 1080p'],
  ['TV', '43 inch TV, 3840 x 2160 (4K)', 43, 3840, 2160, 'windows', SIZE, 'TV screen display 4k uhd'],
  ['TV', '50 inch TV, 3840 x 2160 (4K)', 50, 3840, 2160, 'windows', SIZE, 'TV screen display 4k uhd'],
  ['TV', '55 inch TV, 3840 x 2160 (4K)', 55, 3840, 2160, 'windows', SIZE, 'TV screen display 4k uhd'],
  ['TV', '58 inch TV, 3840 x 2160 (4K)', 58, 3840, 2160, 'windows', SIZE, 'TV screen display 4k uhd'],
  ['TV', '65 inch TV, 3840 x 2160 (4K)', 65, 3840, 2160, 'windows', SIZE, 'TV screen display 4k uhd'],
  ['TV', '75 inch TV, 3840 x 2160 (4K)', 75, 3840, 2160, 'windows', SIZE, 'TV screen display 4k uhd'],
  ['TV', '85 inch TV, 3840 x 2160 (4K)', 85, 3840, 2160, 'windows', SIZE, 'TV screen display 4k uhd'],
  ['TV', '55 inch TV, 7680 x 4320 (8K)', 55, 7680, 4320, 'windows', SIZE, 'TV screen display 8k'],
  ['TV', '65 inch TV, 7680 x 4320 (8K)', 65, 7680, 4320, 'windows', SIZE, 'TV screen display 8k'],
];

/** Which platform the visitor is on, so the Device tab can open with their kind of device. */
export function platformOf({ userAgent = '', platform = '', maxTouchPoints = 0 } = {}) {
  const ua = `${userAgent} ${platform}`;
  if (/iPhone|iPad|iPod/i.test(ua) || (/Mac/i.test(platform) && maxTouchPoints > 1)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  if (/Mac/i.test(ua)) return 'mac';
  return 'windows'; // Windows, Linux and ChromeOS: the list offers PC-style devices
}

let cache;
/** Every device with an id, aspect ratio (long / short), pixel size, platform and a spec URL. */
export function deviceList() {
  if (cache) return cache;
  cache = RAW.map(([brand, name, diag, w, h, platform, source, words = ''], n) => ({
    id: `${brand.toLowerCase()}-${n}`, brand, name, diag, w, h, platform, words,
    aspect: Math.max(w, h) / Math.min(w, h), computed: source === SIZE, source: source === SIZE ? null : source,
  }));
  return cache;
}

/** The first screen of the Device tab: newest devices of the visitor's platform. */
export function popularDevices(platform, count = 12) {
  const all = deviceList();
  const mine = all.filter((d) => d.platform === platform);
  return (mine.length ? mine : all).slice(0, count);
}

export const panelFor = (device) => panelFromDiagonal(device.diag, device.aspect);

/** Words in the query must all appear in "brand name". Best matches first. */
export function searchDevices(query) {
  const words = query.toLowerCase().split(/[^a-z0-9.+]+/).filter(Boolean);
  if (words.length === 0) return [];
  return deviceList().filter((d) => {
    const hay = `${d.brand} ${d.name} ${d.words}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}
