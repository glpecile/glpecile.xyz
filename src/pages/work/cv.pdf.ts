import { PDFDocument } from "pdf-lib";
import type { APIRoute } from "astro";

import geistMonoBoldDataUrl from "@fontsource/geist-mono/files/geist-mono-latin-700-normal.woff?inline";
import geistMonoRegularDataUrl from "@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff?inline";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import resvgWasmModule from "@resvg/resvg-wasm/index_bg.wasm";
import satori, { init as initSatori } from "satori/standalone";
import yogaWasmModule from "satori/yoga.wasm";

import { siteConfig } from "#config/site";
import type { CertificateItem, EducationItem, WorkExperience } from "#config/site";

export const prerender = true;

type CvEntry = {
	title: string;
	meta: string;
	details?: readonly string[];
};

type CvSection = {
	title: string;
	entries: CvEntry[];
};

type CvStyle = Record<string, string | number>;
type CvNode = {
	type: string;
	props: {
		style?: CvStyle;
		children?: CvChild | CvChild[];
		[key: string]: unknown;
	};
};
type CvChild = CvNode | string;

const size = {
	width: 1240,
	height: 1754,
} as const;

const layout = {
	pagePaddingX: 64,
	pagePaddingY: 58,
	pageGap: 34,
	headerGap: 8,
	sectionGap: 16,
	entryGap: 6,
	sectionTitleSize: 20,
	entryTitleSize: 17,
	entryMetaSize: 14,
	detailSize: 13,
	headerTitleSize: 40,
	headerBodySize: 18,
	headerLinkSize: 15,
	headerTitleLineHeight: 1,
	headerBodyLineHeight: 1.35,
	headerLinkLineHeight: 1.3,
	entryTitleLineHeight: 1.2,
	entryMetaLineHeight: 1.3,
	detailLineHeight: 1.3,
	entryDividerSpace: 12,
	entryBulletGap: 10,
	detailBulletGap: 8,
	entryIndent: 28,
	titleMaxWidth: 1060,
	metaMaxWidth: 1060,
	detailMaxWidth: 1030,
};

const pageTheme = {
	background: "#f4f4f5",
	foreground: "#18181b",
	muted: "#52525b",
	border: "#d4d4d8",
};

let wasmInit: Promise<void> | undefined;
let satoriInit: Promise<void> | undefined;
let fontPromise: Promise<{ regular: ArrayBuffer; bold: ArrayBuffer }> | undefined;

const work: readonly WorkExperience[] = siteConfig.work;
const education: readonly EducationItem[] = siteConfig.education;
const certificates: readonly CertificateItem[] = siteConfig.certificates;

const sections: CvSection[] = [
	{
		title: "WORK",
		entries: work.map((job) => ({
			title: `${job.role} @ ${job.company}`,
			meta: `${job.period} | ${job.place}`,
			details: job.summary ? [job.summary] : undefined,
		})),
	},
	{
		title: "EDUCATION",
		entries: education.map((item) => ({
			title: item.school,
			meta: `${item.credential} | ${item.period}`,
			details: item.details,
		})),
	},
	{
		title: "CERTIFICATES",
		entries: certificates.map((item) => ({
			title: item.title,
			meta: `${item.issuer} | Issued ${item.issued}`,
			details: item.details,
		})),
	},
];

const decodeDataUrl = (dataUrl: string) => {
	const payload = dataUrl.includes(",") ? dataUrl.slice(dataUrl.indexOf(",") + 1) : dataUrl;

	return Uint8Array.from(atob(payload), (character) => character.charCodeAt(0)).buffer;
};

const approximateCharsPerLine = (maxWidth: number, fontSize: number) =>
	Math.max(12, Math.floor(maxWidth / (fontSize * 0.62)));

const countWrappedLines = (text: string, maxWidth: number, fontSize: number) => {
	const words = text.trim().split(/\s+/).filter(Boolean);

	if (words.length === 0) {
		return 1;
	}

	const maxChars = approximateCharsPerLine(maxWidth, fontSize);
	let lines = 1;
	let current = "";

	for (const word of words) {
		const next = current.length === 0 ? word : `${current} ${word}`;

		if (next.length <= maxChars || current.length === 0) {
			current = next;
			continue;
		}

		lines += 1;
		current = word;
	}

	return lines;
};

const getLineHeight = (fontSize: number, multiplier: number) => fontSize * multiplier;

const estimateEntryHeight = (entry: CvEntry) => {
	let height = layout.entryDividerSpace;
	height +=
		countWrappedLines(entry.title, layout.titleMaxWidth, layout.entryTitleSize) *
		getLineHeight(layout.entryTitleSize, layout.entryTitleLineHeight);
	height += layout.entryGap;
	height +=
		countWrappedLines(entry.meta, layout.metaMaxWidth, layout.entryMetaSize) *
		getLineHeight(layout.entryMetaSize, layout.entryMetaLineHeight);

	for (const detail of entry.details ?? []) {
		height += layout.entryGap;
		height +=
			countWrappedLines(detail, layout.detailMaxWidth, layout.detailSize) *
			getLineHeight(layout.detailSize, layout.detailLineHeight);
	}

	return height;
};

const estimateSectionHeight = (section: CvSection) => {
	let height = getLineHeight(layout.sectionTitleSize, 1.2);

	for (const entry of section.entries) {
		height += layout.sectionGap;
		height += estimateEntryHeight(entry);
	}

	return height;
};

const estimateCvHeight = () => {
	let height = layout.pagePaddingY * 2;
	height += getLineHeight(layout.headerTitleSize, layout.headerTitleLineHeight);
	height += layout.headerGap;
	height += getLineHeight(layout.headerBodySize, layout.headerBodyLineHeight);
	height += layout.headerGap;
	height += getLineHeight(layout.headerLinkSize, layout.headerLinkLineHeight);

	for (const section of sections) {
		height += layout.pageGap;
		height += estimateSectionHeight(section);
	}

	return Math.max(size.height, Math.ceil(height + layout.pagePaddingY));
};

async function ensureWasm() {
	if (!wasmInit) {
		wasmInit = initWasm(resvgWasmModule).catch((error: unknown) => {
			const message = error instanceof Error ? error.message : String(error);

			if (!message.includes("Already initialized")) {
				throw error;
			}
		});
	}

	await wasmInit;
}

async function ensureSatori() {
	if (!satoriInit) {
		satoriInit = initSatori(yogaWasmModule).catch((error: unknown) => {
			const message = error instanceof Error ? error.message : String(error);

			if (!message.includes("already initialized") && !message.includes("Already initialized")) {
				throw error;
			}
		});
	}

	await satoriInit;
}

async function getFonts() {
	if (!fontPromise) {
		fontPromise = Promise.resolve({
			regular: decodeDataUrl(geistMonoRegularDataUrl),
			bold: decodeDataUrl(geistMonoBoldDataUrl),
		});
	}

	return await fontPromise;
}

const textNode = (text: string, style: CvStyle): CvNode => ({
	type: "div",
	props: {
		style,
		children: text,
	},
});

const rowNode = (children: CvChild[], style: CvStyle): CvNode => ({
	type: "div",
	props: {
		style,
		children,
	},
});

function createDetailNode(detail: string): CvNode {
	return rowNode(
		[
			textNode("-", {
				fontSize: layout.detailSize,
				lineHeight: layout.detailLineHeight,
			}),
			textNode(detail, {
				fontSize: layout.detailSize,
				lineHeight: layout.detailLineHeight,
				maxWidth: `${layout.detailMaxWidth}px`,
			}),
		],
		{
			alignItems: "baseline",
			color: pageTheme.muted,
			display: "flex",
			gap: `${layout.detailBulletGap}px`,
			marginLeft: `${layout.entryIndent}px`,
			maxWidth: `${layout.metaMaxWidth}px`,
		},
	);
}

function createEntryNode(entry: CvEntry): CvNode {
	const children: CvChild[] = [
		rowNode(
			[
				textNode("-", {
					color: pageTheme.foreground,
					fontSize: layout.entryTitleSize,
					fontWeight: 700,
					lineHeight: layout.entryTitleLineHeight,
				}),
				textNode(entry.title, {
					color: pageTheme.foreground,
					fontSize: layout.entryTitleSize,
					fontWeight: 700,
					lineHeight: layout.entryTitleLineHeight,
					maxWidth: `${layout.titleMaxWidth}px`,
				}),
			],
			{
				alignItems: "baseline",
				display: "flex",
				gap: `${layout.entryBulletGap}px`,
			},
		),
		textNode(entry.meta, {
			color: pageTheme.muted,
			display: "flex",
			fontSize: layout.entryMetaSize,
			lineHeight: layout.entryMetaLineHeight,
			marginLeft: `${layout.entryIndent}px`,
			maxWidth: `${layout.metaMaxWidth}px`,
		}),
	];

	for (const detail of entry.details ?? []) {
		children.push(createDetailNode(detail));
	}

	return rowNode(children, {
		borderTop: `1px solid ${pageTheme.border}`,
		display: "flex",
		flexDirection: "column",
		gap: `${layout.entryGap}px`,
		paddingTop: `${layout.entryDividerSpace}px`,
	});
}

function createSectionNode(section: CvSection): CvNode {
	return rowNode(
		[
			textNode(section.title, {
				color: pageTheme.foreground,
				fontSize: layout.sectionTitleSize,
				fontWeight: 700,
				letterSpacing: "0.16em",
			}),
			...section.entries.map(createEntryNode),
		],
		{
			display: "flex",
			flexDirection: "column",
			gap: `${layout.sectionGap}px`,
		},
	);
}

function createCvNode(height: number): CvNode {
	return rowNode(
		[
			rowNode(
				[
					textNode(siteConfig.author, {
						color: pageTheme.foreground,
						fontSize: layout.headerTitleSize,
						fontWeight: 700,
						letterSpacing: "-0.04em",
						lineHeight: layout.headerTitleLineHeight,
					}),
					textNode(siteConfig.cv.heading, {
						color: pageTheme.muted,
						fontSize: layout.headerBodySize,
						lineHeight: layout.headerBodyLineHeight,
					}),
					textNode(siteConfig.siteUrl, {
						color: pageTheme.muted,
						fontSize: layout.headerLinkSize,
						lineHeight: layout.headerLinkLineHeight,
					}),
				],
				{
					display: "flex",
					flexDirection: "column",
					gap: `${layout.headerGap}px`,
				},
			),
			...sections.map(createSectionNode),
		],
		{
			backgroundColor: pageTheme.background,
			color: pageTheme.foreground,
			display: "flex",
			flexDirection: "column",
			gap: `${layout.pageGap}px`,
			height: `${height}px`,
			padding: `${layout.pagePaddingY}px ${layout.pagePaddingX}px`,
			width: "100%",
		},
	);
}

async function renderCvPng() {
	await ensureWasm();
	await ensureSatori();

	const fonts = await getFonts();
	const renderHeight = estimateCvHeight();
	const svg = await satori(createCvNode(renderHeight) as unknown as Parameters<typeof satori>[0], {
		width: size.width,
		height: renderHeight,
		fonts: [
			{
				data: fonts.regular,
				name: "Geist Mono",
				style: "normal",
				weight: 400,
			},
			{
				data: fonts.bold,
				name: "Geist Mono",
				style: "normal",
				weight: 700,
			},
		],
	});

	return new Uint8Array(
		new Resvg(svg, {
			background: pageTheme.background,
			fitTo: {
				mode: "width",
				value: size.width,
			},
			font: {
				defaultFontFamily: "Geist Mono",
				monospaceFamily: "Geist Mono",
			},
		}).render().asPng(),
	);
}

export const GET: APIRoute = async () => {
	const png = await renderCvPng();
	const pdf = await PDFDocument.create();
	pdf.setTitle(`${siteConfig.author} CV`);
	pdf.setAuthor(siteConfig.author);

	const image = await pdf.embedPng(png);
	const pageDoc = pdf.addPage([size.width, size.height]);
	const scale = Math.min(size.width / image.width, size.height / image.height);
	const drawWidth = image.width * scale;
	const drawHeight = image.height * scale;
	const offsetX = (size.width - drawWidth) / 2;
	const offsetY = size.height - drawHeight;

	pageDoc.drawImage(image, {
		x: offsetX,
		y: offsetY,
		width: drawWidth,
		height: drawHeight,
	});

	const bytes = await pdf.save();
	const copy = Uint8Array.from(bytes);

	return new Response(copy, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": `attachment; filename="${siteConfig.cv.fileName}"`,
		},
	});
};
