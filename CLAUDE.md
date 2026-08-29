# CLAUDE.md

The public site for **Vandana Kamath**, a Kerala mural painter: her paintings, an
explanation of the art form, her journal, and two ways to reach her.

Astro 7, Tailwind 4, prerendered, English only. Published at vandanakamath.art
on Netlify.

## The content is not in this repository

Paintings and journal articles live in a Supabase database and are edited in a
CMS, which is a **separate, private repository**:

| | |
|---|---|
| CMS | [`vk-mural-cms`](https://github.com/abhaykamath/vk-mural-cms), checked out at `../cms` |
| Supabase | project `vk-mural`, ref `vbsbcbelqruiiggwfrwl` |

That repository's `CLAUDE.md` and `docs/` explain the database, the API and the
deployment. **Read them before changing anything here that touches content** —
the schema, the publish flow and the row level security model are all documented
there and not repeated here.

```
CMS dashboard ──> API ──> Supabase ──> this site's build ──> static HTML
```

**The database is read once, at build time.** Nothing a visitor does touches
Supabase. If it is down, the site is unaffected — only publishing is.

## Building it

```bash
npm install
cp .env.example .env    # then fill in SUPABASE_ANON_KEY
npm run dev
npm run build           # dist/, plain static files
```

Two variables are required:

```
SUPABASE_URL=https://vbsbcbelqruiiggwfrwl.supabase.co
SUPABASE_ANON_KEY=<anon / publishable key>
```

On Netlify they are under Site configuration → Environment variables. The anon
key is safe here: row level security limits it to reading published rows, and it
cannot write.

**Without them the build fails, deliberately.** A red build is much better than a
live site that has quietly lost its paintings.

## Invariants

1. **Every page is prerendered.** No SSR, no runtime data fetching, no client
   framework. The site ships about 1.4 KB of JavaScript, inlined, for the
   mobile menu and the lightbox. Keep it that way — the lightbox is a native
   `<dialog>` for exactly this reason.
2. **Paintings are never cropped.** Each sits centred in a plate of common
   height, so portrait and landscape works hang on a shared centre line. Cropping
   to tidy a grid is something you do to a stock photo, not to someone's work.
3. **Never print a measurement the database does not have.** Dimensions and
   working time are nullable, and every renderer checks before printing and drops
   the line rather than inventing a number. They appear as facts about her work.
4. **Images are optimised at build time.** Originals come from Supabase Storage
   through `astro:assets`, which emits resized WebP with a `srcset` into
   `/_astro`. The published pages reference local files; a visitor's browser
   never contacts Supabase.
5. **The site copy is not CMS-managed.** `src/data/strings.ts` holds every word
   that is not a painting title or an article — hero, panchavarna, process,
   about, contact. Edited in code, on purpose.

## Where things are

| | |
|---|---|
| `src/data/supabase.ts` | Reads the database at build time. Plain `fetch`, no SDK. |
| `src/data/strings.ts` | All static copy |
| `src/data/site.ts` | Her name and contact details |
| `src/content.config.ts` | The custom Astro loader that feeds articles in |
| `src/components/Home.astro` | The whole home page, section by section |
| `src/components/Lightbox.astro` | Native `<dialog>`, no framework |
| `src/styles/global.css` | Palette and type, with the reasoning |

## The content loader

`src/content.config.ts` replaced a `glob()` over markdown files with a Supabase
loader that **deliberately keeps the same schema and ids**. So
`getCollection('journal')` and `render(entry)` behave exactly as they did, and
moving the content into Postgres required no change to `Home.astro`,
`Article.astro` or `journal/[slug].astro`.

The body arrives as HTML the API rendered from the editor's document. It is safe
to inject because the server produced it: rendered from a structured document
with every text node escaped, never accepted from a browser.

There are no markdown articles in this repository any more. If you find yourself
adding one, the answer is almost certainly the CMS.

## Design

The palette is the art form's own. Kerala mural painting works in panchavarna —
five colours ground from earth and plant — and the Tailwind tokens keep their
Malayalam names (`--color-manjadi`, `--color-kari` as `soot`) so the connection
stays visible in the code and not only in the copy.

Eczar for display, Karla for body. The site was trilingual until recently; it is
English only now, and the per-script font loading and typography rules were
removed with it.

## Traps

- **`astro.config.mjs` runs before Astro loads `.env`.** It must read
  credentials with Vite's `loadEnv`, not by importing `src/data/supabase.ts` —
  doing that runs the module's missing-credentials guard a step too early and
  reports a key that is sitting right there in the file.
- **Remote images need explicit `width` and `height`**, and the Storage host must
  be listed in `image.remotePatterns`, or Astro refuses to optimise them.
- **Publishing is not instant.** A change in the CMS reaches the site only when
  Netlify rebuilds — about a minute. That is by design, not a bug to fix.
