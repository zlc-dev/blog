import { defineCollection } from 'astro:content';

import { glob, file } from 'astro/loaders';

import { z } from 'astro/zod';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './i18n_config.ts';

export const CCLicense = z.enum([
    "CC BY",
    "CC BY-SA",
    "CC BY-ND",
    "CC BY-NC",
    "CC BY-NC-SA",
    "CC BY-NC-ND",
]);

const posts = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/posts" }),
    schema: z.object({
        title: z.string(),
        author: z.string(),
        tags: z.string().array().default([]),
        summary: z.string().optional(),
        published: z.date(),
        locale: z.enum(SUPPORTED_LANGUAGES).default(DEFAULT_LANGUAGE),
        license: CCLicense.default("CC BY-NC")
    })
});

export const collections = { posts };
