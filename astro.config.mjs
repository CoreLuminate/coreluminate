// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: 'https://coreluminate.com',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), sitemap(
    { changefreq: 'weekly', lastmod: new Date() }
  ), svelte()],

  adapter: cloudflare({
    imageService: 'compile',
  })
});