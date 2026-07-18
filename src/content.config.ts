import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const authorId = z.enum(["glpecile", "chatgpt", "claude", "glm"]);

const blog = defineCollection({
	loader: glob({ pattern: ["**/*.md", "**/*.mdx"], base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		draft: z.boolean().default(false),
		authors: z.array(authorId).default(["glpecile"]),
	}),
});

export const collections = { blog };
