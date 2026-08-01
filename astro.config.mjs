// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";
import vercel from '@astrojs/vercel'; // or edge
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  adapter: vercel(),
});