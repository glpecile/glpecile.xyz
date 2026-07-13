import type { ReactNode } from "react";

import { hasMapboxToken } from "@/lib/mapbox";

import "mapbox-gl/dist/mapbox-gl.css";

type MapFrameProps = {
	label: string;
	children: ReactNode;
};

/**
 * Thin monospace caption + bordered viewport wrapper used by every map demo on
 * the post. Stays close to the site's code-frame treatment so the interactive
 * demos read as siblings of the inline code blocks rather than dashboard cards.
 */
export function MapFrame({ label, children }: MapFrameProps) {
	return (
		<figure className="map-frame overflow-hidden rounded-md border border-border text-sm">
			<figcaption className="border-border border-b bg-muted/40 px-3 py-1.5 font-mono text-tone-soft text-xs">
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
