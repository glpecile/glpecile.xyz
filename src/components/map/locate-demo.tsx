import * as React from "react";
import {
	GeolocateControl,
	default as MapGL,
	type MapRef,
	Marker,
} from "react-map-gl/mapbox";
import { MapFrame, MapTokenGate } from "@/components/map/map-frame";
import { useSiteTheme } from "@/components/map/use-site-theme";
import { mapboxToken } from "@/lib/mapbox";

const initialViewState = {
	longitude: -58.38,
	latitude: -34.6,
	zoom: 11,
};

type LocatingState = "idle" | "prompted" | "located" | "denied";

export function LocateDemo() {
	const theme = useSiteTheme();
	const mapRef = React.useRef<MapRef>(null);
	const [state, setState] = React.useState<LocatingState>("idle");
	const [position, setPosition] = React.useState<{
		longitude: number;
		latitude: number;
	} | null>(null);

	return (
		<MapTokenGate>
			<MapFrame label="react-map-gl · GeolocateControl">
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
					style={{ width: "100%", height: 380 }}
				>
					<GeolocateControl
						positionOptions={{ enableHighAccuracy: true }}
						trackUserLocation
						onGeolocate={(event) => {
							setState("located");
							setPosition({
								longitude: event.coords.longitude,
								latitude: event.coords.latitude,
							});
						}}
						onError={() => setState("denied")}
					/>
					{position ? (
						<Marker
							longitude={position.longitude}
							latitude={position.latitude}
							anchor="center"
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
				<div className="text-tone-soft flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1.5 font-mono text-xs">
					<span>
						state:{" "}
						<code className="text-tone-mid">
							{state === "idle"
								? "idle"
								: state === "prompted"
									? "awaiting permission"
									: state === "located"
										? "located"
										: "permission denied"}
						</code>
					</span>
					<span className="text-tone-faint">
						use the crosshair control on the map to locate yourself
					</span>
				</div>
			</MapFrame>
		</MapTokenGate>
	);
}
