import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";

import react from "@astrojs/react";

export default defineConfig({
	site: "https://glpecile.xyz",

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

	adapter: cloudflare(),
	integrations: [mdx(), react()],
});
