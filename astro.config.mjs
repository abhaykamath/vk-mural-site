// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

/*
 * The config is evaluated before Astro loads `.env` into `import.meta.env`, so
 * it has to read the file itself. Importing the app's Supabase module here
 * instead would run that module — and its "you forgot the credentials" guard —
 * a step too early, which reports a missing key that is in fact right there in
 * the file.
 */
const { SUPABASE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const storageHostname = new URL(
  SUPABASE_URL ?? process.env.SUPABASE_URL ?? 'https://example.supabase.co',
).hostname;

/**
 * Every page is prerendered to a real HTML file at build time.
 *
 * That is the whole point of the move off the single page app: a search engine,
 * and anyone sharing a link, gets the actual words.
 *
 * Static output keeps hosting as simple as it was before. There is no server.
 */
export default defineConfig({
  /*
   * Canonical links and the sitemap both derive from this.
   *
   * Netlify sets URL and DEPLOY_PRIME_URL during its builds, so a deploy preview
   * describes itself honestly instead of claiming to be the live domain. The
   * fallback is the real address, which is what a plain local build uses.
   */
  site:
    process.env.DEPLOY_PRIME_URL ??
    process.env.URL ??
    process.env.SITE_URL ??
    'https://keralamural.in',
  output: 'static',

  /*
   * Paintings are fetched from Supabase Storage during the build and optimised
   * into AVIF and WebP here, so the published pages reference local files and
   * never the storage host. A visitor's browser makes no request to Supabase.
   *
   * Astro refuses to optimise a remote image unless its host is named, which is
   * the point of the setting: it stops any URL that finds its way into the
   * database from turning this build into an image proxy for someone else.
   */
  image: {
    remotePatterns: [{ protocol: 'https', hostname: storageHostname }],
  },

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
