# Publishing Guide 📦

This guide explains how to publish `consciousness-lab` to npm.

## What's Been Set Up

### ✅ Package Configuration

**package.json** now includes:
- ✅ `exports` field for modern Node.js module resolution
- ✅ `files` field to control what gets published
- ✅ `bin` field for CLI commands (`consciousness-lab` and `clab`)
- ✅ `publishConfig` for npm publishing settings
- ✅ `packageManager` set to bun
- ✅ `prepublishOnly` script (runs lint and tests before publishing)
- ✅ `prepare` script (ensures bin file is executable)
- ✅ Expanded keywords for better npm discoverability
- ✅ Repository, bugs, and homepage URLs

### ✅ Files Created

- **`.npmignore`** - Excludes dev files from npm package
- **`.env.example`** - Template for users to set up API keys
- **`CHANGELOG.md`** - Version history tracking
- **`bun.lockb`** - Bun lockfile (auto-generated)
- **`PUBLISHING.md`** - This guide

### ✅ Documentation Updated

All documentation now uses `bun` instead of `npm`:
- ✅ README.md
- ✅ QUICKSTART.md

### ✅ Binary Permissions

- ✅ `bin/cli.js` is now executable

---

## Pre-Publishing Checklist

Before publishing to npm, make sure:

### 1. Repository Setup

- [ ] Update repository URL in `package.json` if needed:
  ```json
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/consciousness-lab.git"
  }
  ```

- [ ] Push your code to GitHub:
  ```bash
  git add .
  git commit -m "Prepare for npm publishing"
  git push origin main
  ```

### 2. npm Account

- [ ] Create an npm account at https://www.npmjs.com/signup (if you don't have one)
- [ ] Verify your email address
- [ ] Login locally:
  ```bash
  npm login
  ```

### 3. Package Name Availability

- [ ] Check if the package name is available:
  ```bash
  npm search consciousness-lab
  ```

- [ ] If taken, update the name in `package.json`:
  ```json
  "name": "@your-username/consciousness-lab"
  ```

### 4. Test the Package Locally

- [ ] Test installing locally:
  ```bash
  # In the project directory
  npm pack
  
  # This creates a .tgz file. In another directory:
  npm install /path/to/consciousness-lab-0.1.0.tgz
  
  # Test the CLI
  clab --help
  ```

- [ ] Run tests and linting:
  ```bash
  bun run lint
  bun test
  ```

### 5. Version Management

- [ ] Update version in `package.json` following [Semantic Versioning](https://semver.org/):
  - `0.1.0` → `0.1.1` (patch - bug fixes)
  - `0.1.0` → `0.2.0` (minor - new features, backward compatible)
  - `0.1.0` → `1.0.0` (major - breaking changes)

- [ ] Update CHANGELOG.md with release notes

---

## Publishing to npm

### First-Time Publishing

```bash
# 1. Make sure you're logged in
npm whoami

# 2. Test build
bun run prepublishOnly

# 3. Publish (dry run first)
npm publish --dry-run

# 4. Review the output - make sure only necessary files are included

# 5. Publish for real
npm publish

# If using a scoped package (@username/package):
npm publish --access public
```

### Publishing Updates

```bash
# 1. Update version number
# Option A: Manual - edit package.json
# Option B: Use npm version command
npm version patch  # or 'minor' or 'major'

# 2. Update CHANGELOG.md with changes

# 3. Commit changes
git add .
git commit -m "chore: bump version to x.x.x"

# 4. Create a git tag
git tag v0.1.1
git push origin main --tags

# 5. Publish to npm
npm publish
```

---

## What Gets Published

The following files/directories will be included in the npm package:

```
consciousness-lab/
├── src/              # All source files
├── bin/              # CLI files
├── characters/       # Character definitions
├── models/           # Model configurations
├── validation/       # Validation system
├── visualization/    # HTML visualizations
├── config.json       # Default configuration
├── README.md
├── LICENSE
├── QUICKSTART.md
├── ARCHITECTURE.md
├── package.json
└── .env.example
```

**Excluded** (via .npmignore):
- `node_modules/`
- `.git/`, `.github/`
- Development config files (`.eslintrc`, `tsconfig.json`, etc.)
- Lock files (users will generate their own)
- Results and experiments
- Logs and temp files

---

## After Publishing

### 1. Test the Published Package

```bash
# Install from npm
npm install -g consciousness-lab

# Test CLI
clab --help
clab info
```

### 2. Update GitHub

- [ ] Create a GitHub release matching your npm version
- [ ] Add release notes from CHANGELOG.md
- [ ] Tag the release (e.g., `v0.1.0`)

### 3. Share

- [ ] Tweet/post about the release
- [ ] Update project homepage
- [ ] Share in relevant communities

---

## npm Scripts Reference

```bash
# Development
bun install           # Install dependencies
bun run dev          # Run in development mode
bun test             # Run tests
bun run lint         # Lint code
bun run typecheck    # Type checking

# Publishing
npm pack             # Create tarball (test)
npm publish --dry-run  # Test publishing
npm publish          # Publish to npm

# Version management
npm version patch    # Bump patch version
npm version minor    # Bump minor version
npm version major    # Bump major version
```

---

## Troubleshooting

### "Package name taken"

Change the name to a scoped package:
```json
"name": "@your-username/consciousness-lab"
```

Then publish with:
```bash
npm publish --access public
```

### "prepublishOnly script failed"

Fix linting or test errors before publishing:
```bash
bun run lint
bun test
```

### "Permission denied" when running CLI

The `prepare` script should fix this, but if needed:
```bash
chmod +x bin/cli.js
```

### "Module not found" after installing

Make sure `type: "module"` is in package.json (already set).

---

## Continuous Publishing (GitHub Actions)

For automated publishing, create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Then add `NPM_TOKEN` to your GitHub repository secrets.

---

## Version History

See [CHANGELOG.md](CHANGELOG.md) for full version history.

---

## Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [npm Package Naming](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#name)

---

**Ready to publish? Double-check the checklist above and run `npm publish`!** 🚀

