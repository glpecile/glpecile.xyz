import { type CollectionEntry, getCollection } from "astro:content";

export type ProjectPost = CollectionEntry<"projects">;

const dateFormatter = new Intl.DateTimeFormat("en", {
	dateStyle: "medium",
});

export async function getProjectPosts(): Promise<ProjectPost[]> {
	const posts = (await getCollection("projects")) as ProjectPost[];

	return posts
		.filter((post) => !post.data.draft)
		.toSorted((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getProjectPostUrl(id: string) {
	return `/projects/${id}`;
}

export function formatProjectDate(date: Date) {
	return dateFormatter.format(date);
}
