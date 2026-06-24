import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PDFName, PDFString, rgb } from "pdf-lib";
import type { PDFFont, PDFPage } from "pdf-lib";
import type { APIRoute } from "astro";

import geistMonoBoldDataUrl from "@fontsource/geist-mono/files/geist-mono-latin-700-normal.woff?inline";
import geistMonoRegularDataUrl from "@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff?inline";

import { cvDownloadName } from "@/lib/cv";
import { siteConfig } from "#config/site";
import type {
	CertificateItem,
	ContactInfo,
	EducationItem,
	LanguageItem,
	ProjectEntry,
	SkillGroup,
	WorkExperience,
} from "#config/site";

export const prerender = true;

type CvEntry = {
	title: string;
	titleUrl?: string;
	titleMeta?: string;
	subtitle?: string;
	subtitleMeta?: string;
	bullets?: readonly string[];
};

type CvInlineRow = {
	label: string;
	value: string;
};

type CvSection =
	| { kind: "entries"; title: string; entries: CvEntry[] }
	| { kind: "inline"; title: string; rows: CvInlineRow[] };

type ContactSegment = {
	text: string;
	url?: string;
};

type Ctx = {
	pdf: PDFDocument;
	regular: PDFFont;
	bold: PDFFont;
};

// A measured, atomic chunk of the document. "section" blocks are kept together
// with the entry that follows so a heading never lands alone at a page foot.
type Block = {
	kind: "header" | "section" | "entry";
	height: number;
	draw: (page: PDFPage, top: number) => void;
};

type PageItem = {
	block: Block;
	marginTop: number;
};

const size = {
	width: 1240,
	height: 1754,
} as const;

const layout = {
	pagePaddingX: 64,
	pagePaddingY: 58,
	pageGap: 30,
	headerGap: 10,
	sectionGap: 14,
	entryGap: 7,
	sectionTitleSize: 20,
	entryTitleSize: 17,
	entryMetaSize: 14,
	detailSize: 13,
	headerTitleSize: 40,
	headerBodySize: 18,
	headerLinkSize: 15,
	headerTitleLineHeight: 1.1,
	headerBodyLineHeight: 1.35,
	headerLinkLineHeight: 1.3,
	entryTitleLineHeight: 1.25,
	entryMetaLineHeight: 1.4,
	detailLineHeight: 1.4,
	sectionTitleLineHeight: 1.2,
	entryDividerSpace: 12,
	detailBulletGap: 8,
	entryIndent: 28,
	inlineLabelWidth: 150,
	inlineColumnGap: 12,
	inlineRowGap: 8,
	// Distance from the top of a line box down to the text baseline.
	baselineFactor: 0.78,
	// Headroom so a block never spills past the bottom margin.
	pageSafetyMargin: 36,
};

const colors = {
	background: rgb(0xf4 / 255, 0xf4 / 255, 0xf5 / 255),
	foreground: rgb(0x18 / 255, 0x18 / 255, 0x1b / 255),
	muted: rgb(0x52 / 255, 0x52 / 255, 0x5b / 255),
	border: rgb(0xd4 / 255, 0xd4 / 255, 0xd8 / 255),
};

const x0 = layout.pagePaddingX;
const rightEdge = size.width - layout.pagePaddingX;
const contentWidth = size.width - layout.pagePaddingX * 2;

const work: readonly WorkExperience[] = siteConfig.work;
const education: readonly EducationItem[] = siteConfig.education;
const projects: readonly ProjectEntry[] = siteConfig.projects;
const skills: readonly SkillGroup[] = siteConfig.skills;
const languages: readonly LanguageItem[] = siteConfig.languages;
const certificates: readonly CertificateItem[] = siteConfig.certificates;
const contact: ContactInfo = siteConfig.contact;

const stripUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

const contactSegments: ContactSegment[] = [
	{ text: contact.email, url: `mailto:${contact.email}` },
	contact.phone ? { text: contact.phone, url: `tel:${contact.phone.replace(/\s+/g, "")}` } : null,
	{ text: contact.location },
	{ text: stripUrl(siteConfig.siteUrl), url: siteConfig.siteUrl },
	{ text: stripUrl(siteConfig.links.github), url: siteConfig.links.github },
	contact.linkedin ? { text: stripUrl(contact.linkedin), url: contact.linkedin } : null,
].filter((segment): segment is ContactSegment => segment !== null);

const allSections: CvSection[] = [
	{
		kind: "entries",
		title: "EXPERIENCE",
		entries: work.map((job) => ({
			title: job.company,
			titleUrl: job.url,
			titleMeta: job.place,
			subtitle: job.role,
			subtitleMeta: job.period,
			bullets: job.highlights ?? (job.summary ? [job.summary] : undefined),
		})),
	},
	{
		kind: "entries",
		title: "PROJECTS",
		entries: projects.map((project) => ({
			title: project.name,
			titleUrl: project.url,
			titleMeta: project.stack,
			subtitleMeta: project.period,
			bullets: project.highlights,
		})),
	},
	{
		kind: "inline",
		title: "SKILLS",
		rows: skills.map((group) => ({ label: group.category, value: group.items.join(", ") })),
	},
	{
		kind: "entries",
		title: "EDUCATION",
		entries: education.map((item) => ({
			title: item.school,
			titleUrl: item.url,
			titleMeta: item.location,
			subtitle: item.credential,
			subtitleMeta: item.period,
			bullets: item.details,
		})),
	},
	{
		kind: "inline",
		title: "LANGUAGES",
		rows: languages.map((item) => ({ label: item.language, value: item.level })),
	},
	{
		kind: "entries",
		title: "CERTIFICATES",
		entries: certificates.map((item) => ({
			title: item.title,
			titleUrl: item.url,
			subtitle: item.issuer,
			subtitleMeta: `Issued ${item.issued}`,
			bullets: item.details,
		})),
	},
];

const sections: CvSection[] = allSections.filter((section) =>
	section.kind === "entries" ? section.entries.length > 0 : section.rows.length > 0,
);

const decodeDataUrl = (dataUrl: string) => {
	const payload = dataUrl.includes(",") ? dataUrl.slice(dataUrl.indexOf(",") + 1) : dataUrl;

	return Uint8Array.from(atob(payload), (character) => character.charCodeAt(0));
};

const lineBox = (fontSize: number, lineHeight: number) => fontSize * lineHeight;

// Greedy word-wrap using the embedded font's real metrics, so measured heights
// and drawn positions agree exactly.
function wrapText(font: PDFFont, text: string, fontSize: number, maxWidth: number): string[] {
	const words = text.trim().split(/\s+/).filter(Boolean);

	if (words.length === 0) {
		return [""];
	}

	const lines: string[] = [];
	let current = "";

	for (const word of words) {
		const next = current.length === 0 ? word : `${current} ${word}`;

		if (current.length === 0 || font.widthOfTextAtSize(next, fontSize) <= maxWidth) {
			current = next;
			continue;
		}

		lines.push(current);
		current = word;
	}

	lines.push(current);

	return lines;
}

function addLink(ctx: Ctx, page: PDFPage, rect: [number, number, number, number], url: string) {
	const annotation = ctx.pdf.context.obj({
		Type: "Annot",
		Subtype: "Link",
		Rect: rect,
		Border: [0, 0, 0],
		A: { Type: "Action", S: "URI", URI: PDFString.of(url) },
	});
	const ref = ctx.pdf.context.register(annotation);
	const existing = page.node.Annots();

	if (existing) {
		existing.push(ref);
	} else {
		page.node.set(PDFName.of("Annots"), ctx.pdf.context.obj([ref]));
	}
}

type DrawOptions = {
	font: PDFFont;
	size: number;
	color: ReturnType<typeof rgb>;
	url?: string;
};

// Draws text whose baseline sits `size * baselineFactor` below `top`, so callers
// can advance by whole line boxes. Registers a link hotspot when `url` is given.
function drawLineText(
	ctx: Ctx,
	page: PDFPage,
	text: string,
	x: number,
	top: number,
	options: DrawOptions,
) {
	const baseline = top - options.size * layout.baselineFactor;
	page.drawText(text, { x, y: baseline, size: options.size, font: options.font, color: options.color });

	if (options.url) {
		const width = options.font.widthOfTextAtSize(text, options.size);
		addLink(ctx, page, [x, baseline - options.size * 0.25, x + width, baseline + options.size * 0.82], options.url);
	}
}

function buildHeaderBlock(ctx: Ctx): Block {
	const headingLines = wrapText(ctx.regular, siteConfig.cv.heading, layout.headerBodySize, contentWidth);
	const height =
		lineBox(layout.headerTitleSize, layout.headerTitleLineHeight) +
		layout.headerGap +
		headingLines.length * lineBox(layout.headerBodySize, layout.headerBodyLineHeight) +
		layout.headerGap +
		lineBox(layout.headerLinkSize, layout.headerLinkLineHeight);

	const draw = (page: PDFPage, top: number) => {
		let y = top;

		drawLineText(ctx, page, siteConfig.author, x0, y, {
			font: ctx.bold,
			size: layout.headerTitleSize,
			color: colors.foreground,
		});
		y -= lineBox(layout.headerTitleSize, layout.headerTitleLineHeight) + layout.headerGap;

		for (const line of headingLines) {
			drawLineText(ctx, page, line, x0, y, {
				font: ctx.regular,
				size: layout.headerBodySize,
				color: colors.muted,
			});
			y -= lineBox(layout.headerBodySize, layout.headerBodyLineHeight);
		}
		y -= layout.headerGap;

		const baseline = y - layout.headerLinkSize * layout.baselineFactor;
		const separator = "  |  ";
		let cursor = x0;

		contactSegments.forEach((segment, index) => {
			drawLineText(ctx, page, segment.text, cursor, y, {
				font: ctx.regular,
				size: layout.headerLinkSize,
				color: colors.muted,
				url: segment.url,
			});
			cursor += ctx.regular.widthOfTextAtSize(segment.text, layout.headerLinkSize);

			if (index < contactSegments.length - 1) {
				page.drawText(separator, {
					x: cursor,
					y: baseline,
					size: layout.headerLinkSize,
					font: ctx.regular,
					color: colors.muted,
				});
				cursor += ctx.regular.widthOfTextAtSize(separator, layout.headerLinkSize);
			}
		});
	};

	return { kind: "header", height, draw };
}

function buildSectionTitleBlock(ctx: Ctx, title: string): Block {
	const height = lineBox(layout.sectionTitleSize, layout.sectionTitleLineHeight);

	const draw = (page: PDFPage, top: number) => {
		drawLineText(ctx, page, title, x0, top, {
			font: ctx.bold,
			size: layout.sectionTitleSize,
			color: colors.foreground,
		});
	};

	return { kind: "section", height, draw };
}

function buildEntryBlock(ctx: Ctx, entry: CvEntry): Block {
	const titleRowHeight = lineBox(layout.entryTitleSize, layout.entryTitleLineHeight);
	const hasSubtitleRow = Boolean(entry.subtitle || entry.subtitleMeta);
	const subtitleRowHeight = hasSubtitleRow ? lineBox(layout.entryMetaSize, layout.entryMetaLineHeight) : 0;

	const dashWidth = ctx.regular.widthOfTextAtSize("-", layout.detailSize);
	const bulletTextX = x0 + layout.entryIndent + dashWidth + layout.detailBulletGap;
	const bulletTextWidth = rightEdge - bulletTextX;
	const bulletLineGroups = (entry.bullets ?? []).map((bullet) =>
		wrapText(ctx.regular, bullet, layout.detailSize, bulletTextWidth),
	);
	const bulletsHeight = bulletLineGroups.reduce(
		(total, lines) => total + layout.entryGap + lines.length * lineBox(layout.detailSize, layout.detailLineHeight),
		0,
	);

	const height =
		layout.entryDividerSpace +
		titleRowHeight +
		(hasSubtitleRow ? layout.entryGap + subtitleRowHeight : 0) +
		bulletsHeight;

	const draw = (page: PDFPage, top: number) => {
		page.drawLine({
			start: { x: x0, y: top },
			end: { x: rightEdge, y: top },
			thickness: 1,
			color: colors.border,
		});

		let y = top - layout.entryDividerSpace;
		const titleBaseline = y - layout.entryTitleSize * layout.baselineFactor;

		drawLineText(ctx, page, entry.title, x0, y, {
			font: ctx.bold,
			size: layout.entryTitleSize,
			color: colors.foreground,
			url: entry.titleUrl,
		});

		if (entry.titleMeta) {
			const metaWidth = ctx.regular.widthOfTextAtSize(entry.titleMeta, layout.entryMetaSize);
			page.drawText(entry.titleMeta, {
				x: rightEdge - metaWidth,
				y: titleBaseline,
				size: layout.entryMetaSize,
				font: ctx.regular,
				color: colors.muted,
			});
		}
		y -= titleRowHeight;

		if (hasSubtitleRow) {
			y -= layout.entryGap;
			const subtitleBaseline = y - layout.entryMetaSize * layout.baselineFactor;

			if (entry.subtitle) {
				page.drawText(entry.subtitle, {
					x: x0,
					y: subtitleBaseline,
					size: layout.entryMetaSize,
					font: ctx.regular,
					color: colors.foreground,
				});
			}

			if (entry.subtitleMeta) {
				const metaWidth = ctx.regular.widthOfTextAtSize(entry.subtitleMeta, layout.entryMetaSize);
				page.drawText(entry.subtitleMeta, {
					x: rightEdge - metaWidth,
					y: subtitleBaseline,
					size: layout.entryMetaSize,
					font: ctx.regular,
					color: colors.muted,
				});
			}
			y -= subtitleRowHeight;
		}

		for (const lines of bulletLineGroups) {
			y -= layout.entryGap;

			lines.forEach((line, lineIndex) => {
				if (lineIndex === 0) {
					drawLineText(ctx, page, "-", x0 + layout.entryIndent, y, {
						font: ctx.regular,
						size: layout.detailSize,
						color: colors.muted,
					});
				}

				drawLineText(ctx, page, line, bulletTextX, y, {
					font: ctx.regular,
					size: layout.detailSize,
					color: colors.muted,
				});
				y -= lineBox(layout.detailSize, layout.detailLineHeight);
			});
		}
	};

	return { kind: "entry", height, draw };
}

function buildInlineGridBlock(ctx: Ctx, rows: CvInlineRow[]): Block {
	const cellWidth = contentWidth / 2;
	const valueX = layout.inlineLabelWidth + layout.inlineColumnGap;
	const valueWidth = cellWidth - valueX;
	const valueLineGroups = rows.map((row) =>
		wrapText(ctx.regular, row.value, layout.entryMetaSize, valueWidth),
	);

	const pairHeight = (index: number) => {
		const leftLines = valueLineGroups[index]?.length ?? 1;
		const rightLines = valueLineGroups[index + 1]?.length ?? 0;
		return Math.max(leftLines, rightLines) * lineBox(layout.entryMetaSize, layout.entryMetaLineHeight) + layout.inlineRowGap;
	};

	let height = 0;
	for (let index = 0; index < rows.length; index += 2) {
		height += pairHeight(index);
	}

	const draw = (page: PDFPage, top: number) => {
		let y = top;

		for (let index = 0; index < rows.length; index += 2) {
			const drawCell = (row: CvInlineRow | undefined, lines: string[] | undefined, cellX: number) => {
				if (!row) {
					return;
				}

				const labelBaseline = y - layout.entryMetaSize * layout.baselineFactor;
				page.drawText(row.label, {
					x: cellX,
					y: labelBaseline,
					size: layout.entryMetaSize,
					font: ctx.bold,
					color: colors.foreground,
				});

				let lineY = y;
				for (const line of lines ?? [row.value]) {
					page.drawText(line, {
						x: cellX + valueX,
						y: lineY - layout.entryMetaSize * layout.baselineFactor,
						size: layout.entryMetaSize,
						font: ctx.regular,
						color: colors.muted,
					});
					lineY -= lineBox(layout.entryMetaSize, layout.entryMetaLineHeight);
				}
			};

			drawCell(rows[index], valueLineGroups[index], x0);
			drawCell(rows[index + 1], valueLineGroups[index + 1], x0 + cellWidth);

			y -= pairHeight(index);
		}
	};

	return { kind: "entry", height, draw };
}

function buildBlocks(ctx: Ctx): Block[] {
	const blocks: Block[] = [buildHeaderBlock(ctx)];

	for (const section of sections) {
		blocks.push(buildSectionTitleBlock(ctx, section.title));

		if (section.kind === "entries") {
			for (const entry of section.entries) {
				blocks.push(buildEntryBlock(ctx, entry));
			}
		} else {
			blocks.push(buildInlineGridBlock(ctx, section.rows));
		}
	}

	return blocks;
}

// Greedily pack measured blocks into pages, breaking only between blocks so no
// entry is split and no section heading is orphaned at a page foot.
function paginate(blocks: Block[]): PageItem[][] {
	const usable = size.height - layout.pagePaddingY * 2 - layout.pageSafetyMargin;
	const gapBefore = (block: Block) => (block.kind === "section" ? layout.pageGap : layout.sectionGap);

	const pages: PageItem[][] = [];
	let page: PageItem[] = [];
	let used = 0;

	for (let index = 0; index < blocks.length; index += 1) {
		const block = blocks[index];

		if (page.length === 0) {
			page.push({ block, marginTop: 0 });
			used = block.height;
			continue;
		}

		const gap = gapBefore(block);
		let need = gap + block.height;

		if (block.kind === "section") {
			const next = blocks[index + 1];
			if (next) {
				need += layout.sectionGap + next.height;
			}
		}

		if (used + need > usable) {
			pages.push(page);
			page = [{ block, marginTop: 0 }];
			used = block.height;
		} else {
			page.push({ block, marginTop: gap });
			used += gap + block.height;
		}
	}

	if (page.length > 0) {
		pages.push(page);
	}

	return pages;
}

export const GET: APIRoute = async () => {
	const pdf = await PDFDocument.create();
	pdf.registerFontkit(fontkit);
	pdf.setTitle(`${siteConfig.author} CV`);
	pdf.setAuthor(siteConfig.author);

	const ctx: Ctx = {
		pdf,
		regular: await pdf.embedFont(decodeDataUrl(geistMonoRegularDataUrl), { subset: true }),
		bold: await pdf.embedFont(decodeDataUrl(geistMonoBoldDataUrl), { subset: true }),
	};

	const pages = paginate(buildBlocks(ctx));

	for (const items of pages) {
		const page = pdf.addPage([size.width, size.height]);
		page.drawRectangle({
			x: 0,
			y: 0,
			width: size.width,
			height: size.height,
			color: colors.background,
		});

		let y = size.height - layout.pagePaddingY;
		for (const item of items) {
			y -= item.marginTop;
			item.block.draw(page, y);
			y -= item.block.height;
		}
	}

	const bytes = await pdf.save();
	const copy = Uint8Array.from(bytes);

	return new Response(copy, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": `attachment; filename="${cvDownloadName()}"`,
		},
	});
};
