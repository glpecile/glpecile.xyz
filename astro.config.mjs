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

	// Passthrough image service: remote images are proxied directly
	// without requiring a Cloudflare Images binding.
	adapter: cloudflare({ imageService: "passthrough" }),
	integrations: [mdx(), react()],
});
