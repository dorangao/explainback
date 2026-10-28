# ExplainBack shared progress ledger

Common engineering handoff for **Codex and Claude**. Updated **October 28, 2026,
Pacific**. Start here, then inspect the actual checkout. The work table is the
current index; dated entries and linked evidence retain the history.

## Current baseline

- **Product:** a question or image becomes a bilingual, reviewable interactive
  lesson. The learner predicts, operates, explains and transfers. Five reviewed
  gallery lessons play without signing in or making model requests.
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

### Entry template

```text
YYYY-MM-DD Pacific — TASK-ID — Codex / Claude
Base: branch, exact HEAD, relevant dirty files and owned scope.
Changes: concrete behavior/files and decisions; separate proposals from approvals.
Verification: command or workflow, runtime, result, evidence path and limitations.
State: local / committed SHA / pushed / merged SHA / deployed SHA, each separately.
Next: remaining work, blocker, owner and whether the file claim is released.
```
