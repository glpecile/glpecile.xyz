import { describe, expect, it } from "vitest";

import { flattenInlineLinks, parseInlineLinks } from "./inline-links";

describe("parseInlineLinks", () => {
	it("returns plain text as a single segment", () => {
		expect(parseInlineLinks("no links here")).toEqual([{ text: "no links here" }]);
	});

	it("splits text around a markdown link", () => {
		expect(parseInlineLinks("read the [blog post](https://glpecile.xyz/blog/on-working-with-maps).")).toEqual([
			{ text: "read the " },
			{ text: "blog post", url: "https://glpecile.xyz/blog/on-working-with-maps" },
			{ text: "." },
		]);
	});

	it("handles multiple links and relative urls", () => {
		expect(parseInlineLinks("[a](/one) and [b](/two)")).toEqual([
			{ text: "a", url: "/one" },
			{ text: " and " },
			{ text: "b", url: "/two" },
		]);
	});

	it("returns no segments for empty text", () => {
		expect(parseInlineLinks("")).toEqual([]);
	});
});

describe("flattenInlineLinks", () => {
	it("keeps plain text unchanged", () => {
		expect(flattenInlineLinks("plain")).toBe("plain");
	});

	it("renders links as label with stripped url", () => {
		expect(flattenInlineLinks("see the [blog post](https://glpecile.xyz/blog/on-working-with-maps).")).toBe(
			"see the blog post (glpecile.xyz/blog/on-working-with-maps).",
		);
	});
});
