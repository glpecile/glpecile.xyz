import type { APIRoute } from "astro";

import { siteConfig } from "#config/site";
import { getBlogPostUrl, getBlogPosts } from "@/lib/blog";

const feedPath = "/blog/rss.xml";
const blogPath = "/blog";
const feedTitle = `${siteConfig.shortName} / blog`;
const feedDescription = "Thoughts, experiments, and tiny posts.";

const escapeXml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");

export const prerender = true;

export const GET: APIRoute = async () => {
	const posts = await getBlogPosts();
	const blogUrl = new URL(blogPath, siteConfig.siteUrl).toString();
	const feedUrl = new URL(feedPath, siteConfig.siteUrl).toString();
	const buildDate =
		posts.length === 0
			? new Date()
			: posts.reduce((latest, post) => {
				const date = post.data.updatedDate ?? post.data.pubDate;

				return date > latest ? date : latest;
			}, new Date(0));
	const items = posts
		.map((post) => {
			const link = new URL(getBlogPostUrl(post.id), siteConfig.siteUrl).toString();

			return `<item>
	<title>${escapeXml(post.data.title)}</title>
	<link>${escapeXml(link)}</link>
	<guid isPermaLink="true">${escapeXml(link)}</guid>
	<description>${escapeXml(post.data.description)}</description>
	<pubDate>${post.data.pubDate.toUTCString()}</pubDate>
</item>`;
		})
		.join("\n");
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
	<title>${escapeXml(feedTitle)}</title>
	<link>${escapeXml(blogUrl)}</link>
	<description>${escapeXml(feedDescription)}</description>
	<language>en-us</language>
	<lastBuildDate>${buildDate.toUTCString()}</lastBuildDate>
	<atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
	${items}
</channel>
</rss>`;

	return new Response(body, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
};
