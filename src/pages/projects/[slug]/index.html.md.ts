import type { APIRoute, GetStaticPaths } from "astro";
import { getEntry } from "astro:content";

import { markdownContentType, renderProjectPostMarkdown } from "@/lib/llms";
import { getProjectPosts } from "@/lib/projects";

export const prerender = true;

export const getStaticPaths = (async () => {
	const posts = await getProjectPosts();

	return posts.map((post) => ({
		params: { slug: post.id },
	}));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
	const slug = params.slug;

	if (!slug) {
		return new Response(null, { status: 404 });
	}

	const post = await getEntry("projects", slug);

	if (!post || post.data.draft) {
		return new Response(null, { status: 404 });
	}

	return new Response(renderProjectPostMarkdown(post), {
		headers: {
			"Content-Type": markdownContentType,
		},
	});
};
