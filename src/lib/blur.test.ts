import { afterEach, describe, expect, it, vi } from "vitest";

import { getBlurPlaceholder, tinyPosterUrl, toDataUri } from "./blur";

describe("toDataUri", () => {
	it("encodes bytes as a base64 data uri", () => {
		const data = new TextEncoder().encode("hi");

		expect(toDataUri("image/webp", data)).toBe("data:image/webp;base64,aGk=");
	});

	it("handles empty data", () => {
		expect(toDataUri("image/webp", new Uint8Array())).toBe(
			"data:image/webp;base64,",
		);
	});
});

describe("tinyPosterUrl", () => {
	it("rewrites film poster urls to the tiny variant", () => {
		expect(
			tinyPosterUrl(
				"https://a.ltrbxd.com/resized/film-poster/8/6/9/6/4/4/869644-la-cocina-0-600-0-900-crop.jpg?v=230fd72fce",
			),
		).toBe(
			"https://a.ltrbxd.com/resized/film-poster/8/6/9/6/4/4/869644-la-cocina-0-35-0-52-crop.jpg?v=230fd72fce",
		);
	});

	it("rewrites alternate upload poster urls", () => {
		expect(
			tinyPosterUrl(
				"https://a.ltrbxd.com/resized/sm/upload/he/wz/f9/h1/6gtHgAxgemVd3pIQlbg4YoniqEY-0-600-0-900-crop.jpg?v=c86fe09a93",
			),
		).toBe(
			"https://a.ltrbxd.com/resized/sm/upload/he/wz/f9/h1/6gtHgAxgemVd3pIQlbg4YoniqEY-0-35-0-52-crop.jpg?v=c86fe09a93",
		);
	});

	it("returns null for urls without a size segment", () => {
		expect(tinyPosterUrl("https://example.com/poster.jpg")).toBe(null);
	});
});

describe("getBlurPlaceholder", () => {
	const posterUrl = (id: string) =>
		`https://a.ltrbxd.com/resized/film-poster/${id}-0-600-0-900-crop.jpg`;

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("inlines the tiny variant as a data uri", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(new TextEncoder().encode("hi"), {
				headers: { "content-type": "image/jpeg" },
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		expect(await getBlurPlaceholder(posterUrl("1"))).toBe(
			"data:image/jpeg;base64,aGk=",
		);
		expect(fetchMock).toHaveBeenCalledWith(
			"https://a.ltrbxd.com/resized/film-poster/1-0-35-0-52-crop.jpg",
		);
	});

	it("returns null when the image cannot be fetched", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
		);

		expect(await getBlurPlaceholder(posterUrl("2"))).toBe(null);
	});

	it("returns null for urls it cannot rewrite", async () => {
		const fetchMock = vi.fn();
		vi.stubGlobal("fetch", fetchMock);

		expect(await getBlurPlaceholder("https://example.com/poster.jpg")).toBe(
			null,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("caches results per url", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(new Response(null, { status: 404 }));
		vi.stubGlobal("fetch", fetchMock);

		await getBlurPlaceholder(posterUrl("3"));
		await getBlurPlaceholder(posterUrl("3"));

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
