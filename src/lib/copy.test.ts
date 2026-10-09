import { afterEach, expect, it, vi } from "vitest";

import { attachCopyState } from "./copy";

afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

it.each([
	{ detail: 1, success: true, label: "[copied]", state: "success" },
	{ detail: 0, success: true, label: "[copied]", state: "success" },
	{ detail: 1, success: false, label: "[unavailable]", state: "error" },
])("copy feedback: $state, click detail $detail", async ({ detail, success, label, state }) => {
	vi.useFakeTimers();
	vi.stubGlobal("window", { setTimeout, clearTimeout });
	const writeText = vi.fn(async () => {
		if (!success) throw new Error("clipboard denied");
	});
	vi.stubGlobal("navigator", { clipboard: { writeText } });
	const status = { textContent: "", className: "", setAttribute: vi.fn() };
	vi.stubGlobal("document", { createElement: () => status });
	let click: (event: { detail: number }) => Promise<void> = async () => {};
	const button = {
		addEventListener: (_type: string, listener: typeof click) => { click = listener; },
		append: vi.fn(),
		getAttribute: () => "Copy code",
		setAttribute: vi.fn(),
	};
	const setLabel = vi.fn();
	const setState = vi.fn();
	attachCopyState({
		button: button as unknown as HTMLButtonElement,
		getCopyText: () => "hello",
		labels: { idle: "[copy]", success: "[copied]", error: "[unavailable]" },
		setLabel,
		setState,
	});

	await click({ detail });
	expect(writeText).toHaveBeenCalledWith("hello");
	expect(setLabel).toHaveBeenLastCalledWith(label, detail > 0);
	expect(setState).toHaveBeenLastCalledWith(state);
	expect(status.textContent).toBe(label);
	expect(button.setAttribute).toHaveBeenLastCalledWith("aria-label", `${label}: Copy code`);

	vi.advanceTimersByTime(1600);
	expect(setLabel).toHaveBeenLastCalledWith("[copy]", detail > 0);
	expect(setState).toHaveBeenLastCalledWith();
	expect(button.setAttribute).toHaveBeenLastCalledWith("aria-label", "Copy code");
});
