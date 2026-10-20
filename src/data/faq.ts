// FAQ bank. Each page picks the questions it needs by id. Plain text only (it also becomes FAQPage JSON-LD).
export const faqBank: Record<string, { q: string; a: string }> = {
  accurate: {
    q: 'How accurate is an online ruler?',
    a: 'It depends on the calibration. Before you calibrate, the ruler is a guess based on your screen type, and the size can be well off. After you match a credit card to the outline, the result depends on how closely you line up the edges. Zoom in, use the 0.1 mm buttons, and run the check step with a coin.',
  },
  card: {
    q: 'How do I calibrate an online ruler with a credit card?',
    a: 'Open Calibrate and choose Credit card. Hold a card flat against the screen and line up one edge with the outline. Drag the grip on the right edge until the other edge matches. Use the 0.1 mm buttons for fine changes, then press "My card matches". Then check the result with a coin.',
  },
  bigsmall: {
    q: 'Why does the ruler look too big or too small?',
    a: 'Most rulers assume 96 pixels per inch. Many screens use a different density, and browsers and operating systems scale the page. The result is a ruler that is too long or too short. Calibrate once and the ruler uses the real size of a pixel on your screen.',
  },
  zoom: {
    q: 'Does browser zoom or display scaling change the ruler?',
    a: 'The ruler stores the physical size of a screen pixel, so page zoom should not change its real size in Chrome, Edge and Firefox. We have not tested every browser and setup. In Safari, and after you change the display scaling, keep zoom at 100 percent or calibrate again.',
  },
  oneinch: {
    q: 'How do I find 1 inch on my screen?',
    a: 'Calibrate first. Then pick the inch unit. The long mark with the number 1 is one inch from the corner. A US quarter is 24.26 mm wide, which is a little less than one inch (25.4 mm), so it fits inside that span with a gap.',
  },
  cmmm: {
    q: 'How do I measure in cm and mm online?',
    a: 'Choose cm or mm in the unit switch. Place the object against the ruler from the zero mark at the corner. Each small mark is 1 mm and every tenth mark is 1 cm. Pull a guide out of the ruler to mark the far edge and read the length.',
  },
  phone: {
    q: 'Can I use my phone as a ruler? How long can it measure?',
    a: 'Yes. Open this page on the phone and calibrate. The ruler can only be as long as the screen. A 6.1 inch phone has a screen about 14 cm tall, so it measures small objects. Turn the phone sideways to use the longer edge.',
  },
  camera: {
    q: 'Can I use my phone camera as a ruler?',
    a: 'Not here. A camera ruler needs a reference object of known size in the same photo, which is a different tool. This ruler measures flat objects that you hold against the screen.',
  },
  devices: {
    q: 'Is the ruler true to size on a Mac, Windows PC, Chromebook and iPad?',
    a: 'It can be, on all of them, after you calibrate. The screens differ in pixel density and scaling, so the page cannot know the real size without your help. A saved calibration is kept per screen, so a laptop and an external monitor each keep their own.',
  },
  privacy: {
    q: 'Is my calibration saved? Is my data private?',
    a: 'The calibration is saved in your browser only, as one small record per screen. Nothing you measure is sent to a server. If your browser blocks storage, the ruler still works, but you will calibrate again on the next visit.',
  },
  printable: {
    q: 'Why is an online ruler different from a printable ruler?',
    a: 'An online ruler is drawn on a screen, so it needs calibration for that screen. A printable ruler is drawn on paper, and its size depends on your printer settings, such as "fit to page". A printable ruler is better for long objects. A screen ruler is better for small flat ones.',
  },
  fractions: {
    q: 'How do I read inch fractions: 1/16, 1/8 and 1/4?',
    a: 'Between two whole inches there are 16 small marks. The longest mark is 1/2. The next longest are 1/4 and 3/4. Then 1/8, 3/8, 5/8 and 7/8. Count the small marks from the last whole inch. Eight marks is 1/2, and 12 marks is 3/4.',
  },
  ring: {
    q: 'Can I measure a ring size with it?',
    a: 'You can measure the inside width of a ring by laying it flat on the screen, which gives its diameter in mm. A ring size chart then turns the diameter into a size. A dedicated ring size tool is planned. Until then, use the mm ruler and a trusted size chart.',
  },
  free: {
    q: 'Is it free? Do I need to install an app?',
    a: 'It is free and runs in the browser. There is nothing to install and no account to make.',
  },
};
export const faqIds = Object.keys(faqBank);
export const faq = faqIds.map((k) => faqBank[k]);
