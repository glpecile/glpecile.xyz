export type InlineSegment = {
	text: string;
	url?: string;
};

const linkPattern = /\[([^\]]+)\]\(([^\s)]+)\)/g;

/** Split text with markdown-style [label](url) links into renderable segments. */
export const parseInlineLinks = (text: string): InlineSegment[] => {
	const segments: InlineSegment[] = [];
	let cursor = 0;

	for (const match of text.matchAll(linkPattern)) {
		const [full, label, url] = match;

		if (!label || !url) continue;
		if (match.index > cursor) segments.push({ text: text.slice(cursor, match.index) });

		segments.push({ text: label, url });
		cursor = match.index + full.length;
	}

	if (cursor < text.length) segments.push({ text: text.slice(cursor) });

	return segments;
};

const displayUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/** Flatten [label](url) links to "label (host/path)" for plain-text surfaces like the CV PDF. */
export const flattenInlineLinks = (text: string): string =>
	parseInlineLinks(text)
		.map((segment) => (segment.url ? `${segment.text} (${displayUrl(segment.url)})` : segment.text))
		.join("");
