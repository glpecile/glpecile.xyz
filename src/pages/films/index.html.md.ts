import type { APIRoute } from "astro";

import { getLetterboxdFilms } from "@/lib/letterboxd";
import { markdownContentType, renderFilmsMarkdown } from "@/lib/llms";

export const prerender = true;

export const GET: APIRoute = async () => {
	let films: Awaited<ReturnType<typeof getLetterboxdFilms>> = [];
	try {
		films = await getLetterboxdFilms("Glp");
	} catch {
		// Fail silently: render empty state.
	}

	return new Response(renderFilmsMarkdown(films), {
		headers: {
			"Content-Type": markdownContentType,
		},
	});
};
