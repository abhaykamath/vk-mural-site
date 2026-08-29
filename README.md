# Vandana Kamath, showcase website

Her paintings, an explanation of Kerala mural painting, writing, and two ways to
reach her.

```bash
cd site
npm install
npm run dev      # open the address it prints
npm run build    # produces site/dist, plain static files
```

Astro, Tailwind 4, no server. Every page is prerendered to a real HTML file, so
deploy by copying `site/dist` anywhere that serves files.

## Why prerendered rather than server rendered

The point of moving off the old single page app was never the server. It was that
a search engine, and anyone sharing a link, should get the actual words. Building
the pages at build time achieves exactly that with nothing to run, patch or pay
for. If content ever needs to change without a rebuild, Astro can switch a page to
server rendering without a rewrite.

Five pages are built: the home page, three articles and a 404.

The site is in English. Eczar sets the headings, Karla the body text. Every page
carries a canonical URL and its own title, description and Open Graph tags.

## Whose words are whose

Some of this copy is Vandana's own and some is mine. The distinction matters, so
it is marked in the source.

**Hers**, from written accounts she supplied:

- The biography and the facts list.
- The panchavarna section: what the art form is, that it is also called temple
  art, the ninth to twelfth century dating, that the colours came from naturally
  available resources, and that only five are used even today.
- The four stages, which follow her description of preparing a wall.
- The "off the wall" note on modern artists using market pigments and working on
  canvas, wood, bamboo and fabric.
- The pull quote, verbatim.

**Mine**, and therefore to be checked by her: the individual pigment descriptions,
the interface strings, and all of the journal articles.

## Where content lives

- `inventory.json` at the repository root is her own record of the paintings: the
  slug, the image, the real measurements. It is shared with the studio tool, and
  it is the only place a painting is defined. Adding one means adding an entry
  there and an image.
- Articles are Markdown in `src/content/journal/`. Adding one means adding a
  file; the filename is the slug and it gets a real URL automatically.
- Every other word on the site is in `src/data/strings.ts`. Her name and contact
  details are in `src/data/site.ts`.

## Before this goes public

- **The site domain** in `astro.config.mjs`, currently `vandanakamath.art`.
  Canonical URLs and the sitemap both derive from it, so it has to be right
  before launch.
- **The three journal articles** are samples. The section works and each has a
  real URL, but the writing is placeholder.

## Design notes

The palette is the art form's own. Kerala mural painting works in panchavarna,
five colours ground from earth and plant, and the Tailwind theme tokens keep their
Malayalam names (`--color-manjadi`, `--color-kari` as `soot`, and so on) so the
connection stays visible in the code and not only in the copy.

Two decisions worth keeping:

- **Paintings are never cropped to tidy the grid.** Each sits centred in a plate
  of common height, so portrait and landscape works hang on a shared centre line.
- **Every painting carries its size and working time**, from her own records.

## No framework on the page

The site ships about **1.3KB of JavaScript**, inlined, for the mobile menu and the
lightbox. The previous version shipped 66KB of React so that a gallery overlay
could open. The lightbox is now a native `<dialog>`, which gives modal semantics,
focus trapping, backdrop and Escape to close correctly and for free.

The studio tool still uses React. It is an application and genuinely needs it.

## Known limitations

- The portrait is served at 896px wide, which is fine, but the paintings are at
  full camera resolution.
- Images are served at full resolution. If more paintings are added, run them
  through the studio tool's website export and use the smaller sizes.
- Stated dimensions do not always match the cropped image proportions, most
  noticeably on Buddha, so layout uses the images' real proportions and treats the
  inches as text.
