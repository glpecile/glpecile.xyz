import type { APIRoute, GetStaticPaths } from "astro";
import { getEntry } from "astro:content";

import { renderPreview } from "@/lib/preview";
import { getProjectPosts } from "@/lib/projects";

export const prerender = true;

export const getStaticPaths = (async () => {
	const posts = await getProjectPosts();

	return posts.map((post) => ({
		params: { slug: post.id },
	}));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params, url }) => {
	const slug = params.slug;

	if (!slug) {
		return new Response(null, { status: 404 });
	}

	const post = await getEntry("projects", slug);

	if (!post || post.data.draft) {
		return new Response(null, { status: 404 });
	}

	const png = await renderPreview(
		post.data.title,
		post.data.description,
		url.toString(),
		"dark",
	);

	return new Response(png, {
		headers: {
			"Content-Type": "image/png",
		},
	});
};
