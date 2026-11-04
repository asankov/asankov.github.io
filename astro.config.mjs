import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';

const rego = JSON.parse(readFileSync(new URL('./src/syntax/rego.tmLanguage.json', import.meta.url), 'utf8'));

export default defineConfig({
  site: 'https://asankov.dev',
  // GitHub Pages serves the HTML generated during the build.
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({
    filter: (page) => {
      const { pathname } = new URL(page);
      return ['/', '/about/', '/cv/'].includes(pathname) || pathname.startsWith('/post/');
    },
  })],
  markdown: {
    // Preserve punctuation in the existing technical articles and command headings.
    processor: satteri({ features: { smartPunctuation: false } }),
    shikiConfig: {
      theme: 'one-dark-pro',
      langs: [rego],
    },
  },
});
