import { siteConfig } from "#config/site";

export function GET() {
	return new Response(
		[`User-agent: *`, `Allow: /`, `Host: ${siteConfig.siteUrl}`, `Sitemap: ${siteConfig.siteUrl}/sitemap.xml`].join("\n"),
		{
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
			},
		},
	);
}
