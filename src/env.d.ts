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
