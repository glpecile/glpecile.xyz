import { siteConfig } from "#config/site";

const monthYearStamp = (date: Date) => {
	const month = date.toLocaleString("en-US", { month: "short" }).toLowerCase();

	return `${month}-${date.getFullYear()}`;
};

/**
 * Downloadable CV filename with a month-year stamp, e.g.
 * `gian-luca-pecile-cv-jun-2026.pdf`. Stamped at build time (the PDF route and
 * the /work page both prerender), so the link and the file agree.
 */
export function cvDownloadName(date: Date = new Date()) {
	const base = siteConfig.cv.fileName.replace(/\.pdf$/i, "");

	return `${base}-${monthYearStamp(date)}.pdf`;
}
