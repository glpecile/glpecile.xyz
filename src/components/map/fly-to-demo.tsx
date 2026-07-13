import * as React from "react";
import { default as MapGL, type MapRef, Marker } from "react-map-gl/mapbox";
import { MapFrame, MapTokenGate } from "@/components/map/map-frame";
import { useSiteTheme } from "@/components/map/use-site-theme";
import { mapboxToken } from "@/lib/mapbox";

type Place = {
	id: string;
	name: string;
	city: string;
	longitude: number;
	latitude: number;
};

const places: Place[] = [
	{
		id: "great-wall",
		name: "Great Wall",
		city: "China",
		longitude: 116.57,
		latitude: 40.43,
	},
	{
		id: "petra",
		name: "Petra",
		city: "Jordan",
		longitude: 35.44,
		latitude: 30.33,
	},
	{
		id: "christ-redeemer",
		name: "Christ the Redeemer",
		city: "Rio de Janeiro",
		longitude: -43.21,
		latitude: -22.95,
	},
	{
		id: "machu-picchu",
		name: "Machu Picchu",
		city: "Peru",
		longitude: -72.55,
		latitude: -13.16,
	},
	{
		id: "chichen-itza",
		name: "Chichén Itzá",
		city: "Mexico",
		longitude: -88.57,
		latitude: 20.68,
	},
	{
		id: "colosseum",
		name: "Colosseum",
		city: "Rome",
		longitude: 12.49,
		latitude: 41.89,
	},
	{
		id: "taj-mahal",
		name: "Taj Mahal",
		city: "Agra",
		longitude: 78.04,
		latitude: 27.17,
	},
];

const initialViewState = {
	longitude: -30,
	latitude: 25,
	zoom: 1.4,
	pitch: 0,
	bearing: 0,
};

export function FlyToDemo() {
	const theme = useSiteTheme();
	const mapRef = React.useRef<MapRef>(null);
	const [activeId, setActiveId] = React.useState<string | null>(null);

	const flyToPlace = React.useCallback((place: Place) => {
		setActiveId(place.id);
		mapRef.current?.flyTo({
			center: [place.longitude, place.latitude],
			zoom: 6,
			duration: 1400,
			curve: 1.4,
			essential: true,
		});
	}, []);

	return (
		<MapTokenGate>
			<MapFrame label="react-map-gl · flyTo">
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
					{places.map((place) => (
						<Marker
							key={place.id}
							longitude={place.longitude}
							latitude={place.latitude}
							anchor="bottom"
							offset={[0, -6]}
						>
							<span
								aria-hidden="true"
								className={
									activeId === place.id
										? "font-mono text-[hsl(var(--link))] text-base leading-none"
										: "font-mono text-[hsl(var(--tone-faint))] text-base leading-none"
								}
							>
								{activeId === place.id ? "●" : "○"}
							</span>
						</Marker>
					))}
				</MapGL>
				<ul className="border-border divide-y divide-[hsl(var(--tone-faint)/0.18)] border-t font-mono text-xs">
					{places.map((place) => {
						const isActive = activeId === place.id;

						return (
							<li key={place.id}>
								<button
									type="button"
									onClick={() => flyToPlace(place)}
									aria-pressed={isActive}
									className={
										"flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors " +
										(isActive
											? "text-[hsl(var(--link))] hover:brightness-110"
											: "text-tone-soft hover:bg-muted/40 hover:text-tone-mid")
									}
								>
									<span aria-hidden="true">
										{isActive ? "●" : "○"}
									</span>
									<span className="flex-1">{place.name}</span>
									<span className="text-tone-faint">
										{place.city}
									</span>
								</button>
							</li>
						);
					})}
				</ul>
			</MapFrame>
		</MapTokenGate>
	);
}
