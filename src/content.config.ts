import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

/** Journal articles. One markdown file per article, the filename is the slug. */
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
