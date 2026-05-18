import type { APIRoute } from "astro";

import { getBlogPosts } from "@/lib/blog";
import { getProjectPosts } from "@/lib/projects";
import { markdownContentType, renderHomeMarkdown } from "@/lib/llms";

export const prerender = true;

export const GET: APIRoute = async () => {
	const posts = await getBlogPosts();
 	const projectPosts = await getProjectPosts();

	return new Response(renderHomeMarkdown(posts, projectPosts), {
		headers: {
			"Content-Type": markdownContentType,
		},
	});
};
