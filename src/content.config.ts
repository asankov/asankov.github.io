import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ base: './public/articles', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.string()).default([]),
    aliases: z.array(z.string()).nullish().transform((value) => value ?? []),
  }),
});

export const collections = { posts };
