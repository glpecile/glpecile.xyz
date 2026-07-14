import type * as GeoJSONTypes from "geojson";
import * as React from "react";
import {
	GeolocateControl,
	Layer,
	default as MapGL,
	type MapRef,
	Marker,
	Source,
} from "react-map-gl/mapbox";
import {
	circlePolygon,
	FILL_COLOR,
	radiusFromSlider,
	sliderFromRadius,
	zoomForRadius,
} from "@/components/map/circle-demo";
import {
	labelMapCanvas,
	MapFrame,
	MapTokenGate,
} from "@/components/map/map-frame";
import {
	type GeocodeFeature,
	searchPlaces,
} from "@/components/map/search-demo";
import { useSiteTheme } from "@/components/map/use-site-theme";
import { mapboxToken } from "@/lib/mapbox";

const initialViewState = {
	longitude: -58.38,
	latitude: -34.6,
	zoom: 11,
};

export function GrandFinaleDemo() {
	const theme = useSiteTheme();
	const mapRef = React.useRef<MapRef>(null);

	const [query, setQuery] = React.useState("");
	const [results, setResults] = React.useState<GeocodeFeature[]>([]);
	const [showResults, setShowResults] = React.useState(false);

	const [center, setCenter] = React.useState({
		longitude: initialViewState.longitude,
		latitude: initialViewState.latitude,
	});
	const [radius, setRadius] = React.useState(5);
	const [searchedLabel, setSearchedLabel] = React.useState<string | null>(
		null,
	);
	const [userPosition, setUserPosition] = React.useState<{
		longitude: number;
		latitude: number;
	} | null>(null);
	const [mapReady, setMapReady] = React.useState(false);

	const skipSearchRef = React.useRef(false);

	React.useEffect(() => {
		if (skipSearchRef.current) {
			skipSearchRef.current = false;
			setResults([]);
			setShowResults(false);
			return;
		}

		if (!query.trim()) {
			setResults([]);
			setShowResults(false);
			return;
		}

		let cancelled = false;
		const handle = window.setTimeout(async () => {
			const features = await searchPlaces(query);
			if (!cancelled) {
				setResults(features);
				setShowResults(true);
			}
		}, 250);

		return () => {
			cancelled = true;
			window.clearTimeout(handle);
		};
	}, [query]);

	const circleData = React.useMemo(
		() =>
			circlePolygon(
				center.longitude,
				center.latitude,
				radius,
			) as GeoJSONTypes.Feature<GeoJSONTypes.Polygon>,
		[center, radius],
	);

	const fillColor = FILL_COLOR[theme];

	// Sync GeoJSON source data when center or radius changes.
	React.useEffect(() => {
		if (!mapReady) return;
		const source = mapRef.current?.getSource("finale-circle") as
			| { setData: (d: GeoJSONTypes.GeoJSON) => void }
			| undefined;
		source?.setData(circleData);
	}, [circleData, mapReady]);

	const selectFeature = (feature: GeocodeFeature) => {
		setResults([]);
		setShowResults(false);
		skipSearchRef.current = true;
		setQuery(feature.place_name);
		setSearchedLabel(feature.place_name);
		setCenter({
			longitude: feature.center[0],
			latitude: feature.center[1],
		});
		mapRef.current?.flyTo({
			center: feature.center,
			zoom: zoomForRadius(radius, feature.center[1]),
			duration: 1200,
			curve: 1.4,
			essential: true,
		});
	};

	return (
		<MapTokenGate>
			<MapFrame label="react-map-gl · the whole thing">
				{/* Search bar */}
				<div className="border-border bg-muted/30 relative border-b">
					<div className="flex items-center gap-2 px-3 py-2 font-mono text-sm">
						<span aria-hidden="true" className="text-tone-faint">
							&gt;
						</span>
						<input
							type="search"
							placeholder="search a place, then adjust the radius…"
							value={query}
							onChange={(event) => {
								setQuery(event.currentTarget.value);
								if (!event.currentTarget.value) {
									setSearchedLabel(null);
								}
							}}
							aria-label="Search a location"
							className="text-tone-mid placeholder:text-tone-faint flex-1 bg-transparent font-mono text-sm focus:outline-none"
						/>
					</div>
					{showResults && results.length > 0 ? (
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

				{/* Map */}
				<div className="p-4">
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
						onLoad={(event) => {
							labelMapCanvas(
								event.target,
								"Search, radius, and geolocation combined",
							);
							setMapReady(true);
						}}
						style={{ width: "100%", height: 360, borderRadius: 4 }}
					>
						<Source
							id="finale-circle"
							type="geojson"
							data={circleData}
						>
							<Layer
								id="finale-circle-fill"
								type="fill"
								paint={{
									"fill-color": fillColor,
									"fill-opacity": 0.15,
								}}
							/>
							<Layer
								id="finale-circle-line"
								type="line"
								paint={{
									"line-color": fillColor,
									"line-width": 1.5,
								}}
							/>
						</Source>
						<Marker
							longitude={center.longitude}
							latitude={center.latitude}
							anchor="center"
						>
							<span
								aria-hidden="true"
								className="font-mono text-base leading-none text-[hsl(var(--link))]"
							>
								●
							</span>
						</Marker>
						{userPosition ? (
							<Marker
								longitude={userPosition.longitude}
								latitude={userPosition.latitude}
								anchor="center"
							>
								<span
									aria-hidden="true"
									className="font-mono text-sm leading-none text-[hsl(var(--tone-mid))]"
								>
									◎
								</span>
							</Marker>
						) : null}
						<GeolocateControl
							position="bottom-right"
							positionOptions={{ enableHighAccuracy: true }}
							trackUserLocation
							onGeolocate={(event) => {
								const pos = {
									longitude: event.coords.longitude,
									latitude: event.coords.latitude,
								};
								setUserPosition(pos);
								setCenter(pos);
								setSearchedLabel("your location");
								mapRef.current?.flyTo({
									center: [pos.longitude, pos.latitude],
									zoom: zoomForRadius(radius, pos.latitude),
									duration: 1200,
									curve: 1.4,
									essential: true,
								});
							}}
						/>
					</MapGL>
				</div>

				{/* Controls */}
				<div className="text-tone-soft flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 font-mono text-xs">
					<div className="flex flex-1 items-center gap-3">
						<label htmlFor="finale-radius" className="shrink-0">
							radius
						</label>
						<input
							id="finale-radius"
							type="range"
							min={0}
							max={100}
							step={1}
							value={sliderFromRadius(radius)}
							onChange={(event) => {
								const value = radiusFromSlider(
									Number(event.currentTarget.value),
								);
								setRadius(value);
								mapRef.current?.easeTo({
									center: [center.longitude, center.latitude],
									zoom: zoomForRadius(value, center.latitude),
									duration: 400,
								});
							}}
							className="h-1.5 min-w-24 flex-1 cursor-pointer appearance-none rounded-full bg-[hsl(var(--tone-faint)/0.3)] accent-[hsl(var(--link))]"
						/>
						<code className="text-tone-mid shrink-0 tabular-nums">
							{radius} km
						</code>
					</div>
					<span className="text-tone-faint">·</span>
					<span className="shrink-0">
						{searchedLabel ? (
							<>
								at{" "}
								<code className="text-tone-mid">
									{searchedLabel.length > 40
										? `${searchedLabel.slice(0, 37)}…`
										: searchedLabel}
								</code>
							</>
						) : (
							<span className="text-tone-faint">
								search or locate to begin
							</span>
						)}
					</span>
				</div>
			</MapFrame>
		</MapTokenGate>
	);
}
