// @ts-check
import { defineConfig } from 'astro/config';

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, FALLBACK_LAN } from "./src/i18n_config.ts";
import pagefind from 'astro-pagefind';
import icon from 'astro-icon';
import { SITE_CONFIG } from './src/site_config.ts';

const ASTRO_ICON_OPTS = {
  include: {
    heroicons: ["*"],
    "fa6-brands": ["creative-commons"],
  },
};

// https://astro.build/config
export default defineConfig({
  site: SITE_CONFIG.site,
  base: SITE_CONFIG.base,
  outDir: './dist',
  output: "static",
  i18n: {
    locales: [...SUPPORTED_LANGUAGES],
    defaultLocale: DEFAULT_LANGUAGE,
    fallback: FALLBACK_LAN,
    routing: {
      prefixDefaultLocale: true,
      fallbackType: "redirect"
    },
  },
  integrations: [pagefind(), icon(ASTRO_ICON_OPTS)],
});