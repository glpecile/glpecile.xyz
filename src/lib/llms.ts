import { siteConfig } from "#config/site";
import type { CertificateItem, EducationItem, WorkExperience } from "#config/site";
import type { BlogPost } from "@/lib/blog";
import { getBlogPostUrl } from "@/lib/blog";
import type { ProjectPost } from "@/lib/projects";
import { getProjectPostUrl } from "@/lib/projects";

type WorkItem = WorkExperience;

const siteHost = new URL(siteConfig.siteUrl).hostname;

const socialLabelMap: Record<string, string> = {
	x: "X",
	bluesky: "Bluesky",
	github: "GitHub",
	letterboxd: "Letterboxd",
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

	return job.summary ? `- ${details}. ${job.summary}` : `- ${details}`;
};

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

const renderProjectMarkdownLink = (post: ProjectPost) =>
	`[${post.data.title}](${toAbsoluteUrl(getMarkdownPath(getProjectPostUrl(post.id)))})`;

export function getMarkdownPath(path: string) {
	const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");

	return normalizedPath === "/" ? "/index.html.md" : `${normalizedPath}/index.html.md`;
}

export function renderLlmsTxt(posts: BlogPost[], projectPosts: ProjectPost[]) {
	const lines = [
		`# ${siteHost}`,
		"",
		`> Personal portfolio and blog for ${siteConfig.author}, a frontend engineer shipping websites and apps.`,
		"",
		"Prefer the markdown URLs below over scraping the HTML pages. They contain the same substantive content with the terminal-style presentation removed.",
		"",
		"For agents:",
		"",
		"1. Prefer markdown mirrors over HTML: `/index.html.md`, `/work/index.html.md`, `/blog/index.html.md`, `/projects/index.html.md`",
		"2. Use `/work` for experience, `/projects` for build notes, and `/blog` for writing samples",
		"3. Follow post-level `index.html.md` links only when you need full article text",
		"",
		"## Portfolio",
		"",
		`- [Home](${toAbsoluteUrl(getMarkdownPath("/"))}): Short profile, featured work, recent writing, and public links`,
		`- [Work](${toAbsoluteUrl(getMarkdownPath("/work"))}): Full work history, education, certificates, and the CV download link`,
		`- [Projects](${toAbsoluteUrl(getMarkdownPath("/projects"))}): Project notes and implementation writeups for shipped tools`,
		`- [CV PDF](${toAbsoluteUrl(siteConfig.cv.href)}): Downloadable resume PDF generated from the same work page data; prefer the work markdown link for text extraction`,
		"",
		"## Writing",
		"",
		`- [Blog](${toAbsoluteUrl(getMarkdownPath("/blog"))}): Index of published blog posts with dates, descriptions, and markdown links`,
	];

	if (projectPosts.length > 0) {
		lines.push(
			"",
			"## Projects",
			"",
			...projectPosts.map((post) => {
				const date = toIsoDate(post.data.updatedDate ?? post.data.pubDate);

				return `- ${renderProjectMarkdownLink(post)}: ${date}. ${post.data.description}`;
			}),
		);
	}

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

export function renderHomeMarkdown(posts: BlogPost[], projectPosts: ProjectPost[]) {
	const currentWork = siteConfig.work[0];
	const featuredWork = siteConfig.work.slice(0, 3);
	const recentPosts = posts.slice(0, 5);
	const recentProjects = projectPosts.slice(0, 3);

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
		`- Prefer [home markdown](${toAbsoluteUrl(getMarkdownPath("/"))}), [work markdown](${toAbsoluteUrl(getMarkdownPath("/work"))}), [projects markdown](${toAbsoluteUrl(getMarkdownPath("/projects"))}), and [blog markdown](${toAbsoluteUrl(getMarkdownPath("/blog"))}) over the HTML pages`,
		"- Open per-post markdown links only when you need full article text",
		"",
		"## Featured work",
		"",
		...(featuredWork.length > 0 ? featuredWork.map(renderWorkLine) : ["No work entries yet."]),
		"",
		"## Recent projects",
		"",
		...(recentProjects.length > 0
			? recentProjects.map((post) => {
					const date = toIsoDate(post.data.updatedDate ?? post.data.pubDate);

					return `- ${renderProjectMarkdownLink(post)} — ${date} — ${post.data.description}`;
				})
			: ["No project notes yet."]),
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
		...(siteConfig.work.length > 0 ? siteConfig.work.map(renderWorkLine) : ["No work entries yet."]),
		"",
		"## Education",
		"",
		...(siteConfig.education.length > 0
			? siteConfig.education.map(renderEducationLine)
			: ["No education entries yet."]),
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

export function renderProjectsIndexMarkdown(posts: ProjectPost[]) {
	return joinLines([
		"# Projects",
		"",
		`> Project notes and implementation writeups by ${siteConfig.author}.`,
		"",
		`- Canonical HTML: ${toAbsoluteUrl("/projects")}`,
		"",
		"## Posts",
		"",
		...(posts.length > 0
			? posts.map((post) => {
					const date = toIsoDate(post.data.updatedDate ?? post.data.pubDate);

					return `- ${renderProjectMarkdownLink(post)} — ${date} — ${post.data.description}`;
				})
			: ["No project notes yet."]),
	]);
}

export function renderProjectPostMarkdown(post: ProjectPost) {
	const body = cleanMarkdownBody(post.body);

	return joinLines([
		`# ${post.data.title}`,
		"",
		`> ${post.data.description}`,
		"",
		`- Published: ${toIsoDate(post.data.pubDate)}`,
		post.data.updatedDate ? `- Updated: ${toIsoDate(post.data.updatedDate)}` : undefined,
		`- Canonical HTML: ${toAbsoluteUrl(getProjectPostUrl(post.id))}`,
		"",
		body,
	]);
}
