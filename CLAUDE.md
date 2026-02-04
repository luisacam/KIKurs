# CLAUDE.md - AI Assistant Guidelines for KIKurs

This document provides context and guidelines for AI assistants working on the KIKurs repository.

## Project Overview

**KIKurs** is a project repository currently in its initial setup phase. The name suggests educational/course-related content (German: "Kurs" = Course, "KI" = AI/Artificial Intelligence).

**Current Status:** Newly initialized repository awaiting content development.

## Repository Structure

```
KIKurs/
├── .git/              # Git repository metadata
├── CLAUDE.md          # This file - AI assistant guidelines
└── README.md          # Project description
```

As the project grows, update this structure documentation accordingly.

## Development Workflow

### Branch Naming Convention

This repository uses a specific branch naming pattern for AI-assisted development:

- **Main branch:** `main` - production-ready code
- **Feature branches:** `claude/<feature-description>-<session-id>` - for AI-assisted development work

### Git Workflow

1. **Always work on the designated feature branch** - never push directly to `main`
2. **Commit frequently** with clear, descriptive commit messages
3. **Use conventional commit format** when applicable:
   - `feat:` - new features
   - `fix:` - bug fixes
   - `docs:` - documentation changes
   - `refactor:` - code refactoring
   - `test:` - adding/updating tests
   - `chore:` - maintenance tasks

### Push Protocol

When pushing changes:
```bash
git push -u origin <branch-name>
```

If push fails due to network errors, retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s).

## Code Conventions

### General Guidelines

1. **Keep it simple** - avoid over-engineering solutions
2. **Write self-documenting code** - use clear naming conventions
3. **Only add what's needed** - no speculative features
4. **Maintain consistency** - follow existing patterns in the codebase

### File Organization

As the project develops:
- Group related files in meaningful directories
- Use lowercase with hyphens for directory names (e.g., `my-feature/`)
- Keep configuration files in the project root

## Documentation Standards

- **README.md** - Project overview, setup instructions, usage guide
- **CLAUDE.md** - AI assistant context and guidelines (this file)
- Add inline comments only where the code isn't self-explanatory
- Document public APIs and interfaces

## AI Assistant Guidelines

### Before Making Changes

1. **Read existing code first** - understand the context before modifying
2. **Check for existing patterns** - maintain consistency with the codebase
3. **Verify requirements** - ensure you understand what's being asked

### When Implementing Features

1. **Start with the simplest solution** that meets requirements
2. **Avoid adding unused code** - no dead code or speculative features
3. **Test your changes** - verify functionality before committing
4. **Keep commits atomic** - one logical change per commit

### Code Quality

1. **No security vulnerabilities** - avoid command injection, XSS, SQL injection, etc.
2. **Handle errors appropriately** - but only for realistic failure scenarios
3. **Clean up after yourself** - remove debug code, unused imports, etc.

### Communication

1. **Be direct and concise** - avoid unnecessary verbosity
2. **Explain decisions** - document non-obvious choices
3. **Ask for clarification** when requirements are unclear

## Testing

*Testing framework and conventions to be established as the project develops.*

When adding tests:
- Place test files alongside source files or in a dedicated `tests/` directory
- Name test files with a `.test.` or `_test.` suffix
- Ensure tests are deterministic and independent

## Build & Deployment

*Build and deployment processes to be defined as the project develops.*

## Updating This Document

This CLAUDE.md should be kept up-to-date as the project evolves:

1. **Add new conventions** as they are established
2. **Document new tools** and their usage
3. **Update structure** as directories are added
4. **Remove outdated information** that no longer applies

---

*Last updated: 2026-02-04*
