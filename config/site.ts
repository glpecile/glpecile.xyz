export type SiteConfig = typeof siteConfig;

export type ContactInfo = {
	email: string;
	location: string;
	phone?: string;
	linkedin?: string;
};

export type WorkExperience = {
	role: string;
	company: string;
	period: string;
	place: string;
	url?: string;
	summary?: string;
	highlights?: readonly string[];
};

export type EducationItem = {
	school: string;
	credential: string;
	period: string;
	location?: string;
	url?: string;
	details?: readonly string[];
};

export type ProjectEntry = {
	name: string;
	stack: string;
	period?: string;
	url?: string;
	highlights: readonly string[];
};

export type SkillGroup = {
	category: string;
	items: readonly string[];
};

export type LanguageItem = {
	language: string;
	level: string;
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
		title: "Projects",
		href: "/projects",
		shortcut: "p",
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
	description: "Frontend engineer focused on design systems and high-craft product UI.",
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
		projects: {
			latestPostCount: 9,
		},
	},
	links: {
		x: "https://x.com/glpwzrd",
		bluesky: "https://bsky.app/profile/glpecile.xyz",
		github: "https://github.com/glpecile",
		letterboxd: "https://letterboxd.com/Glp/",
	},
	contact: {
		email: "hello@glpecile.xyz",
		location: "Buenos Aires, Argentina",
	} satisfies ContactInfo,
	work: [
		{
			role: "Software / Frontend Engineer",
			company: "POAP - Proof Of Attendance Protocol",
			period: "Jan 2025 - Present",
			place: "Buenos Aires · Hybrid",
			url: "https://poap.xyz",
			highlights: [
				"Build and own reusable React/TypeScript components and shared UI patterns for POAP — the web3 protocol for issuing digital collectibles (NFTs) — keeping the interface consistent and high-quality at scale.",
				"Ship polished, high-traffic collectible (NFT) interfaces end to end — from UI implementation through code review and release — improving reliability, performance, and product feel.",
			],
		},
		{
			role: "Teaching Assistant",
			company: "ITBA - Instituto Tecnologico de Buenos Aires",
			period: "Mar 2024 - Jul 2025",
			place: "Buenos Aires · Remote",
			url: "https://www.itba.edu.ar",
			highlights: [
				"Led technical sessions and code reviews on multiplatform mobile development, instilling production-grade engineering best practices.",
				"Mentored students through architecting and shipping apps across iOS and Android.",
			],
		},
		{
			role: "Software Engineer",
			company: "Aligned",
			period: "Dec 2023 - Sep 2024",
			place: "Buenos Aires · Hybrid",
			url: "https://explorer.alignedlayer.com",
			highlights: [
				"Designed and built the user-facing block explorer for zero-knowledge proofs in the Aligned verification layer — turning dense, real-time on-chain proof and batch data into a clear, legible interface.",
				"Owned the product from concept to production across the user-facing interface, protocol API integration, and the backend services / data pipelines that index and aggregate on-chain data.",
			],
		},
		{
			role: "Frontend Engineer",
			company: "Constellation Network",
			period: "Aug 2022 - Mar 2023",
			place: "Remote",
			url: "https://constellationnetwork.io",
			highlights: [
				"Designed and built an anonymous chat app authenticated with a web wallet — wallet-based sign-in was novel at the time — owning the product UI end to end.",
				"Developed production React/TypeScript interfaces for a web3 distributed-ledger network, delivering features against evolving protocol APIs.",
			],
		},
		{
			role: "Social Media Designer",
			company: "ITBA Computer Society",
			period: "Nov 2019 - Dec 2021",
			place: "Buenos Aires",
			url: "https://csitba.web.app/",
			highlights: [
				"Produced brand and design assets for a student technology community.",
			],
		},
	] satisfies WorkExperience[],
	education: [
		{
			school: "Instituto Tecnologico de Buenos Aires",
			credential: "Software Engineering, Computer Software Engineering",
			period: "Mar 2017 - Feb 2025",
			location: "Buenos Aires, Argentina",
			url: "https://www.itba.edu.ar",
			details: [
				"Thesis: privacy-preserving image classification with fully homomorphic encryption (CNN + Concrete ML / Zama).",
			],
		},
		{
			school: "Southern International School",
			credential: "High School Diploma",
			period: "2011 - 2016",
			location: "Buenos Aires, Argentina",
			url: "https://intschools.org/en/southern",
		},
	] satisfies EducationItem[],
	projects: [
		{
			name: "glpecile.xyz — Personal site & design system",
			stack: "Astro / TypeScript / Tailwind CSS",
			url: "https://glpecile.xyz",
			highlights: [
				"Designed and built this site as a hand-crafted component system — consistent type, color, and motion tokens driving every page from a single config.",
				"Engineered a custom CV generator that renders a typeset PDF programmatically (pdf-lib) from the same content source as the live site.",
				"Sweated the details: reveal/stagger animations, keyboard shortcuts, dark/light theming, and an /llms.txt export for agents.",
			],
		},
		{
			name: "lugia",
			stack: "React Native / Expo",
			url: "https://github.com/glpecile/lugia",
			highlights: [
				"Built a cross-platform (iOS / Android / web) blog application with Expo from a single shared UI codebase.",
			],
		},
		{
			name: "Human-in-Picture — Privacy-Preserving CNN (Thesis)",
			stack: "Python / PyTorch / Concrete ML (FHE)",
			url: "https://github.com/Memento-Research/human-in-picture-concrete-ml",
			highlights: [
				"Engineering thesis: a CNN that detects human presence in images while running inference entirely on encrypted data via fully homomorphic encryption (FHE) — no server-side decryption.",
				"Trained a PyTorch CNN and compiled it with Concrete ML (Zama) for homomorphic inference; benchmarked accuracy and latency across input resolutions (32–128px).",
				"Shipped an interactive proof-of-concept web app demonstrating end-to-end private inference.",
			],
		},
		{
			name: "SIA - AI Systems",
			stack: "Python / NumPy / AI/ML",
			url: "https://github.com/glpecile/SIA_TPs",
			highlights: [
				"Implemented perceptrons, search, and optimization algorithms from scratch in Python.",
				"Trained and evaluated neural-network and AI models across multiple problem sets.",
			],
		},
		{
			name: "srt-cli",
			stack: "TypeScript / Bun",
			url: "https://github.com/glpecile/srt-cli",
			highlights: [
				"Authored and published an open-source CLI that converts plain text into .srt subtitle files.",
			],
		},
		{
			name: "ITBA Systems Coursework",
			stack: "C / Java / PostgreSQL / Redis",
			url: "https://github.com/glpecile",
			highlights: [
				"Cryptography & steganography tooling, a multithreaded socket server in C, distributed object computing in Java, and a Postgres/Redis-backed data platform.",
			],
		},
	] satisfies ProjectEntry[],
	skills: [
		{
			category: "Frontend & UI",
			items: [
				"React",
				"Next.js",
				"TypeScript",
				"CSS",
				"Tailwind CSS",
				"React Native / Expo",
				"Astro",
				"Responsive & accessible UI",
			],
		},
		{
			category: "Design Systems & Craft",
			items: [
				"Reusable component libraries",
				"Design tokens & consistency at scale",
				"Animation, motion & interaction design",
				"Information-dense UI",
			],
		},
		{
			category: "Languages",
			items: ["TypeScript", "JavaScript", "Python", "Elixir", "Java", "C", "SQL"],
		},
		{
			category: "Backend & Data",
			items: ["Phoenix (Elixir)", "Data pipelines & indexing", "PostgreSQL", "REST APIs"],
		},
		{
			category: "AI / ML",
			items: [
				"Machine learning (PyTorch)",
				"Privacy-preserving ML (FHE, Concrete ML)",
				"LLM application patterns",
			],
		},
		{
			category: "Cloud & Tooling",
			items: ["Cloudflare Workers", "Vercel", "Git", "CI/CD"],
		},
	] satisfies SkillGroup[],
	languages: [
		{ language: "Spanish", level: "Native" },
		{ language: "English", level: "Native (IB Higher Level)" },
		{ language: "Italian", level: "C1 (CILS certified)" },
		{ language: "Portuguese", level: "Conversational (IB Standard Level)" },
	] satisfies LanguageItem[],
	certificates: [
		{
			title: "Animations on the Web Course",
			issuer: "Emil Kowalski",
			issued: "Aug 2024",
			details: ["Certificate: Animations on the Web Course Certificate taught by Emil Kowalski"],
			url: "https://animations.dev/",
		},
		{
			title: "Certificazione di Lingua Italiana come Lingua Straniera, livello C1 (CILS)",
			issuer: "Universita per Stranieri di Siena",
			issued: "Dec 2016",
			url: "https://cils.unistrasi.it/",
		},
		{
			title:
				"International Baccalaureate (IB) Certificate (Economics, English, Italian, Portuguese, Spanish)",
			issuer: "International Baccalaureate",
			issued: "Nov 2016",
			url: "https://www.ibo.org/",
		},
		{
			title: "International General Certificate of Secondary School (IGCSE)",
			issuer: "University of Cambridge",
			issued: "Nov 2014",
			url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-upper-secondary/cambridge-igcse/",
		},
	] satisfies CertificateItem[],
	cv: {
		href: "/work/cv.pdf",
		fileName: "gian-luca-pecile-cv.pdf",
		label: "download cv",
		heading: "Frontend engineer building design systems and high-craft product interfaces.",
	} satisfies CvFile,
} as const;
