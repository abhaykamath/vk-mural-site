// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

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
    'https://vandanakamath.art',
  output: 'static',

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
