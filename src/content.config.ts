import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

/**
 * Journal articles, one folder per language.
 *
 * The id carries the locale, for example `en/why-the-gods-are-green`, so the
 * home page and the article routes can filter by language without a second
 * index. Adding a language means adding a folder.
 */
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
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
