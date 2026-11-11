/** Stroke icons on a 24px grid, one path each. Rendered by `icon.astro`. */
export const icons = {
	check: "M5 12.5l4.5 4.5L19 7.5",
	code: "m16 18 6-6-6-6M8 6l-6 6 6 6",
	copy: "M11 9h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM5 15V6a2 2 0 0 1 2-2h9",
	download: "M12 3v12M8 11l4 4 4-4M5 21h14",
	markdown:
		"M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4",
	rss: "M5 11a8 8 0 0 1 8 8M5 4a15 15 0 0 1 15 15M5 19h.01",
	share: "M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7",
} as const;

export type IconName = keyof typeof icons;

export const svg = (name: IconName) =>
	`<svg viewBox="0 0 24 24" aria-hidden="true" class="icon"><path d="${icons[name]}"></path></svg>`;

/** Markup for an icon that swaps to a check while an ancestor has `data-copy-state="success"`. */
export const iconSwapHtml = (name: IconName) =>
	`<span class="icon-swap" aria-hidden="true">${svg(name)}${svg("check")}</span>`;
