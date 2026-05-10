import type { APIRoute } from "astro";

import { getEntry } from "astro:content";

import { renderPreview } from "@/lib/preview";

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
	const slug = params.slug;

	if (!slug) {
		return new Response(null, { status: 404 });
	}

	const post = await getEntry("blog", slug);

	if (!post || post.data.draft) {
		return new Response(null, { status: 404 });
	}

	const png = await renderPreview(post.data.title, post.data.description, request.url);

	return new Response(png, {
		headers: {
			"Cache-Control": "public, max-age=3600",
			"Content-Type": "image/png",
		},
	});
};
