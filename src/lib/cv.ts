import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { load } from 'js-yaml';
import { z } from 'zod';

const positionSchema = z.object({
  title: z.string(),
  period: z.string(),
  responsibilities: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
});

const experienceSchema = z.object({
  title: z.string().optional(),
  company: z.string(),
  location: z.string(),
  period: z.string().optional(),
  positions: z.array(positionSchema),
  responsibilities: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
});

const cvSchema = z.object({
  personal: z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  contact: z.object({
    email: z.email(),
    phone: z.string().optional(),
    linkedin: z.string(),
    linkedinLink: z.url(),
    github: z.string(),
    downloadLink: z.url().optional(),
  }),
  summary: z.string(),
  experience: z.array(experienceSchema),
  openSourceContributions: z.array(experienceSchema),
  talks: z.array(z.object({
    venue: z.string(),
    date: z.string(),
    location: z.string(),
    sessions: z.array(z.object({
      name: z.string(),
      summary: z.string(),
      type: z.string().optional(),
      with: z.string().optional(),
      links: z.object({
        youtube: z.url().optional(),
        github: z.url().optional(),
        slides: z.url().optional(),
      }).optional(),
    })),
  })),
  certifications: z.array(z.string()).default([]),
});

export type CVData = z.infer<typeof cvSchema>;

/** Read and validate the CV during Astro rendering, before any HTML is shipped. */
export function loadCVData(): CVData {
  const source = readFileSync(resolve(process.cwd(), 'public/cv-data.yaml'), 'utf8');
  return cvSchema.parse(load(source));
}
