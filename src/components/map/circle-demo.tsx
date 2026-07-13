import type * as GeoJSONTypes from "geojson";
import * as React from "react";
import {
	Layer,
	default as MapGL,
	type MapRef,
	Marker,
	Source,
} from "react-map-gl/mapbox";
import { MapFrame, MapTokenGate } from "@/components/map/map-frame";
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

const DEFAULT_CENTER = { longitude: -58.38, latitude: -34.6 };

const initialViewState = {
	...DEFAULT_CENTER,
	zoom: 10,
};

export function CircleDemo() {
	const theme = useSiteTheme();
	const mapRef = React.useRef<MapRef>(null);
	const [radius, setRadius] = React.useState(5);
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

	const handleRadiusChange = (value: number) => {
		setRadius(value);
		const zoom = value > 20 ? 8.5 : value > 10 ? 9.5 : 10.5;
		mapRef.current?.easeTo({ zoom, duration: 400 });
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
						onLoad={() => setMapReady(true)}
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
								className="font-mono text-[hsl(var(--link))] text-base leading-none"
							>
								●
							</span>
						</Marker>
					</MapGL>
				</div>
				<div className="flex items-center gap-3 px-4 py-3 font-mono text-tone-soft text-xs">
					<label htmlFor="circle-radius" className="shrink-0">
						radius
					</label>
					<input
						id="circle-radius"
						type="range"
						min={1}
						max={50}
						step={1}
						value={radius}
						onChange={(event) =>
							handleRadiusChange(
								Number(event.currentTarget.value),
							)
						}
						className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-[hsl(var(--tone-faint)/0.3)] accent-[hsl(var(--link))]"
					/>
					<code className="shrink-0 text-tone-mid tabular-nums">
						{radius} km
					</code>
				</div>
			</MapFrame>
		</MapTokenGate>
	);
}
