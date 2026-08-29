# Vandana Kamath, showcase website

Her paintings, an explanation of Kerala mural painting, writing, and two ways to
reach her.

```bash
cd site
npm install
cp .env.example .env   # then fill in SUPABASE_ANON_KEY
npm run dev            # open the address it prints
npm run build          # produces site/dist, plain static files
```

Astro, Tailwind 4, no server. Every page is prerendered to a real HTML file, so
deploy by copying `site/dist` anywhere that serves files.

The paintings and the journal come from a database now, read **once, at build
time**. Nothing here talks to it when someone visits: if the database is asleep
or gone, the website is unaffected. See "Where content lives" below.

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

**Paintings and journal articles are edited in the CMS**, which is a separate
repository (`vk-mural-cms`) and writes to a Supabase database. This site reads
that database during the build:

- `src/data/supabase.ts` fetches published paintings and articles. It uses the
  anon key, which row level security limits to reading published rows — it
  cannot write, which is what makes it safe in a build environment.
- `src/content.config.ts` feeds the articles into Astro's content collections,
  so `getCollection('journal')` and `render(entry)` work exactly as they did
  when these were markdown files.
- Painting photographs live in Supabase Storage. Astro downloads each one during
  the build and emits resized WebP with a `srcset`, so the published pages
  reference local files and a visitor's browser never contacts Supabase.

Everything else is still in the repository:

- Every other word on the site is in `src/data/strings.ts`. Her name and contact
  details are in `src/data/site.ts`. These are not CMS-managed.
- The portrait, `public/images/vandana.jpg`, is a local asset.

Publishing a change in the CMS triggers a Netlify build, which is when the new
content reaches the site — about a minute.

### Building it

Two environment variables are required, and the build fails loudly without them
rather than publishing a site with nothing on it:

```
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_ANON_KEY=<the anon / publishable key>
```

On Netlify they go under Site configuration → Environment variables.

## Before this goes public

- **The site domain** in `astro.config.mjs`, currently `vandanakamath.art`.
  Canonical URLs and the sitemap both derive from it, so it has to be right
  before launch.
- **The three journal articles** are samples. The section works and each has a
  real URL, but the writing is placeholder.
- **The reading times are wrong** on the three seeded articles: the frontmatter
  claimed six or seven minutes and they are really about one. They were carried
  over as-is so the migration changed nothing visible, and they correct
  themselves the first time each article is saved in the CMS.

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

- Stated dimensions do not always match the cropped image proportions, most
  noticeably on Buddha, so layout uses the images' real proportions and treats the
  inches as text.
- The build downloads every painting from Supabase Storage each time, which adds
  a few seconds. Fine at six paintings; worth caching if it ever becomes sixty.
