# React Studio and Branding Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans in this session. The user authorized implementation and delegated remaining design decisions. Track progress in the shared ledger, not a separate agent ledger.

**Goal:** Migrate the working app shell and Lesson Studio to React + TypeScript + Vite and deliver the green-and-paper brand system.

**Architecture:** React owns navigation, authentication, gallery, lesson authoring/review and lesson playback. Existing pure lesson/physics modules remain the calculation source; legacy physics and quantum workspaces use lifecycle adapters with scoped DOM ownership. The existing Node API and cloud Redis/auth boundaries remain unchanged.

**Tech Stack:** Node 22, npm, React, TypeScript, Vite, existing node:test suite and Playwright browser checks.

**Spec:** `docs/superpowers/specs/2026-10-27-green-paper-branding-design.md`, as amended by the user's React/Vite approval and delegated judgment.

## Global Constraints

- Keep EN/ZH behavior, public gallery, explicit provider calls, quotas, review gates and provenance.
- Keep credentials and image bytes out of build output, logs and documentation.
- Local and Vercel builds must serve the same branded frontend and correct asset MIME types.
- Preserve existing math/physics contracts; migrate DOM ownership without rewriting calculations.
- Preserve pre-existing untracked files and grounding edits. No commit, push or deployment is included.
- Work on `codex/react-studio-branding`, based on `ba4da7a`.

## Review Focus

- Pending provider/image responses after language change, logout or unmount must not restore stale private state.
- Public gallery and malformed/unknown deep links must remain usable without provider calls.
- Review approval must reset after text/definition edits and imports; invalid edits must not replace a valid draft.
- Animation, event listeners and provider-console polling must stop across navigation, visibility and remounts.
- Vite asset routing/proxying must preserve same-origin login checks and block arbitrary repository files.

## Task 1: Frontend build and serving

**Files:** `package.json`, lockfile, `vite.config.ts`, `tsconfig.json`, `index.html`, `scripts/dev.mjs`, `scripts/build-vercel.mjs`, `src/static.mjs`, `src/server.mjs`, `test/static.test.mjs`.

**Interfaces:** static frontend serving returns a handled boolean for approved built paths; `/api/*` remains in the existing handler. Vite middleware shares the local Node HTTP server with API requests, preserving the browser-origin contract without a second proxy.

- [x] Add HTTP tests for missing/traversal assets and branded icon delivery; observe missing-feature failures.
- [x] Install compatible pinned React/Vite/TypeScript tooling under Node 22 and record versions.
- [x] Add Vite build, development launcher and safe built asset serving; keep legacy module URLs available for existing tests.
- [x] Verify focused HTTP tests, typecheck/build and lockfile audit. Do not auto-fix unrelated dependencies.

## Task 2: React shell, authentication and gallery

**Files:** `frontend/App.tsx`, `frontend/main.tsx`, `frontend/lib/{types,api,shared}.ts`, `frontend/components/{Brand,Gallery,AccessPanel}.tsx`, `e2e/app.spec.ts`, `playwright.config.ts`.

**Interfaces:** typed auth state supplies `authenticated`, target models, quota/access metadata and a `post` function; routes preserve `#studio`, `#physics`, `#quantum`, `#lesson:<id>` and invite fragments.

- [x] Add browser checks for public lesson opening/completion, EN/ZH state preservation, keyboard navigation and invite/login/logout behavior.
- [x] Implement React-owned header, public gallery, authentication and hash navigation with stale-request guards.
- [x] Run browser checks against the production build, keeping model calls behind deterministic server fixtures.

## Task 3: Studio and learning workspaces

**Files:** `frontend/components/{Studio,DraftReview,LessonPlayer,ExperimentView,ProviderConsole,LegacyLabs}.tsx`, `frontend/lib/image.ts`, `public/physics-controller.mjs`, `frontend/legacy/physics.html`, relevant browser tests.

**Interfaces:** React Studio uses `validateLesson` and `createLessonPlayer`; adapter workspaces expose `set`, `stop`, `destroy` and receive shared language/auth/model settings without touching React-owned DOM.

- [x] Add browser checks for create/revise/import/review/export, invalid definitions, pending-response invalidation and animation/navigation cleanup.
- [x] Implement typed controlled authoring/review, image processing and lesson playback around the existing engine.
- [x] Extract physics controller into a scoped mount with cleanup; adapt quantum and provider console without duplicating the backend.
- [x] Verify model/process/quantum/vehicle lessons, disabled actions, request budgets and lost-session recovery.

## Task 4: Branding, polish and final verification

**Files:** `public/brand/*`, public favicon/touch/share assets, `frontend/styles.css`, `index.html`, docs and shared ledger.

- [x] Create the SVG identity and derived icon/share assets; use one consistent green/paper system.
- [x] Polish responsive hierarchy, controls, typography, galleries, image attachment and player states. Keep useful actions visible and diagnostics secondary.
- [x] Run Node 22 tests, typecheck, production build, browser suite and package audit; inspect desktop/mobile EN/ZH screenshots and keyboard/reduced-motion behavior.
- [x] Request one fresh-context review of the complete diff, address material findings and rerun affected checks.
- [x] Update the shared ledger and README with actual commands, evidence and migration boundaries. Leave changes locally reviewable.

## Rulings

- User's “Proceed and use judgment” authorizes implementation without further plan/design approval. The green-and-paper direction stays selected.
- Use the shared ledger instead of the skill's separate scratch ledger to honor repository instructions.
- Use one feature branch in the existing shared checkout; no other active file claims were recorded. Recheck HEAD before edits and completion.
- Backend/core unit tests remain; new browser tests cover the React UI instead of relying on the old custom-DOM fixtures alone.

## Completion

Completed locally October 28 Pacific. Validation: 245 Node tests, 18 Chromium
browser tests, clean lockfile install, typecheck/build and zero audit findings.
Independent review findings were reproduced and fixed. See
[verification](../../react-ui-verification.md) and the
[shared ledger](../../implementation/progress-ledger.md). No commit/push/deploy.
