export type LetterboxdFilm = {
	title: string;
	year: string;
	url: string;
	image: string;
	watchedDate: string | null;
	liked: boolean;
	tags: LetterboxdTag[];
};

export type LetterboxdTag = {
	name: string;
	url: string;
};

type GetLetterboxdFilmsOptions = {
	includeTags?: boolean;
	limit?: number;
};

const decodeHtmlEntities = (text: string): string =>
	text
		.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"');

const extractTag = (xml: string, tag: string): string | null => {
	const match = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`, "s"));

	return match?.[1]?.trim() ?? null;
};

const extractCdata = (xml: string, tag: string): string | null => {
	const match = xml.match(new RegExp(`<${tag}><!\\[CDATA\\[(.*?)\\]\\]></${tag}>`, "s"));

	return match?.[1]?.trim() ?? null;
};

const getEntryTags = async (url: string): Promise<LetterboxdTag[]> => {
	try {
		const response = await fetch(url);
		if (!response.ok) return [];

		const html = await response.text();
		const tagList = html.match(/<ul class="tags">(.*?)<\/ul>/s)?.[1] ?? "";
		const tags = [...tagList.matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)].map(
			([, href, name]) => ({
				name: decodeHtmlEntities(name.trim()),
				url: new URL(href, url).href,
			}),
		);

		return tags;
	} catch {
		return [];
	}
};

export async function getLetterboxdFilms(
	username: string,
	{ includeTags = false, limit }: GetLetterboxdFilmsOptions = {},
): Promise<LetterboxdFilm[]> {
	const rssUrl = `https://letterboxd.com/${username}/rss/`;
	const response = await fetch(rssUrl, {
		headers: {
			Accept: "application/rss+xml, application/xml, text/xml",
		},
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch Letterboxd RSS: ${response.status} ${response.statusText}`,
		);
	}

	const xml = await response.text();
	const itemMatches = xml.match(/<item>(.*?)<\/item>/gs) ?? [];

	const films = itemMatches
		.map((itemXml): LetterboxdFilm | null => {
			const title = extractTag(itemXml, "letterboxd:filmTitle");
			const year = extractTag(itemXml, "letterboxd:filmYear");
			const url = extractTag(itemXml, "link");
			const watchedDate = extractTag(itemXml, "letterboxd:watchedDate");
			const liked = extractTag(itemXml, "letterboxd:memberLike") === "Yes";
			const descriptionCdata = extractCdata(itemXml, "description");
			const imageMatch = descriptionCdata?.match(/<img[^>]+src="([^"]+)"/);
			const image = imageMatch?.[1] ?? "";

			if (!title || !year || !url) {
				return null;
			}

			return {
				title: decodeHtmlEntities(title),
				year,
				url,
				image,
				watchedDate,
				liked,
				tags: [],
			};
		})
		.filter((film): film is LetterboxdFilm => film !== null);

	const results = limit ? films.slice(0, limit) : films;

	if (!includeTags) return results;

	return Promise.all(
		results.map(async (film) => ({
			...film,
			tags: await getEntryTags(film.url),
		})),
	);
}
