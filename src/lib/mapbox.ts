/**
 * Public Mapbox access token, configured via `PUBLIC_MAPBOX_TOKEN`.
 *
 * Mapbox access tokens are intentionally public (they live in the browser and
 * cannot be hidden from end users) and should only be scoped to allowed
 * domains via the Mapbox dashboard. We read it here so a single source of
 * truth is shared between the client islands and any server-side preview code.
 */
export const mapboxToken: string =
	(import.meta.env.PUBLIC_MAPBOX_TOKEN as string | undefined) ?? "";

export const hasMapboxToken = mapboxToken.length > 0;