import type { APIRoute } from "astro";

import { getBlogPosts } from "@/lib/blog";
import { llmsContentType, renderLlmsTxt } from "@/lib/llms";

export const prerender = true;

export const GET: APIRoute = async () => {
	const posts = await getBlogPosts();

	return new Response(renderLlmsTxt(posts), {
		headers: {
			"Content-Type": llmsContentType,
		},
	});
};
