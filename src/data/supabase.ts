/**
 * Reading the CMS database, at build time only.
 *
 * Nothing here runs in a visitor's browser. Every page is prerendered, so these
 * requests happen once on the build machine and what ships is plain HTML — the
 * site keeps working if the database is asleep, slow, or gone.
 *
 * The key used is the anon key, and row level security limits it to `select` on
 * rows whose status is `published`. There is no insert, update or delete policy
 * on any table, so this key cannot write. That is why it is safe in Netlify's
 * build environment: it reads exactly what the site already shows.
 *
 * Deliberately a plain `fetch` against PostgREST rather than `@supabase/supabase-js`.
 * Two queries do not justify a dependency, and the site's whole argument is that
 * it ships almost nothing.
 */

const url = import.meta.env.SUPABASE_URL ?? process.env.SUPABASE_URL;
const key = import.meta.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error(
    'SUPABASE_URL and SUPABASE_ANON_KEY must be set to build the site.\n' +
      'They are in the CMS repository’s api/.env, and on Netlify under\n' +
      'Site configuration → Environment variables. See site/README.md.',
  );
}

/** The Storage host, for `image.remotePatterns` and nothing else. */
export const storageHostname = new URL(url).hostname;

/**
 * One request.
 *
 * A failure throws rather than returning an empty list. A build that quietly
 * publishes a site with no paintings on it is far worse than a build that stops
 * and says why.
 */
async function query<T>(path: string): Promise<T[]> {
  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key!, Authorization: `Bearer ${key!}` },
  });

  if (!response.ok) {
    throw new Error(
      `Could not read ${path} from Supabase: ${response.status} ${await response.text()}`,
    );
  }

  return (await response.json()) as T[];
}

// ------------------------------------------------------------- paintings ----

interface PaintingRow {
  slug: string;
  title: string;
  description: string;
  width_inches: string | number | null;
  height_inches: string | number | null;
  time_taken_days: number | null;
  image_path: string | null;
  image_width: number | null;
  image_height: number | null;
  is_hero: boolean;
}

export interface Painting {
  slug: string;
  name: string;
  description: string;

  /**
   * The original in Supabase Storage.
   *
   * Astro downloads it at build time and emits resized AVIF and WebP, so this
   * URL never reaches a visitor — the pages reference the local derivatives.
   */
  imageUrl: string;
  /** Known ahead of time, so a page reserves the right space before loading. */
  imageWidth: number;
  imageHeight: number;

  /**
   * Null until Vandana supplies them. They are printed on the site as facts
   * about her work, so a guess is worse than an omission: every place that shows
   * them checks first and leaves the line out rather than inventing a number.
   */
  widthInches: number | null;
  heightInches: number | null;
  days: number | null;

  /** The painting that leads the home page. An editorial choice, made in the CMS. */
  isHero: boolean;
}

const num = (value: string | number | null): number | null =>
  value === null || value === '' ? null : Number(value);

/*
 * Fetched once per build, not once per caller.
 *
 * The home page, the lightbox and the layout all want the same rows, and every
 * page renders the layout — so without this a five page build makes twenty
 * identical requests for six paintings.
 */
let paintingsPromise: Promise<Painting[]> | null = null;

export function getPaintings(): Promise<Painting[]> {
  paintingsPromise ??= loadPaintings();
  return paintingsPromise;
}

/** The painting the CMS has chosen to lead the site. */
export async function getHeroPainting(): Promise<Painting | undefined> {
  const paintings = await getPaintings();
  return paintings.find((piece) => piece.isHero) ?? paintings[0];
}

async function loadPaintings(): Promise<Painting[]> {
  const rows = await query<PaintingRow>(
    'paintings?select=slug,title,description,width_inches,height_inches,' +
      'time_taken_days,image_path,image_width,image_height,is_hero' +
      '&status=eq.published&order=position.asc',
  );

  return rows
    // A painting with no photograph would render an empty frame. The CMS refuses
    // to publish one, so this is a belt-and-braces guard rather than a real case.
    .filter((row) => row.image_path)
    .map((row) => ({
      slug: row.slug,
      name: row.title,
      description: row.description,
      imageUrl: `${url}/storage/v1/object/public/paintings/${row.image_path}`,
      imageWidth: row.image_width ?? 1200,
      imageHeight: row.image_height ?? 1200,
      widthInches: num(row.width_inches),
      heightInches: num(row.height_inches),
      days: row.time_taken_days,
      isHero: row.is_hero,
    }));
}

// --------------------------------------------------------------- articles ---

export interface ArticleRow {
  slug: string;
  title: string;
  excerpt: string;
  body_html: string;
  read_minutes: number;
  needs_review: boolean;
  published_at: string;
}

let articlesPromise: Promise<ArticleRow[]> | null = null;

export function getArticles(): Promise<ArticleRow[]> {
  articlesPromise ??= query<ArticleRow>(
    'articles?select=slug,title,excerpt,body_html,read_minutes,needs_review,published_at' +
      '&status=eq.published&order=published_at.desc',
  );
  return articlesPromise;
}
