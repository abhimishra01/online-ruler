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
    faq: ['accurate', 'card', 'inchcm', 'bigsmall', 'zoom', 'phone', 'camera', 'devices', 'privacy', 'free'],
    sections: [
      {
        h2: 'Quick start in 3 steps',
        html: `<ol>
<li><strong>Calibrate.</strong> Press Calibrate at the top right of the page (on a phone, it sits above the ruler). Hold a credit card against the screen and match its edges to the outline. This takes about 20 seconds.</li>
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
        h2: 'A worked example: measuring a screw',
        html: `<p>Say you want the length of a wood screw. Here is the full routine, from start to finish.</p>
<ol>
<li>Calibrate with a card and run the check step. The status chip should read "Calibrated, checked".</li>
<li>Choose millimeters. Screw sizes are often given in mm, such as 4 x 40.</li>
<li>Lay the screw flat on the glass, below the top ruler. Put the flat of the head against the left ruler, or against a guide set at zero.</li>
<li>Press Add guide, then drag the guide to the tip of the screw. The readout shows the length, for example "40 mm = 4 cm = 1 9/16 in".</li>
<li>Look straight down at the tip while you place the guide. If you look from the side, the guide appears to move.</li>
</ol>
<p>Measure twice, and take the middle value if the two differ. A screen shows whole pixels, so a reading is only as fine as the pixel grid on your screen. On most phones the grid is finer than a tenth of a millimeter. On a standard monitor one pixel is about a quarter of a millimeter.</p>`,
      },
      {
        h2: 'Common mistakes to avoid',
        html: `<ul>
<li><strong>Skipping the calibration.</strong> The first screen is an estimate. Use the card step before you rely on a number.</li>
<li><strong>Changing the zoom afterwards.</strong> Chrome, Edge and Firefox keep the scale when you zoom the page, but Safari and display scaling changes can break it. If in doubt, calibrate again.</li>
<li><strong>Using a bent or worn card.</strong> A card with a warped edge is hard to line up. Pick a flat one. A coin is a good second check, because its edge is a clean circle.</li>
<li><strong>Looking from an angle.</strong> The glass has a small gap above the pixels. A sideways view moves the object relative to the marks. Look straight down.</li>
<li><strong>Measuring something thick.</strong> A tall object casts the edge away from the screen. Measure flat things, or measure at the base.</li>
<li><strong>Trusting a stretched screen.</strong> If your monitor is set to a resolution with a different shape than the panel, everything is stretched. Use the native resolution, or calibrate with the card, which shows the true size of what you see.</li>
</ul>`,
      },
      {
        h2: 'Which pages to use',
        html: `<p>All the pages share one tool and one saved calibration. Pick the page that matches the scale you read most. The <a href="@cm/">cm ruler</a> and the <a href="@mm/">mm ruler</a> suit metric work. The <a href="@inches/">inch ruler</a> reads fractions down to 1/16. The <a href="@actual-size/">actual size ruler</a> opens the calibration first and explains the method in detail. On a phone, open the <a href="@phone/">phone ruler</a>, which puts the ruler down the long edge of the screen.</p>`,
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
    faq: ['cmmm', 'inchcm', 'accurate', 'card', 'bigsmall', 'phone', 'free'],
    sections: [
      {
        h2: 'A centimeter ruler for your screen',
        html: `<p>This page opens the online ruler in centimeters. Each numbered mark is 1 cm. Each small mark is 1 mm, and the middle mark between two numbers is 5 mm. The zero mark sits in the top left corner.</p>
<p>To measure, put one end of the object at zero. Then pull a guide out of the ruler and move it to the other end. The tool shows the length, for example "9.21 cm = 92.1 mm = 3 5/8 in". Press Copy to put the text on your clipboard.</p>
<p>For a true size ruler, calibrate first. Press Calibrate at the top right (on a phone, above the ruler), open the Card tab, and match a credit card to the outline. The status then reads "Calibrated".</p>`,
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
      {
        h2: 'Reading a centimeter ruler, step by step',
        html: `<p>Put the object at zero. Find the last numbered mark before the end of the object. That number is the whole centimeters. Then count the small marks after it. Each small mark is one millimeter.</p>
<p>Example: an object ends 3 marks after the 7. That is 7 cm and 3 mm, which you write as 7.3 cm. The tool does this for you when you use a guide, but the same steps work when you read the marks by eye.</p>
<p>Half-centimeter marks help. The middle mark between two numbers is 5 mm, and it is a little longer than the others. If an object ends at that mark, add 0.5 cm to the last whole number.</p>`,
      },
      {
        h2: 'Common sizes in centimeters',
        html: `<p>These reference sizes are handy for a quick check. A credit card is 8.56 cm by 5.398 cm. A US quarter is 2.426 cm across. A US dime is 1.791 cm across. A sheet of A4 paper is 21.0 cm by 29.7 cm. A US Letter sheet is 21.59 cm by 27.94 cm. All of these come from standards or the US Mint.</p>
<p>If you have one of these on your desk, lay it on the screen and compare. This is the same idea as the check step, and it takes five seconds.</p>`,
      },
      {
        h2: 'When centimeters are the right choice',
        html: `<p>Use centimeters when you want a number that is easy to say and to write. 12.4 cm is quicker to communicate than 124 mm, and it avoids the fractions of an inch. Most countries use metric for clothing, furniture and packaging, so centimeters are the usual unit in shops and online listings.</p>
<p>If a form asks for millimeters, switch to the <a href="@mm/">mm ruler</a>. If a pattern is in inches, switch to the <a href="@inches/">inch ruler</a>. Your calibration stays the same, so you do not need to repeat it.</p>`,
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
    faq: ['fractions', 'oneinch', 'twelve', 'inchcm', 'accurate', 'card', 'bigsmall', 'free'],
    sections: [
      {
        h2: 'An inch ruler with 1/16 marks',
        html: `<p>This page opens the online ruler in inches. Each long mark with a number is a whole inch. The mark in the middle is 1/2 inch and carries a small "&frac12;" label. Shorter marks show 1/4, 1/8 and 1/16.</p>
<p>Pull a guide out of the ruler to mark the end of your object. The tool rounds the length to the nearest 1/16 and shows it as a reduced fraction, such as "3 5/8 in". It also shows the decimal value (3.625 in) and the millimeter value, so you can copy the form you need.</p>
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
      {
        h2: 'Inch fractions at a glance',
        html: `<p>The ruler marks every 1/16 inch. The mark length tells you the fraction. The longest mark between two numbers is 1/2. The next length is 1/4 and 3/4. Then 1/8, 3/8, 5/8 and 7/8. The shortest marks are the odd sixteenths.</p>
<p>A quick way to read a fraction: count the marks past the last whole inch, and write the count over 16. If the count is even, halve both numbers until the count is odd. Six marks past 2 inches is 6/16, which is 3/8, so the length is 2 3/8 in.</p>
<p>Many tape measures stop at 1/16, and so does this tool. If a plan asks for 1/32, use the decimal value from the readout and convert it with the chart on this page.</p>`,
      },
      {
        h2: 'Measuring common household things',
        html: `<ul>
<li><strong>Picture frames and prints.</strong> Standard print sizes are whole inches, such as 4 x 6 and 5 x 7. Check that your print fits the mat opening, which is usually a little smaller.</li>
<li><strong>Hardware.</strong> Bolts, nuts and washers use fractions of an inch. A 1/4 inch bolt has a shaft 6.35 mm wide. Lay it on the screen and read the width with two guides.</li>
<li><strong>Lumber.</strong> A board sold as 2 x 4 is smaller than its name. The finished size in the US is 1 1/2 by 3 1/2 inches. Measure the actual piece when it matters.</li>
<li><strong>Crafts.</strong> Quilt squares, beads and ribbon are often given in inches and sixteenths.</li>
</ul>`,
      },
      {
        h2: 'Inches and millimeters together',
        html: `<p>Some jobs use both units. A part may be drawn in inches but sold in millimeters. Choose the "cm + in" view on the <a href="@">main ruler</a> to see both scales along the same edge. The readout also gives the millimeter value for every guide, so you can copy the unit the other person needs.</p>`,
      },
    ],
  },
  {
    slug: 'mm',
    title: 'Online Ruler mm: Free Millimeter Ruler, Actual Size',
    description: 'Free online ruler in mm for your screen. Calibrate with a credit card, then measure small parts in millimeters. Guides show the length. Works on phones.',
    h1: 'Online Ruler mm: Millimeter Ruler in Actual Size',
    lede: 'A tick for every millimeter and a number every 10. Calibrate first for true size.',
    crumb: 'Ruler in mm',
    unit: 'mm', edges: 'top,left',
    faq: ['cmmm', 'ring', 'accurate', 'card', 'phone', 'free'],
    sections: [
      {
        h2: 'Online ruler in mm: how to use it',
        html: `<ol>
<li><strong>Calibrate.</strong> Hold a credit card against the screen and match its edges to the outline. A card is 85.60 by 53.98 mm, so the ruler can set its millimeter scale from it.</li>
<li><strong>Place the part.</strong> Put one end of the part at the zero mark in the corner.</li>
<li><strong>Read the mm.</strong> Pull a guide out to the other end. The length shows in millimeters, for example "92.1 mm".</li>
</ol>
<p>Until you calibrate, the ruler shows an estimate and says so. Check the result with a coin: a US dime is 17.91 mm wide.</p>`,
      },
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
        h2: 'How to read a millimeter ruler',
        html: `<p>Find the last number before the end of the object. The numbers are in millimeters here, and they appear every 10 mm. Then count the small marks after it. Each one is 1 mm. A mark at 37 means 37 mm, which is 3.7 cm.</p>
<p>The longer mark between two numbers is 5 mm. It helps your eye find the middle. If the object ends exactly on it, add 5 to the last number.</p>
<p>For half a millimeter, estimate by eye, or use the arrow keys on a guide. With snap on, a guide moves in whole millimeters. Turn snap off if you need finer steps.</p>`,
      },
      {
        h2: 'Reference sizes in millimeters',
        html: `<p>You can check the scale with objects of known size. A credit card is 85.60 by 53.98 mm. A US cent is 19.05 mm, a nickel is 21.21 mm, a dime is 17.91 mm and a quarter is 24.26 mm. A euro 2 cent coin is 18.75 mm. A US Letter sheet is 215.9 mm wide, and an A4 sheet is 210 mm wide.</p>
<p>The coin sizes come from the US Mint and the European Commission. Both publish their sizes, so you can verify them.</p>`,
      },
      {
        h2: 'Why a screen ruler has limits in mm',
        html: `<p>A screen is made of pixels, and a pixel has a size. On a typical laptop one millimeter is only four or five pixels. The ruler can only draw a mark on a pixel, so each mark may sit up to half a pixel from its ideal place. On a phone the pixels are smaller, which helps.</p>
<p>The match to the card also has a limit, because you line up two edges by eye. Expect small errors. For a part that must fit within a tenth of a millimeter, use calipers. A screen ruler is a quick check, not a replacement for a measuring tool.</p>`,
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
<li>Press Calibrate at the top right of the page, then open the Card tab.</li>
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
      {
        h2: 'Pixels, CSS pixels and device pixels',
        html: `<p>Three words come up often, so here is what each one means.</p>
<ul>
<li><strong>Device pixel.</strong> One physical dot on the panel. It has a real size, which depends on the hardware.</li>
<li><strong>CSS pixel.</strong> The unit a web page uses. Browsers map it to device pixels. On a laptop with a high-density panel, one CSS pixel may use four device pixels.</li>
<li><strong>Device pixel ratio.</strong> The number of device pixels in one CSS pixel along one side. Zooming the page changes it.</li>
</ul>
<p>The tool stores device pixels per millimeter, which does not change when you zoom. That is why the scale holds in most browsers when you press Ctrl and plus. The card tells the tool how long a millimeter is in device pixels, and everything else follows from that.</p>`,
      },
      {
        h2: 'How exact is the result?',
        html: `<p>We have not measured the accuracy on a set of devices yet, so we do not quote a figure. What we can say is how the error arises. When you match a card, you line up an edge by eye, so your match is only as good as your eyesight and the width of one pixel. The device and screen size methods trust a number printed by the maker, so their error is larger.</p>
<p>To keep the error small, hold the card flat and close to the glass, look straight down, and use the 0.1 mm buttons to fine-tune. Then run the check step. If a second object fits too, your scale is good for most small jobs.</p>`,
      },
      {
        h2: 'When to calibrate again',
        html: `<p>Calibrate again if you change the display scaling or the resolution in the system settings, or if you plug in a new monitor. The tool notices a new screen and asks you. A calibration is also worth redoing if you used a quick method first and later need a better result.</p>
<p>You do not need to calibrate again after a restart, or on another day. The saved value stays in your browser until you reset it or clear the site data.</p>`,
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
    unit: 'both', edges: 'left',
    faq: ['phone', 'camera', 'devices', 'accurate', 'card', 'free'],
    sections: [
      {
        h2: 'A ruler on your phone screen',
        html: `<p>This page puts the online ruler on your phone. The ruler runs down the left edge of the screen, along its long side, so a phone held upright gives the most length. The unit switch is above the ruler. Use cm and inches together, or pick one. If you need a ruler across the top as well, turn it on in Options.</p>
<p>Calibrate first. A phone is a small, dense screen, and an uncalibrated ruler is only a guess. Hold a credit card against the screen and match it. On a phone the card is shown on its short side, because the long side is wider than the screen.</p>`,
      },
      {
        h2: 'How long can a phone ruler be?',
        html: `<p>It can be as long as the screen. A 6.1 inch phone with a 19.5:9 screen is about 14 cm tall. Larger phones reach about 15 to 16 cm. A tablet gives more. Turn the phone sideways to use the long edge for a horizontal ruler.</p>
<p>For anything longer, use a real ruler or a tape measure. A phone ruler is for small flat objects: a coin, a key, a screw, a bead, a stamp or a label.</p>`,
      },
      {
        h2: 'How to calibrate on a phone',
        html: `<ol>
<li>Open the page and press Calibrate at the top right.</li>
<li>Hold a credit card flat on the screen. The outline shows the short side of the card, 53.98 mm, because the long side is wider than most phones.</li>
<li>Drag the grip on the right of the outline until the card edge matches it. Use the 0.1 mm buttons to fine-tune.</li>
<li>Press "My card matches". The tool then shows a coin outline. Lay a coin on it to check.</li>
</ol>
<p>Keep your phone still and look straight at the screen. A phone on a table works better than one in your hand.</p>`,
      },
      {
        h2: 'Measuring with the vertical ruler',
        html: `<p>On a phone held upright, the ruler runs down the left edge. That is the long side of the screen, so it gives the most length. Place the object next to it with one end at zero.</p>
<p>Press Add guide. A horizontal line appears. Drag it to the other end of the object. The readout shows the length in the units you chose. If you want to mark both ends, pull a second guide out of the ruler. The readout then shows the gap between the two guides.</p>
<p>The controls hide when you open the calibration, so the whole screen is free for the card.</p>`,
      },
      {
        h2: 'What fits on a phone screen',
        html: `<p>A phone screen is small, so pick the right objects. These fit on a 6.1 inch phone, which has a screen about 14 cm tall and 6.5 cm wide.</p>
<ul>
<li>Coins, keys, SIM cards and memory cards.</li>
<li>Screws, bolts, nails and small tools.</li>
<li>Beads, buttons, earrings and charms.</li>
<li>Stamps, tickets and business cards. A business card is often 3.5 by 2 inches in the US, so it fits across the phone.</li>
</ul>
<p>A US dollar bill is 6.14 inches long, which is about 15.6 cm. It will not fit on most phones, so use a tablet or a computer.</p>`,
      },
      {
        h2: 'Troubleshooting on a phone',
        html: `<ul>
<li><strong>The ruler looks too big or too small.</strong> Calibrate again. Check that pinch zoom is off.</li>
<li><strong>The browser bars move.</strong> The address bar can hide and show as you scroll. This changes the screen height but not the scale.</li>
<li><strong>The result changed after rotating.</strong> The scale stays the same in both directions. If it did not, calibrate again and tell us.</li>
<li><strong>The screen goes dark.</strong> The page asks the phone to stay awake, but some browsers do not allow it. Raise the screen timeout in the phone settings.</li>
</ul>`,
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
