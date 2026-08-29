# Vandana Kamath, showcase website

Her paintings, an explanation of Kerala mural painting, writing, and two ways to
reach her. In English, Malayalam and Hindi.

```bash
cd site
npm install
npm run dev      # open the address it prints
npm run build    # produces site/dist, plain static files
npm run audit    # drives the built site in a real browser, 3 languages x 8 widths
```

Astro, Tailwind 4, no server. Every page is prerendered to a real HTML file, so
deploy by copying `site/dist` anywhere that serves files.

## Why prerendered rather than server rendered

The point of moving off the old single page app was never the server. It was that
a search engine, and anyone sharing a link, should get the actual words. Building
the pages at build time achieves exactly that with nothing to run, patch or pay
for. If content ever needs to change without a rebuild, Astro can switch a page to
server rendering without a rewrite.

Twelve pages are built: three home pages and three articles in each of three
languages.

## Languages

| Language | URL | Display face | Body face |
|---|---|---|---|
| English | `/` | Eczar | Karla |
| Malayalam | `/ml/` | Manjari | Manjari |
| Hindi | `/hi/` | Eczar | Mukta |

Eczar covers Latin and Devanagari, so English and Hindi share a display face.
Malayalam is a different script and needs Manjari, which was drawn for it. Fonts
load per language, so nobody downloads a script they are not reading.

Both Indic scripts also get more line height, no uppercase, no tight tracking, and
smaller headings than English. That is not fussiness: a Malayalam compound like
തിരിച്ചെടുക്കാനാവാത്ത is wider than a phone at English heading size.

Every page carries `hreflang` for all three plus `x-default`, a canonical URL, and
localized title, description and Open Graph tags. The language switcher keeps your
position, so switching from a Malayalam article lands on the English version of
that same article.

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

**The Malayalam and Hindi are my translations**, including of her own words. Both
files are marked `needsReview = true`. She is a native speaker and should read
them before publication.

The three files use identical keys, so `en.ts` and `ml.ts` can be read side by
side while reviewing.

## Where content lives

- `inventory.json` at the repository root is her own record of the paintings and
  stays in English. It is shared with the studio tool.
- Malayalam and Hindi painting titles and descriptions live in the i18n files
  keyed by slug, as overrides, so her working file stays clean.
- Articles are Markdown in `src/content/journal/<lang>/`. Adding one means adding
  a file; it gets a real URL automatically.
- Everything else is in `src/i18n/en.ts`, `ml.ts`, `hi.ts`.

## Before this goes public

- **The site domain** in `astro.config.mjs`, currently `vandanakamath.art`.
  Canonical URLs, hreflang and the sitemap all derive from it, so it has to be
  right before launch.
- **The nine journal articles** are samples. The section works and each has a
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

## The CSS audit

`npm run audit` checks **computed styles**, not whether a class exists.

That distinction is the reason it exists. `py-[--spacing-gap]` is valid Tailwind 3
syntax; Tailwind 4 accepts it silently and emits `padding-block: --spacing-gap`,
which is invalid CSS. The browser drops it, every section loses its vertical
padding, and the build, the typecheck and the class list all look perfectly fine.
In Tailwind 4 the syntax for reading a variable is `py-(--spacing-gap)`.

The audit checks section padding, horizontal overflow, elements past the viewport,
images that failed to load, clipped text, and console errors, across three
languages and eight widths.

## Known limitations

- The portrait is served at 896px wide, which is fine, but the paintings are at
  full camera resolution.
- Images are served at full resolution. If more paintings are added, run them
  through the studio tool's website export and use the smaller sizes.
- Stated dimensions do not always match the cropped image proportions, most
  noticeably on Buddha, so layout uses the images' real proportions and treats the
  inches as text.
