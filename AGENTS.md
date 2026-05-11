# AGENTS.md

Project-specific guidance for working in this repo.

## Gotchas

- Assume the user is already running a dev server. Do not start another one unless they explicitly ask.
- Always run code validation after making changes. Prefer `bun run check`, and run `bun run lint` when the change affects linted files.
- Use Bun only. Prefer `bun`, `bunx`, and `bun install`, and do not add `pnpm-lock.yaml`, `package-lock.json`, or `yarn.lock`.
- Prefer Tailwind CSS utilities over custom `<style>` blocks or one-off CSS when implementing UI changes.
- Tailwind CSS is configured through `@tailwindcss/vite` and `src/styles/global.css`. Do not add `tailwind.config.*` unless there is a real project need.
- Keep the `@/*` alias pointing to `./src/*`. New imports and generated files should use the `src`-based alias layout.
- Run `bun run check` after `.astro` changes. Use `bun run lint` for TS, JS, and CSS changes that Biome covers.
- In Astro, `script is:inline` blocks share the page scope after compilation. Wrap inline script bodies in an IIFE or otherwise isolate names; do not rely on component boundaries to prevent top-level redeclarations.
- For shadcn, use `bunx shadcn@latest ...` and keep generated components under `src/components/ui`.
- Prefer shorter, clearer variable names when they stay unambiguous in context. Avoid verbose names like `workExperience` when `work` is sufficient.
- Never use `any`. Prefer concrete types, `unknown`, or small typed helpers instead.
- Prefer `async`/`await` over `.then()` chains.
- Use kebab-case for component, layout, and route-related filenames. Avoid PascalCase filenames like `SiteLayout.astro` or `SectionLabel.astro`.

## Frontend Style

- Preserve the site's plain-text terminal aesthetic. Use nexxel.dev and terminal.shop/faq as the tone reference.
- Prefer monospace typography, simple section labels, inline nav, text lists, and understated separators over cards, pills, panels, and dashboard-like chrome.
- Do not introduce decorative gradients, glowing background effects, floating ambient shapes, or glassmorphism.
- Avoid heavy borders, shadows, blur, and oversized containers unless the user explicitly asks for them.
- Prefer links and lists over boxed CTAs. The UI should feel closer to a personal terminal page than a SaaS landing page.
- Keep motion subtle and rare. Keyboard-driven navigation should stay instant with no decorative animation.
