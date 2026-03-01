# CLAUDE.md - AI Assistant Guidelines for KIKurs

This document provides context and guidelines for AI assistants working on the KIKurs repository.

## Project Overview

**KIKurs** is an educational course repository for learning AI (Künstliche Intelligenz) and Machine Learning fundamentals. The course is in German and includes lessons, exercises, and code examples.

**Current Status:** Complete course with 5 lessons.

## Repository Structure

```
KIKurs/
├── lektionen/                  # Course lessons (theory)
│   ├── 01-einfuehrung/         # Lesson 1: Introduction to AI
│   ├── 02-ml-grundlagen/       # Lesson 2: Machine Learning Basics
│   ├── 03-neuronale-netze/     # Lesson 3: Neural Networks
│   ├── 04-praxis/              # Lesson 4: Practical Applications
│   └── 05-deep-learning/       # Lesson 5: Deep Learning
├── uebungen/                   # Exercises for each lesson
│   ├── 01-einfuehrung/
│   ├── 02-ml-grundlagen/
│   ├── 03-neuronale-netze/
│   ├── 04-praxis/
│   └── 05-deep-learning/
├── notebooks/                  # Interactive Jupyter notebooks
│   ├── 01-einfuehrung.ipynb
│   ├── 02-ml-grundlagen.ipynb
│   ├── 03-neuronale-netze.ipynb
│   └── 04-praxis.ipynb
├── beispiele/                  # Code examples
│   ├── hallo_ki.py             # Simple rule-based chatbot
│   ├── neuron_demo.py          # Neuron and neural network demo
│   ├── iris_klassifikation.py  # Iris flower classification
│   ├── studenten_vorhersage.py # Student success prediction
│   └── deep_learning_demo.py   # Deep learning demonstration
├── projekte/                   # Capstone project guidelines
├── quiz/                       # Interactive course quizzes
│   └── ki_quiz.py
├── daten/                      # Datasets for exercises
│   ├── studenten.csv           # Student dataset
│   └── wetter.csv              # Weather dataset
├── requirements.txt            # Python dependencies
├── CLAUDE.md                   # This file - AI assistant guidelines
└── README.md                   # Project description and setup
```

## Course Content

The course covers:
1. **Einführung in KI** - What is AI?
2. **Machine Learning Grundlagen** - Supervised/unsupervised learning
3. **Neuronale Netze** - How neural networks work
4. **Praktische Anwendungen** - AI in practice
5. **Deep Learning** - Deep neural networks and advanced techniques

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

*Last updated: 2026-03-01*
