const WORDS_PER_MINUTE = 200;

export function getReadingTimeMinutes(body: string | undefined): number {
	const words = (body ?? "").split(/\s+/).filter(Boolean).length;

	return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function formatReadingTime(minutes: number): string {
	return `${minutes} min read`;
}
