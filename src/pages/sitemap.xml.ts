import { getBlogPosts } from "@/lib/blog";

import { siteConfig } from "../../config/site";

const formatSitemapDate = (date: Date) => date.toISOString().split("T")[0];

export async function GET() {
	const posts = await getBlogPosts();
	const today = formatSitemapDate(new Date());
	const latestPostDate = posts[0]
		? formatSitemapDate(posts[0].data.updatedDate ?? posts[0].data.pubDate)
		: today;
	const urls = [
		{ loc: `${siteConfig.siteUrl}/`, lastmod: today },
		{ loc: `${siteConfig.siteUrl}/blog`, lastmod: latestPostDate },
		{ loc: `${siteConfig.siteUrl}/work`, lastmod: today },
		...posts.map((post) => ({
			loc: `${siteConfig.siteUrl}/blog/${post.id}`,
			lastmod: formatSitemapDate(post.data.updatedDate ?? post.data.pubDate),
		})),
	];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${urls
		.map(
			({ loc, lastmod }) => `<url>
		<loc>${loc}</loc>
		<lastmod>${lastmod}</lastmod>
	</url>`,
		)
		.join("\n")}
</urlset>`;

	return new Response(body, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
}
