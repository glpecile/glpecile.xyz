import { siteConfig } from "#config/site";

export function GET() {
	return new Response(
		JSON.stringify({
			name: siteConfig.name,
			short_name: siteConfig.shortName,
			description: siteConfig.description,
			start_url: "/",
			display: "standalone",
			background_color: siteConfig.backgroundColor,
			theme_color: siteConfig.themeColor,
			icons: [
				{
					src: "/icon-192.png",
					sizes: "192x192",
					type: "image/png",
				},
				{
					src: "/icon.png",
					sizes: "512x512",
					type: "image/png",
				},
			],
		}),
		{
			headers: {
				"Content-Type": "application/manifest+json; charset=utf-8",
			},
		},
	);
}
