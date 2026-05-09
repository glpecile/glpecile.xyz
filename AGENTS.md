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
- For shadcn, use `bunx shadcn@latest ...` and keep generated components under `src/components/ui`.
