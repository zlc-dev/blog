import { defineCollection } from 'astro:content';

import { glob, file } from 'astro/loaders';

import { z } from 'astro/zod';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './i18n_config.ts';
import { joinPath } from './utils.ts';
import { SITE_CONFIG } from './site_config.ts';

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
        license: CCLicense.default("CC BY-NC"),
    })
});

const musics = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/music" }),
    schema: z.object({
        name: z.string(),
        artist: z.string(),
        url: z.string().transform(v => "/" + joinPath(SITE_CONFIG.base, v)),
        cover: z.string().transform(v => "/" + joinPath(SITE_CONFIG.base, v)),
        lrc: z.string().default("").transform(v => "/" + joinPath(SITE_CONFIG.base, v))
    })
});

export const collections = { posts, musics };
