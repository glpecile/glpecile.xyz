import { siteConfig } from "../../config/site";

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
					src: "/favicon.ico",
					sizes: "any",
					type: "image/x-icon",
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
