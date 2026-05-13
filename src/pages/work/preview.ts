import type { APIRoute } from "astro";

import { renderPreview } from "@/lib/preview";

export const prerender = true;

export const GET: APIRoute = async ({ url }) => {
	const png = await renderPreview(
		"glpecile",
		"Work, education, certificates, and shipped frontend things.",
		url.toString(),
		"dark",
	);

	return new Response(png, {
		headers: {
			"Content-Type": "image/png",
		},
	});
};
