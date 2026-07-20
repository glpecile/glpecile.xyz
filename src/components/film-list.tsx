import {
	QueryClient,
	QueryClientProvider,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { Component, Suspense, type ReactNode } from "react";

import type { FilmWithBlur } from "@/lib/blur";
import type { LetterboxdFilm } from "@/lib/letterboxd";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { staleTime: 60_000, retry: 1 },
	},
});

type Layout = "grid" | "timeline";

type FilmsResponse = { films: LetterboxdFilm[] };

const formatDate = (dateStr: string | null) => {
	if (!dateStr) return "";
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

const getMonthKey = (dateStr: string | null) => {
	if (!dateStr) return "unknown";
	const date = new Date(dateStr);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const getMonthLabel = (dateStr: string | null) => {
	if (!dateStr) return "";
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-US", {
		month: "long",
		year: "numeric",
	});
};

const groupFilmsByMonth = <T extends LetterboxdFilm>(filmList: T[]) => {
	const groups: { month: string; label: string; films: T[] }[] = [];
	let currentKey = "";

	for (const film of filmList) {
		const key = getMonthKey(film.watchedDate);
		if (key !== currentKey) {
			currentKey = key;
			groups.push({
				month: key,
				label: getMonthLabel(film.watchedDate),
				films: [film],
			});
		} else {
			groups[groups.length - 1]?.films.push(film);
		}
	}

	return groups;
};

// Raw Letterboxd poster URL in both the build-time and runtime render, backed
// by the same inline blur. Matching the `src` lets the browser reuse the loaded
// image when the island hydrates, so there is no reload flash. (The runtime
// `/_image` optimizer 404s on this prerendered site, so raw URLs are required.)
const Poster = ({
	film,
	className,
}: {
	film: FilmWithBlur;
	className: string;
}) => (
	<img
		src={film.image}
		alt={`Poster for ${film.title} (${film.year}).`}
		width={300}
		height={450}
		loading="lazy"
		style={film.blur ? { backgroundImage: `url(${film.blur})` } : undefined}
		className={`bg-muted aspect-[2/3] bg-cover bg-center object-cover ${className}`}
	/>
);

const FilmGrid = ({ films }: { films: FilmWithBlur[] }) => (
	<ol className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
		{films.map((film) => (
			<li key={film.url}>
				<a
					href={film.url}
					target="_blank"
					rel="noopener noreferrer"
					className="group block"
				>
					{film.image ? (
						<Poster film={film} className="w-full" />
					) : (
						<div className="bg-muted aspect-[2/3] w-full p-3">
							<p className="text-tone-mid text-sm leading-relaxed">{film.title}</p>
						</div>
					)}
					<p className="mt-2 text-sm leading-snug">
						<span className="text-foreground group-hover:underline group-focus-visible:underline">
							{film.title}
						</span>
						<span className="text-tone-faint">, {film.year}</span>
					</p>
				</a>
			</li>
		))}
	</ol>
);

const FilmTimeline = ({
	films,
	withTags,
}: {
	films: FilmWithBlur[];
	withTags: boolean;
}) => (
	<ol className="space-y-8">
		{groupFilmsByMonth(films).map((group) => (
			<li key={group.month} className="space-y-4">
				<h3 className="bg-background text-tone-mid sticky top-0 z-10 -mx-6 px-6 py-2 text-sm tracking-wider uppercase">
					{group.label}
				</h3>
				<ol className="border-border after:bg-border relative border-l-2 border-dotted pl-6 after:absolute after:bottom-0 after:-left-1.5 after:h-0.5 after:w-2.5">
					{group.films.map((film) => (
						<li key={film.url} className="mb-6 last:mb-0">
							<div className="bg-foreground absolute -left-1.5 mt-1.5 h-2.5 w-2.5" />
							<div className="flex gap-4">
								{film.image && (
									<a
										href={film.url}
										target="_blank"
										rel="noopener noreferrer"
										className="block shrink-0"
									>
										<Poster film={film} className="w-16 sm:w-20" />
									</a>
								)}
								<div className="flex-1">
									{film.watchedDate && (
										<time className="text-tone-faint text-sm">
											{formatDate(film.watchedDate)}
										</time>
									)}
									<p className="mt-1 text-base leading-8 sm:text-lg">
										<a
											href={film.url}
											target="_blank"
											rel="noopener noreferrer"
											className="terminal-link"
										>
											{film.title}
										</a>
										<span className="text-tone-faint">, {film.year}</span>
										{film.liked && (
											<span
												className="text-link ml-2 inline-block text-xl leading-none"
												role="img"
												aria-label="Liked"
											>
												&hearts;
											</span>
										)}
									</p>
									{withTags && film.tags.length > 0 && (
										<ul className="text-tone-faint mt-1 flex flex-wrap gap-x-3 text-sm">
											{film.tags.map((tag) => (
												<li key={tag.url}>
													<a
														href={tag.url}
														target="_blank"
														rel="noopener noreferrer"
														className="hover:text-foreground focus-visible:text-foreground hover:underline focus-visible:underline"
													>
														#{tag.name}
													</a>
												</li>
											))}
										</ul>
									)}
								</div>
							</div>
						</li>
					))}
				</ol>
			</li>
		))}
	</ol>
);

const fetchFilms = async ({
	limit,
	tags,
}: {
	limit?: number;
	tags?: boolean;
}): Promise<FilmWithBlur[]> => {
	const params = new URLSearchParams();
	if (limit) params.set("limit", String(limit));
	if (tags) params.set("tags", "true");
	const query = params.toString();

	const response = await fetch(`/api/films.json${query ? `?${query}` : ""}`);
	if (!response.ok) throw new Error(`films request failed: ${response.status}`);

	const data = (await response.json()) as FilmsResponse;
	return data.films;
};

type Props = {
	films: FilmWithBlur[];
	limit?: number;
	tags?: boolean;
	layout?: Layout;
};

const EmptyState = () => <p className="text-tone-soft text-sm">no films yet.</p>;

const FilmListContent = ({ films: initialFilms, limit, tags, layout }: Props) => {
	// Seed with the build-time films so the first paint is real content, then
	// let react-query refresh in place. `initialDataUpdatedAt: 0` marks the
	// seed stale so a background refetch runs on mount without ever suspending.
	const { data: films } = useSuspenseQuery({
		queryKey: ["letterboxd", "films", { limit: limit ?? "all", tags: !!tags }],
		queryFn: () => fetchFilms({ limit, tags }),
		initialData: initialFilms,
		initialDataUpdatedAt: 0,
	});

	if (films.length === 0) return <EmptyState />;

	return layout === "timeline" ? (
		<FilmTimeline films={films} withTags={!!tags} />
	) : (
		<FilmGrid films={films} />
	);
};

class FilmsErrorBoundary extends Component<
	{ children: ReactNode },
	{ hasError: boolean }
> {
	state = { hasError: false };

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	render() {
		return this.state.hasError ? <EmptyState /> : this.props.children;
	}
}

export default function FilmListLoader(props: Props) {
	return (
		<QueryClientProvider client={queryClient}>
			<FilmsErrorBoundary>
				<Suspense fallback={<EmptyState />}>
					<FilmListContent {...props} />
				</Suspense>
			</FilmsErrorBoundary>
		</QueryClientProvider>
	);
}
