export type SiteConfig = typeof siteConfig;

export type WorkExperience = {
	role: string;
	company: string;
	period: string;
	place: string;
	url?: string;
	summary?: string;
};

export type EducationItem = {
	school: string;
	credential: string;
	period: string;
	url?: string;
	details?: readonly string[];
};

export type CertificateItem = {
	title: string;
	issuer: string;
	issued: string;
	url?: string;
	details?: readonly string[];
};

export type CvFile = {
	href: string;
	fileName: string;
	label: string;
	heading: string;
};

type NavItem = {
	title: string;
	href: string;
	shortcut: string;
};

type ThemeItem = {
	theme: "auto" | "light" | "dark";
	shortcut: string;
};

const nav = [
	{
		title: "Home",
		href: "/",
		shortcut: "h",
	},
	{
		title: "Blog",
		href: "/blog",
		shortcut: "b",
	},
	{
		title: "Work",
		href: "/work",
		shortcut: "w",
	},
] satisfies NavItem[];

const theme = [
	{
		theme: "auto",
		shortcut: "a",
	},
	{
		theme: "light",
		shortcut: "l",
	},
	{
		theme: "dark",
		shortcut: "d",
	},
] satisfies ThemeItem[];

export const siteConfig = {
	author: "Gian Luca Pecile",
	name: "glpecile's personal site",
	shortName: "glpecile",
	description: "Frontend engineer. Shipping websites and apps from time to time.",
	emoji: "🧙",
	backgroundColor: "#eff1f5",
	themeColor: "#eff1f5",
	siteUrl: "https://glpecile.xyz",
	category: "personal site",
	shortcuts: {
		nav,
		theme,
		blog: {
			latestPostCount: 9,
		},
	},
	links: {
		x: "https://x.com/glpwzrd",
		bluesky: "https://bsky.app/profile/glpecile.xyz",
		github: "https://github.com/glpecile",
		letterboxd: "https://letterboxd.com/Glp/",
	},
	work: [
		{
			role: "Software / Frontend Engineer",
			company: "POAP - Proof Of Attendance Protocol",
			period: "Jan 2025 - Present",
			place: "Buenos Aires Province · Hybrid",
			url: "https://poap.xyz",
		},
		{
			role: "Teaching Assistant",
			company: "ITBA - Instituto Tecnologico de Buenos Aires",
			period: "Mar 2024 - Jul 2025",
			place: "Buenos Aires Province · Remote",
			url: "https://www.itba.edu.ar",
			summary: "Multiplatform mobile app design best practices.",
		},
		{
			role: "Frontend Engineer",
			company: "Aligned",
			period: "Dec 2023 - Sep 2024",
			place: "Buenos Aires Province · Hybrid",
			url: "https://alignedlayer.com",
		},
		{
			role: "Frontend Engineer",
			company: "Constellation Network",
			period: "Aug 2022 - Mar 2023",
			place: "Remote",
			url: "https://constellationnetwork.io",
		},
		{
			role: "Social Media Designer",
			company: "ITBA Computer Society",
			period: "Nov 2019 - Dec 2021",
			place: "Buenos Aires Province",
			url: "https://csitba.web.app/",
		},
	] satisfies WorkExperience[],
	education: [
		{
			school: "Instituto Tecnologico de Buenos Aires",
			credential: "Software Engineering, Computer Software Engineering",
			period: "Mar 2017 - Feb 2025",
			url: "https://www.itba.edu.ar",
		},
		{
			school: "Southern International School",
			credential: "High School Diploma",
			period: "2011 - 2016",
		},
	] satisfies EducationItem[],
	certificates: [
		{
			title: "Animations on the Web Course",
			issuer: "Emil Kowalski",
			issued: "Aug 2024",
			details: ["Certificate: Animations on the Web Course Certificate taught by Emil Kowalski"],
		},
		{
			title: "Certificazione di Lingua Italiana come Lingua Straniera, livello C1 (CILS)",
			issuer: "Universita per Stranieri di Siena",
			issued: "Dec 2016",
		},
		{
			title:
				"International Baccalaureate (IB) Certificate (Economics, English, Italian, Portuguese, Spanish)",
			issuer: "International Baccalaureate",
			issued: "Nov 2016",
		},
		{
			title: "International General Certificate of Secondary School (IGCSE)",
			issuer: "University of Cambridge",
			issued: "Nov 2014",
		},
	] satisfies CertificateItem[],
	cv: {
		href: "/work/cv.pdf",
		fileName: "gian-luca-pecile-cv.pdf",
		label: "download cv",
		heading: "Software Engineer from ITBA.",
	} satisfies CvFile,
} as const;
