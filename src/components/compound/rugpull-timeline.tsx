import * as React from "react";
import { DemoFrame } from "@/components/compound/demo-frame";

type TimelineEvent = {
	date: string;
	title: string;
	detail: string;
	artifact?: { label: string; file: string; quote: string };
};

const repoBlob = "https://github.com/glpecile/shinobu/blob/main/";

const events: TimelineEvent[] = [
	{
		date: "Jun 2026",
		title: "Trakt ships breaking API changes",
		detail:
			"Images disappear from responses, pagination becomes mandatory. The solutions folder picks it up as it happens — including where the API now disagrees with Trakt's own docs.",
		artifact: {
			label: "docs/solutions/trakt-watchlist-pagination-2026.md",
			file: "docs/solutions/trakt-watchlist-pagination-2026.md",
			quote: "Trakt /sync/watchlist: pagination is required, and the blueprint says otherwise",
		},
	},
	{
		date: "Jul 14, 2026",
		title: "The AniList retry storm",
		detail:
			"Stacked retry defaults turn one failing request into eight, spending the rate budget the outage needs to recover. Fixed, measured, and written down the same day. Two and a half weeks later, plan 0034 cites it by name.",
		artifact: {
			label: "docs/solutions/anilist-rate-limit-retry-storm.md",
			file: "docs/solutions/anilist-rate-limit-retry-storm.md",
			quote: "AniList 429s from ordinary browsing: staleTime 0 + default retries = rate-limit storm",
		},
	},
	{
		date: "Jul 22, 2026",
		title: "The rugpull",
		detail:
			"Trakt caps free accounts at one connected community app. A second connection costs $60/year — after a 100–300% VIP price hike the year before.",
	},
	{
		date: "Jul 30, 2026",
		title: "The Serializd probe",
		detail:
			"One day before the decision, on an unrelated task: instead of running a destructive write experiment against a live account, the agent finds the answer already sitting in production data. The write-up becomes policy the next day, when plan 0034 cites it.",
		artifact: {
			label: "docs/solutions/serializd-watchlist-clears-watched.md",
			file: "docs/solutions/serializd-watchlist-clears-watched.md",
			quote: "Serializd: does a watchlist write clear watched state?",
		},
	},
	{
		date: "Jul 31, 2026",
		title: "Decision: full detachment",
		detail:
			"Simkl becomes the tracking spine. Trakt is demoted to bring-your-own-everything — the app ships no Trakt credentials at all.",
	},
	{
		date: "Jul 31, 2026",
		title: "Plan 0034, written the same day",
		detail:
			"322 lines, ten implementation units. It opens with a search through the solutions folder, cites 'the AniList lesson' for its retry design and 'the Serializd lesson' for its live-account checks, and counts the write-ups themselves as one of the ten.",
		artifact: {
			label: "docs/plans/0034-simkl-provider-and-trakt-detachment.md",
			file: "docs/plans/0034-simkl-provider-and-trakt-detachment.md",
			quote: "…no blind retry storm — the AniList lesson, docs/solutions/anilist-rate-limit-retry-storm.md",
		},
	},
	{
		date: "Jul 31, 2026",
		title: "The Simkl dossiers land before the code",
		detail:
			"The CORS probe (first provider that needs no proxy at all) and the rate-limit discipline doc — written from Simkl's documentation before the first line of provider code, because Simkl's failure mode is client-id suspension, 'without warning, no appeal.'",
		artifact: {
			label: "docs/solutions/web-cors-simkl.md",
			file: "docs/solutions/web-cors-simkl.md",
			quote: "Web CORS: Simkl — fully browser-callable, no proxy",
		},
	},
	{
		date: "Aug 1, 2026",
		title: "Simkl ships. Four bugs, four docs.",
		detail:
			"The day after the swap, four bug reports against the new provider — and every one becomes a permanent entry in the ledger before its fix lands.",
		artifact: {
			label: "docs/solutions/simkl-watched-movies-never-read-back.md (+3 siblings)",
			file: "docs/solutions/simkl-watched-movies-never-read-back.md",
			quote: "A movie watched on Simkl still offered \"Mark as watched\"",
		},
	},
];

/**
 * The Trakt → Simkl detachment, as a clickable ledger. Every expanded node
 * shows the real artifact the repo kept from that day.
 */
export function RugpullTimeline() {
	const [open, setOpen] = React.useState<number | null>(5);

	return (
		<DemoFrame label="the rugpull, as recorded by the repo · tap an entry">
			<ol className="m-0 list-none divide-y divide-[hsl(var(--tone-faint)/0.14)] p-0 font-mono text-xs">
				{events.map((event, i) => {
					const isOpen = open === i;

					return (
						<li key={`${event.date}-${event.title}`} className="mt-0">
							<button
								type="button"
								onClick={() => setOpen(isOpen ? null : i)}
								aria-expanded={isOpen}
								className="hover:bg-muted/40 flex w-full items-baseline gap-3 px-3 py-2 text-left transition-colors"
							>
								<span className="text-tone-faint w-24 shrink-0">
									{event.date}
								</span>
								<span
									className={
										isOpen
											? "text-[hsl(var(--link))]"
											: "text-tone-mid"
									}
								>
									{event.title}
								</span>
								<span
									aria-hidden="true"
									className="text-tone-faint ml-auto"
								>
									{isOpen ? "−" : "+"}
								</span>
							</button>
							{isOpen ? (
								<div className="flex flex-col gap-2 px-3 pb-3 pl-[6.75rem]">
									<p className="text-tone-soft m-0">
										{event.detail}
									</p>
									{event.artifact ? (
										<div className="border-l-2 border-[hsl(var(--link)/0.5)] pl-3">
											<p className="text-tone-mid m-0">
												“{event.artifact.quote}”
											</p>
											<p className="m-0">
												<a
													href={`${repoBlob}${event.artifact.file}`}
													target="_blank"
													rel="noreferrer"
													className="text-tone-faint underline decoration-[hsl(var(--tone-faint)/0.4)] hover:text-[hsl(var(--link))]"
												>
													{event.artifact.label}
												</a>
											</p>
										</div>
									) : null}
								</div>
							) : null}
						</li>
					);
				})}
			</ol>
		</DemoFrame>
	);
}
