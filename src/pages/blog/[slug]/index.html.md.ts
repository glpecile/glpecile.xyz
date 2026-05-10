import type { APIRoute, GetStaticPaths } from "astro";
import { getEntry } from "astro:content";

import { getBlogPosts } from "@/lib/blog";
import { markdownContentType, renderBlogPostMarkdown } from "@/lib/llms";

export const prerender = true;

export const getStaticPaths = (async () => {
	const posts = await getBlogPosts();

	return posts.map((post) => ({
		params: { slug: post.id },
	}));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
	const slug = params.slug;

	if (!slug) {
		return new Response(null, { status: 404 });
	}

	const post = await getEntry("blog", slug);

	if (!post || post.data.draft) {
		return new Response(null, { status: 404 });
	}

	return new Response(renderBlogPostMarkdown(post), {
		headers: {
			"Content-Type": markdownContentType,
		},
	});
};
