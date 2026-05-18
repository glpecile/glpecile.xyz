import type { APIRoute } from "astro";

import { markdownContentType, renderProjectsIndexMarkdown } from "@/lib/llms";
import { getProjectPosts } from "@/lib/projects";

export const prerender = true;

export const GET: APIRoute = async () => {
	const posts = await getProjectPosts();

	return new Response(renderProjectsIndexMarkdown(posts), {
		headers: {
			"Content-Type": markdownContentType,
		},
	});
};
