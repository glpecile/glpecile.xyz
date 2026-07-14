import type { ReactNode } from "react";

import { hasMapboxToken } from "@/lib/mapbox";

import "mapbox-gl/dist/mapbox-gl.css";

type MapFrameProps = {
	label: string;
	children: ReactNode;
};

/**
 * Mapbox ships its canvas with tabindex="0" (arrow keys pan, +/- zoom), but
 * audit tools flag a focusable canvas that has no widget role or name. Brand
 * it as a named application so the focus is legitimate and the built-in
 * keyboard controls are announced.
 */
export function labelMapCanvas(
	map: { getCanvas: () => HTMLCanvasElement },
	label: string,
) {
	const canvas = map.getCanvas();
	canvas.setAttribute("role", "application");
	canvas.setAttribute(
		"aria-label",
		`${label} — interactive map. Arrow keys pan, plus and minus zoom.`,
	);
}

/**
 * Thin monospace caption + bordered viewport wrapper used by every map demo on
 * the post. Stays close to the site's code-frame treatment so the interactive
 * demos read as siblings of the inline code blocks rather than dashboard cards.
 */
export function MapFrame({ label, children }: MapFrameProps) {
	return (
		<figure className="map-frame border-border my-10 overflow-hidden rounded-md border text-sm">
			<figcaption className="border-border bg-muted/40 text-tone-soft border-b px-3 py-1.5 font-mono text-xs">
				{label}
			</figcaption>
			{children}
		</figure>
	);
}

type MapTokenGateProps = {
	children: ReactNode;
};

/**
 * Renders a small placeholder instead of the live map when no Mapbox token is
 * configured, so the post stays readable before the author pastes their token.
 */
export function MapTokenGate({ children }: MapTokenGateProps) {
	if (!hasMapboxToken) return null;
	return <>{children}</>;
}
