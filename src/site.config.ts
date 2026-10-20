// ONE config file. Change values here; every page reads from it.
// Keep this file plain (no type-only syntax): scripts/deploy.mjs imports it directly.
const cfg = {
  name: 'Online Ruler',                 // shown in header, title, footer
  domain: 'onlineruler.com',            // reserved .com (not bought); the live address is the Bingemind one below
  cloudflareProject: 'online-ruler',    // Cloudflare Pages project name (used by npm run deploy)
  keyword: 'online ruler',              // main keyword: goes in the H1 and title
  keywords: ['actual size ruler', 'ruler in inches', 'ruler cm', 'ruler mm', 'ruler on screen', 'inch ruler online', 'real size ruler'],
  tagline: 'True to size, free and private', // short line shown in the page
  description:
    'A free online ruler that is true to size on your screen. Calibrate with a credit card in 20 seconds, then measure in cm, mm or inches with guides.',
  email: 'hello@onlineruler.com',       // contact email (not shown in Bingemind mode)
  ga4: '',                              // GA4 measurement ID. Empty = Google Analytics off
  adsense: '',                          // AdSense publisher ID. Empty = ads off
  brand: '#8a6a00',                     // brand color (ruler gold; no other tool uses this hue)
  skin: 'minimal',                      // look: 'minimal', 'swiss', 'clay' or 'retro'
  locale: 'en-US',                      // BCP 47 language tag
  ogImage: '/og.png',                   // 1200x630 file in public/
  category: 'UtilitiesApplication',     // schema.org applicationCategory
  owner: 'Online Ruler',                // name used in legal pages
};

// Bingemind mode (SITE_MODE=bingemind): the tool lives at bingemind.com/online-ruler/.
// Canonical links always name that address. Legal pages name Bingemind as the owner.
const bingemind = process.env.SITE_MODE === 'bingemind';
export default {
  ...cfg,
  domain: 'bingemind.com/online-ruler',
  origin: 'https://bingemind.com/online-ruler',
  bingemind,
  owner: bingemind ? 'Bingemind' : cfg.owner,
  contactWord: bingemind ? 'Contact' : 'Email',
  contactHref: bingemind ? 'https://bingemind.com/#contact' : `mailto:${cfg.email}`,
  contactLabel: bingemind ? 'bingemind.com/#contact' : cfg.email,
};
