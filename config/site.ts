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
		linkedin: "https://www.linkedin.com/in/glpecile",
	} satisfies ContactInfo,
	work: [
		{
			role: "Software / Frontend Engineer",
			company: "POAP - Proof Of Attendance Protocol",
			period: "Jan 2025 - Present",
			place: "Buenos Aires · Hybrid",
			url: "https://poap.xyz",
			highlights: [
				"Ship production features end to end for POAP — the web3 protocol for issuing digital collectibles (NFTs) — from TypeScript implementation through API integration, code review, and release on high-traffic minting and collection surfaces.",
				"Own reusable React/TypeScript components and shared patterns across the protocol's products, improving reliability, performance, and consistency at scale.",
			],
		},
		{
			role: "Teaching Assistant",
			company: "ITBA - Instituto Tecnologico de Buenos Aires",
			period: "Mar 2024 - Jul 2025",
			place: "Buenos Aires · Remote",
			url: "https://www.itba.edu.ar",
			highlights: [
				"Led technical sessions and code reviews on multiplatform mobile development, guiding engineering teams toward production-grade practices.",
				"Mentored student teams through architecting, debugging, and shipping apps across iOS and Android — explaining complex technical trade-offs to mixed-experience audiences.",
			],
		},
		{
			role: "Software Engineer",
			company: "Aligned",
			period: "Dec 2023 - Sep 2024",
			place: "Buenos Aires · Hybrid",
			url: "https://explorer.alignedlayer.com",
			highlights: [
				"Designed and built the block explorer for Aligned, a zero-knowledge proof verification layer on Ethereum — turning dense, real-time on-chain proof and batch data into a clear, legible product.",
				"Owned the system from concept to production: backend services and data pipelines (Elixir/Phoenix, PostgreSQL) indexing and aggregating on-chain data, protocol API integration, and the user-facing interface.",
				"Diagnosed and resolved production issues spanning the explorer, its indexers, and the underlying blockchain network.",
			],
		},
		{
			role: "Frontend Engineer",
			company: "Constellation Network",
			period: "Aug 2022 - Mar 2023",
			place: "Remote",
			url: "https://constellationnetwork.io",
			highlights: [
				"Designed and built an anonymous chat app authenticated with a web wallet — wallet-based sign-in was novel at the time — owning the product end to end.",
				"Delivered production React/TypeScript features for a web3 distributed-ledger network, integrating against evolving protocol APIs and shifting requirements.",
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
			category: "Web3 & Blockchain",
			items: [
				"NFT infrastructure (POAP)",
				"Zero-knowledge proof systems (Aligned)",
				"On-chain data indexing",
				"Wallet-based authentication",
				"Ethereum ecosystem",
			],
		},
		{
			category: "Languages",
			items: ["TypeScript", "JavaScript", "Python", "Elixir", "Java", "C", "SQL"],
		},
		{
			category: "Backend & APIs",
			items: [
				"REST API design & integration",
				"Phoenix (Elixir)",
				"Data pipelines & indexing",
				"PostgreSQL",
				"Redis",
			],
		},
		{
			category: "AI / ML",
			items: [
				"Machine learning (PyTorch)",
				"Privacy-preserving ML (FHE, Concrete ML)",
				"LLM application patterns",
				"AI-assisted development tooling",
			],
		},
		{
			category: "Frontend & UI",
			items: [
				"React",
				"Next.js",
				"Astro",
				"Tailwind CSS",
				"React Native / Expo",
				"Reusable component libraries",
				"Responsive & accessible UI",
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
		heading:
			"Software engineer shipping web3 products end to end — NFT infrastructure, zero-knowledge proof explorers, and wallet-native apps — from APIs and on-chain data pipelines to high-craft interfaces.",
	} satisfies CvFile,
} as const;
