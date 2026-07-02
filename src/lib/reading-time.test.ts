import { describe, expect, it } from "vitest";

import { formatReadingTime, getReadingTimeMinutes } from "@/lib/reading-time";

describe("getReadingTimeMinutes", () => {
	it("returns at least 1 minute for empty or missing bodies", () => {
		expect(getReadingTimeMinutes(undefined)).toBe(1);
		expect(getReadingTimeMinutes("")).toBe(1);
		expect(getReadingTimeMinutes("   \n\t  ")).toBe(1);
	});

	it("returns 1 minute for short bodies", () => {
		expect(getReadingTimeMinutes("just a few words here")).toBe(1);
	});

	it("counts words at 200 wpm", () => {
		const words = (count: number) => Array(count).fill("word").join(" ");

		expect(getReadingTimeMinutes(words(200))).toBe(1);
		expect(getReadingTimeMinutes(words(400))).toBe(2);
		expect(getReadingTimeMinutes(words(1000))).toBe(5);
	});

	it("ignores whitespace runs and newlines when counting", () => {
		expect(getReadingTimeMinutes("one\n\ntwo   three\tfour")).toBe(1);
	});
});

describe("formatReadingTime", () => {
	it("formats minutes as a read label", () => {
		expect(formatReadingTime(1)).toBe("1 min read");
		expect(formatReadingTime(8)).toBe("8 min read");
	});
});
