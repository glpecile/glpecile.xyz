# AGENTS.md

Project-specific guidance for working in this repo.

## Skills

- Skills are vendored in `.agents/skills/`, with a Claude Code directory symlink at `.claude/skills`; OpenCode reads `.agents/skills/` directly. `skills-lock.json` tracks upstream sources. Update through `bunx skills@latest`, not by editing vendored files.
- Use `astro` for framework work and `shadcn` for the existing component library.
- Use `emil-design-eng` for interaction and motion decisions; use `frontend-design` for new visual directions only within the site's style rules below.
- Use `better-accessibility` for semantics, keyboard and focus behavior; `better-typography` for text rendering; `better-layout` for responsive structure; and `better-colors` for tokens and measured contrast.
- Use `mobile-native` for phone-specific viewport, touch and safe-area bugs. This is a scrolling personal site, not an app shell: preserve native scrolling, zoom and selectable content instead of applying its app baseline globally.
- Use `break-ui` when asked to stress-test a component with realistic edge-case data. Keep fixtures and toggles dev-only; do not ship a test route or list it in machine-readable surfaces.
- The site's narrow column, Inter text with mono accents, lowercase content titles, existing tokens and instant keyboard navigation take precedence over generic skill styling defaults. Fix usability failures without restyling the site.

## Gotchas

- Assume the user is already running a dev server. Do not start another one unless they explicitly ask.
- Always run code validation after making changes. Prefer `bun run check`, and run `bun run lint` when the change affects linted files.
- Use Bun only. Prefer `bun`, `bunx`, and `bun install`, and do not add `pnpm-lock.yaml`, `package-lock.json`, or `yarn.lock`.
- Prefer Tailwind CSS utilities over custom `<style>` blocks or one-off CSS when implementing UI changes.
- Tailwind CSS is configured through `@tailwindcss/vite` and `src/styles/global.css`. Do not add `tailwind.config.*` unless there is a real project need.
- Keep the `@/*` alias pointing to `./src/*` and `#config/*` pointing to `./config/*`. New imports and generated files should use the `src`-based alias layout, and config imports should use `#config/*`.
- Treat `config/site.ts` as the source of truth for site-wide nav, links, metadata, and work entries. Prefer updating config over duplicating literals in pages/components.
- Keep shared keyboard shortcuts in `config/site.ts` under `siteConfig.shortcuts` and derive labels/handlers from that config instead of hardcoding keys across pages/components.
- Run `bun run check` after `.astro` changes. Use `bun run lint` for TS and JS changes that oxlint covers (config in `.oxlintrc.json`).
- In Astro, `script is:inline` blocks share the page scope after compilation. Wrap inline script bodies in an IIFE or otherwise isolate names; do not rely on component boundaries to prevent top-level redeclarations.
- For shadcn, use `bunx shadcn@latest ...` and keep generated components under `src/components/ui`.
- Prefer shorter, clearer variable names when they stay unambiguous in context. Avoid verbose names like `workExperience` when `work` is sufficient.
- Prefer shorter, clearer `.md` and `.mdx` filenames for content slugs. Avoid overly long post filenames when a concise slug like `srt-cli.mdx` would stay clear.
- Keep content `title` frontmatter fully lowercase (terminal aesthetic), e.g. `building serverless telegram notification bots`, not `Building Serverless Telegram Notification Bots`.
- Never use `any`. Prefer concrete types, `unknown`, or small typed helpers instead.
- Prefer `async`/`await` over `.then()` chains.
- Use kebab-case for component, layout, and route-related filenames. Avoid PascalCase filenames like `SiteLayout.astro` or `SectionLabel.astro`.
- When adding or changing first-class routes, keep machine-readable surfaces in sync: `sitemap.xml`, `/llms.txt`, relevant `index.html.md` mirrors, and `SiteLayout` alternate metadata.
- Do not edit generated output under `dist/` or `.astro/`; make source changes under `src/` or `config/`.
- Web fonts are subset by hand with `uv run scripts/subset-fonts.py`, which writes `src/assets/fonts/*.woff2` and `src/styles/fonts.css`; commit the output. It subsets Inter (one variable file) and JetBrains Mono (400/500/700). Rerun it when content needs a character it reports as dropped, when a weight or OpenType feature is added, or after upgrading `@fontsource-variable/inter` or `@fontsource/jetbrains-mono`. Pixel-diff before/after (Chromium, Firefox and WebKit) when changing its options.
- Use Astro's `<Image>` component from `astro:assets` instead of native `<img>` tags. Configure remote image domains in `astro.config.mjs` under `image.remotePatterns`.
- When deploying to Cloudflare, set `imageService: 'compile'` on the Cloudflare adapter so remote `<Image>` assets are optimized at build time. This site is fully prerendered, so runtime services like `passthrough` do not work: no worker route serves `/_image`, and those URLs 404 in production.

## Markdown Mirrors

Every first-class route should have a corresponding `index.html.md.ts` endpoint that renders a plain-text markdown version of the page. This serves agents, RSS readers, and accessibility tools.

- **Visual-heavy pages** (like `/films` with poster grids or timelines) should render as structured lists in markdown. Focus on the data, not the presentation.
- **Interactive pages** should describe their purpose and link to the HTML version for the full experience.
- Keep markdown mirrors in `src/lib/llms.ts` as `renderXxxMarkdown()` functions for consistency.
- The markdown should be self-contained: include enough context that an agent or reader understands the page without needing to visit the HTML.

## Style

- The look is a narrow personal page with small, playful interaction details (references: Benji Taylor's product work, aiforui.dev): one `max-w-[42rem]` column, generous vertical space, little chrome.
- Keep the fun parts: the name scramble (load and hover), the live pulse on the current role, poster tilt on hover, the sliding theme switch, keycap `.kbd` hints, press feedback (`active:scale-[0.97]`). New interactive pieces should get the same care.
- Brand logos come from `simple-icons` (build-time import, inline SVG path).
- Actions carry an icon: use `.action` with `icon.astro` (paths in `src/lib/icons.ts`) for share, download, markdown, rss and source links. Actions that complete in place use `<Icon swap />`, which changes to a check while an ancestor has `data-copy-state="success"`.
- Projects on `/work` are `.card`s (soft ring, lift on hover, stretched title link). Use cards only for self-contained items like these, not for sections.
- Inter sets all text (body 400, names and section labels `font-[575]`). JetBrains Mono is an accent only: the page headline (`.page-heading`), dates, key hints (`.kbd`) and code.
- One accent color: the blue (`--heading`, `--link`, `--ring`). Use it for the page headline, link hover, focus rings and small state marks. Everything else is the cool neutral tone scale (`text-tone-*`). Do not add a second accent.
- One loud element per page: the mono blue `h1`. Section labels are plain lowercase `h2`s (`section-label.astro`), no eyebrows, rules or all-caps tracking.
- Links use `.site-link`: text color with a faint underline that turns blue on hover. Titles inside list rows drop the underline (`no-underline`).
- Lists are text rows: title left, a dashed leader, mono date right. Icon links are `.chip` pills (soft 1px ring plus a small shadow). No SaaS cards, gradients, blur or glow.
- Radii: `rounded-md` for media and code, 4px for row highlights and `.kbd`, full for chips and the theme switch.
- List rows opt into keyboard selection with `data-tui-row`: a subtle fill that bleeds past the column, `j`/`k` + `enter` navigation (script in `site-layout.astro`, styles at the end of `global.css`). Use it for text rows only; rows with media skip it.
- Show shortcut keys as `.kbd` hints next to their label, derived from `siteConfig.shortcuts`.
- Motion answers the user (hover, press, toggle) and uses `--ease-reveal`; the page-enter cascade is the only unprompted sequence. Respect reduced motion. Keyboard-driven navigation stays instant with no decorative animation.
- The footer is a short rule, the source link and the theme switch (`.theme-thumb` follows `data-theme-preference`). It is not sticky.
