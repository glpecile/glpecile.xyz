# CLAUDE.md

@AGENTS.md

## Claude-specific notes

- Agent skills live in `.agents/skills/` and are symlinked into `.claude/skills/`. Prefer the `astro` skill for framework questions and `frontend-design`/`emil-design-eng` for UI work before reaching for external docs.
- `skills-lock.json` tracks skill sources; do not edit skills in place — they are vendored from upstream repos.
- Quick commands: `bun run check` (astro type check), `bun run lint` (oxlint), `bun run test` (vitest unit tests), `bun run build` (production build). Run `check` after any `.astro` or content-schema change.
- Unit tests are colocated as `src/**/*.test.ts` and run with vitest (`vitest.config.ts` mirrors the `@/*` and `#config/*` aliases). Add tests for new pure helpers in `src/lib/`.
- Content collections are defined in `src/content.config.ts`; posts live in `src/content/{blog,projects}/` as MDX with kebab-case slugs.
- When verifying rendered output, ask the user for their dev server port instead of spawning a new server (see AGENTS.md gotchas).
