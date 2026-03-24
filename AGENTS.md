# AGENTS.md

## Purpose
This repo is a static React roadmap site for Brief Connect, exported from Figma Make.
Keep it client-only, simple to iterate on, and easy to deploy.

## Product Direction
- Build a horizontally scrollable roadmap timeline
- Plot releases against month / quarter milestones
- Open a release modal from each plotted marker
- Open a feature / PRD modal from the release modal
- Keep all data static and client-side
- Optimise for GitHub Pages-style hosting

## Rule Files
Checked on 2026-03-24:
- No `.cursor/rules/`
- No `.cursorrules`
- No `.github/copilot-instructions.md`

Use this file as the repository-specific agent guide.

## Stack
- Vite 6
- React 18
- `.ts` / `.tsx` source files
- Tailwind CSS v4 via `@tailwindcss/vite`
- Custom CSS in `src/styles/`
- `motion/react` for animation
- `react-markdown` + `remark-gfm` for markdown rendering
- Static roadmap content in `src/app/data/roadmap.ts`

## Current Tooling Reality
- No `tsconfig.json`
- No lint configuration
- No test framework
- No `dev`, `preview`, `lint`, `test`, or `typecheck` scripts
- No committed lockfile

Do not pretend unsupported tooling exists.

## Important Files
- `package.json`
- `vite.config.ts`
- `src/app/App.tsx`
- `src/app/components/Timeline.tsx`
- `src/app/components/ReleaseMarker.tsx`
- `src/app/components/ReleaseDetailModal.tsx`
- `src/app/components/FeaturePRDModal.tsx`
- `src/app/data/roadmap.ts`
- `src/styles/theme.css`
- `src/styles/prose.css`

## Commands
Run from `/home/isjeremy/code/bc-workspace/bc-roadmap`.

### Install
No lockfile is committed. `package.json` includes a `pnpm.overrides` block, but the repo is not otherwise pinned.

```bash
npm install
```

Alternative:

```bash
pnpm install
```

If a lockfile is added later, stick to that package manager.

### Build
Supported build command:

```bash
npm run build
```

This runs `vite build`.

### Dev Server
No script exists yet. Use Vite directly:

```bash
npx vite
```

or:

```bash
npm exec vite
```

### Preview
No script exists yet:

```bash
npx vite preview
```

### Lint
Not configured.
- `npm run lint` is unsupported
- Never report lint success unless lint tooling was added and run

### Typecheck
Not configured.
- No `tsconfig.json`
- No `npm run typecheck`
- `npm run build` is the closest available verification

### Tests
Not configured.
- No test files found
- No Vitest, Jest, Playwright, or Cypress config found
- `npm test` is unsupported

### Running A Single Test
Not possible right now because no test runner is set up.

If tests are introduced later, update this file with:
- full suite command
- single file command
- single test name command

Do not imply single-test support exists today.

## Architecture Notes
- Keep the app static and client-side unless explicitly asked otherwise
- Keep roadmap content in data files, not embedded deep in UI components
- Prefer local React state for modal and selection flows
- `roadmap.ts` is the source of truth for releases and feature PRDs
- `Timeline.tsx` derives marker positions from `Date` values
- Modal transitions use `motion/react`

## Code Style

### General
- Make surgical changes only
- Prefer straightforward React code over abstraction-heavy patterns
- Avoid refactoring generated UI primitives unless necessary
- Use guard clauses and direct control flow
- Keep changes directly tied to the task

### Imports
- Order imports as external, local, then assets
- Use `import type` for type-only imports when following local file style
- The repo supports `@` -> `src`, but most app code uses relative imports; match nearby code
- Do not mass-rewrite imports for style reasons only

### Formatting
- Formatting is mixed across the export
- Many product files use double quotes and semicolons
- Some generated files use single quotes and omit semicolons
- Match the existing style of the file you edit
- Do not perform repo-wide formatting passes

### Types
- Prefer explicit props interfaces or local type aliases
- Keep shared domain types near the data model
- Avoid `any`
- Use nullable unions like `Feature | null` when appropriate

### Naming
- Components: `PascalCase`
- Props types: `ThingProps`
- Functions and variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- App component files: `PascalCase.tsx`
- Generated UI primitive files: keep existing kebab-case naming

### React
- Use function components
- Keep state close to where it is used
- Derive state instead of duplicating it when practical
- Use `useEffect` only for real side effects
- Prefer callback props over unnecessary context

### Styling
- Prefer Tailwind utilities for component styling
- Use `src/styles/theme.css` for shared tokens and base styling
- Use `src/styles/prose.css` for markdown rendering styles
- Preserve the current visual language: white surfaces, blue accents, gradients, subtle motion
- Preserve readability on desktop and mobile

### Content
- Keep markdown in `roadmap.ts` readable and structured
- Preserve headings and bullet lists in release and feature content
- Keep dates explicit and easy to scan

### Error Handling
- Prefer early returns for UI flows
- Throw explicit errors only for real invariant violations
- Avoid leaving debug logging behind
- Prefer clear null checks over defensive overengineering

### Assets And Content
- Keep `figma:asset/...` imports unless intentionally replacing exported assets
- Keep roadmap copy editable in data files rather than hardcoding long content in components

### Accessibility
- Use semantic buttons for clickable UI
- Keep image `alt` text meaningful
- Preserve focus states and obvious modal actions

## Agent Working Rules
- Inspect nearby files before editing to match local conventions
- Prefer product-specific files in `src/app/` over generated primitives in `src/app/components/ui/`
- If you add tooling, add scripts and update this file in the same change
- After meaningful code changes, run `npm run build`
- Be explicit about what could not be verified because linting, tests, and typechecking are absent

## Default Verification
Best available verification today:

```bash
npm run build
```
