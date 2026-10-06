# glpecile.xyz

Personal site built with [Astro](https://astro.build/).

## Development

Install dependencies:

```bash
bun install
```

Start the dev server:

```bash
bun run dev
```

Run validation:

```bash
bun run lint
bun run check
bun run build
```

## Agent skills

Skills live in `.agents/skills/`, with sources tracked in `skills-lock.json`.
OpenCode reads them directly; Claude Code uses the `.claude/skills` directory symlink.

- [Emil Kowalski](https://github.com/emilkowalski/skills): `emil-design-eng` for interaction craft, `mobile-native` for phone-specific fixes, and `break-ui` for realistic edge-case testing.
- [Jakub Krehel](https://github.com/jakubkrehel/skills): `better-accessibility`, `better-typography`, `better-layout`, and `better-colors` for focused UI work and reviews.
- Framework/tooling: `astro`, `shadcn`, and `frontend-design`.

Site-specific skill guidance lives in `AGENTS.md`. Keep vendored skills unchanged;
refresh them from upstream with:

```bash
bunx skills@latest update --project -y
```
