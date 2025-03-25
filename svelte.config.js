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
      base: "/niki-vis-5609"  // ✅ Base path for GitHub Pages
    },
    appDir: "_app",
    prerender: {
      entries: ["*"]  // ✅ Pre-renders all pages for static deployment
    }
  }
};

export default config;
