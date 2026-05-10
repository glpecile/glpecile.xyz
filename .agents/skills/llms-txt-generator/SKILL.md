---
name: llms-txt-generator
description: This skill generates llms.txt documentation optimized for AI/LLM consumption. It should be used when the user says "crear llms.txt", "generate llms.txt", "documentar para AI", "document for AI", "crear documentacion para LLMs", "generate docs for LLMs", "make repo readable for Claude", or wants to create structured machine-readable documentation following the llms.txt standard.
---

# LLM Documentation Generator

Generate structured, AI-readable documentation following the llms.txt standard with granular files organized by domain.

## Output Structure

```
llm-docs/
├── llm.txt                    # Main index (~1-2 KB)
├── llm.version.txt            # Metadata and sync info (~0.3 KB)
└── llm.{domain}.txt           # Domain-specific files (~3-50 KB each)
```

## Workflow

### Phase 1: Language Selection

Ask user preferred language for documentation output (English, Spanish, or bilingual).

### Phase 2: Project Analysis

Identify project type and data sources:

| Indicator | Project Type |
|-----------|--------------|
| `components/`, design tokens, SCSS | Frontend/UI Library |
| `cmd/`, CLI flags, subcommands | CLI Tool |
| `/api/`, OpenAPI, routes | REST/GraphQL API |
| `src/`, exports, package.json | Generic Library |

Detect structured data sources:
- JSON metadata files (component docs, OpenAPI specs)
- JSDoc/GoDoc comments
- TypeScript definitions
- Configuration files (package.json, go.mod)
- Existing documentation (README, docs/)

### Phase 3: Domain Planning

Based on project type, plan which `llm.{domain}.txt` files to create:

- **Frontend/UI**: See `references/frontend-example.md`
- **CLI Tools**: See `references/cli-example.md`
- **APIs**: See `references/api-example.md`
- **Libraries**: See `references/library-example.md`

### Phase 4: Implementation Decision

| Condition | Approach |
|-----------|----------|
| Structured data exists (JSON, JSDoc, OpenAPI) | Create generator script |
| Manual documentation needed | Write static markdown files |
| Mixed sources | Hybrid: script for structured, manual for rest |

For generator script structure, see `references/generator-script-pattern.md`.

### Phase 5: File Generation

#### llm.version.txt (always first)

```markdown
# {Project} LLM Documentation

- **Version**: {semantic version}
- **Last Updated**: {YYYY-MM-DD}
- **Documentation Version**: 1.0.0
- **Files**: {count} domain files
- **Total Size**: ~{X} KB
```

#### llm.txt (main index)

```markdown
# {Project} - LLM Documentation

## Project Metadata
- **Name**: {project name}
- **Type**: {frontend|cli|api|library}
- **Language**: {primary language}
- **Purpose**: {one-line description}

## Quick Reference
- **Key Modules**: {list main areas}
- **Patterns**: {architectural patterns used}
- **Dependencies**: {key dependencies}

## Documentation Structure

### {Domain 1}
#### llm.{domain1}.txt
- **Focus**: {what this file covers}
- **Use when**: {scenarios to read this file}

## Reading Guide

1. Start with `llm.version.txt` for metadata
2. Read `llm.{primary-domain}.txt` for core concepts
3. Reference other files as needed
```

#### llm.{domain}.txt (domain files)

Each domain file follows this structure:

```markdown
# {Domain} - {Project}

## Overview
{2-3 sentences explaining this domain}

## {Section 1}

| Name | Type | Description |
|------|------|-------------|
| ... | ... | ... |

## Related Files
- `llm.{related}.txt` - {why related}
```

## Best Practices

1. **File size**: Keep each file under 50 KB for optimal LLM context usage
2. **Cross-references**: Link between files with clear "when to read" guidance
3. **Tables**: Use markdown tables for properties, tokens, parameters
4. **Code examples**: Include practical, copy-pasteable examples
5. **Hierarchy**: Use consistent heading levels (H1 for title, H2 for sections, H3 for subsections)

For a complete worked example, see `references/complete-output-example.md`.
