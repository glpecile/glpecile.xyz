import type { APIRoute } from "astro";

import { renderPreview } from "@/lib/preview";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const png = await renderPreview(
		"glpecile",
		"Thoughts, experiments, and tiny posts.",
		request.url,
		"dark",
	);

	return new Response(png, {
		headers: {
			"Cache-Control": "public, max-age=0, must-revalidate",
			"Content-Type": "image/png",
		},
	});
};
