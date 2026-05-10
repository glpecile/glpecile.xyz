import type { APIRoute } from "astro";

import { renderPreview } from "@/lib/preview";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const png = await renderPreview(
		"glpecile",
		"Frontend Engineer",
		request.url,
	);

	return new Response(png, {
		headers: {
			"Cache-Control": "public, max-age=3600",
			"Content-Type": "image/png",
		},
	});
};
