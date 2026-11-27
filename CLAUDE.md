# CLAUDE.md

@AGENTS.md

## Claude-specific notes

- Agent skills live in `.agents/skills/` and are symlinked into `.claude/skills/`. Follow the skill routing and site-specific constraints in `AGENTS.md` before reaching for external docs.
- `skills-lock.json` tracks skill sources; do not edit skills in place — they are vendored from upstream repos.
- Quick commands: `bun run check` (astro type check), `bun run format` (oxfmt), `bun run lint` (oxlint and `oxfmt --check`), `bun run test` (bun test unit tests), `bun run build` (production build). Run `check` after any `.astro` or content-schema change.
- Unit tests are colocated as `src/**/*.test.ts` and run with `bun test`, which resolves the `@/*` and `#config/*` aliases from `tsconfig.json`. Import from `bun:test`; swap globals with `src/lib/test-globals.ts`, since bun has no `vi.stubGlobal`. Add tests for new pure helpers in `src/lib/`.
- Content collections are defined in `src/content.config.ts`; posts live in `src/content/{blog,projects}/` as MDX with kebab-case slugs.
- When verifying rendered output, ask the user for their dev server port instead of spawning a new server (see AGENTS.md gotchas).
