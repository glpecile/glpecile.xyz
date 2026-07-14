# AGENTS.md

Project-specific guidance for working in this repo.

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
- Never use `any`. Prefer concrete types, `unknown`, or small typed helpers instead.
- Prefer `async`/`await` over `.then()` chains.
- Use kebab-case for component, layout, and route-related filenames. Avoid PascalCase filenames like `SiteLayout.astro` or `SectionLabel.astro`.
- When adding or changing first-class routes, keep machine-readable surfaces in sync: `sitemap.xml`, `/llms.txt`, relevant `index.html.md` mirrors, and `SiteLayout` alternate metadata.
- Do not edit generated output under `dist/` or `.astro/`; make source changes under `src/` or `config/`.
- Use Astro's `<Image>` component from `astro:assets` instead of native `<img>` tags. Configure remote image domains in `astro.config.mjs` under `image.remotePatterns`.

## Markdown Mirrors

Every first-class route should have a corresponding `index.html.md.ts` endpoint that renders a plain-text markdown version of the page. This serves agents, RSS readers, and accessibility tools.

- **Visual-heavy pages** (like `/films` with poster grids or timelines) should render as structured lists in markdown. Focus on the data, not the presentation.
- **Interactive pages** should describe their purpose and link to the HTML version for the full experience.
- Keep markdown mirrors in `src/lib/llms.ts` as `renderXxxMarkdown()` functions for consistency.
- The markdown should be self-contained: include enough context that an agent or reader understands the page without needing to visit the HTML.

## Style

- Preserve the site's plain-text terminal aesthetic.
- Prefer monospace typography, simple section labels, inline nav, text lists, and understated separators over cards, pills, panels, and dashboard-like chrome.
- Do not introduce decorative gradients or glowing background effects.
- Avoid heavy borders, shadows, blur, and oversized containers unless the user explicitly asks for them.
- Prefer links and lists over boxed CTAs. The UI should feel closer to a personal terminal page than a SaaS landing page.
- Keep motion subtle and rare. Keyboard-driven navigation should stay instant with no decorative animation.
