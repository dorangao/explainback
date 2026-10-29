# ExplainBack shared progress ledger

Common engineering handoff for **Codex and Claude**. Updated **October 28, 2026,
Pacific**. Start here, then inspect the actual checkout. The work table is the
current index; dated entries and linked evidence retain the history.

## Current baseline

- **Product:** a question or image becomes a bilingual, reviewable interactive
  lesson. The learner predicts, operates, explains and transfers. Six reviewed
  gallery lessons (one drafted from a sketch) play without signing in or making
  model requests.
- **Grounding source:** `main` at `ba4da7a5182df30b399baad37a03494e4565ccf9`, merging
  PR #7. The locally stored `origin/main` matches; no remote refresh was performed
  in this grounding pass.
- **Recent additions:** reviewer codes with quotas, local open-access mode,
  Muse Wonder alongside Spark, image input and model-comparison/judge evaluation.
- **Production release tracking:** [PR #8 release verification](https://github.com/dorangao/explainback/pull/8)
  records the final merge, deployment and live checks. Before this release, the
  Vercel CLI verified production at `ba4da7a`, READY/PROMOTED with
  `explainback.app` assigned. Older release records remain in
  [the deployment notes](../vercel-deployment.md).
- **Release branch:** `codex/react-studio-branding`; migration and branding
  implementation committed/pushed as `8bdc8ff` in [PR #8](https://github.com/dorangao/explainback/pull/8).
  The PR release-verification section records the final merged/deployed state.
- **Fresh local checks:** Node **22.23.1**, **245/245 tests**, TypeScript and build
  pass; **18/18 Chromium workflows passed** after independent review fixes. See [migration verification](../react-ui-verification.md).
- **Pre-existing untracked work:** `.agents/`, `.claude/`, `skills-lock.json`.
  Left untouched and excluded from the release commits. Shared handoff documents
  are included in PR #8.
- **Current work:** the approved green-and-paper React migration is implemented
  and validated. The user authorized commit/push/PR/merge/deployment; REL-001
  links the live release record instead of inferring those external states.


## Work table

| ID | Owner | State | Scope / files | Next action |
|---|---|---|---|---|
| GROUND-001 | Codex | Complete locally; uncommitted | `AGENTS.md`, `CLAUDE.md`, this ledger, README and readiness/deployment notes | Both agents use this handoff on their next task. |
| UI-001 | Codex | Committed and pushed in `8bdc8ff`; release tracked by REL-001 | Base `ba4da7a`, branch `codex/react-studio-branding`; claim: `frontend/`, `e2e/`, package/build configs, static serving, physics adapter, brand assets, relevant tests and docs. | Ready for user review; commit/push/deployment remain separate next actions. |
| REL-001 | Codex | Release evidence in PR #8; file claim released | Base `ba4da7a`, `codex/react-studio-branding`; claims `vercel.json`, `.vercelignore`, `.github/workflows/`, suction fallback regression, release evidence and this ledger; committing the validated UI-001 files. | [PR #8](https://github.com/dorangao/explainback/pull/8) carries the final merge SHA, production deployment and live validation evidence; read its release verification section. |
| REVIEW-001 | Claude | Assessment complete; no product code changed | Base `b7f82df` (`main` after PR #8), checkout on `codex/react-studio-branding`; read-only review of `frontend/`, `src/static.mjs`, build/CI config, tests; this ledger only | User chooses which findings to schedule; see the dated entry. |
| CLEAN-001 | Claude | Merged as `92723db`; deployed to production | Base `b7f82df`, branch `feat/post-migration-cleanup`; claims `frontend/**`, `public/*.d.mts`, removed legacy shell files, `src/server.mjs` (asset map, reply metrics), `test/**`, lint/format/Vitest config, CI workflow, README, LICENSE, Studio docs | User reviews and merges the PR; deploy afterwards. Labs port left `react/refs` and `react/immutability` as warnings under `frontend/components/labs/**` (follow-up: idiomatic React state for the ported controllers). |
| PROMPT-001 | Claude | Merged as `44434ef`; deployed to production | Base `4f861c0`, branch `feat/author-prompt-v2`; `src/lesson-author.mjs` (author-v2), `src/eval/studio.mjs` (samples, rejection reasons), `scripts/eval-studio.mjs`, `public/lesson-schema.mjs` and `demo-model.mjs` (field-naming validator messages), evaluation docs | User reviews the before/after in `docs/studio-evaluation.md` and merges; deploy afterwards. |
| GALLERY-002 | Claude | Merged as `118cd69`; deployed to production | Base `775b897`, branch `feat/sketch-gallery-and-restore`; `public/gallery-lessons.mjs`, `public/gallery/pendulum-sketch.png`, `src/static.mjs`, `scripts/build-vercel.mjs`, `frontend/components/{Gallery,Studio,RevisionSummary}.tsx`, types, styles, tests, README and Studio docs | Done; release recorded in `docs/vercel-deployment.md`. |
| EXPLAIN-001 | Claude | Merged as `88d082c`; deployed to production | Base `118cd69`, branch `feat/explain-back`; `src/lesson-author.mjs` (graded guide contract), `src/server.mjs`, `frontend/components/{LessonPlayer,Studio}.tsx`, `frontend/lib/{types,messages}.ts`, styles, tests, README and Studio docs | Done; release recorded in `docs/vercel-deployment.md`. |
| ROLES-001 | Claude | Merged as `bc9f1d2`; deployed to production | Base `00dc995`, branch `feat/creator-tester-roles`; `src/lesson-tester.mjs` (new), `src/server.mjs` (roles, `/api/studio/tryout`), `frontend/components/{Studio,DraftReview,RequestSummary,RevisionSummary}.tsx`, types, messages, styles, tests, README and Studio docs | Done; release recorded in `docs/vercel-deployment.md`. |


Before working, read the latest table and actual Git state, claim a bounded file
scope and record its base commit. Release the claim when done or waiting. This
table is coordination guidance, not an automatic file lock. Append evidence at
handoff; do not overwrite another agent's entry or silently move its status.

## Repository map

| Surface | Main files | Working contract |
|---|---|---|
| Page shell and localization | `index.html`, `frontend/App.tsx`, `frontend/styles.css` | React/TypeScript shell, navigation, language and auth state. Original public shell remains historical compatibility source. |
| Lesson Studio and gallery | `frontend/components/`, `public/gallery-lessons.mjs`, `lesson-player.mjs`, `studio-showcase.mjs` | React authoring/review/player over shared schema and calculation engines; public local playback and explicit review gates. |
| Generated lessons | `public/lesson-schema.mjs`, `demo-model.mjs`, `generated-demo.mjs`, `src/lesson-author.mjs` | Bounded formula/process contract, not arbitrary generated browser code; numeric checks do not validate scientific assumptions. |
| Physics / quantum | `public/*view.mjs`, `motion.mjs`, `flight.mjs`, `suction.mjs`, `quantum.mjs`; `src/*evidence.mjs` | Existing curated renderers and computed evidence remain supporting examples. |
| HTTP / auth / storage | `src/server.mjs`, `tester-auth.mjs`, `access-codes.mjs`, `state.mjs`, `redis-state.mjs` | Local in-memory state; hosted Redis; scoped sessions, access quotas and explicit request boundaries. |
| Model access | `src/meta.mjs`, `src/llm/`, `src/cloud.mjs`, `api/index.js` | Hosted Meta; optional local Ollama. Cloud explicitly disables local open-access mode. |
| Evaluation | `src/eval/`, `eval/`, `scripts/eval-studio.mjs`, `test/` | Frozen fixtures, contract checks and separate rubric judgments. Human content review remains distinct. |
| Delivery | `vite.config.ts`, `scripts/dev.mjs`, `scripts/build-vercel.mjs`, `src/static.mjs`, `vercel.json` | Vite builds into `dist`; explicit brand asset copying/serving; same-origin `/api/*` remains on Node. |

## Reconciled progress history

Dates below are Git commit dates in Pacific, not proof of when every feature was
created. The readiness tracker records the user's correction: only API setup
preceded October 26; application work began October 26. Event eligibility and
demo timestamps are not established by this engineering ledger.

| Date | Commit(s) | Recorded progress | Attribution / evidence |
|---|---|---|---|
| Oct 26 | `da3ca89` | Initial bilingual claim-testing lab | Git history and earlier verification documents; agent not identified by commit trailer. |
| Oct 27 | `3786b28`, `7f31bf5` | Multi-provider evaluation and tester access, merged as PR #1 | Git history; [tester checks](../tester-access-verification.md). |
| Oct 27 | `b49d7f3`, `aa69769` | Bilingual lesson authoring and interactive labs, PR #2 | [Studio scope](../lesson-studio.md), Git history. |
| Oct 27 | `0297d12`, `70d2720`, `3f947d5` | Powered flight, structured output, Studio-first flow and frozen evaluation | [Demo](../studio-demo.md), [evaluation](../studio-evaluation.md), [release notes](../vercel-deployment.md). |
| Oct 27 | `311b50b`, `5745bbc` | Public lesson gallery and guided-demo end-state fix, PRs #3–4 | Claude co-author trailers; `test/gallery.test.mjs`, `test/demo-runner.test.mjs`. |
| Oct 27 | `318746b`, `5a9415c` | Reviewer access codes and per-code quota, PR #5 | Claude co-author trailer; [release record](../vercel-deployment.md#gallery-and-reviewer-code-production-release--october-28-2026). |
| Oct 27 | `12d4f04`, `6bf8eb0` | Local open-access mode, PR #6 | Claude co-author trailer; `test/open-access.test.mjs`, cloud boundary tests. |
| Oct 27 | `08e5591`, `ba4da7a` | Wonder, image input and comparison evaluation, PR #7 | Claude co-author trailer; image/structured-output/provider/judge tests. |
| Oct 27 | `59a725a` | Documentation of the Wonder production release | Claude co-author trailer; feature-branch-only documentation commit at grounding time; record restored here without cherry-picking. |

Some historical release headings say October 28 while their commits are October
27 Pacific. Those headings are preserved as written. New entries use explicit
Pacific dates to avoid further ambiguity; the original headings alone do not
establish the release's precise local time.

## Initial UI and branding assessment

The issues below were recorded during grounding and addressed by UI-001. They
remain as the initial assessment, not a description of the current implementation.
The EN/ZH workflow, review gates, provenance and auth boundaries remain required.

| Priority / ID | Observed issue | Intended outcome and validation |
|---|---|---|
| P1 / UI-001A | `public/index.html` has a text wordmark and no favicon/touch icon; no brand assets are present. | One recognizable mark used in the header, browser icon and touch icon; inspect it at small sizes and in light/dark browser chrome. |
| P1 / UI-001B | Build copies only `.mjs`, `.css`, `.html`; local server uses an explicit asset map. | Serve and package approved SVG/PNG/ICO assets with correct MIME types. Check actual local HTTP responses and `dist` output. |
| P2 / UI-001C | Title is generic; description, theme color and social-card metadata are absent. | Consistent product name and concise learning proposition, with a share image. Verify metadata and asset URLs without changing the existing noindex policy implicitly. |
| P2 / UI-001D | Signed-out copy says tester sign-in is required even though the gallery is public. The shell, Studio and authoring walkthrough compete for attention. | Make opening a reviewed lesson and creating one easy to distinguish; retain access-code entry. Verify first visit, signed-in state and gallery deep links in both languages. |
| P2 / UI-001E | Shared tokens coexist with many hard-coded colors, type sizes and component treatments. Gallery cards are text-heavy in the checked-in screenshot. | Consistent spacing, typography and controls; clearer gallery scanning. Inspect desktop/mobile and keyboard focus in EN/ZH, plus image attachment and lesson player states. |

Selected direction: refine the green-and-paper learning studio with a distinct
ExplainBack mark and clearer hierarchy. User selected this option on October 27
Pacific. Alternatives considered: a brighter science playground or a monochrome
editorial style. Detailed design approval remains separate from direction selection.

## Validation and remaining boundaries

- **Correctness:** 244 local tests passed at `ba4da7a`; HTTP tests use local
  fixtures. No new paid model evaluation or hosted interaction was run.
- **Delivery:** the public build passed. Brand-image support is missing by source
  inspection; UI-001B must cover local and hosted asset paths together.
- **Security/reliability:** session, auth, access-code and provider tests passed.
  This grounding is not a fresh security audit or a check of live Redis state.
- **Accessibility/usability:** source and the checked-in gallery screenshot were
  reviewed. Fresh browser, keyboard, narrow-screen and contrast checks belong to
  the UI pass; no WCAG conformance claim is made.
- **Maintainability:** shared instructions and this ledger now provide the common
  entry point. Historical verification documents remain evidence, not competing
  current work queues.
- **Submission:** independent content review, tester observation, video,
  contribution eligibility and submission remain tracked in
  [hackathon readiness](../hackathon-readiness.md). This ledger does not complete
  those gates or send anything to organizers.

## Dated entries

### 2026-10-27 Pacific — GROUND-001 — Codex

**Request:** reconcile work by Codex and Claude, share one progress ledger, and
prepare the next UI/branding/favicon phase.

**Base:** started on `feat/wonder-eval-image` at `59a725a`; observed the shared
checkout change to `main` at `ba4da7a` during read-only review. Rechecked the new
state before editing. No branch switch, reset or cherry-pick performed by this task.

**Changes:** added shared `AGENTS.md` and `CLAUDE.md` entry points and this ledger;
linked it from README and the readiness tracker; restored the omitted release
note from `59a725a` with its provenance. Recorded current architecture, recent
commit history, UI gaps and the proposed next scope. Product code is unchanged.

**Verification:** `/Users/dorangao/.nvm/versions/node/v22.23.1/bin/node --test`
passed **244/244**, zero failures/skips. Initial sandbox run could not bind
localhost (`listen EPERM`); rerun with approved loopback access passed.
`node scripts/build-vercel.mjs` under the same Node 22 binary passed.
Test output: `/tmp/explainback-grounding-tests.log` (local, temporary evidence).

**State:** documentation complete locally, uncommitted; no push, merge or
deployment performed. UI implementation awaits the branding direction. No active
file claim remains while waiting. Next agent should read this record and recheck
Git before starting UI-001.

### 2026-10-27 Pacific — UI-001 design — Codex

**Direction selected by user:** refine the existing green-and-paper learning
studio. This selects the visual direction; it does not record approval of the
new design document.

**Base:** `main` at `ba4da7a`; existing grounding edits and pre-existing untracked
files preserved. Owned scope for this step was the shared ledger and
`docs/superpowers/specs/2026-10-27-green-paper-branding-design.md`.

**Changes:** wrote the proposed identity, icon/share assets, bilingual screen
composition, responsive behavior, delivery constraints and acceptance checks.
The proposal retains the plain-JavaScript app and existing learning boundaries.

**Verification:** reviewed against current source and the grounded asset pipeline;
`git diff --check` passed. No runtime changes or new runtime checks in this step.
The 244-test result above remains the previous baseline check.

**State:** local design ready for user approval; uncommitted. File claim released
while waiting. After approval, write the implementation plan and begin UI-001.

### 2026-10-27 Pacific — UI-001 framework discussion — Codex

**User question:** whether to move from plain JavaScript to a framework before
the UI pass. The green-and-paper branding direction remains selected.

**Grounding:** the backend already runs on Node 22. The browser uses ES modules
and manual DOM/state updates (`public/app.mjs`, `public/lesson-studio.mjs`).
Pure lesson/model modules can be retained. Some UI tests use custom DOM doubles
and would need adaptation during a component migration.

**Recommendation, not yet selected:** incrementally adopt React + TypeScript
with Vite for the frontend while retaining the current Node API, auth/Redis
boundaries and simulation modules. Next.js becomes more compelling if public
indexable lesson pages and server-rendered routes become near-term requirements.
Brand assets alone do not require a framework. React's
[existing-project guidance](https://react.dev/learn/add-react-to-an-existing-project)
supports incremental adoption; Vite is a build tool, not a backend framework.

**State:** no packages installed, no product files changed, no migration
authorized by this question alone. The design's plain-JavaScript assumption is
now under review. No new tests run for this discussion.

### 2026-10-27 Pacific — UI-001 implementation started — Codex

**Authorization:** user accepted React + TypeScript + Vite and said to proceed
and use judgment for improvements after migration. Further routine design and
implementation choices are delegated.

**Plan:** `docs/superpowers/plans/2026-10-27-react-studio-branding.md`.
**Ruling:** use the existing shared ledger and a feature branch in this checkout;
no competing active file claims were recorded. Preserve all pre-existing files.
**Baseline:** Node 22.23.1, `ba4da7a`, previous 244-test baseline.
**Current task:** build/serving foundation and React UI contracts.

### 2026-10-28 Pacific — UI-001 implementation and review checkpoint — Codex

**Base:** `codex/react-studio-branding`, HEAD `ba4da7a` unchanged. Existing
untracked agent skills/configuration preserved. Same frontend/static/assets/tests
file claim remains active. Work crossed the Pacific date boundary; October 27
entries above retain their original dates.

**Changes:** implemented React + TypeScript + Vite shell/auth/gallery/Studio/review/
player, retained scientific engines, lazy scoped physics/quantum adapters,
green-paper hierarchy, responsive controls, SVG identity, favicon/touch/share
assets and metadata. Local dev uses one HTTP server with Vite middleware, avoiding
an extra proxy-origin contract. Build copies only approved brand files.

**Verification:** Node 22.23.1: 245/245 Node tests, typecheck and build passed;
10 Chromium workflows passed; npm audit reported zero vulnerabilities. Reviewed
EN/ZH layouts at 320/390/768/1440 CSS px and four captured screens. Local asset
MIME checks and secret-file denial passed. Detailed evidence and boundaries:
[React UI verification](../react-ui-verification.md).

**Review:** fresh whole-diff reviewer running. Reproduced browser-Back route exit
and late manual-physics response after language change; regressions/fixes next.
Earlier parameter-focus reset and invite-from-gallery defects were corrected
and covered. No claim of live provider, production or native Safari validation.

**State:** local only; not committed, pushed, merged or deployed. Claim remains
active through final regression pass and handoff.

### 2026-10-28 Pacific — UI-001 complete locally — Codex

**Base/final Git state:** `codex/react-studio-branding`, HEAD remains
`ba4da7a5182df30b399baad37a03494e4565ccf9`. All implementation and grounding edits
remain uncommitted. `.agents/`, `.claude/` and `skills-lock.json` were not changed.

**Changes:** completed the React/TypeScript/Vite migration and responsive
paper-green identity, including SVG mark, 16/32/48 ICO, 180px touch icon and
1200×630 share card. Public gallery and authored drafts now use separate state;
Explore/Create and browser history preserve author work. Pending physics replies
are invalidated on language changes; polling, animation and observer cleanup
follow workspace/document visibility and unmounting. Node API, hosted auth/Redis
and scientific engines remain in place. Labs load on demand.

**Final review:** one fresh reviewer found four material issues; six targeted
regressions failed before the fixes and passed after. Draft retention, route
synchronization, stale manual replies and background diagnostics were fixed.
The ResizeObserver finding was treated as part of lifecycle correctness because
repeated mounts retained detached lab trees; the logout regression now observes
zero active observers. No findings deferred. A further animation regression was
observed red then green; expired-access cleanup is also covered.

**Verification:** Node 22.23.1 clean `npm ci --ignore-scripts`; **245/245** Node
tests; **18/18** Chromium browser tests; typecheck and production build passed;
zero npm audit findings. Correct dev/production brand MIME types and asset
sizes; no horizontal overflow in EN/ZH at 320/390/768/1440px; desktop/mobile
screens inspected. `git diff --check` passed. Evidence and exact boundaries:
[React UI verification](../react-ui-verification.md).

**State:** implementation/tests complete locally. **Not committed, pushed, merged
or deployed.** Live provider behavior, native Safari/iPhone and teaching readiness
were not established by this work. Existing production notes remain historical.
**Next:** user review, then an explicitly requested commit/PR/deployment step.
File claim released; next agent must reread this ledger and the current Git state.

### 2026-10-28 Pacific — REL-001 authorized release started — Codex

User explicitly requested Vercel configuration updates, commit, push, PR creation,
merge, deployment and validation. Base remains `ba4da7a` on
`codex/react-studio-branding`. The UI-001 file set is the release scope; unrelated
`.agents/`, `.claude/` and `skills-lock.json` remain excluded. Live GitHub main was
checked and still matches this base. Fresh local fetch and Vercel inspection are
in progress. The Vercel connector returned 403; use the same project's CLI
credentials as the documented fallback. No credentials are copied into evidence.

### 2026-10-28 Pacific — REL-001 release preparation — Codex

Vercel CLI confirmed project `explainback` in the existing team, Node 22.x,
GitHub `dorangao/explainback`, production branch `main`, automatic domain
assignment enabled. Existing production `dpl_64cXvoVsMsB4AENtDkSpwkqgtSa1` is
READY/PROMOTED at `ba4da7a`, with `explainback.app` assigned. This supersedes the
older deployed-commit inference in the initial grounding summary.

Expanded the deployment allowlist to include `frontend/` and the Vite/TypeScript
entry/config files. Changed Vercel preset to Vite, install to
`npm ci --ignore-scripts`, and build to
typecheck followed by the explicit Vite/brand build. Kept API rewrite, region,
Node 22 engine and security/noindex headers. Added a Node 22 GitHub Actions job
for unit, build and synthetic Chromium checks before merging.

A fresh suite exposed a pre-existing suction fallback bug: floating-point clock
subtraction could yield progress `0.9999999999999999` and never resolve in a
background tab. A fixed clock reproduced the cancelled test; the fallback now
advances directly to the final state. Focused regression passes. Full final
validation follows before staging. This is a release-blocking correction within
the animation/lifecycle scope, not a new feature.

### 2026-10-28 Pacific — REL-001 committed, pushed and preview ready — Codex

**Implementation commit:** `8bdc8ff510d9e72ef2a04cddd765545217168cd3`, pushed to
`origin/codex/react-studio-branding`. **Pull request:**
[#8](https://github.com/dorangao/explainback/pull/8).

**Fresh checks:** Node 22.23.1, 245/245 Node tests, 18/18 browser tests,
typecheck and production build passed after the suction fallback correction.
A bounded value scan of all 59 staged files and 10 build files found no configured
secret values. The broad project scan was stopped while waiting on an older
ignored screenshot; no claim is made that it completed. Unrelated agent folders
and `skills-lock.json` remain outside the commit.

**Observed preview:** `dpl_6k23sF64S3LHujyJonF8hTr5F8sv`, READY, commit `8bdc8ff`,
[preview URL](https://explainback-r0xwtjxxy-doran-gaos-projects.vercel.app).
GitHub's Vercel status succeeded; the Node 22 CI job was running at this
checkpoint. Merge and production deployment are separate from this preview.

**Release evidence handoff:** the PR description's **Release verification**
section is the durable post-merge record for this task. It is updated only after
the merge SHA, production deployment/alias and live checks are observed. Read it
for the final state; this entry intentionally records only this pre-merge
checkpoint. This keeps the shared ledger linked to actual release evidence
without a documentation-only release loop. File claim released after committing
this evidence pointer; no other agent's files were changed.

### 2026-10-28 Pacific — REL-001 Linux CI correction — Codex

The PR's new Linux check surfaced an existing oversized-upload stream issue in
`test/lesson-http.test.mjs`. The cancelled check was waiting for HTTP completion/fixture cleanup after a
413. An early throw from Node's default async iterator can destroy its stream;
the byte-limit path and fixture cleanup were reviewed together. A new chunked
upload regression exercises an unfinished oversized request; it passed locally
on both versions, so it is not claimed as a local reproduction of the Linux
cancellation. `readJSON` now uses
`iterator({destroyOnReturn:false})`, drains excess bytes without buffering them,
and returns the same bounded 413 error. The HTTP fixture consumes the final
413 body and explicitly closes its own connections at teardown, avoiding a
platform-dependent keep-alive/upload race. Parsed Vercel request bodies keep their
existing byte limit. No provider call is made for oversized input.

The CI runner is pinned to Ubuntu 24.04; checkout/setup-node v5 use Node 24 for
the Actions runtime, while application checks still run on Node 22. The v5
runtime declarations were checked in the official action manifests. The PR must
pass these checks before merge; its release section remains the final evidence
pointer. Owned correction scope: server body reader, HTTP regression, workflow
and this ledger; unrelated files remain excluded.

### Entry template

```text
YYYY-MM-DD Pacific — TASK-ID — Codex / Claude
Base: branch, exact HEAD, relevant dirty files and owned scope.
Changes: concrete behavior/files and decisions; separate proposals from approvals.
Verification: command or workflow, runtime, result, evidence path and limitations.
State: local / committed SHA / pushed / merged SHA / deployed SHA, each separately.
Next: remaining work, blocker, owner and whether the file claim is released.
```

### 2026-10-28 Pacific — REVIEW-001 — Claude

**Request:** after the React + TypeScript + Vite migration (PR #8), check what
can be improved further.

**Base:** `main` at `b7f82df`; checkout found on `codex/react-studio-branding`
at `14e918b` with a clean tracked tree. No branch switch, no product edits.

**Fresh checks (Node 22.23.1):** `npm run typecheck` passed; `npm test` 246/246;
`npm run build` emitted `index-*.js` 350 KB (118 KB gzip), `LegacyLabs-*.js`
188 KB (68 KB gzip), CSS 69 KB. explainback.app serves the React build with no
console errors. One earlier background `npm run typecheck` exited 1 with no
output and passed on rerun; not reproduced, noted because the Vercel build
command depends on it (TypeScript 7.0.2 native compiler).

**Findings, in priority order (assessment, not a work claim):**

1. Physics and quantum still run as imperative DOM code mounted through
   `LegacyLabs` (`frontend/legacy/physics.html` 557 lines + `public/physics-controller.mjs`
   601 lines + the old view modules). Two UI stacks and two styling systems
   remain; the lazy chunk is mostly this code. Port the guided demo to React
   components, or decide explicitly that the labs stay legacy.
2. Dead code retained: `public/app.mjs`, `public/lesson-studio.mjs`,
   `public/index.html`, `public/style.css`, and the old `/assets/*.mjs` map in
   `src/server.mjs`. `test/lesson-view.test.mjs` and the UI half of
   `test/gallery.test.mjs` exercise the dead Studio module. Remove them and
   replace with component tests; there are no React unit tests, only 18
   Chromium workflows and engine tests.
3. The TypeScript boundary is hand-written: `frontend/lib/types.ts` duplicates
   the lesson schema and `lib/shared.ts` uses `as unknown as` casts. Convert
   `lesson-schema.mjs`/`demo-model.mjs` to TypeScript or generate types from
   `demoSchema`, then enable `checkJs` for the engines incrementally.
4. `Studio.tsx` is 911 lines with 31 hook calls and at least one effect with
   an incomplete dependency list (`[starter, authenticated]`). Split into
   hooks (provider session, compose/revise, image attachment) and add ESLint
   with `react-hooks` rules; no linter or formatter is configured.
5. Muse's contribution is still not visible: a revision replaces the draft
   with no before/after view. A "what changed" diff after revise, and a
   compact request summary (elapsed time, tokens) outside the developer
   console, remain the highest-value judge-facing feature.
6. Repository hygiene: no `LICENSE`; GitHub homepage still points at
   `explainback-delta.vercel.app`; description empty. CI now exists.
7. Smaller: split the authoring bundle from the public gallery path so
   signed-out visitors load less; move ~110 inline `say()` string pairs into
   a message table so a native speaker can review the Chinese in one place.

**State:** findings only; nothing committed. Next action is the user's choice.

### 2026-10-28 Pacific — CLEAN-001 — Claude

**Request:** apply fixes for all seven REVIEW-001 findings on a new branch.

**Base/branch:** `main` at `b7f82df`; work on `feat/post-migration-cleanup`.
The physics/quantum port was done by a delegated agent in a worktree
(`worktree-agent-a09d810a860cc1fde`, commit `3d748b5`) and merged with one
resolved conflict in `ProviderConsole.tsx`.

**Changes by finding:**

1. Labs: `frontend/components/labs/` (Labs, PhysicsLab, QuantumLab, GuidedDemo,
   MotionSettings, Workspace, ClaimWorkbench, mounted wrappers, a typed store that
   ports the controller 1:1, copy tables) replace `LegacyLabs.tsx`,
   `frontend/legacy/physics.html`, `public/physics-controller.mjs` and
   `public/quantum-view.mjs`. Pure engines unchanged. Known differences recorded
   by the port: journey/suction views remount when moved between demo host and
   workspace (scrub resets), console polling at 1000 ms, quantum coach timeout
   defaults to 30 s when a target has none, stale claim-decision items no longer
   kept hidden. Not driven manually: calculus graph reveal, acceleration graph
   and metric select, quantum coach exhaustion UI (all straight ports; covered by
   typecheck/build and the existing Playwright flows where present).
2. Dead code: removed `public/app.mjs`, `lesson-studio.mjs`, `demo-review.mjs`,
   `index.html`, the server's legacy `/assets/*.mjs` map, and the DOM-double UI
   tests. `public/style.css` is still imported by `frontend/main.tsx` and stays.
3. Types: sibling `public/*.d.mts` declarations for lesson-schema, demo-model,
   lesson-player, generated-demo, gallery-lessons and studio-showcase; `lib/shared.ts`
   has no casts; `frontend/lib/engines.test.ts` keeps type keys and JSON schema in step.
4. Studio: `hooks/useProviderSession.ts` and `hooks/useImageAttachment.ts`;
   effects no longer read refs during render; oxlint with react-hooks rules,
   Prettier, Vitest (`npm run check`); CI runs lint, format check and unit tests.
5. "What Muse changed": `lib/lesson-diff.ts` + `components/RevisionSummary.tsx`;
   server replies carry `model`, `elapsedMs`, `usage`. Verified live locally:
   create 7.8 s, revise 11.2 s, seven listed field changes (screenshot in
   `docs/screenshots/revision-summary.jpg`).
6. Hygiene: MIT `LICENSE`; GitHub description and homepage set to explainback.app.
7. Bundle/messages: DraftReview, RevisionSummary and ProviderConsole are lazy
   chunks; `scripts/extract-messages.mjs` moved 177 literal EN/ZH pairs into
   `frontend/lib/messages.ts` (20 non-literal strings remain inline).

**Verification (Node 22.23.1, merged branch):** `tsc --noEmit` pass; oxlint
0 errors (warnings remain: set-state-in-effect in App/Studio, refs/immutability
in the ported labs); Prettier clean; Node tests 230/230; Vitest 12/12;
Playwright 18/18; build: index 360.6 KB (121.5 KB gzip), Labs 181.1 KB
(67.6 KB gzip), DraftReview 6.6 KB, ProviderConsole 5.6 KB, CSS 70.4 KB.
The main chunk grew about 10 KB from the message table and diff view.

**State:** merged as `92723db` and deployed; see [release record](../vercel-deployment.md#post-migration-cleanup-release--october-28-2026-pacific).

### 2026-10-28 Pacific — PROMPT-001 — Claude

**Request:** revise the author prompt against the judge findings and measure the
change against the preserved baseline.

**Changes:** `author-v2` instructions (neutral framing, standard quantity names
translated per language, correct units, transfer question names quantity and
unit, explicit length limits); `--samples=N` in the Studio runner; validator
rejections name the field and limit; prompt version recorded in report metadata.

**Verification:** Node tests 231/231; Vitest 12/12; app typecheck pass. Live:
two-sample comparison on both models for three text and two image cases, judge
unchanged. Spark text 6/6 automated and judge 10.0 (baseline 3/3, 8.0); Wonder
image 4/4 and 9.0 (baseline 2/2, 8.0); Wonder text 5/6 and Spark image 3/4 with
one contract rejection each. Two intermediate regressions (renamed ids; Wonder
over the explanation limit) were caught by the probes and the contract checks
and fixed before the final run. Full table in
[studio-evaluation.md](../studio-evaluation.md#author-prompt-v2-measured-against-the-baseline-october-28-2026).

**State:** merged as `44434ef` and deployed; see [release record](../vercel-deployment.md#author-prompt-v2-release--october-28-2026-pacific).

### 2026-10-28 Pacific — GALLERY-002 — Claude

**Request (own pick after PROMPT-001):** show multimodal input without sign-in,
and make the revision panel actionable.

**Changes:** gallery lesson `sketch-pendulum`, drafted by `muse-spark-1.3` from
the frozen pendulum sketch (image-suite run of Oct 28, `sketch-pendulum-en#2`)
and lightly edited (duplicate chapter removed, labels capitalised, unit symbol);
the card shows the sketch and a "Created from a sketch" chip, the player shows
the sketch beside the provenance note, and the image is served and packaged with
the brand assets. "Restore previous draft" on the revision panel reloads the
pre-revision draft without a request. The build script's directory creation now
handles the space in the checkout path (an earlier run had created an empty
percent-encoded directory tree under `~/Library`, removed).

**Verification:** Node tests 232/232 (new gallery/asset test); Vitest 12/12
(restore covered); typecheck, lint, format clean; build emits
`dist/gallery/pendulum-sketch.png`; Playwright 18/18.

**State:** merged as `118cd69` (PR #11) and deployed; hosted check of the sketch lesson, card chip and image asset passed on explainback.app. Release recorded in `docs/vercel-deployment.md`.


### 2026-10-28 Pacific — EXPLAIN-001 — Claude

**Request (own pick after GALLERY-002):** make the learner actually explain
back, which the product name promises and the Explain stage never asked for.

**Changes:** the Explain stage gains an "Explain it back" textarea (per
chapter, 700 characters) placed before the reviewed explanation. With creation
access, "Check my explanation with Muse" posts the text as `explanation` on the
existing guide request; `src/lesson-author.mjs` then switches to an assessment
prompt and a graded `guide_lesson` tool (`verdict` supported/partly/unsupported,
`explanation`, `followUp`, `nextAction`) and the reader requires exactly that
shape (`readLessonAuthor(..., assessed)`), rejecting graded replies on plain
requests and plain replies on graded ones. The player shows the verdict chip,
feedback, follow-up question and next action; the one-line request summary
still reports model, time and tokens. Signed-out visitors keep the textarea and
see that feedback needs access. Learner text is untrusted subject matter in the
prompt; it is traced like other request text (no secrets, no image bytes).

**Verification:** Node tests (new graded-guide HTTP test: 400 on empty/over-
long text, 502 on wrong reply shape, pass-through of graded fields); Vitest
(two new Studio tests: graded flow with request body check, signed-out state);
typecheck, lint (pre-existing labs warnings only), format; Node 233/233,
Vitest 14/14, Playwright 18/18. Live local check (open-access dev server,
`muse-spark-1.3`): a deliberately partial explanation of the web-cache lesson
returned verdict "partly", feedback naming the missing freshness/revalidation
path, and a follow-up question that did not reveal the answer, in 4.9 s.

**State:** merged as `88d082c` (PR #12) and deployed; hosted check through the judge invite returned a supported verdict with follow-up in 4.7 s. Release recorded in `docs/vercel-deployment.md`.

### 2026-10-28 Pacific — ROLES-001 — Claude

**Request (user):** use the stronger Wonder model as the creator and Spark as a
test learner who tries a draft and gives feedback.

**Changes:** `/api/status` reports `roles` (creator = configured
`muse-wonder-1.0`, tester = configured `muse-spark-1.3`, each falling back to the
default target); the Studio starts on the creator and labels the selector
"Creator model" with the test learner shown beside it. New
`src/lesson-tester.mjs`: `learnerView` (what a learner sees before the
explanation; never answer, hint or explanation), `learnerTryoutRequest`
(structured `try_lesson` tool: per-chapter prediction+reason, explanation,
transfer answer, ≤3 confusions, ≤3 suggestions; overall note; 1–5 rating) and
`readLearnerTryout` (shape/length checks; transfer answers checked by code,
numeric within tolerance, choices by index). `/api/studio/tryout` always runs on
the tester role within the Lesson Studio session and counts against the same
budgets. Draft review gains "Let the test learner try this lesson", the report
(checked answers, confusions, suggestions, rating, request summary) and "Use
these suggestions in a revision", which fills the revision box. `RequestSummary`
moved to its own module so the lazy `RevisionSummary` import is effective (the
Vite INEFFECTIVE_DYNAMIC_IMPORT warning is gone).

**Verification:** Node tests (new `test/lesson-tester.test.mjs`: learner view
hides answers, numeric/choice checking, malformed reports rejected; HTTP test:
roles in status, tryout runs on the tester id, 400 on an invalid lesson,
checked answer and budget in the reply); Vitest (creator default from roles;
tryout flow with request body, report contents and suggestion hand-off);
typecheck, lint (warnings only, pre-existing kinds), format, build (no dynamic
import warning), Playwright 18/18; Node 237/237, Vitest 16/16. Live local check
(open-access dev server): Wonder drafted "Why faster bicycles need more room to
stop" (16.0 s; a first attempt was rejected and retried, consistent with the
measured 5/6 Wonder text pass rate), Spark tried it in 5.7 s with the transfer
answer 30 m checked correct, two confusions, two suggestions and a 3/5 rating,
and "Use these suggestions" filled the revision box. One confusion came from the
learner view listing only the first output unlabelled; the view now names every
output with its unit at three axis points.

**State:** merged as `bc9f1d2` (PR #13) and deployed; hosted check through the judge invite: Wonder drafted a parachute lesson (24.6 s), Spark's tryout (3.0 s) had the transfer answer checked correct with a 4/5 rating. Release recorded in `docs/vercel-deployment.md`.
