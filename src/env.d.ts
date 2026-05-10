declare module "*.wasm" {
	const module: WebAssembly.Module;
	export default module;
}

declare module "@resvg/resvg-wasm/index_bg.wasm" {
	const module: WebAssembly.Module;
	export default module;
}

declare module "satori/yoga.wasm" {
	const module: WebAssembly.Module;
	export default module;
}

declare module "*.wasm?module" {
	const module: WebAssembly.Module;
	export default module;
}

declare module "*.woff?url" {
	const url: string;
	export default url;
}

declare module "*.woff2?url" {
	const url: string;
	export default url;
}

declare module "*.png?url" {
	const url: string;
	export default url;
}

interface Window {
	__glpecileTheme: {
		storageKey: string;
		root: HTMLElement;
		media: MediaQueryList;
		getSystemTheme(): "light" | "dark";
		apply(theme: "auto" | "light" | "dark"): void;
		persist(theme: "auto" | "light" | "dark"): void;
	};
}
