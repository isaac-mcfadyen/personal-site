import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import expressiveCode from "astro-expressive-code";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	integrations: [sitemap(), svelte(), expressiveCode(), mdx()],
	site: "https://www.imcf.me",
	vite: {
		plugins: [tailwindcss()],
	},
});
