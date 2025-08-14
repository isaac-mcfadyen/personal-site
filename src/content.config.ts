import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
	loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/blog" }),
	schema: z.object({
		title: z.string().min(1).max(80),
		date: z.coerce.date(),
		description: z.string(),
	}),
});
export const collections = { blog };
