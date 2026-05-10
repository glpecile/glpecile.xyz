import type { APIRoute } from "astro";

import { getBlogPosts } from "@/lib/blog";
import { markdownContentType, renderBlogIndexMarkdown } from "@/lib/llms";

export const prerender = true;

export const GET: APIRoute = async () => {
	const posts = await getBlogPosts();

	return new Response(renderBlogIndexMarkdown(posts), {
		headers: {
			"Content-Type": markdownContentType,
		},
	});
};
