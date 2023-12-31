import { defineCollection, z } from "astro:content";

const blog = defineCollection({
	type: "content",
	schema: ({ image }) => ({
		title: z.string().min(1).max(80),
		date: z.date(),
	}),
});
export default {
	blog,
};
