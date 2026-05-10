import jetBrainsMonoBoldUrl from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff?url";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import resvgWasmModule from "@resvg/resvg-wasm/index_bg.wasm";
import { createElement } from "react";
import satori, { init as initSatori } from "satori/standalone";
import yogaWasmModule from "satori/yoga.wasm";

const size = {
	width: 1200,
	height: 630,
} as const;

const avatarPath = "/images/me.png";
const background = "#050505";
const foreground = "#f4f4f5";
const muted = "rgba(244, 244, 245, 0.7)";
const fontName = "JetBrains Mono";

let avatarPromise: Promise<string> | undefined;
let fontPromise: Promise<ArrayBuffer> | undefined;
let wasmInit: Promise<void> | undefined;
let satoriInit: Promise<void> | undefined;

function resolveAssetUrl(path: string, requestUrl: string) {
	return new URL(path, requestUrl).toString();
}

async function fetchBinary(url: string) {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch asset: ${url}`);
	}

	return await response.arrayBuffer();
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
	let binary = "";
	const bytes = new Uint8Array(buffer);
	const chunkSize = 0x8000;

	for (let index = 0; index < bytes.length; index += chunkSize) {
		const chunk = bytes.subarray(index, index + chunkSize);
		binary += String.fromCharCode(...chunk);
	}

	return btoa(binary);
}

async function getAvatar(requestUrl: string) {
	if (!avatarPromise) {
		avatarPromise = (async () => {
			const avatar = await fetchBinary(resolveAssetUrl(avatarPath, requestUrl));

			return `data:image/png;base64,${arrayBufferToBase64(avatar)}`;
		})();
	}

	return await avatarPromise;
}

async function getFont(requestUrl: string) {
	if (!fontPromise) {
		fontPromise = fetchBinary(resolveAssetUrl(jetBrainsMonoBoldUrl, requestUrl));
	}

	return await fontPromise;
}


async function ensureWasm() {
	if (!wasmInit) {
		wasmInit = initWasm(resvgWasmModule);
	}

	await wasmInit;
}

async function ensureSatori() {
	if (!satoriInit) {
		satoriInit = initSatori(yogaWasmModule);
	}

	await satoriInit;
}

function createPreview(title: string, subtitle: string, avatar: string) {
	const titleSize = title.length > 22 ? 68 : 82;

	return createElement(
		"div",
		{
			style: {
				alignItems: "center",
				background,
				color: foreground,
				display: "flex",
				height: "100%",
				justifyContent: "center",
				padding: "72px",
				width: "100%",
			},
		},
		createElement(
			"div",
			{
				style: {
					alignItems: "center",
					display: "flex",
					gap: "40px",
					width: "100%",
				},
			},
			createElement("img", {
				alt: "",
				height: 120,
				src: avatar,
				style: {
					borderRadius: "9999px",
					flexShrink: 0,
				},
				width: 120,
			}),
			createElement(
				"div",
				{
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "14px",
					},
				},
				createElement(
					"div",
					{
						style: {
							fontSize: titleSize,
							fontWeight: 700,
							letterSpacing: "-0.05em",
							lineHeight: 1,
							maxWidth: "860px",
						},
					},
					title,
				),
				createElement(
					"div",
					{
						style: {
							color: muted,
							fontSize: 34,
							letterSpacing: "0.12em",
							lineHeight: 1.3,
							maxWidth: "860px",
							textTransform: "uppercase",
						},
					},
					subtitle,
				),
			),
		),
	);
}

export async function renderPreview(
	title: string,
	subtitle: string,
	requestUrl: string,
) {
	await ensureWasm();
	await ensureSatori();

	const [avatar, font] = await Promise.all([
		getAvatar(requestUrl),
		getFont(requestUrl),
	]);

	const svg = await satori(
		createPreview(title, subtitle, avatar),
		{
			...size,
			fonts: [
				{
					data: font,
					name: fontName,
					style: "normal",
					weight: 700,
				},
			],
		},
	);

	return new Uint8Array(
		new Resvg(svg, {
		background,
		fitTo: {
			mode: "width",
			value: size.width,
		},
		font: {
			defaultFontFamily: fontName,
			fontBuffers: [new Uint8Array(font)],
			monospaceFamily: fontName,
		},
		}).render().asPng(),
	);
}
