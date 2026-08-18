import * as React from "react";
import { DemoFrame } from "@/components/compound/demo-frame";

const providers = [
	{ name: "Simkl", url: "https://simkl.com" },
	{ name: "Trakt", url: "https://trakt.tv" },
	{ name: "AniList", url: "https://anilist.co" },
	{ name: "Letterboxd", url: "https://letterboxd.com" },
	{ name: "Serializd", url: "https://www.serializd.com" },
] as const;

type Kind = {
	label: string;
	targets: string[];
	note: string;
};

const movie: Kind = {
	label: "movie",
	targets: ["Simkl", "Trakt", "Letterboxd"],
	note: "Movies go to the general trackers plus Letterboxd, the film diary.",
};

const kinds: Kind[] = [
	movie,
	{
		label: "tv show",
		targets: ["Simkl", "Trakt", "Serializd"],
		note: "TV goes to the general trackers plus Serializd. Letterboxd doesn't track TV.",
	},
	{
		label: "anime series",
		targets: ["Simkl", "AniList"],
		note: "Anime goes to the trackers that handle it natively — AniList, and Simkl, which understands anime-specific episode numbering.",
	},
	{
		label: "anime film",
		targets: ["Simkl", "Trakt", "AniList", "Letterboxd"],
		note: "The edge case. AniList files it under anime; Trakt and Letterboxd file it under movies. It goes to both worlds — everyone except the TV-only tracker.",
	},
	{
		label: "manga",
		targets: ["AniList"],
		note: "Only AniList tracks manga.",
	},
];

/**
 * The log fan-out as a tree: pick a media type, see which of the five
 * providers a single log branches out to. Mirrors
 * src/lib/providers/routing.ts in the shinobu repo.
 */
export function FanOutDemo() {
	const [active, setActive] = React.useState<Kind>(movie);

	return (
		<DemoFrame label="one log, routed · pick what you just finished">
			<div className="flex flex-col gap-4 p-4 font-mono text-xs">
				<div className="flex flex-wrap gap-2">
					{kinds.map((kind) => {
						const selected = kind.label === active.label;

						return (
							<button
								key={kind.label}
								type="button"
								onClick={() => setActive(kind)}
								aria-pressed={selected}
								className={
									selected
										? "rounded border border-[hsl(var(--link)/0.6)] px-3 py-1.5 text-[hsl(var(--link))] transition-colors"
										: "border-border text-tone-mid hover:text-tone-strong rounded border px-3 py-1.5 transition-colors"
								}
							>
								{kind.label}
							</button>
						);
					})}
				</div>
				<div className="flex flex-col gap-0.5" aria-live="polite">
					<span className="text-tone-strong">
						one log · {active.label}
					</span>
					{providers.map((provider, i) => {
						const on = active.targets.includes(provider.name);
						const branch =
							i === providers.length - 1 ? "└──" : "├──";

						return (
							<span
								key={provider.name}
								className="flex items-baseline gap-2"
							>
								<span
									aria-hidden="true"
									className={
										on
											? "text-[hsl(var(--link))]"
											: "text-tone-faint opacity-40"
									}
								>
									{branch}
								</span>
								<a
									href={provider.url}
									target="_blank"
									rel="noreferrer"
									className={
										on
											? "text-[hsl(var(--link))] no-underline hover:underline"
											: "text-tone-faint no-underline opacity-40 hover:underline"
									}
								>
									{provider.name}
								</a>
								{on ? (
									<span
										aria-hidden="true"
										className="text-[hsl(var(--link))]"
									>
										✓
									</span>
								) : null}
							</span>
						);
					})}
				</div>
				<p className="text-tone-soft m-0">{active.note}</p>
			</div>
		</DemoFrame>
	);
}
