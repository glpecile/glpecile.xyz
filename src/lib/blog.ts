import { type CollectionEntry, getCollection } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

const dateFormatter = new Intl.DateTimeFormat("en", {
	dateStyle: "medium",
});

export async function getBlogPosts(): Promise<BlogPost[]> {
	const posts = (await getCollection("blog")) as BlogPost[];

	return posts
		.filter((post) => !post.data.draft)
		.toSorted((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getBlogPostUrl(id: string) {
	return `/blog/${id}`;
}

export function formatDate(date: Date) {
	return dateFormatter.format(date);
}
