import type { APIRoute } from "astro";

import { getLetterboxdFilms } from "@/lib/letterboxd";

export const prerender = false;

const MAX_LIMIT = 50;

export const GET: APIRoute = async ({ url }) => {
	const limitParam = Number(url.searchParams.get("limit"));
	const limit =
		Number.isFinite(limitParam) && limitParam > 0
			? Math.min(limitParam, MAX_LIMIT)
			: undefined;
	const includeTags = url.searchParams.get("tags") === "true";

	try {
		const films = await getLetterboxdFilms("Glp", { includeTags, limit });

		return Response.json(
			{ films },
			{ headers: { "Cache-Control": "public, max-age=60" } },
		);
	} catch {
		return Response.json(
			{ error: "failed to load films" },
			{ status: 502, headers: { "Cache-Control": "no-store" } },
		);
	}
};
