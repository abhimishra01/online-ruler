// One data file for the home page and the five landing pages. One tool component, no copy drift.
// href="@x/" is turned into a link that works under any base path.
export interface Section { h2: string; html: string; table?: 'methods' | 'fractions' | 'mm-in' | 'cm-in' | 'objects' }
export interface RulerPage {
  slug: string; // '' is the home page
  title: string; description: string; h1: string; lede: string; crumb: string;
  unit: string; edges: string; openCal?: boolean;
  faq: string[]; sections: Section[];
}

export const pages: RulerPage[] = [
  {
    slug: '',
    title: 'Online Ruler: Actual Size in cm, mm and Inches (Free)',
    description: 'A free online ruler that is true to size on your screen. Calibrate with a credit card in 20 seconds, then measure in cm, mm or inches with guides.',
    h1: 'Online Ruler: Actual Size in cm, mm and Inches',
    lede: 'Calibrate with a credit card, then measure. Pull a guide out of any ruler to read a length.',
    crumb: 'Online ruler',
    unit: 'both', edges: 'top,left',
    faq: ['accurate', 'card', 'bigsmall', 'zoom', 'phone', 'devices', 'privacy', 'free'],
    sections: [
      {
        h2: 'Quick start in 3 steps',
        html: `<ol>
<li><strong>Calibrate.</strong> Press the status button at the top of the ruler. Hold a credit card against the screen and match its edges to the outline. This takes about 20 seconds.</li>
<li><strong>Pick a unit.</strong> Choose cm, mm, inches or pixels. You can also show cm and inches together.</li>
<li><strong>Measure.</strong> Put your object against the ruler, with one end at the zero mark in the corner. Pull a guide out of the ruler to mark the other end. The length appears at the bottom of the ruler.</li>
</ol>
<p>This online ruler works in the browser on a phone, a tablet and a computer. There is nothing to install.</p>`,
      },
      {
        h2: 'Why most online rulers are wrong',
        html: `<p>A web page cannot see how big your screen is. It sees pixels. A CSS pixel is not a fixed length. The web standard says 96 CSS pixels make one inch, but that is a reference value, not a measurement of your hardware.</p>
<p>Real screens differ. A phone packs many pixels into a small panel. A laptop may scale its display to make text easier to read. A monitor may be set to a lower resolution than its panel supports. Each of these changes how long one pixel is in real life.</p>
<p>Many online rulers still draw at 96 pixels per inch and call it done. On a typical laptop that makes the ruler too short, and on a phone it can be far off. An actual size ruler needs one fact from you: how big something real looks on your screen. That is what calibration does.</p>
<p>Until you calibrate, this ruler shows a labeled estimate. It never says "calibrated" for a guess.</p>`,
      },
      {
        h2: 'Pick a calibration method',
        table: 'methods',
        html: `<p>You can calibrate in four ways. The credit card method is the one we suggest, because a card has a fixed, standard size and almost everyone has one.</p>`,
      },
      {
        h2: 'How to read cm, mm and inches',
        table: 'fractions',
        html: `<p>On a metric ruler, the numbered marks are centimeters. The small marks between them are millimeters. There are 10 mm in 1 cm. To read a length, find the last numbered mark, then count the small marks past it.</p>
<p>An inch ruler is split into halves, quarters, eighths and sixteenths. The longer the mark, the larger the fraction. Count the small marks past the last whole inch, then reduce: 8 sixteenths is 1/2, and 10 sixteenths is 5/8. The chart below shows each step with its decimal and millimeter value.</p>
<p>When you pull two guides out of the ruler, the tool shows the span in your chosen unit and the other units too. For inches it gives the nearest 1/16 as a fraction, for example "3 5/8 in", next to the decimal value. See the pages for <a href="@cm/">cm</a>, <a href="@mm/">mm</a> and <a href="@inches/">inches</a> for more on each scale.</p>`,
      },
      {
        h2: 'Check your scale with everyday objects',
        table: 'objects',
        html: `<p>After you calibrate, the tool asks you to check the result. It draws a second object at true size. Lay a coin or card on the screen. If it fits, the calibration is good. If it does not, calibrate again.</p>
<p>You can also check at any time with something you own. A credit card is 85.60 by 53.98 mm. A sheet of US Letter paper is 215.9 mm wide, and A4 is 210 mm wide. The coin sizes below come from the US Mint and the European Commission.</p>`,
      },
      {
        h2: 'What people measure with a screen ruler',
        html: `<p>A screen ruler suits small, flat things that you can hold against the glass. People use it for:</p>
<ul>
<li>Screws, bolts, washers and other small parts, to match a size.</li>
<li>Beads, gemstones and jewelry parts, in millimeters.</li>
<li>Photos, prints and stamps, to check the size before ordering a frame.</li>
<li>Label and sticker sizes.</li>
<li>Spacing on a design, when you want to see a layout at real size.</li>
</ul>
<p>Hold the object flat and close to the glass. If it sits high above the screen, the angle of view makes it look larger or smaller than it is. Look straight at the edge you are reading.</p>`,
      },
      {
        h2: 'Limits you should know',
        html: `<ul>
<li><strong>Length.</strong> The ruler can only be as long as your screen. A 6.1 inch phone has a screen about 14 cm tall, so it fits small objects. A laptop screen is wider, from about 29 to 34 cm. For long objects, use a real ruler or a tape measure.</li>
<li><strong>Edges.</strong> The rulers touch the real glass edge only in full screen. Press F, or the Full screen button, so the rulers use the whole display. Phones in Safari may not offer full screen.</li>
<li><strong>Zoom.</strong> The ruler stores the physical size of a screen pixel, so page zoom is designed not to change the real size in Chrome, Edge and Firefox. We have not tested every browser and screen. In Safari, keep zoom at 100 percent (press Cmd and 0).</li>
<li><strong>More than one screen.</strong> A calibration belongs to one screen. If you move the window to a second monitor, the tool tells you and asks you to calibrate it or use a saved one.</li>
<li><strong>Curved glass.</strong> A thick bezel or curved edge can hide a little of the screen at the sides.</li>
</ul>`,
      },
      {
        h2: 'Privacy',
        html: `<p>Everything runs in your browser. The tool does not send your measurements or your calibration anywhere. Your calibration is saved in your browser, one small record for each screen, so you do not have to do it again. You can remove it with Reset calibration in the Options. If your browser blocks storage, the ruler still works, and you calibrate again next time.</p>`,
      },
    ],
  },
  {
    slug: 'cm',
    title: 'Ruler in cm: Free Online CM Ruler, Actual Size',
    description: 'A free centimeter ruler for your screen. Calibrate with a credit card, then measure in cm and mm. Pull guides out to read a length.',
    h1: 'Ruler in cm: Online Centimeter Ruler, Actual Size',
    lede: 'Millimeter marks, a number at each centimeter. Calibrate first for true size.',
    crumb: 'Ruler in cm',
    unit: 'cm', edges: 'top,left',
    faq: ['cmmm', 'accurate', 'card', 'bigsmall', 'phone', 'free'],
    sections: [
      {
        h2: 'A centimeter ruler for your screen',
        html: `<p>This page opens the online ruler in centimeters. Each numbered mark is 1 cm. Each small mark is 1 mm, and the middle mark between two numbers is 5 mm. The zero mark sits in the top left corner.</p>
<p>To measure, put one end of the object at zero. Then pull a guide out of the ruler and move it to the other end. The tool shows the length, for example "9.21 cm = 92.1 mm = 3 5/8 in". Press Copy to put the text on your clipboard.</p>
<p>For a true size ruler, calibrate first. Press the status button and match a credit card to the outline. The status then reads "Calibrated with card".</p>`,
      },
      {
        h2: 'Centimeters and millimeters',
        html: `<p>The centimeter is a tenth of a decimeter and a hundredth of a meter. There are 10 millimeters in a centimeter. To turn cm into mm, multiply by 10. To turn mm into cm, divide by 10. So 4.7 cm is 47 mm, and 63 mm is 6.3 cm.</p>
<p>To switch between centimeters and inches, use 2.54: one inch is exactly 2.54 cm. Use the table below for common values. The <a href="@mm/">millimeter ruler</a> shows the same scale with a number every 10 mm, which is easier for small parts.</p>`,
        table: 'cm-in',
      },
      {
        h2: 'What people measure in centimeters',
        html: `<ul>
<li>Books, notebooks and photo prints.</li>
<li>Phone cases, cables and small electronics.</li>
<li>Craft pieces, fabric swatches and patterns.</li>
<li>Pots, plants and seed spacing, on a flat sheet or card.</li>
<li>Items to ship, when you want to check a box size before you buy it.</li>
</ul>
<p>If the object is longer than your screen, measure in parts. Mark the end of the first part with a guide, slide the object, and add the lengths. This adds a small error each time, so use a tape measure for anything long.</p>`,
      },
      {
        h2: 'Get the most from the cm ruler',
        html: `<ol>
<li>Calibrate with a card, and run the check step with a coin.</li>
<li>Press F for full screen, so the rulers use the whole display.</li>
<li>Turn on snap in Options if you want guides to jump to the nearest millimeter.</li>
<li>Use the arrow keys on a selected guide to move it one millimeter at a time. Hold Shift for steps of 10.</li>
<li>Need inches too? Switch to "cm + in" to see both scales on one ruler, or open the <a href="@inches/">inch ruler</a>.</li>
</ol>
<p>The ruler works the same on a phone. Turn the phone sideways for more length. See the <a href="@phone/">phone ruler page</a> for tips.</p>`,
      },
    ],
  },
  {
    slug: 'inches',
    title: 'Inch Ruler Online: Actual Size with 1/16 Marks',
    description: 'A free inch ruler for your screen with marks down to 1/16. Calibrate with a credit card, then read fractions and decimals. Works on phones.',
    h1: 'Inch Ruler Online: Actual Size with 1/16 Marks',
    lede: 'Marks for halves, quarters, eighths and sixteenths. Calibrate first for true size.',
    crumb: 'Inch ruler',
    unit: 'in', edges: 'top,left',
    faq: ['fractions', 'oneinch', 'accurate', 'card', 'bigsmall', 'free'],
    sections: [
      {
        h2: 'An inch ruler with 1/16 marks',
        html: `<p>This page opens the online ruler in inches. Each long mark with a number is a whole inch. The mark in the middle is 1/2 inch and carries a small "&frac12;" label. Shorter marks show 1/4, 1/8 and 1/16.</p>
<p>Pull a guide out of the ruler to mark the end of your object. The tool rounds the length to the nearest 1/16 and shows it as a reduced fraction, such as "3 5/8 in". It also shows the decimal value (3.626 in) and the millimeter value, so you can copy the form you need.</p>
<p>Calibrate first. A card is 3 3/8 in wide and 2 1/8 in tall, which is a good check on the ruler once you have calibrated it.</p>`,
      },
      {
        h2: 'How to read inch fractions',
        html: `<p>Count the small marks after the last whole inch. There are 16 steps in an inch. Reduce the fraction by dividing both numbers by 2 until you cannot go further:</p>
<ul>
<li>8 steps is 8/16, which is 1/2.</li>
<li>4 steps is 4/16, which is 1/4. 12 steps is 3/4.</li>
<li>2 steps is 2/16, which is 1/8. 6 steps is 3/8.</li>
<li>Odd counts, such as 1, 3 or 11, stay in sixteenths: 11/16.</li>
</ul>
<p>Add the whole inches in front. If the last whole inch is 3 and you count 10 steps, the length is 3 and 10/16, which is 3 5/8 in.</p>`,
        table: 'fractions',
      },
      {
        h2: 'Inches in everyday US sizes',
        html: `<p>Many US sizes use inches: lumber and hardware, paper, frames, screens and clothing. A US Letter sheet is 8.5 by 11 in. A credit card is 3 3/8 by 2 1/8 in. A US quarter is 24.26 mm across, which is about 0.955 in (the US Mint lists 0.955 in).</p>
<p>When a plan lists a size as a decimal, such as 2.375 in, use the table to find the nearest 1/16. 2.375 in is 2 3/8 in. If you work in metric, the <a href="@cm/">cm ruler</a> uses the same calibration.</p>`,
      },
      {
        h2: 'Tips for accurate readings',
        html: `<ul>
<li>Look straight down at the edge you read. A sideways view shifts the mark.</li>
<li>Keep the object flat against the glass.</li>
<li>Turn snap on to make guides jump to the nearest 1/16.</li>
<li>Use full screen (F) to give the ruler the whole display.</li>
<li>Check the result with a coin after you calibrate. If it does not fit, calibrate again.</li>
</ul>`,
      },
    ],
  },
  {
    slug: 'mm',
    title: 'Ruler in mm: Free Online MM Ruler, Actual Size',
    description: 'A free millimeter ruler for your screen. Calibrate with a credit card, then measure small parts in mm. Guides show the length. Works on phones.',
    h1: 'Ruler in mm: Online Millimeter Ruler, Actual Size',
    lede: 'A tick for every millimeter and a number every 10. Calibrate first for true size.',
    crumb: 'Ruler in mm',
    unit: 'mm', edges: 'top,left',
    faq: ['cmmm', 'ring', 'accurate', 'card', 'phone', 'free'],
    sections: [
      {
        h2: 'A millimeter ruler for small parts',
        html: `<p>This page opens the online ruler in millimeters. There is a tick for every millimeter, a longer tick at 5 mm, and a number every 10 mm. Use it for screws, beads, gemstones, watch straps, film and other small flat parts.</p>
<p>Put the part against the ruler with one end at zero. Pull a guide out of the ruler to the other end, and read the length, for example "92.1 mm". Hold Shift while you move a guide with the arrow keys to jump 10 mm.</p>
<p>A screen shows only whole pixels, so a millimeter is a few pixels wide. On a phone one millimeter is about 6 pixels, and on a standard monitor it is often 4 or fewer. Calibrate first, and use full screen for the cleanest result.</p>`,
      },
      {
        h2: 'Millimeter to inch chart',
        html: `<p>The chart shows common millimeter sizes in decimal inches, with the nearest 1/16 inch. One inch is exactly 25.4 mm. To change mm to inches, divide by 25.4. To change inches to mm, multiply by 25.4.</p>`,
        table: 'mm-in',
      },
      {
        h2: 'Things people measure in millimeters',
        html: `<ul>
<li>The width of a bead, a charm or a gemstone.</li>
<li>The inside width of a ring, laid flat on the screen. A ring size chart then turns the diameter into a size.</li>
<li>The width of a watch strap or a band.</li>
<li>The diameter of a coin. A US dime is 17.91 mm and a US quarter is 24.26 mm, from the US Mint.</li>
<li>Tape, ribbon and cord widths.</li>
</ul>
<p>For round things, place the part so its edges touch two guides, and read the gap. For small parts, use the crosshair (press C) to see the exact spot under your finger or cursor.</p>`,
      },
      {
        h2: 'Tips for the mm ruler',
        html: `<ol>
<li>Calibrate with a card, then check with a coin.</li>
<li>Use the 0.1 mm buttons in the calibration step to refine the match.</li>
<li>Press F for full screen.</li>
<li>Open Options, then Snap guides to marks, so guides land on whole millimeters.</li>
<li>Prefer a bigger scale? Open the <a href="@cm/">cm ruler</a> or the <a href="@inches/">inch ruler</a>.</li>
</ol>`,
      },
    ],
  },
  {
    slug: 'actual-size',
    title: 'Actual Size Ruler: Calibrate to Real Size (Free)',
    description: 'An actual size ruler that you calibrate with a credit card. Learn why 96 PPI is wrong, how the card method works, and how to check your scale.',
    h1: 'Actual Size Ruler: Calibrate Your Screen to Real Size',
    lede: 'Match a credit card to the outline, check with a coin, and the ruler shows real centimeters and inches.',
    crumb: 'Actual size ruler',
    unit: 'both', edges: 'top,left', openCal: true,
    faq: ['bigsmall', 'zoom', 'accurate', 'card', 'devices', 'printable'],
    sections: [
      {
        h2: 'What "actual size" means on a screen',
        html: `<p>An actual size ruler shows lengths as they are in the real world. One centimeter on the screen should match one centimeter on a physical ruler. A web page cannot do this alone, because it does not know the physical size of your pixels.</p>
<p>This page asks you to teach it. You match an object of known size, a credit card, to an outline. From that match the tool works out how many device pixels fit in a millimeter on your screen. It saves that number for this screen and draws every ruler from it.</p>`,
      },
      {
        h2: 'Why 96 PPI is wrong on most screens',
        html: `<p>PPI means pixels per inch. Web standards define a CSS pixel as 1/96 of an inch, so a simple ruler draws 96 pixels for each inch. That value is a convention. The panel in your device has its own density.</p>
<p>A laptop with a 13.3 inch, 2560 by 1600 panel, set to look like 1440 by 900, shows about 128 CSS pixels per inch. A ruler that draws 96 of them per inch ends up about a quarter too short. Phones are further away from 96. Change the display scaling and the number changes again.</p>
<p>So a fixed pixel count per inch cannot be right everywhere. The only fix is to measure on your own screen.</p>`,
      },
      {
        h2: 'The credit card method',
        html: `<p>Credit and debit cards follow ISO/IEC 7810 ID-1: 85.60 by 53.98 mm. That is 3 3/8 by 2 1/8 inches. The size is the same all over the world.</p>
<ol>
<li>Open Calibrate and choose Credit card.</li>
<li>Hold the card flat against the screen. Line up one edge with the outline.</li>
<li>Drag the grip on the right edge until the other edge matches. Zoom in with your eyes: look straight at the screen, not at an angle.</li>
<li>Use the 0.1 mm buttons, or the arrow keys on the grip, for fine changes.</li>
<li>Press "My card matches".</li>
</ol>
<p>On a narrow phone the card is shown on its short side, 53.98 mm, because the long side will not fit. The result is the same.</p>`,
      },
      {
        h2: 'Check your scale',
        html: `<p>After the card step, the tool shows a coin outline at the size it now believes is right. A US quarter is 24.26 mm wide (US Mint). Lay a quarter on it. If it fits, press Yes. If not, press No and calibrate again.</p>
<p>This check uses a second object, so it can catch a mistake in the first match. Other methods work too: pick your device from the list, type your screen size, or use a coin or a sheet of paper. The device and screen size methods are approximate. They trust the size printed on the box.</p>`,
        table: 'methods',
      },
      {
        h2: 'Per screen, saved in your browser',
        html: `<p>The calibration is saved for this screen in your browser. A laptop and an external monitor each keep their own record. If you drag the window to another monitor, the tool notices and offers to calibrate it, or to reuse a saved one. Nothing is sent to a server.</p>
<p>Display scaling matters. If you change it, calibrate again. After calibration, go to the <a href="@">full online ruler</a> to measure.</p>`,
      },
    ],
  },
  {
    slug: 'phone',
    title: 'Online Ruler for Phone: Measure on Your Screen',
    description: 'A free online ruler for your phone screen. Calibrate with a credit card, then measure small objects in cm, mm or inches. Works on iPhone and Android.',
    h1: 'Online Ruler for Phone: Measure on Your Screen',
    lede: 'A ruler on your phone screen. Calibrate with a card, then lay a small object on the glass.',
    crumb: 'Phone ruler',
    unit: 'both', edges: 'left,top',
    faq: ['phone', 'camera', 'devices', 'accurate', 'card', 'free'],
    sections: [
      {
        h2: 'A ruler on your phone screen',
        html: `<p>This page puts the online ruler on your phone. The vertical ruler runs along the long edge of the screen, and there is a second ruler across the top. The unit switch is above the ruler. Use cm and inches together, or pick one.</p>
<p>Calibrate first. A phone is a small, dense screen, and an uncalibrated ruler is only a guess. Hold a credit card against the screen and match it. On a phone the card is shown on its short side, because the long side is wider than the screen.</p>`,
      },
      {
        h2: 'How long can a phone ruler be?',
        html: `<p>It can be as long as the screen. A 6.1 inch phone with a 19.5:9 screen is about 14 cm tall. Larger phones reach about 15 to 16 cm. A tablet gives more. Turn the phone sideways to use the long edge for a horizontal ruler.</p>
<p>For anything longer, use a real ruler or a tape measure. A phone ruler is for small flat objects: a coin, a key, a screw, a bead, a stamp or a label.</p>`,
      },
      {
        h2: 'Tips for iPhone and Android',
        html: `<ul>
<li><strong>Keep the screen on.</strong> Where the browser allows it, the page asks the phone to stay awake while you measure.</li>
<li><strong>Do not pinch zoom.</strong> Pinch zoom changes the page size, so the ruler is no longer true. The tool warns you when it is on.</li>
<li><strong>Keep the object flat.</strong> A thick screen protector or a case lip can lift an object off the glass.</li>
<li><strong>Full screen.</strong> On iPhone, Safari may not offer full screen for a web page. Add the page to your Home Screen to hide the browser bars.</li>
<li><strong>Check with a coin</strong> after you calibrate. The check step does this for you.</li>
</ul>`,
      },
      {
        h2: 'Camera rulers and other options',
        html: `<p>Some apps use the camera to measure. That needs a reference object of known size in the photo, and it is a different tool. This ruler does not use the camera. It measures flat objects that you place on the screen.</p>
<p>If you use a computer, the <a href="@actual-size/">actual size ruler</a> page explains calibration in detail. See also the <a href="@cm/">cm ruler</a> and the <a href="@inches/">inch ruler</a>.</p>`,
      },
    ],
  },
];

export const bySlug = (slug: string) => pages.find((p) => p.slug === slug)!;
