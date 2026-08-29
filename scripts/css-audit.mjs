/**
 * CSS audit. Builds nothing; drives the built site in a real browser.
 *
 *     npm run build && npm run audit
 *
 * This exists because of a bug that nothing else caught. `py-[--spacing-gap]` is
 * valid Tailwind 3 syntax and Tailwind 4 accepts it without complaint, but it
 * emits `padding-block: --spacing-gap`, which is invalid CSS. The browser drops
 * the declaration, every section loses its vertical padding, and the build, the
 * typecheck and the class list all look completely fine. In Tailwind 4 the
 * syntax for reading a variable is `py-(--spacing-gap)`.
 *
 * So the rule here is: assert on **computed styles**, not on whether a class
 * exists. A class can exist, compile, and still do nothing.
 *
 * The mobile menu is not covered here, because it needs a click. It broke once
 * in a way worth remembering: the header carried `backdrop-blur`, and
 * `backdrop-filter` makes an element a containing block for `position: fixed`
 * descendants, so the menu panel sized itself against the header rather than the
 * viewport. If the menu is touched, check its height at a mobile width.
 */
import puppeteer from 'puppeteer';

const ORIGIN = process.env.AUDIT_ORIGIN ?? 'http://127.0.0.1:4321';
const PAGES = [
  ['en', '/'],
  ['ml', '/ml/'],
  ['hi', '/hi/'],
];
const WIDTHS = [360, 390, 640, 768, 1024, 1280, 1440, 1920];

const problems = [];
const browser = await puppeteer.launch({ protocolTimeout: 120_000 });

for (const [lang, path] of PAGES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    page.on('pageerror', (error) => problems.push(`${lang} @${width}  script error: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error') problems.push(`${lang} @${width}  console: ${message.text()}`);
    });

    await page.goto(`${ORIGIN}${path}`, { waitUntil: 'networkidle0' });

    /*
     * Scroll the whole page before measuring anything.
     *
     * Without this the audit only ever sees the top of the document: lazily
     * loaded images below the fold have never been requested, so they look
     * broken, and anything that overflows further down is never measured. This
     * check reported the portrait as a failed image when it was fine.
     */
    await page.evaluate(async () => {
      const step = window.innerHeight;
      // Height is read once and the loop is capped: as lazy images load they
      // extend the document, and re-reading it each pass can run away.
      const steps = Math.min(60, Math.ceil(document.documentElement.scrollHeight / step) + 2);
      for (let i = 0; i <= steps; i++) {
        window.scrollTo(0, i * step);
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
      window.scrollTo(0, 0);
    });
    await new Promise((resolve) => setTimeout(resolve, 500));

    const found = await page.evaluate((viewport) => {
      const px = (value) => Math.round(parseFloat(value) || 0);
      const issues = [];

      if (document.documentElement.scrollWidth > viewport + 1) {
        issues.push(`page scrolls sideways (${document.documentElement.scrollWidth}px)`);
      }

      // Sections must actually have their vertical rhythm. This is the check
      // that would have caught the padding bug.
      const sections = [...document.querySelectorAll('main > section')];
      sections.slice(1).forEach((section) => {
        const padding = px(getComputedStyle(section).paddingTop);
        if (padding < 40) issues.push(`#${section.id || 'section'} has padding-top ${padding}px`);
      });

      // Nothing may stick out past the viewport.
      document.querySelectorAll('header *, main *, footer *').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.right > viewport + 1) {
          issues.push(`overflows right: ${el.tagName.toLowerCase()}.${el.classList[0] ?? ''}`);
        }
      });

      // Images that finished loading and came back empty. `complete` is the
      // important half: a lazy image that was never requested is not broken,
      // it simply has not been asked for, and flagging it is a false alarm.
      document.querySelectorAll('img').forEach((image) => {
        if (image.complete && image.naturalWidth === 0) {
          issues.push(`image failed: ${image.getAttribute('src')}`);
        }
      });

      // Text clipped by an ancestor that is too short for it.
      document.querySelectorAll('h1, h2, h3, p').forEach((el) => {
        if (el.scrollHeight > el.clientHeight + 2 && getComputedStyle(el).overflow !== 'visible') {
          issues.push(`clipped text: ${el.tagName.toLowerCase()}`);
        }
      });

      return [...new Set(issues)];
    }, width);

    for (const issue of found) problems.push(`${lang} @${width}  ${issue}`);
    await page.close();
  }
}

await browser.close();

if (problems.length === 0) {
  console.log(`No problems across ${PAGES.length} languages x ${WIDTHS.length} widths.`);
  process.exit(0);
}

console.log(`${problems.length} problem(s):`);
for (const problem of problems) console.log('  ' + problem);
process.exit(1);
