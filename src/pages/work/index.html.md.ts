import type { APIRoute } from "astro";

import { markdownContentType, renderWorkMarkdown } from "@/lib/llms";

export const prerender = true;

export const GET: APIRoute = () =>
	new Response(renderWorkMarkdown(), {
		headers: {
			"Content-Type": markdownContentType,
		},
	});
