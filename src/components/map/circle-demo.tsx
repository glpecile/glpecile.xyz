import type * as GeoJSONTypes from "geojson";
import * as React from "react";
import {
	Layer,
	default as MapGL,
	type MapRef,
	Marker,
	Source,
} from "react-map-gl/mapbox";
import {
	labelMapCanvas,
	MapFrame,
	MapTokenGate,
} from "@/components/map/map-frame";
import { useSiteTheme } from "@/components/map/use-site-theme";
import { mapboxToken } from "@/lib/mapbox";

export const STEPS = 64;
export const EARTH_RADIUS_KM = 6371;

/**
 * Builds a GeoJSON polygon approximating a circle on the Earth's surface
 * for a given center and radius in kilometers. Uses the haversine formula
 * — fine for city-scale radii where projection distortion is negligible.
 */
export function circlePolygon(
	lng: number,
	lat: number,
	radiusKm: number,
): GeoJSONTypes.Feature<GeoJSONTypes.Polygon> {
	const coordinates: number[][] = [];

	for (let i = 0; i <= STEPS; i++) {
		const bearing = (i / STEPS) * 2 * Math.PI;
		const dByR = radiusKm / EARTH_RADIUS_KM;

		const latRad = (lat * Math.PI) / 180;
		const lngRad = (lng * Math.PI) / 180;

		const destLatRad = Math.asin(
			Math.sin(latRad) * Math.cos(dByR) +
				Math.cos(latRad) * Math.sin(dByR) * Math.cos(bearing),
		);
		const destLngRad =
			lngRad +
			Math.atan2(
				Math.sin(bearing) * Math.sin(dByR) * Math.cos(latRad),
				Math.cos(dByR) - Math.sin(latRad) * Math.sin(destLatRad),
			);

		coordinates.push([
			(((destLngRad * 180) / Math.PI + 540) % 360) - 180,
			(destLatRad * 180) / Math.PI,
		]);
	}

	return {
		type: "Feature",
		geometry: { type: "Polygon", coordinates: [coordinates] },
		properties: {},
	};
}

/**
 * Solid color for the link accent in each theme — WebGL can't read CSS vars.
 * Mapbox's color parser only accepts legacy comma-separated HSL; the modern
 * space-separated syntax fails paint validation and the layer never renders.
 */
export const FILL_COLOR = {
	dark: "hsl(172, 39%, 65%)",
	light: "hsl(192, 60%, 44%)",
} as const;

export const RADIUS_MIN_KM = 1;
export const RADIUS_MAX_KM = 50;

/**
 * Log-scale mapping between slider position (0-100) and radius in km.
 * Radii live on a multiplicative scale — 1→2 km matters as much as
 * 20→40 km — so a linear slider wastes half its travel on the top end.
 */
export function radiusFromSlider(position: number): number {
	const radius =
		RADIUS_MIN_KM * (RADIUS_MAX_KM / RADIUS_MIN_KM) ** (position / 100);
	return radius >= 10 ? Math.round(radius) : Math.round(radius * 10) / 10;
}

export function sliderFromRadius(radius: number): number {
	return Math.round(
		(100 * Math.log(radius / RADIUS_MIN_KM)) /
			Math.log(RADIUS_MAX_KM / RADIUS_MIN_KM),
	);
}

const EARTH_CIRCUMFERENCE_M = 40_075_016.686;

/**
 * Zoom level at which a circle of radiusKm fits inside the demo viewport,
 * derived from mapbox's meters-per-pixel at a given latitude
 * (circumference · cos(lat) / (512 · 2^zoom)).
 */
export function zoomForRadius(radiusKm: number, lat: number): number {
	const viewportPx = 300;
	const metersPerPixel = (radiusKm * 2 * 1000) / viewportPx;
	return Math.log2(
		(EARTH_CIRCUMFERENCE_M * Math.cos((lat * Math.PI) / 180)) /
			(512 * metersPerPixel),
	);
}

const DEFAULT_CENTER = { longitude: -58.38, latitude: -34.6 };
const INITIAL_RADIUS_KM = 5;

const initialViewState = {
	...DEFAULT_CENTER,
	zoom: zoomForRadius(INITIAL_RADIUS_KM, DEFAULT_CENTER.latitude),
};

export function CircleDemo() {
	const theme = useSiteTheme();
	const mapRef = React.useRef<MapRef>(null);
	const [radius, setRadius] = React.useState(INITIAL_RADIUS_KM);
	const [mapReady, setMapReady] = React.useState(false);
	const [center] = React.useState(DEFAULT_CENTER);

	const data = React.useMemo(
		() => circlePolygon(center.longitude, center.latitude, radius),
		[center, radius],
	);

	const fillColor = FILL_COLOR[theme];

	// Sync GeoJSON source data when radius changes. react-map-gl's <Source>
	// data prop doesn't reliably propagate updates — we call setData manually.
	React.useEffect(() => {
		if (!mapReady) return;
		const source = mapRef.current?.getSource("circle") as
			| { setData: (d: GeoJSONTypes.GeoJSON) => void }
			| undefined;
		source?.setData(data);
	}, [data, mapReady]);

	// Re-center on the circle while zooming so the shape always fits the
	// frame, even if the user panned away before touching the slider.
	const handleSliderChange = (position: number) => {
		const value = radiusFromSlider(position);
		setRadius(value);
		mapRef.current?.easeTo({
			center: [center.longitude, center.latitude],
			zoom: zoomForRadius(value, center.latitude),
			duration: 400,
		});
	};

	return (
		<MapTokenGate>
			<MapFrame label="react-map-gl · geojson circle">
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
							labelMapCanvas(event.target, "GeoJSON circle over Buenos Aires");
							setMapReady(true);
						}}
						style={{ width: "100%", height: 360, borderRadius: 4 }}
					>
						<Source id="circle" type="geojson" data={data}>
							<Layer
								id="circle-fill"
								type="fill"
								paint={{
									"fill-color": fillColor,
									"fill-opacity": 0.15,
								}}
							/>
							<Layer
								id="circle-line"
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
					</MapGL>
				</div>
				<div className="text-tone-soft flex items-center gap-3 px-4 py-3 font-mono text-xs">
					<label htmlFor="circle-radius" className="shrink-0">
						radius
					</label>
					<input
						id="circle-radius"
						type="range"
						min={0}
						max={100}
						step={1}
						value={sliderFromRadius(radius)}
						onChange={(event) =>
							handleSliderChange(
								Number(event.currentTarget.value),
							)
						}
						className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-[hsl(var(--tone-faint)/0.3)] accent-[hsl(var(--link))]"
					/>
					<code className="text-tone-mid shrink-0 tabular-nums">
						{radius} km
					</code>
				</div>
			</MapFrame>
		</MapTokenGate>
	);
}
