import { siteConfig } from "#config/site";
import type {
	CertificateItem,
	EducationItem,
	LanguageItem,
	ProjectEntry,
	SkillGroup,
	WorkExperience,
} from "#config/site";
import type { BlogPost } from "@/lib/blog";
import { getBlogPostUrl } from "@/lib/blog";
import type { LetterboxdFilm } from "@/lib/letterboxd";

type WorkItem = WorkExperience;

const siteHost = new URL(siteConfig.siteUrl).hostname;

const socialLabelMap: Record<string, string> = {
	x: "X",
	bluesky: "Bluesky",
	github: "GitHub",
	letterboxd: "Letterboxd",
	linkedin: "LinkedIn",
};

export const llmsContentType = "text/plain; charset=utf-8";
export const markdownContentType = "text/markdown; charset=utf-8";

const joinLines = (lines: Array<string | undefined>) =>
	lines.filter((line): line is string => line !== undefined).join("\n");

const toAbsoluteUrl = (path: string) => new URL(path, siteConfig.siteUrl).toString();

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

const renderCompanyLink = (job: WorkItem) =>
	job.url ? `[${job.company}](${job.url})` : job.company;

const renderTextLink = (label: string, url?: string) => (url ? `[${label}](${url})` : label);

const renderWorkLine = (job: WorkItem) => {
	const details = `${job.role} @ ${renderCompanyLink(job)} — ${job.period} — ${job.place}`;
	const note = job.summary ?? job.highlights?.[0];

	return note ? `- ${details}. ${note}` : `- ${details}`;
};

const renderWorkEntry = (job: WorkItem) => {
	const head = `- ${job.role} @ ${renderCompanyLink(job)} — ${job.period} — ${job.place}`;
	const bullets = (job.highlights ?? (job.summary ? [job.summary] : [])).map(
		(highlight) => `  - ${highlight}`,
	);

	return [head, ...bullets].join("\n");
};

const renderProjectEntry = (project: ProjectEntry) => {
	const period = project.period ? ` — ${project.period}` : "";
	const head = `- ${renderTextLink(project.name, project.url)} — ${project.stack}${period}`;
	const bullets = project.highlights.map((highlight) => `  - ${highlight}`);

	return [head, ...bullets].join("\n");
};

const renderSkillLine = (group: SkillGroup) => `- ${group.category}: ${group.items.join(", ")}`;

const renderLanguageLine = (item: LanguageItem) => `- ${item.language}: ${item.level}`;

const renderEducationLine = (item: EducationItem) => {
	const details = `${renderTextLink(item.school, item.url)} — ${item.credential} — ${item.period}`;
	const notes = item.details?.join(". ");

	return notes ? `- ${details}. ${notes}` : `- ${details}`;
};

const renderCertificateLine = (item: CertificateItem) => {
	const details = `${renderTextLink(item.title, item.url)} — ${item.issuer} — Issued ${item.issued}`;
	const notes = item.details?.join(". ");

	return notes ? `- ${details}. ${notes}` : `- ${details}`;
};

const renderFilmLine = (film: LetterboxdFilm) => {
	const watched = film.watchedDate ? `${film.watchedDate} — ` : "";
	return `- ${watched}[${film.title}](${film.url}) (${film.year})`;
};

const formatSocialLabel = (label: string) =>
	socialLabelMap[label] ??
	(label.length === 0 ? label : `${label.slice(0, 1).toUpperCase()}${label.slice(1)}`);

const cleanMarkdownBody = (body?: string) => {
	if (!body) {
		return "";
	}

	const lines = body.split("\n");
	let start = 0;

	while (
		start < lines.length &&
		(lines[start].trim() === "" ||
			lines[start].startsWith("import ") ||
			lines[start].startsWith("export "))
	) {
		start += 1;
	}

	return lines.slice(start).join("\n").trim();
};

const renderPostMarkdownLink = (post: BlogPost) =>
	`[${post.data.title}](${toAbsoluteUrl(getMarkdownPath(getBlogPostUrl(post.id)))})`;

export function getMarkdownPath(path: string) {
	const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");

	return normalizedPath === "/" ? "/index.html.md" : `${normalizedPath}/index.html.md`;
}

export function renderLlmsTxt(posts: BlogPost[]) {
	const lines = [
		`# ${siteHost}`,
		"",
		`> Personal portfolio and blog for ${siteConfig.author}, a frontend engineer shipping websites and apps.`,
		"",
		"Prefer the markdown URLs below over scraping the HTML pages. They contain the same substantive content with the terminal-style presentation removed.",
		"",
		"For agents:",
		"",
		"1. Prefer markdown mirrors over HTML: `/index.html.md`, `/work/index.html.md`, `/blog/index.html.md`, `/films/index.html.md`",
		"2. Use `/work` for experience, `/blog` for writing and build notes, and `/films` for recently watched films",
		"3. Follow post-level `index.html.md` links only when you need full article text",
		"",
		"## Portfolio",
		"",
		`- [Home](${toAbsoluteUrl(getMarkdownPath("/"))}): Short profile, featured work, recent writing, and public links`,
		`- [Work](${toAbsoluteUrl(getMarkdownPath("/work"))}): Full work history, education, certificates, and the CV download link`,
		`- [Films](${toAbsoluteUrl(getMarkdownPath("/films"))}): Recently watched films from Letterboxd`,
		`- [CV PDF](${toAbsoluteUrl(siteConfig.cv.href)}): Downloadable resume PDF generated from the same work page data; prefer the work markdown link for text extraction`,
		"",
		"## Writing",
		"",
		`- [Blog](${toAbsoluteUrl(getMarkdownPath("/blog"))}): Index of published blog posts with dates, descriptions, and markdown links`,
	];

	if (posts.length > 0) {
		lines.push(
			"",
			"## Optional",
			"",
			...posts.map((post) => {
				const date = toIsoDate(post.data.updatedDate ?? post.data.pubDate);

				return `- ${renderPostMarkdownLink(post)}: ${date}. ${post.data.description}`;
			}),
		);
	}

	return lines.join("\n");
}

export function renderHomeMarkdown(posts: BlogPost[], films: LetterboxdFilm[] = []) {
	const currentWork = siteConfig.work[0];
	const featuredWork = siteConfig.work.slice(0, 3);
	const recentPosts = posts.slice(0, 5);
	const recentFilms = films.slice(0, 4);

	return joinLines([
		`# ${siteConfig.author}`,
		"",
		`> ${siteConfig.description}`,
		"",
		`- Site: ${siteConfig.siteUrl}`,
		`- Canonical HTML: ${toAbsoluteUrl("/")}`,
		currentWork
			? `- Current role: ${currentWork.role} @ ${renderCompanyLink(currentWork)}`
			: undefined,
		"",
		"## Agent guide",
		"",
		`- Start with [llms.txt](${toAbsoluteUrl("/llms.txt")}) for the curated overview`,
		`- Prefer [home markdown](${toAbsoluteUrl(getMarkdownPath("/"))}), [work markdown](${toAbsoluteUrl(getMarkdownPath("/work"))}), [blog markdown](${toAbsoluteUrl(getMarkdownPath("/blog"))}), and [films markdown](${toAbsoluteUrl(getMarkdownPath("/films"))}) over the HTML pages`,
		"- Open per-post markdown links only when you need full article text",
		"",
		"## Featured work",
		"",
		...(featuredWork.length > 0 ? featuredWork.map(renderWorkLine) : ["No work entries yet."]),
		"",
		"## Recent writing",
		"",
		...(recentPosts.length > 0
			? recentPosts.map((post) => {
					const date = toIsoDate(post.data.updatedDate ?? post.data.pubDate);

					return `- ${renderPostMarkdownLink(post)} — ${date} — ${post.data.description}`;
				})
			: ["No published blog posts yet."]),
		"",
		"## Recently watched",
		"",
		...(recentFilms.length > 0
			? recentFilms.map(renderFilmLine)
			: ["No films logged yet."]),
		"",
		"## Public links",
		"",
		...Object.entries(siteConfig.links).map(
			([label, href]) => `- [${formatSocialLabel(label)}](${href})`,
		),
	]);
}

export function renderWorkMarkdown() {
	return joinLines([
		"# Work",
		"",
		`> Work history, education, certificates, and CV for ${siteConfig.author}.`,
		"",
		`- Canonical HTML: ${toAbsoluteUrl("/work")}`,
		`- CV PDF: ${toAbsoluteUrl(siteConfig.cv.href)}`,
		"",
		"## Roles",
		"",
		...(siteConfig.work.length > 0 ? siteConfig.work.map(renderWorkEntry) : ["No work entries yet."]),
		"",
		"## Projects",
		"",
		...(siteConfig.projects.length > 0
			? siteConfig.projects.map(renderProjectEntry)
			: ["No projects yet."]),
		"",
		"## Skills",
		"",
		...(siteConfig.skills.length > 0 ? siteConfig.skills.map(renderSkillLine) : ["No skills yet."]),
		"",
		"## Education",
		"",
		...(siteConfig.education.length > 0
			? siteConfig.education.map(renderEducationLine)
			: ["No education entries yet."]),
		"",
		"## Languages",
		"",
		...(siteConfig.languages.length > 0
			? siteConfig.languages.map(renderLanguageLine)
			: ["No languages yet."]),
		"",
		"## Certificates",
		"",
		...(siteConfig.certificates.length > 0
			? siteConfig.certificates.map(renderCertificateLine)
			: ["No certificates yet."]),
	]);
}

export function renderBlogIndexMarkdown(posts: BlogPost[]) {
	return joinLines([
		"# Blog",
		"",
		`> Published writing by ${siteConfig.author}.`,
		"",
		`- Canonical HTML: ${toAbsoluteUrl("/blog")}`,
		"",
		"## Posts",
		"",
		...(posts.length > 0
			? posts.map((post) => {
					const date = toIsoDate(post.data.updatedDate ?? post.data.pubDate);

					return `- ${renderPostMarkdownLink(post)} — ${date} — ${post.data.description}`;
				})
			: ["No published blog posts yet."]),
	]);
}

export function renderBlogPostMarkdown(post: BlogPost) {
	const body = cleanMarkdownBody(post.body);

	return joinLines([
		`# ${post.data.title}`,
		"",
		`> ${post.data.description}`,
		"",
		`- Published: ${toIsoDate(post.data.pubDate)}`,
		post.data.updatedDate ? `- Updated: ${toIsoDate(post.data.updatedDate)}` : undefined,
		`- Canonical HTML: ${toAbsoluteUrl(getBlogPostUrl(post.id))}`,
		"",
		body,
	]);
}

export function renderFilmsMarkdown(films: LetterboxdFilm[]) {
	return joinLines([
		"# Films",
		"",
		`> Recently watched films by ${siteConfig.author}, pulled from Letterboxd.`,
		"",
		`- Canonical HTML: ${toAbsoluteUrl("/films")}`,
		`- Letterboxd profile: ${siteConfig.links.letterboxd}`,
		"",
		"## Recently watched",
		"",
		...(films.length > 0 ? films.map(renderFilmLine) : ["No films logged yet."]),
		"",
		`[View all on Letterboxd](${siteConfig.links.letterboxd})`,
	]);
}
