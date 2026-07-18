import type { APIRoute } from "astro";

import { renderPreview } from "@/lib/preview";

export const prerender = true;

export const GET: APIRoute = async ({ url }) => {
	const png = await renderPreview(
		"glpecile",
		"Thoughts, experiments, and project writeups.",
		url.toString(),
		"dark",
	);

	return new Response(png, {
		headers: {
			"Content-Type": "image/png",
		},
	});
};
