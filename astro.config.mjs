import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import prefetch from "@astrojs/prefetch";
import markdoc from "@astrojs/markdoc";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), sitemap(), prefetch(), markdoc(), svelte()],
	site: "https://www.imcf.me",
});
