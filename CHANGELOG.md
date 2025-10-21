# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - NPM Publishing
- Prepared package for npm publishing with proper configuration
- Added bun as primary package manager
- Created .env.example for easy setup
- Added .npmignore for cleaner npm packages
- PUBLISHING.md guide for npm publishing workflow

### Added - Meta-Analysis Framework
- Custom project-analysis characters (Architect, Educator, Visionary, Philosopher)
- Self-analysis experiment (experiments/self-analysis.js)
- META_ANALYSIS.md documenting recursive self-analysis philosophy
- INTEGRATION.md comprehensive guide for using in other projects

### Added - Adaptive Analysis Breakthrough ⚡
- First-run workflow (experiments/first-run.js) - agents that transform themselves
- Five-phase adaptive process: Examine → Question → Debate → Transform → Evolve
- FIRST_RUN_WORKFLOW.md complete philosophy and documentation
- BREAKTHROUGH.md documenting the discovery
- Evolved character output system
- Individual focused dialogues (one per question)
- Agent self-transformation through understanding

### Changed
- README.md now showcases adaptive analysis and general-purpose use
- QUICKSTART.md updated to use bun and clab commands
- experiments/README.md expanded with workflow comparisons
- Documentation now emphasizes domain-agnostic capabilities

### Discovered
- consciousness-lab is a general-purpose multi-perspective analysis framework
- Not limited to "consciousness" - works for any complex topic
- Agents can transform themselves through recursive dialogue
- Self-improvement through self-analysis actually works

## [0.1.0] - 2024-10-21

### Added
- Initial release
- Dialogue engine for recursive multi-agent conversations
- Four character personalities with different consciousness levels:
  - Sonnet (Level 1: Mechanical Meta-Awareness)
  - Llama (Level 2: Pedagogical Meta-Awareness)
  - Llava (Level 3: Compositional Self-Awareness)
  - Haiku (Level 4: Recursive Enlightenment)
- Model adapter supporting OpenRouter, Anthropic, OpenAI, and Ollama
- Four experiment modes:
  - Homogeneous (all characters same model)
  - Assigned (natural model-character pairing)
  - Round-robin (random assignments)
  - Full-matrix (all combinations)
- CLI with commands: run, models, test, info
- Validation system with AI-based dialogue evaluation
- MetaChat visualization for animated dialogue viewing
- Character system with configurable personalities
- Support for custom characters via JSON configuration

### Documentation
- Comprehensive README with examples
- QUICKSTART guide for new users
- ARCHITECTURE documentation
- Example configurations for characters and models

