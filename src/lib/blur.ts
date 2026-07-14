import { Buffer } from "node:buffer";

// Smallest resized poster variant Letterboxd's CDN serves; other
// arbitrary sizes are rejected with a 403.
const TINY_POSTER_SIZE = "0-35-0-52";

const POSTER_SIZE_PATTERN = /-0-\d+-0-\d+-crop\.jpg/;

export const toDataUri = (mime: string, data: Uint8Array): string =>
	`data:${mime};base64,${Buffer.from(data).toString("base64")}`;

/** Rewrites a Letterboxd poster URL to its tiny placeholder variant. */
export const tinyPosterUrl = (url: string): string | null =>
	POSTER_SIZE_PATTERN.test(url)
		? url.replace(POSTER_SIZE_PATTERN, `-${TINY_POSTER_SIZE}-crop.jpg`)
		: null;

const createBlurPlaceholder = async (url: string): Promise<string | null> => {
	const tinyUrl = tinyPosterUrl(url);
	if (!tinyUrl) return null;

	try {
		const response = await fetch(tinyUrl);
		if (!response.ok) return null;

		const mime = response.headers.get("content-type") ?? "image/jpeg";
		return toDataUri(mime, new Uint8Array(await response.arrayBuffer()));
	} catch {
		return null;
	}
};

const cache = new Map<string, Promise<string | null>>();

/**
 * Tiny inline data URI for a poster, generated at build time from
 * Letterboxd's smallest resized variant (no image processing needed,
 * so it works inside the workerd prerender environment). Meant to be
 * inlined as a background behind the real image so pages paint a soft
 * preview while posters load. Returns null on failure so callers can
 * fall back to a plain background.
 */
export const getBlurPlaceholder = (url: string): Promise<string | null> => {
	let placeholder = cache.get(url);
	if (!placeholder) {
		placeholder = createBlurPlaceholder(url);
		cache.set(url, placeholder);
	}
	return placeholder;
};
