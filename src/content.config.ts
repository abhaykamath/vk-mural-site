import type { Loader } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

import { getArticles } from './data/supabase';

/**
 * Journal articles, read from the CMS database at build time.
 *
 * This was a `glob()` over markdown files. The schema and the ids are unchanged
 * from that arrangement on purpose: `getCollection('journal')` and
 * `render(entry)` behave exactly as they did, so `Home.astro`, `Article.astro`
 * and `journal/[slug].astro` did not have to change at all when the content
 * moved into Postgres.
 *
 * The body arrives as HTML that the API rendered from the editor's document. It
 * is handed to Astro through `rendered`, which is the same channel the markdown
 * pipeline used, so `<Content />` still works and the site needs no knowledge of
 * the editor.
 *
 * That HTML is trusted because the server produced it: the API renders from a
 * structured document with every text node escaped, and never accepts HTML from
 * a browser. Nothing a writer types can introduce a tag.
 */
function supabaseJournal(): Loader {
  return {
    name: 'supabase-journal',

    load: async ({ store, parseData, generateDigest, logger }) => {
      const articles = await getArticles();

      // Cleared rather than merged: an article unpublished in the CMS has to
      // disappear from the next build, and a stale entry left in the store
      // would keep its page alive.
      store.clear();

      for (const article of articles) {
        const data = await parseData({
          id: article.slug,
          data: {
            title: article.title,
            date: article.published_at,
            excerpt: article.excerpt,
            minutes: article.read_minutes,
            needsReview: article.needs_review,
          },
        });

        store.set({
          id: article.slug,
          data,
          rendered: { html: article.body_html },
          digest: generateDigest(article),
        });
      }

      logger.info(`Loaded ${articles.length} published articles`);
    },
  };
}

const journal = defineCollection({
  loader: supabaseJournal(),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    minutes: z.number(),
    /** Drafted rather than written by Vandana. Keeps honest work visible. */
    needsReview: z.boolean().default(false),
  }),
});

export const collections = { journal };
