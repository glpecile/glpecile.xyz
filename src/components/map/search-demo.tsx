import * as React from "react";
import { default as MapGL, type MapRef, Marker } from "react-map-gl/mapbox";
import {
	labelMapCanvas,
	MapFrame,
	MapTokenGate,
} from "@/components/map/map-frame";
import { useSiteTheme } from "@/components/map/use-site-theme";
import { mapboxToken } from "@/lib/mapbox";

const initialViewState = {
	longitude: -58.38,
	latitude: -34.6,
	zoom: 11,
};

export type GeocodeFeature = {
	id: string;
	place_name: string;
	center: [number, number];
};

type GeocodeResponse = {
	features?: GeocodeFeature[];
};

export const searchPlaces = async (
	query: string,
): Promise<GeocodeFeature[]> => {
	if (!query.trim()) {
		return [];
	}

	const endpoint = new URL(
		`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
	);
	endpoint.searchParams.set("access_token", mapboxToken);
	endpoint.searchParams.set("autocomplete", "true");
	endpoint.searchParams.set("limit", "5");

	const response = await fetch(endpoint);

	if (!response.ok) {
		return [];
	}

	const json = (await response.json()) as GeocodeResponse;

	return json.features ?? [];
};

export function SearchDemo() {
	const theme = useSiteTheme();
	const mapRef = React.useRef<MapRef>(null);
	const [query, setQuery] = React.useState("");
	const [results, setResults] = React.useState<GeocodeFeature[]>([]);
	const [selected, setSelected] = React.useState<GeocodeFeature | null>(null);

	// Prevents the debounce effect from re-fetching immediately after a
	// selection sets the query to the feature's place_name.
	const skipSearchRef = React.useRef(false);

	React.useEffect(() => {
		if (skipSearchRef.current) {
			skipSearchRef.current = false;
			setResults([]);
			return;
		}

		if (!query.trim()) {
			setResults([]);
			return;
		}

		let cancelled = false;
		const handle = window.setTimeout(async () => {
			const features = await searchPlaces(query);

			if (!cancelled) {
				setResults(features);
			}
		}, 250);

		return () => {
			cancelled = true;
			window.clearTimeout(handle);
		};
	}, [query]);

	const selectFeature = (feature: GeocodeFeature) => {
		setSelected(feature);
		setResults([]);
		skipSearchRef.current = true;
		setQuery(feature.place_name);
		mapRef.current?.flyTo({
			center: feature.center,
			zoom: 12,
			duration: 1200,
			curve: 1.4,
			essential: true,
		});
	};

	return (
		<MapTokenGate>
			<MapFrame label="react-map-gl · geocoding search">
				<div className="border-border bg-muted/30 relative border-b">
					<div className="flex items-center gap-2 px-3 py-2 font-mono text-sm">
						<span aria-hidden="true" className="text-tone-faint">
							&gt;
						</span>
						<input
							type="search"
							placeholder="search a city, address, or venue…"
							value={query}
							onChange={(event) =>
								setQuery(event.currentTarget.value)
							}
							aria-label="Search a location"
							className="text-tone-mid placeholder:text-tone-faint flex-1 bg-transparent font-mono text-sm focus:outline-none"
						/>
					</div>
					{results.length > 0 ? (
						<ul className="border-border bg-background absolute inset-x-0 top-full z-10 m-0 list-none border-y p-0">
							{results.map((feature) => (
								<li key={feature.id} className="mt-0">
									<button
										type="button"
										onClick={() => selectFeature(feature)}
										className="text-tone-soft hover:bg-muted hover:text-tone-mid block w-full px-4 py-2 text-left font-mono text-xs"
									>
										{feature.place_name}
									</button>
								</li>
							))}
						</ul>
					) : null}
				</div>
				<MapGL
					ref={mapRef}
					mapboxAccessToken={mapboxToken}
					initialViewState={initialViewState}
					mapStyle={
						theme === "dark"
							? "mapbox://styles/mapbox/dark-v11"
							: "mapbox://styles/mapbox/light-v11"
					}
					interactiveLayerIds={[]}
					attributionControl={false}
					onLoad={(event) => labelMapCanvas(event.target, "Geocoding search")}
					style={{ width: "100%", height: 380 }}
				>
					{selected ? (
						<Marker
							longitude={selected.center[0]}
							latitude={selected.center[1]}
							anchor="bottom"
						>
							<span
								aria-hidden="true"
								className="font-mono text-base leading-none text-[hsl(var(--link))]"
							>
								●
							</span>
						</Marker>
					) : null}
				</MapGL>
			</MapFrame>
		</MapTokenGate>
	);
}
