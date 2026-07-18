import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";

import react from "@astrojs/react";

export default defineConfig({
	site: "https://glpecile.xyz",

	// The projects collection was merged into the blog; keep old URLs alive.
	redirects: {
		"/projects": "/blog",
		"/projects/[slug]": "/blog/[slug]",
	},

	image: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "a.ltrbxd.com",
			},
		],
	},

	markdown: {
		shikiConfig: {
			defaultColor: false,
			themes: {
				light: "catppuccin-latte",
				dark: "catppuccin-mocha",
			},
		},
	},

	vite: {
		plugins: [tailwindcss()],
	},

	// Compile-time image service: remote images are downloaded and
	// optimized at build time into static /_astro assets. The site is
	// fully prerendered, so there is no runtime /_image endpoint.
	adapter: cloudflare({ imageService: "compile" }),
	integrations: [mdx(), react()],
});
