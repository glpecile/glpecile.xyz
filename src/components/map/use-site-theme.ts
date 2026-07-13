import { useSyncExternalStore } from "react";

type SiteTheme = "light" | "dark";

function readSiteTheme(): SiteTheme {
	if (typeof document === "undefined") {
		return "light";
	}

	return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(callback: () => void): () => void {
	const observer = new MutationObserver(callback);
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["data-theme"],
	});

	return () => observer.disconnect();
}

/**
 * Subscribes to the site's `data-theme` attribute on `<html>` and returns
 * the current theme. Uses `useSyncExternalStore` — the React 18 primitive for
 * external stores — so there are no effects, no stale closures, and no
 * serializer/deserializer mismatch between SSR and hydration.
 */
export function useSiteTheme(): SiteTheme {
	return useSyncExternalStore(
		subscribe,
		readSiteTheme,
		() => "light" satisfies SiteTheme,
	);
}
