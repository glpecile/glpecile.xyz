declare module "*.wasm" {
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
