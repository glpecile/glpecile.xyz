import { siteConfig } from "../../config/site";

export function GET() {
	const today = new Date().toISOString().split("T")[0];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${siteConfig.siteUrl}/</loc>
		<lastmod>${today}</lastmod>
	</url>
</urlset>`;

	return new Response(body, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
}
