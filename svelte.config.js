import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build'
    }),
    paths: {
      base: "/niki-vis-5609"  // ✅ Correct for GitHub Pages
    },
    appDir: "_app",
    prerender: {
      default: true  // ✅ Ensures all pages are pre-rendered for static hosting
    }
  }
};

export default config;
