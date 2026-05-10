# Complete Output Example: CLI Deployment Tool

## llm-docs/llm.version.txt

```markdown
# DeployCLI LLM Documentation

- **Version**: 2.1.0
- **Last Updated**: 2025-12-15
- **Documentation Version**: 1.0.0
- **Files**: 4 domain files
- **Total Size**: ~35 KB
```

## llm-docs/llm.txt

```markdown
# DeployCLI - LLM Documentation

## Project Metadata
- **Name**: deploy-cli
- **Type**: CLI Tool
- **Language**: TypeScript
- **Purpose**: Deploy applications to multiple cloud providers

## Quick Reference
- **Key Modules**: commands, providers, config
- **Patterns**: Command pattern, Provider abstraction
- **Dependencies**: commander, chalk, ora

## Documentation Structure

### Commands
#### llm.commands.txt
- **Focus**: All CLI commands and subcommands
- **Use when**: Need to understand available commands and flags

### Providers
#### llm.providers.txt
- **Focus**: Cloud provider integrations (AWS, GCP, Vercel)
- **Use when**: Adding or modifying provider support

### Configuration
#### llm.config.txt
- **Focus**: Config file format and options
- **Use when**: Understanding how users configure the CLI
```

## llm-docs/llm.commands.txt

```markdown
# Commands - DeployCLI

## Overview
DeployCLI exposes 5 main commands for deployment management.

## Commands

| Command | Description | Flags |
|---------|-------------|-------|
| `deploy` | Deploy to target provider | `--provider`, `--env`, `--dry-run` |
| `rollback` | Revert to previous deployment | `--version`, `--force` |
| `status` | Check deployment status | `--watch`, `--json` |
| `config` | Manage configuration | `--init`, `--validate` |
| `logs` | Stream deployment logs | `--follow`, `--since` |

## deploy

Main deployment command.

### Usage
```bash
deploy-cli deploy --provider aws --env production
```

### Flags
- `--provider, -p`: Target provider (aws, gcp, vercel)
- `--env, -e`: Environment (development, staging, production)
- `--dry-run`: Simulate without deploying
- `--config, -c`: Path to config file

## Related Files
- `llm.providers.txt` - Provider-specific deployment details
- `llm.config.txt` - Configuration options for deployments
```

## Using the Output

Once generated, the files can be:

1. **Included in AI prompts:**
   ```
   @llm-docs/llm.commands.txt How do I deploy to staging?
   ```

2. **Referenced in CLAUDE.md:**
   ```markdown
   ## LLM Documentation
   See `llm-docs/` for AI-optimized documentation.
   ```

3. **Maintained automatically:**
   ```bash
   npm run generate:llms  # Regenerate after changes
   ```
