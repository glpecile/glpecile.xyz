import type { APIRoute } from "astro";

import { getBlogPosts } from "@/lib/blog";
import { getProjectPosts } from "@/lib/projects";
import { llmsContentType, renderLlmsTxt } from "@/lib/llms";

export const prerender = true;

export const GET: APIRoute = async () => {
	const posts = await getBlogPosts();
 	const projectPosts = await getProjectPosts();

	return new Response(renderLlmsTxt(posts, projectPosts), {
		headers: {
			"Content-Type": llmsContentType,
		},
	});
};
