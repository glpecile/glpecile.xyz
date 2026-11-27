// bun:test has no vi.stubGlobal, so tests swap globals with these.
const originals = new Map<string, PropertyDescriptor | undefined>();

export function stubGlobal(name: string, value: unknown) {
	if (!originals.has(name))
		originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
	Object.defineProperty(globalThis, name, {
		value,
		configurable: true,
		writable: true,
	});
}

export function unstubAllGlobals() {
	for (const [name, original] of originals) {
		if (original) Object.defineProperty(globalThis, name, original);
		else Reflect.deleteProperty(globalThis, name);
	}
	originals.clear();
}
