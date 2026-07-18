import type { APIRoute } from "astro";

import { getBlogPosts } from "@/lib/blog";
import { getLetterboxdFilms } from "@/lib/letterboxd";
import { markdownContentType, renderHomeMarkdown } from "@/lib/llms";

export const prerender = true;

export const GET: APIRoute = async () => {
	const posts = await getBlogPosts();

	let films: Awaited<ReturnType<typeof getLetterboxdFilms>> = [];
	try {
		films = await getLetterboxdFilms("Glp");
	} catch {
		// Fail silently: render empty state.
	}

	return new Response(renderHomeMarkdown(posts, films), {
		headers: {
			"Content-Type": markdownContentType,
		},
	});
};
