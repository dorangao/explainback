# ExplainBack shared progress ledger

Common engineering handoff for **Codex, Claude and Devin**. Updated **October 28,
2026, Pacific** (header refreshed after REVIEW-002). Start here, then inspect the actual checkout. The work table is the
current index; dated entries and linked evidence retain the history.

## Current baseline

- **Product:** a question or a sketch becomes a bilingual, reviewable interactive
  lesson. Wonder is the creator, Spark the test learner whose answers code
  checks; the learner predicts, operates, explains it back (typed or spoken
  through Muse Voice Transcribe, graded by Muse) and transfers; any lesson becomes a narrated show with a Muse Image cover. Six
  reviewed gallery lessons and their shows play without signing in.
- **Grounding source:** `main` at `3d4ff7a` (PR #19 merge); `origin/main`
  matches; production serves that code (`explainback-q8k5jsc9g`, see the
  deployment notes).
- **Shipped Oct 28 (all merged and deployed):** PR #9 post-migration cleanup,
  #10 author prompt v2, #11 sketch gallery lesson and restore, #12 explain it
  back, #13 creator/tester roles and tryout, #14 narrated shows and Why Muse,
  #15 rejection reasons, #16 invite reuse, #17 Devin's review housekeeping,
  #18 indexable/installable site with Vercel analytics (analytics toggle still
  off in the dashboard), #19 spoken explain-back through Muse Voice Transcribe.
- **Fresh local checks (Oct 28, PR #16 branch):** Node **243/243**, Vitest
  **21/21**, Playwright **18/18**, typecheck, lint (warnings only), Prettier,
  build. CI (`verify.yml`) runs the same on every PR.
- **Pre-existing untracked work:** `.agents/`, `.claude/`, `skills-lock.json`.
  Left untouched and excluded from commits.
- **Current work:** submission readiness (demo script, video, submission copy,
  organizer questions) per `docs/hackathon-readiness.md`; see REVIEW-002 below
  for the Oct 28 review and its disposition.

## Work table

| ID | Owner | State | Scope / files | Next action |
|---|---|---|---|---|
| GROUND-001 | Codex | Complete; committed in PR #8 | `AGENTS.md`, `CLAUDE.md`, this ledger, README and readiness/deployment notes | Both agents use this handoff on their next task. |
| UI-001 | Codex | Merged in PR #8 and deployed | Base `ba4da7a`, branch `codex/react-studio-branding`; claim: `frontend/`, `e2e/`, package/build configs, static serving, physics adapter, brand assets, relevant tests and docs. | Ready for user review; commit/push/deployment remain separate next actions. |
| REL-001 | Codex | Release evidence in PR #8; file claim released | Base `ba4da7a`, `codex/react-studio-branding`; claims `vercel.json`, `.vercelignore`, `.github/workflows/`, suction fallback regression, release evidence and this ledger; committing the validated UI-001 files. | [PR #8](https://github.com/dorangao/explainback/pull/8) carries the final merge SHA, production deployment and live validation evidence; read its release verification section. |
| REVIEW-001 | Claude | Assessment complete; no product code changed | Base `b7f82df` (`main` after PR #8), checkout on `codex/react-studio-branding`; read-only review of `frontend/`, `src/static.mjs`, build/CI config, tests; this ledger only | User chooses which findings to schedule; see the dated entry. |
| CLEAN-001 | Claude | Merged as `92723db`; deployed to production | Base `b7f82df`, branch `feat/post-migration-cleanup`; claims `frontend/**`, `public/*.d.mts`, removed legacy shell files, `src/server.mjs` (asset map, reply metrics), `test/**`, lint/format/Vitest config, CI workflow, README, LICENSE, Studio docs | User reviews and merges the PR; deploy afterwards. Labs port left `react/refs` and `react/immutability` as warnings under `frontend/components/labs/**` (follow-up: idiomatic React state for the ported controllers). |
| PROMPT-001 | Claude | Merged as `44434ef`; deployed to production | Base `4f861c0`, branch `feat/author-prompt-v2`; `src/lesson-author.mjs` (author-v2), `src/eval/studio.mjs` (samples, rejection reasons), `scripts/eval-studio.mjs`, `public/lesson-schema.mjs` and `demo-model.mjs` (field-naming validator messages), evaluation docs | User reviews the before/after in `docs/studio-evaluation.md` and merges; deploy afterwards. |
| GALLERY-002 | Claude | Merged as `118cd69`; deployed to production | Base `775b897`, branch `feat/sketch-gallery-and-restore`; `public/gallery-lessons.mjs`, `public/gallery/pendulum-sketch.png`, `src/static.mjs`, `scripts/build-vercel.mjs`, `frontend/components/{Gallery,Studio,RevisionSummary}.tsx`, types, styles, tests, README and Studio docs | Done; release recorded in `docs/vercel-deployment.md`. |
| EXPLAIN-001 | Claude | Merged as `88d082c`; deployed to production | Base `118cd69`, branch `feat/explain-back`; `src/lesson-author.mjs` (graded guide contract), `src/server.mjs`, `frontend/components/{LessonPlayer,Studio}.tsx`, `frontend/lib/{types,messages}.ts`, styles, tests, README and Studio docs | Done; release recorded in `docs/vercel-deployment.md`. |
| ROLES-001 | Claude | Merged as `bc9f1d2`; deployed to production | Base `00dc995`, branch `feat/creator-tester-roles`; `src/lesson-tester.mjs` (new), `src/server.mjs` (roles, `/api/studio/tryout`), `frontend/components/{Studio,DraftReview,RequestSummary,RevisionSummary}.tsx`, types, messages, styles, tests, README and Studio docs | Done; release recorded in `docs/vercel-deployment.md`. |
| SHOW-001 | Claude | Merged as `b8ba6ce`; deployed to production | Base `5f80635`, branch `feat/lesson-show`; `src/lesson-show.mjs` (new), `src/meta.mjs` (Muse Image), `src/server.mjs` (`/api/studio/show`), `scripts/make-gallery-shows.mjs`, `public/gallery-shows.mjs` + six covers, `src/static.mjs`, `frontend/components/ShowPlayer.tsx` (new), App routing `#show:`, Gallery, Studio, DraftReview, types, messages, styles, tests, README (Why Muse) and Studio docs | Done; release recorded in `docs/vercel-deployment.md`. |
| REASON-001 | Claude | Merged as `e0a094c`; deployed to production | Base `7bd28a1`, branch `fix/rejection-reason`; `src/server.mjs` (rejection reason on 502 and trace), `src/trace.mjs`, `public/provider-console.mjs`, `frontend/lib/api.ts`, `frontend/components/Studio.tsx`, messages, styles, tests, Studio docs | Done; release recorded in `docs/vercel-deployment.md`. Follow-up: an `#invite:` link reused in the same tab after sign-out needs a reload. |
| INVITE-002 | Claude | Merged as `7e0f458`; deployed to production | Base `b6796af`, branch `fix/invite-reuse`; `frontend/App.tsx` (invite applied once per navigation, no handled-code guard), `frontend/App.test.tsx` (new) | Done; release recorded in `docs/vercel-deployment.md`. |
| VOICE-001 | Claude | Merged as `3d4ff7a` (PR #19); deployed to production | Base `35817c6` (`main` after PR #18 docs), branch `feat/spoken-explain-back`; `src/wav.mjs` (new), `src/meta.mjs` (`transcribeMetaAudio`), `src/server.mjs` (`/api/studio/transcribe`, `status.voice`, `transcribeCall` option), `frontend/lib/recorder.ts` (new), `LessonPlayer.tsx` (Say it instead), `Studio.tsx` (transcribe request), `RequestSummary.tsx`, hook mode, types, messages, styles, tests, README/Studio/demo docs | User records one spoken explanation through the judge invite in a real browser (the pane cannot grant a microphone); the route itself is verified live. |
| SEO-001 | Claude | Merged as `5c9a17f` (PR #18); deployed to production | Base `eec2d1a` (`main` after PR #17), branch `feat/seo-pwa-analytics`; `index.html` (SEO/share/PWA head, JSON-LD), `vercel.json` (no `noindex`, asset caching), `src/static.mjs` and `scripts/build-vercel.mjs` (robots/sitemap/manifest/worker/icons), `public/{manifest.webmanifest,sw.js,icons/}`, `frontend/lib/{analytics,install}.ts`, `frontend/main.tsx`, `App.tsx` (route titles, Install button), `package.json` license fields, tests, README/tracker/deployment notes | User enables Web Analytics in the Vercel dashboard (Project → Analytics → Enable) and confirms the Official Rules under R02. |
| REVIEW-002 | Devin (review) · Claude (disposition) | Merged as `eec2d1a` (PR #17) | Base `8e39aee`, branch `chore/housekeeping-review-002`; show cover budget (`src/server.mjs`), sketch source key `muse-sketch`, unused busy state and shadowing, inline strings extracted, demo script rewrite, readiness tracker and ledger header refresh | User reviews and merges; user runs the worktree/branch cleanup commands recorded below. |
| SUBMIT-001 | Codex | Full local candidate verified; eligibility review open; claim released | Base `acb0ed3` on `main`; `docs/hackathon-readiness.md`, `docs/submission-provenance.md`, this ledger and `output/submission-candidate-explainback/` | Confirm mixed-source timeline/rights and review candidate, then separately publish and verify a public repository and final demo when authorized. |
| PUBLISH-001 | Codex | Public repo pushed; preview ready; live flow unverified; claim released | Base `acb0ed3` on original `main`; separate candidate `a6e151e8404848eb4d52e5d14bf210c6ee424689`; this ledger and readiness note | User opens preview, authenticates and tests the full live flow; verify hosted behavior and remaining eligibility before submission. |
| MOVE-001 | Codex | Complete: domain moved and verified | Base old `acb0ed3`; new `/Users/dorangao/app/explainbackapp` at `a6e151e`; production deployment `dpl_Hnt8c8Z1PNHZM7T63iFgMaZ3rSGf` | Continue submission readiness and user-led full-flow testing. |
| TOUCH-001 | Claude | Complete; read-only touch base of the standalone checkout; no claim held | Base `a6e151e` on `/Users/dorangao/app/explainbackapp` `main` (matches `origin/main`); this ledger only | Another agent is editing `frontend/styles.css` there (uncommitted at 21:12 Pacific); whoever owns it runs Prettier and records the claim before committing. |
| LIVE-001 | Claude | Complete: full live flow verified after cutover; shot list written; claim released | Base `a6e151e` (deployed source); claims `docs/studio-demo.md` (shot list section), this ledger and `docs/hackathon-readiness.md` evidence line only; no product code | User records the demo from the shot list in `docs/studio-demo.md`; spoken explain-back and narrow screens still unverified live. |
| DEMO-TRACE-001 | Claude | Implemented and verified locally in both checkouts; PRs open, not merged or deployed | Base `96a163d` (original `main`) and `6049da1` (standalone `main`), branch `fix/guided-demo-without-trace` in each; claims `public/demo-runner.mjs`, `public/suction-demo.mjs`, `frontend/components/labs/{GuidedDemo.tsx,physicsController.ts}`, their Node tests, `e2e/app.spec.ts`, README and deployment notes (original only), this ledger | User merges the standalone PR (Git-triggered production deploy) and the original PR; then presses Start demo on explainback.app through the judge invite. |


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

### 2026-10-28 Pacific — SHOW-001 — Claude

**Request (user):** pick and demonstrate an angle on why Muse models are the
right fit, and let the final result be more than text (narration, slides,
images).

**Facts checked first (dev.meta.ai docs, October 28):** Spark and Wonder accept
text, image, video, audio and PDF and return text only; Muse Image generates
and edits images (`/v1/images/generations`); Muse Voice Transcribe is
speech-to-text only; there is no text-to-speech or video generation on the API.
The show therefore uses the creator model for the script, Muse Image for the
cover, the checked lesson for every visual, and the browser's speech synthesis
for the voice, labelled as such.

**Changes:** `src/lesson-show.mjs` (structured `make_show` script contract with
order and length checks), `generateMetaImage` in `src/meta.mjs` (documented
body, data URL result, no bytes in traces), `/api/studio/show` (creator session
model, optional cover, injectable `imageCall`), `ShowPlayer` (slides rendered
from the lesson, experiment sweep, browser narration with language voice,
keyboard, credits), `#show:<id>` route and gallery "Watch the show" links,
Studio "Make a narrated show" / "Watch the show", six generated gallery shows
with covers packaged as brand assets, README "Why Muse, specifically" section.

**Verification:** Node tests (show contract, image client with fake fetch, HTTP
show with cover and cover failure, gallery show contract and served covers);
Vitest (ShowPlayer slides, keyboard, speech in zh with mocked synthesis;
Studio make/watch/close flow); typecheck, lint (warnings only), format, build,
Playwright. Live generation: six shows from Wonder (13–25 s each) and six Muse
Image covers (220–375 kB); Node 242/242, Vitest 19/19, Playwright 18/18. Live
local checks (open-access dev server): `#show:cooling` played with the cover,
narration and the sweeping cooling curve, speech started and paused, no console
errors; in the Studio, Wonder drafted "Why does a hot air balloon rise?"
(17.2 s), "Make a narrated show" returned a six-slide script (10.5 s) and a
Muse Image balloon cover, the player opened over the draft and closed back to
the review with "Watch the show" available. A cover heading was unreadable on
the dark stage in the first run; fixed before commit.

**State:** merged as `b8ba6ce` (PR #14) and deployed; hosted check of `#show:quantum` signed out (cover, narration, experiment slide, browser voice, no console errors). Release recorded in `docs/vercel-deployment.md`.

### 2026-10-28 Pacific — REASON-001 — Claude

**Request (user):** a production creation from an uploaded "differentiation
rules" image showed as failed after the call went through; find out why.

**Diagnosis:** Claude in Chrome was not connected, so the tab could not be
read. Vercel runtime logs for the afternoon deployment show the tester login
(17:06), a Studio session (17:24:43) and a compose that returned 502; the
provider-activity polling ran about 26 s, so Wonder answered and the draft
failed the lesson contract. A 1.1 MB JPEG of differentiation rules on Wonder
through the judge invite drafted fine on production (11.5 s), so size, format
and the creator default are not the trigger; the rejection is content-dependent.
The exact validator message was not visible anywhere: the server replaced it
with a generic 502 and the trace recorded only "failed or rejected".

**Changes:** the Studio block attaches a bounded, one-line `reason` to the
502 and to the trace row, but only for errors raised while reading the reply
(our validator messages, tagged at the read step; configured secrets redacted);
provider and transport errors keep carrying no text, as before; the client reads it into
`ApiError.reason`; the Studio appends "Reason: …" to the failure line; the
provider console shows it after the outcome.

**Verification:** Node tests (new HTTP test: validator reason on the 502 and in
the trace, provider errors carry none, accepted rows carry none); Vitest (Studio shows the reason and the remaining budget);
typecheck, lint, format, Playwright. Live check recorded below when run.

**State:** merged as `e0a094c` (PR #15) and deployed; bundle check passed, a live rules-image creation drafted normally (no rejection to display). Release recorded in `docs/vercel-deployment.md`.

### 2026-10-28 Pacific — INVITE-002 — Claude

**Request (user):** a reused `#invite:` link in a tab that had already used it
did not sign in again after sign-out until the page was reloaded.

**Cause:** the App remembered the handled code in a ref and skipped it on the
next navigation, although the invite ref is already cleared on use.

**Changes:** the handled-code guard is removed; each `#invite:` navigation is
applied exactly once (the ref is cleared when consumed, so later auth changes
do not replay it). New `frontend/App.test.tsx` mocks `useAuth` and checks:
sign-in from the link, sign-out, the same link again signs in again, and an
auth change alone does not replay a consumed invite.

**Verification:** Vitest 21/21, Node 243/243, typecheck, lint, format,
Playwright 18/18. Hosted check after deployment recorded below.

**State:** merged as `7e0f458` (PR #16) and deployed; hosted check of sign-out then same-tab invite reuse passed (new login without reload). Release recorded in `docs/vercel-deployment.md`.

### 2026-10-28 Pacific — REVIEW-002 — Devin's review, disposition by Claude

**Source:** Devin's read-only review of the ledger, tracker, demo and eval docs
and the main code paths (shared by the user). Devin joins the crew; this ledger
and `AGENTS.md` are the handoff.

**Applied in this change:**

- (5) **Show request time budget.** `/api/studio/show` ran the creator call (up
  to 50 s) and then the Muse Image call (60 s) inside a 60 s function. The cover
  call now gets what is left of a 55 s budget after the script call and is
  skipped (`coverSkipped:'time'`) when under 8 s remain; the client no longer
  waits an extra 60 s. Test asserts the budgeted timeout.
- (6) **Sketch provenance key** renamed from `muse-image` to `muse-sketch` in
  the gallery data, source note and card, so it cannot be read as "Muse Image
  drew the sketch".
- (8) `App.tsx` unused busy state removed; four shadowed `t` lambdas renamed;
  22 inline `say(...)` pairs in LessonPlayer, ShowPlayer and DraftReview moved
  into `frontend/lib/messages.ts` by the extractor (236 messages).
- (1, 2) `docs/studio-demo.md` rewritten around the current product with the
  Wonder-timing guidance (honest cuts, or Spark as creator and say so).
- (3, 4) `docs/hackathon-readiness.md` and this ledger's header refreshed:
  dates, test counts, R05/R06/R07/Q04/Q05/X02 states, story pointer, work table
  rows GROUND-001/UI-001.

**Not applied here, with reasons:**

- (7) Worktree `.claude/worktrees/agent-a09d810a860cc1fde` (branch merged,
  tree clean) and the superseded branches `feat/reviewer-access-codes` (its
  commit is equivalent to one on main) and `feat/wonder-eval-image` (its docs
  were restored on main): removal is destructive and was declined by the
  session's permission policy. Commands for the user:
  `git worktree remove .claude/worktrees/agent-a09d810a860cc1fde`,
  `git branch -d worktree-agent-a09d810a860cc1fde`,
  `git branch -D feat/reviewer-access-codes feat/wonder-eval-image`,
  `git push origin --delete feat/reviewer-access-codes feat/wonder-eval-image`.
  Moving the checkout out of iCloud Drive is the user's call.
- (8) Labs hook warnings: left; the labs port is out of scope this week.
- (9) Automatic re-run of the test learner after a revision with a before/after
  clarity number: good follow-up; one extra request per revision.
- (10) Sketch transfer-values prompt rule: cheap, but prompt changes are kept
  only with a measured rerun (image suite), so it is a separate small task.
- (11) "How this was checked" panel on gallery cards: follow-up.
- (12) Human content review of the six gallery lessons: user/reviewer task (Q02).
- R01/R02 and the organizer questions remain the user's.

**Verification:** Node 243/243 (budget assertion added to the show test),
Vitest 21/21, typecheck, lint (no errors; no-shadow/no-unused-vars warnings in
Studio/App gone), Prettier, Playwright 18/18.

**State:** merged as `eec2d1a` (PR #17); the worktree/branch cleanup commands
remain the user's.

### 2026-10-28 Pacific — SEO-001 — Claude

**Request:** check for license requirements beyond a public repository, add an
MIT license (Doran Gao, 2026) if none, optimise the app for search, enable
Vercel analytics, and make the app installable on desktop and mobile.

**License:** `LICENSE` (MIT, copyright 2026 Doran Gao) already existed from
CLEAN-001; `package.json` now carries `license`, `author`, `homepage` and
`repository`, and the README has a license section. The only rules document in
the repository (`docs/863382756_…n.pdf`) is the Hackathon Credit Terms: it says
participation and judging are governed by the separate Official Rules and has no
licensing clause. The participant guide on Cerebral Valley redirects to a
sign-in, and public coverage does not quote an IP or license requirement, so
nothing beyond "public repository" was found; reading the Official Rules stays
with the user (R02).

**Search and sharing:** the `X-Robots-Tag: noindex, nofollow` header is gone
from `vercel.json`, `robots.txt` allows everything except `/api/` and names
`sitemap.xml` (one URL: hash routes are one page); both are generated in
`src/static.mjs`, written by the build and served by the local server. The head
gains canonical and hreflang links, an `og:locale` pair, image alt, a
`robots` meta and a schema.org `WebApplication` JSON-LD block (data-only, so
the `script-src 'self'` CSP is unchanged). The tab title names the open gallery
lesson or show. Hashed `/assets/*` files are now cached for a year as immutable
and icons/gallery/brand files for a day; pages and the API stay `no-store`.

**Installable app:** `public/manifest.webmanifest` (standalone, scope `/`,
192/512 any icons and a 512 maskable icon rendered from `favicon.svg`, two
shortcuts) and `public/sw.js` (shell precache; pages network-first with an
offline fallback; hashed assets cache-first; brand/gallery
stale-while-revalidate; `/api/*`, `/_vercel/*` and non-GET requests never
touched). The worker registers on production builds only
(`frontend/lib/install.ts`), so the Vite dev server and Vitest see none of it;
Playwright runs against the built `dist` with the worker active. Chromium shows
an **Install app** button in the top bar when the browser offers the prompt;
Safari and Firefox install from their own menus (README says how).

**Analytics:** `frontend/lib/analytics.ts` loads the same-origin
`/_vercel/insights/script.js` only on `explainback.app` or `*.vercel.app`
hosts and reports hash-route page views with invite codes stripped. No
dependency was added. The script returns 404 until **Web Analytics is enabled
in the Vercel dashboard** (Project → Analytics); the CLI exposes no toggle and
the dashboard needs the user's sign-in, so that step is the user's.

**Verification:** Node 245/245 (crawler files, manifest/worker consistency,
new static paths), Vitest 25/25 (analytics host guard, once-only script,
invite scrubbing, worker registration guard), typecheck, lint (warnings only),
Prettier, build, Playwright 18/18 on the built bundle.

**State:** merged as `5c9a17f` (PR #18) and deployed; release record in
`docs/vercel-deployment.md`. Remaining for the user: the Vercel Web Analytics
toggle and the Official Rules check (R02).

### 2026-10-28 Pacific — VOICE-001 — Claude

**Request:** "Keep going" after SEO-001; picked from the recorded follow-ups:
the spoken explain-back through Muse Voice Transcribe, which adds a third Meta
model to the learner loop (Wonder/Spark text, Muse Image covers, Muse Voice
speech in) and strengthens the "why Muse" angle for the creative-use criterion.

**API contract (dev.meta.ai, read Oct 28):** `POST https://api.meta.ai/v1/asr/transcribe`,
bearer key, multipart with a `request` JSON part (`model`, `mode`
`PUSH_TO_TALK`, `audioEncoding` `WAV`, optional `languageBias` names) and an
`audio` part; RIFF/WAVE mono 16-bit PCM at 16 or 24 kHz only, 32 MB / 10 min
caps; JSON reply `{sessionId, transcript, audioDurationMs, turns}`.

**Built:** `src/wav.mjs` validates the header, format, rate and 0.3–60 s
duration and decodes the base64 body (bounded at 2.6 MB); `transcribeMetaAudio`
in `src/meta.mjs` builds the multipart request with Node's `FormData`/`Blob`,
30 s timeout, traces sizes and the transcript only; `/api/studio/transcribe`
needs a Lesson Studio session, a language, charges the hourly bucket (not the
eight attempts), returns `{text, model, audioDurationMs, elapsedMs}`, 503 when
no key is configured, 502 on failure with no upstream text; `/api/status` adds
`voice`. Browser: `frontend/lib/recorder.ts` captures through Web Audio
(`AudioContext` at 16 kHz, `ScriptProcessorNode`, linear resample fallback,
WAV encoder, base64), auto-stops at one minute; `LessonPlayer` shows **Say it
instead** → **Stop and transcribe** → "Transcribing with Muse Voice…", appends
the transcript to the per-chapter textarea with an "edit it, then check" note,
and reports denied/unsupported microphones; `Studio.transcribe` runs through
the shared provider session (busy, metrics "transcribed your explanation", 45 s
client timeout, failure line). The microphone is hidden when `status.voice` is
false or without creation access.

**Verification:** Node 249/249 (`test/speech.test.mjs`: WAV reader cases,
multipart contract and trace, route validation/trace/502/503), Vitest 30/30
(recorder helpers; spoken flow with a mocked recorder; hidden without voice),
typecheck, lint (warnings only), Prettier, build, Playwright 18/18. Live, local
open-access server with the real key: a 6.9 s synthetic English sentence
(macOS `say`, 16 kHz) came back word for word in 2.2 s; a 6.1 s Mandarin
sentence in 2.4 s with its first syllable dropped. In the dev server the button
renders in the Explain step for the cache lesson; the browser pane cannot grant
a microphone, so the recording path itself was exercised by the component test
and the WAV encoder test, not by a real microphone.

**State:** merged as `3d4ff7a` (PR #19) and deployed; release record in
`docs/vercel-deployment.md` (live route check through the judge invite, signed
out afterwards). Remaining: one real-microphone recording by the user.


### 2026-10-28 Pacific — SUBMIT-001 — Codex

**Request:** check the new-work rule and prepare an event-only standalone source repository without disturbing the existing checkout.

**Base and coordination:** `main` at `acb0ed3a8de4c155d947cc9378cfc2ebae8c2e6b`. Existing untracked `.agents/`, `.claude/`, and `skills-lock.json` preserved. No branch switch or commit to the existing repository.

**Findings:** the Discord FAQ says a fresh repository should contain only event work; building officially begins after kickoff. The original first Git commit occurred after kickoff, but a baseline captured October 26 at 5:18 p.m. Pacific contains file modification times before the scheduled 9 a.m. kickoff; `public/graph.mjs` and `public/math.mjs` remain hash-identical. Those times conflict with treating the complete original project as verified event-only; modification times do not prove every line's authorship or creation time. The exact end of kickoff, contributor eligibility, rights and mixed dependencies remain open. See [provenance review](../submission-provenance.md) and the dated follow-up in [readiness](../hackathon-readiness.md).

**Candidate:** initialized a separate local Git repository at `output/submission-candidate-explainback/`, with no commits or remote. It contains selected later-added lesson contract, arithmetic, narrated-show and WAV components, synthetic fixtures, focused tests and provenance notes. This is an incomplete source extract, not the full application or a verified eligible submission. No deployed or public state changed.

**Verification:** Node 22.23.1 `npm test` in the candidate passed 4/4 after fixing a syntax error in the extracted WAV test. A limited heuristic scan found no matches in 13 candidate files; no comprehensive secret or historical scan was run. Main `git diff --check` passed before this ledger update. Tests do not establish end-to-end product behavior, eligibility or teaching readiness.

**Next:** reconcile timestamp evidence, verify the included and required dependency provenance and rights, clarify the organizer's event-only/existing-base expectations, and produce and validate a complete judge-facing repository. No commit, push, publication, deployment, organizer message or submission was made.


### 2026-10-28 Pacific — SUBMIT-001 full candidate — Codex

**User clarification:** Doran believes application work was after kickoff and requested removal of insignificant disputed material plus more standard implementations for the helpers and server. This belief does not establish why the recorded pre-kickoff modification times exist. Earlier evidence remains above.

**Changes:** expanded the isolated local Git candidate at `output/submission-candidate-explainback/` from source snapshot `acb0ed3`. Excluded baseline archives, local output, credentials and the earlier API setup probes. Replaced `public/graph.mjs` and `public/math.mjs` with D3-based plotting and a bounded formula catalog; migrated HTTP parsing/routing to Express 5 and the Meta Responses transport to the OpenAI-compatible Node SDK with Meta’s endpoint and zero automatic retries. Existing business workflow logic, Meta validation and image/voice code remain derived from the source project; replacements do not by themselves prove event-only provenance. Candidate `README.md`, `PROVENANCE.md` and `SOURCE-MANIFEST.json` describe boundaries and traceability.

**Verification:** Node 22.23.1: Node 259/259; Vitest 30/30; Playwright 18/18; typecheck; lint with warnings; Prettier; production build. A clean temporary copy passed offline `npm ci --ignore-scripts` and build. A delayed lock-release test covers serverless completion and an additional test covers disconnect cleanup. One small live Meta Responses call through the new SDK completed (`muse-spark-1.3`, 124 total tokens); the full live lesson workflow and actual Vercel runtime were not tested. A limited secret-pattern scan found no matches but is not a comprehensive secret review. No teaching-readiness or organizer eligibility claim is made.

**State / next:** local repository has no commits and no remote. Original checkout remains on `main` at `acb0ed3`; the pre-existing untracked files are preserved. Confirm remaining source/asset rights, collaborator eligibility, and the mixed-timeline question; review the standalone package and demo, then publication, hosted validation, and submission are separate actions. No push, deployment, organizer message or submission was made.


### 2026-10-28 Pacific — PUBLISH-001 — Codex

**Request:** create a public GitHub repository for the standalone candidate, deploy a preview for full-flow testing, and save a local checkout to `~/app/explainbackapp`.

**Publication:** reviewed the candidate contents and binary metadata. A heuristic credential scan found only synthetic test fixtures; this does not establish comprehensive secret or asset-rights clearance. Committed the 230-file candidate as root commit `a6e151e8404848eb4d52e5d14bf210c6ee424689`; created [dorangao/explainbackapp](https://github.com/dorangao/explainbackapp) as public and pushed `main`. GitHub metadata confirmed public visibility, and its `main` SHA matched the local commit. A clean clone at `/Users/dorangao/app/explainbackapp` has the same HEAD and clean Git status.

**Preview:** deployed the candidate with the Vercel CLI to existing project `explainback`, preview deployment `dpl_D4d3Uu4ZdZB99eNB6NtXPGRWyDsz`, [preview URL](https://explainback-kg8htkl23-doran-gaos-projects.vercel.app). Vercel reported `READY`, `target: null` (preview), and Git metadata for `dorangao/explainbackapp` at the exact SHA above. The cloud build installed dependencies, typechecked and built successfully. Project metadata lists preview-scoped tester credentials, Meta key and Redis configuration; values were not read or changed. Existing previews share the preview Redis namespace. Vercel protection may require its sign-in.

**Limits and next:** live preview access, tester sign-in and the complete hosted model-backed lesson flow were not exercised; the requested display-awake lease remained awaiting approval. The user can try the preview with existing preview tester credentials. This does not establish production deployment, official eligibility, or hackathon submission. Original ExplainBack `main` remained at `acb0ed3`; unrelated untracked files were preserved.


### 2026-10-28 Pacific — MOVE-001 — Codex

**Request:** move `explainback.app` to the newly imported `explainbackapp` Vercel project and reuse existing settings and credentials. User explicitly asked to skip AwakeRelay from now on and chose to preserve existing reviewer invitations before moving the domain.

**Configuration:** new project `prj_seU9s7OSv76NZd3M2c0lSR7WWkuT` is set to Node 22 and connected to the existing Upstash resource `explainback-preview` for production and preview. The local Meta key and tester credentials were added as sensitive variables to both environments; the same local tester credentials succeeded against the old production site. `EXPLAINBACK_PUBLIC_ORIGINS` was set for the custom domain. No secret values or invite codes were written to these notes. Shared Redis uses the existing production namespace and may share sessions and quotas.

**Staging:** production deployment `dpl_9onmA7EfUrbHRCm4553h2Mj4WFKb` at source commit `a6e151e8404848eb4d52e5d14bf210c6ee424689` reports READY. A protected test verified tester login HTTP 200, authenticated status HTTP 200 with Meta and voice configured, logout HTTP 200, and a synthetic live Studio session and lesson creation both HTTP 200 with a ready lesson. The temporary Vercel protection credential generated for that check was revoked and verified absent. This does not establish full lesson review/teaching readiness.

**Waiting:** existing production `EXPLAINBACK_ACCESS_CODES` is a Vercel Secret and cannot be read back; no local copy was located. The user chose to preserve existing invite links. Requested the user add the original value as a production secret in the new project without pasting it into chat. Do not move the domain or claim invite continuity until the user has restored it and the new deployment has been rebuilt and checked. Current Vercel metadata confirms `explainback.app` remains verified on the old project `prj_8y4jOH8v4zYVlNgRiwPfA0W0uAP5`. The new local checkout remains clean.


### 2026-10-28 Pacific — MOVE-001 invite-setting follow-up — Codex

The user indicated that the existing reviewer-invite value was saved. A fresh Vercel project environment metadata read and a separate `vercel env ls production` check both showed no `EXPLAINBACK_ACCESS_CODES` variable in new project `prj_seU9s7OSv76NZd3M2c0lSR7WWkuT`; no secret values were retrieved. Asked the user to check the project, exact variable name and Production target. The domain remains attached to the old project, and cutover is pending confirmation and a fresh metadata check; rebuild with the restored secret before cutover.

### 2026-10-28 Pacific — MOVE-001 invite-format follow-up — Codex

The user confirmed the variable was saved in the new project's Production environment; subsequent metadata showed it present. Rebuilt production deployment `dpl_F8zs3jjLrHRrYdLHjL37dKi2K92B` and verified it was READY. Its `/api/auth` response reports `codes: false`; a sanitized runtime warning says the first entry does not have the required four-field format. The current domain's `/api/auth` reports `codes: true`. No secret values were read or recorded. Asked the user to restore the complete value in the expected format. The domain remains on the old project pending a corrected value, redeployment and verification.

### 2026-10-28 Pacific — MOVE-001 invite-label follow-up — Codex

After the user reported saving a correction, production deployment `dpl_B4mQDZfQS7eGHDgmKRGfuGSywxUW` built successfully and reported READY. Its `/api/auth` still reports `codes: false`; the sanitized runtime warning identifies an invalid or duplicate label. Asked the user to check the label and remove any variable-name prefix or surrounding quotes. No invite values were read or recorded. The domain remains on the old project; rebuild and recheck before moving it. The standalone checkout remains clean at `a6e151e`.

### 2026-10-28 Pacific — MOVE-001 domain cutover — Codex

The user corrected the reviewer setting, redeployed, and reported that the old invite link worked against the new deployment. Production deployment `dpl_Hnt8c8Z1PNHZM7T63iFgMaZ3rSGf`, source `a6e151e8404848eb4d52e5d14bf210c6ee424689`, was READY and its `/api/auth` reported reviewer codes enabled. Moved `explainback.app` to project `explainbackapp`; Vercel domain verification reported a valid configuration, and its alias list mapped the custom domain to that exact deployment.

On the public domain, home and authentication status returned HTTP 200, tester login and authenticated status returned HTTP 200 with Meta and voice configured, and logout returned HTTP 200. The first logout probe omitted its required JSON content type and returned 415; the corrected probe passed. In the browser, the cooling gallery lesson progressed through prediction, experiment, explanation and transfer, and its local answer check accepted a correct numerical result. An earlier staged deployment had also completed a synthetic model-backed lesson creation; the entire creation-to-review flow was not repeated after cutover. Existing invite continuity is based on the user's test plus the enabled-code status, not a secret comparison. No credentials or codes were recorded. The standalone checkout remains clean; no commit or push was made for this cutover.

### 2026-10-28 Pacific — TOUCH-001 — Claude

**Scope:** read-only touch base of the new standalone checkout `/Users/dorangao/app/explainbackapp`; no product files edited in either checkout.

**State found:** standalone `main` at `a6e151e` (single commit, no inherited history), `origin/main` identical, `.env` present and ignored. Compared with original `main` at `acb0ed3`: 230 tracked files versus 310. Removed: `AGENTS.md`, `CLAUDE.md`, all of `docs/` except a new `docs/implementation-plan.md`, `public/graph.mjs`, `public/math.mjs`, `scripts/browser/*.txt`, `scripts/{capture-ui,meta-check,meta-smoke,security-check}.mjs`. Added: `PROVENANCE.md`, `SOURCE-MANIFEST.json`, `public/{formula-catalog,function-plot}.mjs`, `test/{formula-plot,standard-runtime}.test.mjs`. Ten shared files differ in content (README, `api/index.js`, `physicsController.ts`, package and lockfile, `src/{meta,problems,server}.mjs`, `test/{meta,open-access}.test.mjs`), consistent with the Express/D3/OpenAI-SDK replacements recorded in `PROVENANCE.md`. The standalone repo carries no agent instructions or ledger; this shared ledger remains the only handoff record.

**Validation (Node 22.23.1 via nvm, shell default is Node 25):** `node_modules` was initially incomplete (no `.bin`), so `npm ci --ignore-scripts` was run (180 packages). Then typecheck, lint (3 pre-existing warnings), Node tests **259/259**, Vitest **30/30** and build all passed. `format:check` failed only on `frontend/styles.css`, which was modified by another process at 21:12:28 Pacific during this check (Codex CLI processes were running); the committed `HEAD` version of that file formats cleanly. Playwright was not run. That edit was left untouched and is not claimed in the work table by anyone.

**Next action:** the agent editing `frontend/styles.css` should claim it here, run `npm run format` and the full checks before committing. Live full-flow testing from MOVE-001 remains user-led.

### 2026-10-28 Pacific — REVIEW-UI-001 — Codex

**Request:** test the hosted creation-to-review journey and existing reviewer invitation, and polish the standalone checkout's UI in the approved green-and-paper direction using Meta Muse as a visual reference.

**Live production:** in an existing signed-in session, the cooling starter with the existing-experiments mode was rejected twice because the model said the catalog lacked that experiment. In new-topic mode, Muse Spark produced a reviewable cooling draft; a revision returned a field-by-field diff. After review, prediction, experiment, Muse feedback, a locally checked numeric transfer answer and completion were exercised. The user then opened the existing invitation manually: the reviewer badge and quota appeared, the form was seeded, and the address was scrubbed. The first Wonder creation led to a blank page; browser diagnostics showed a failed dynamic import of the review module. That tab had been open across the domain cutover, so a stale asset is plausible but unproven. After reloading, reviewer access persisted; a new Wonder request produced a two-chapter draft. The review gate, presentation, prediction, experiment and checked transfer answers in both chapters reached completion. The generated chapters repeated the same demo and transfer case; scientific and teaching quality still need human judgment. No invite, credential or private URL was recorded.

**Local changes:** `/Users/dorangao/app/explainbackapp/frontend/styles.css` refines the creation, review and player surfaces with stronger workspace typography, rounded starter controls and inputs, and softer review and experiment surfaces. Referenced Meta's published Muse design story and product site. This is local only; no commit, push or deployment was made. Desktop and 390px mobile creation views were inspected; the automated browser suite covers the reviewer creation and review workflow with a synthetic provider.

**Verification:** Node 22.23.1: 259 Node tests, 30 Vitest tests, 18 Playwright tests, typecheck, Prettier and build passed; lint exited successfully with existing warnings. Vitest emitted jsdom `scrollTo` notices. Real microphone, image-based creation, show generation and the stale-module failure's root cause were not tested. The tested production deployment is distinct from the local CSS changes.

### 2026-10-28 Pacific — REVIEW-RECOVERY-001 — Codex

**Request:** investigate the blank review page, use Wonder asynchronously for lesson creation and Spark for quick feedback, commit/push/deploy the polish, and retest reviewer access in production.

**Findings and changes:** the browser had reported a failed dynamic import of the old review chunk; its observed asset URL now returns NOT_FOUND. A local browser test reproduced a blank page by blocking the lazily loaded review chunk after creation. The review and revision components now load with the initial application bundle, so an already-loaded new-version tab does not need a later review chunk after a deployment. Tabs that loaded the old release still need one refresh. This fixes the reproduced review-module failure, not every possible asset or network error.

Wonder compose/revision now starts a Meta background response and polls via authenticated, session-owned server requests; validated results remain in the temporary session for repeat retrieval. Duplicate starts are blocked while pending. Learner guide feedback routes to Spark regardless of creator model. The UI asks the user to keep the page open and discloses that Meta stores the background request and response, including any image. Image preparation leaves room for Meta's 1 MiB background limit. Navigation or reload does not resume the job in the UI; interrupted provider jobs may continue and be retained by Meta, and retrying may consume another request. The prototype still requires synthetic examples. No private invite, credential or response ID was recorded.

**Verification:** Node 22.23.1: 263 Node tests, 31 Vitest tests, 19 Playwright tests, typecheck, formatting and build passed; lint passed with existing warnings. The missing-review-chunk test failed before the fix and passed after it. Tests cover background provider submission/polling, ownership, duplicate starts and Spark routing; a job exceeding 60 seconds was not run live.

**Release:** committed `5dbb9dc9c64a968a96cb2a48bdd501a5a21c1ac2`, pushed `main` to `dorangao/explainbackapp`. Git-triggered production deployment `dpl_7NN6DHMwgmYR1jC4R79RALCS74Jk` reported READY and source metadata matched the commit; aliases included `explainback.app`.

**Production reviewer verification:** the existing reviewer session survived a refresh, with its badge and quota visible. A Wonder cooling creation returned HTTP 202 followed by successful poll requests and a validated draft (28.8 s); a Wonder revision returned its change summary (20.9 s). Presentation remained gated on review. The lesson progressed through prediction, experiment, Spark explanation feedback (4.1 s), checked numeric transfer and completion. The model generated a question as the prediction claim, an awkward mismatch with agree/disagree; human teaching review remains necessary. This was a text-only test; image upload, real microphone, narration, long-duration recovery and a fresh invite sign-in were not repeated in this release. The previous release's invite sign-in was tested in REVIEW-UI-001.

### 2026-10-28 Pacific — REVIEW-RECOVERY-001 invite follow-up — Codex

The user reopened the invite after the release. The current browser showed reviewer access and the scrubbed creation URL on the updated production UI. A sanitized request-status check showed an authentication status request, but no fresh login request; the app's invite handler reuses an already-authenticated session. This confirms access remained available, not that the code was newly authenticated. Asked the user to save any unfinished lesson, sign out and reopen the invite to complete the distinct fresh sign-in check. No invite or credential was recorded.

**Fresh invite check completed:** after the user signed out and reopened the existing invite, sanitized production request statuses showed logout HTTP 200 followed by login HTTP 200. The browser displayed the reviewer badge, the seeded creation form and the cleaned `#create` address on the new UI. The creation-to-completion journey on this release had already passed as recorded above. No invite or credential was captured.

### 2026-10-28 Pacific — CLAIM-001 — Codex

**Request:** make Muse generate a testable statement for agree/disagree predictions, test and deploy it, and create a maintained architecture diagram and technology stack.

**Changes:** updated author prompt version to `author-v3` with bilingual examples and an explicit requirement for a specific observable declarative prediction. The server rejects clearly interrogative claims in either language in newly generated or revised model output, without changing the schema for existing imported or gallery lessons. This heuristic catches obvious question forms; it does not prove semantic testability or scientific correctness. Background validation failures now return a terminal code so the UI preserves the rejection reason and author input instead of polling a finished job. Added `docs/architecture.md` with a Mermaid system diagram, flow, stack and source references; `AGENTS.md`, `CLAUDE.md` and README ask contributors to update it with architecture and stack changes.

**Verification:** Node 22: 264 Node tests, 32 Vitest tests, 19 Playwright tests, typecheck, formatting and build passed; lint passed with existing warnings. Tests cover English and Chinese questions, clear declarative claims, catalog/generated reader paths, background revision rejection and retained UI input/reason. Live production reviewer session: Wonder generated a cooling lesson in 27.2 s with the claim “The coffee cools at the same rate throughout the experiment” and its Chinese equivalent; after review, the player displayed agree/disagree, accepted Disagree, ran the experiment and showed an explanation. This single live example does not establish all generated claims are useful or scientifically correct.

**Release:** committed `21d342f14964e7662e88a9983c2d9ba114537bee`, pushed `main`, and Vercel production deployment `dpl_ANEzUvq39T2cMCNHPj2CrpbFtpqn` was READY with matching commit metadata and `explainback.app` alias. No invite or credentials were recorded.

### 2026-10-28 Pacific — LIVE-001 — Claude

**Scope:** live creation-to-review flow on `https://explainback.app` (deployment source `a6e151e`, the standalone repo) and a recorded shot list. Files: `docs/studio-demo.md` (new shot-list section), this ledger. No product code changed in either checkout.

**Signed out:** library with six cards, `#lesson:sketch-pendulum` (predict step, gravity slider, Spark-from-sketch attribution), `#show:cooling` (slide 1/6 with credits) and the `#create` access gate all rendered. `/api/auth` reported `configured true, codes true, open false, authenticated false`.

**Signed in (user opened the judges invite in the browser pane; no code was typed by the agent):** header showed the judges quota. Wonder created the cooling lesson in **22.7 s** (1382 in / 1567 out). Spark tryout **4.0 s**: overall 4/5 clarity, prediction *Not sure*, transfer answer **38.07 °C marked correct by code**, two confusions and two suggestions. *Use these suggestions in a revision* filled the prompt; Wonder revised in **21.5 s** with *What Muse changed · 2 fields* (chapter explanation, assumptions) and *Restore previous draft*. Review box ticked, presented: Disagree → experiment → final state **25.386 °C at 60 min** (22 + 68·e⁻³), cooling rate 0.16928 °C/min. Typed explain-back graded by Spark in **3.5 s** as *Supported by the evidence* with one follow-up question. Transfer 80/20/0.08 at 15 min: `38.07` accepted locally. *Make a narrated show* returned a 6-slide show with a Muse Image cover in about **40 s** wall clock; slide 3 is the live curve. EN→中 on the show translated narration, controls and credits. Quota went 34→30 live requests this hour; the provider-session counter went 7→3.

**Observations (cosmetic, not fixed):** the "The show is ready…" status banner stayed English after switching to 中文; the "requests left in this provider session" figure read 3 in EN and 8 in 中文 on the same page state. Worth a look in `frontend/lib/messages.ts` and the status source, outside this claim.

**Not verified:** spoken explain-back (no microphone in the pane), narrow-screen layout, multi-chapter lessons. The lesson was not exported; the pane session was left signed in. Nothing committed.

### 2026-10-29 Pacific — DEMO-TRACE-001 — Claude

**Request:** the user's phone screenshot of the live Physics & math workbench
(Chinese, judge invite) showed **开始演示 / Start demo** greyed out with the note
"演示需启用 EXPLAINBACK_TRACE=1 并重启"; "check and fix can start the show".

**Cause:** the guided demo was gated on the server trace flag three times: the
Start button and `runDemo()` in `physicsController.ts` refused to start without
`status.traceEnabled`, and both scripts (`runPresetDemo`, `runSuctionDemo`)
threw before their first request. Production runs with `EXPLAINBACK_TRACE`
unset on purpose: the flag keeps filtered request bodies in Redis for 30
minutes and marks every session a developer demo. The demo itself never needed
the trace; presets already reach the server with `demoPreset: true`, which marks
the session `demoUsed` and the report `assisted`, and the manual flows run with
tracing off.

**Fix:** the demo starts whenever the lab is ready and the tester is signed in;
the scripts require only login and a supported language; the console stays
behind the flag and the note now says "The request console is off on this
server (EXPLAINBACK_TRACE=1); the demo still makes live model calls" (zh:
"真实调用的请求记录未开启…演示照常进行"). README and the deployment notes no
longer list the flag as a demo requirement. Applied identically to the
standalone checkout `/Users/dorangao/app/explainbackapp` (branch
`fix/guided-demo-without-trace` from `6049da1`; it has no deployment notes and
its README does not mention the flag).

**Verification:** original checkout, Node 22: `npm run check`, Node **250/250**
(two runner tests now assert the scripts complete with `traceEnabled:false`
and still refuse without login), Vitest **30/30**, build, Playwright
**11/11** on `app.spec.ts` including a new test that rewrites `/api/status` to
`traceEnabled:false`, starts the demo, sees "Paused · read, then select Next"
at step 1 and stops it. Built bundle served locally with
`EXPLAINBACK_TRACE=0 EXPLAINBACK_OPEN_ACCESS=1`: `/api/status` reported
`traceEnabled:false`, Start demo was enabled, the suction script paused at step
1 of 11, one Next sent the preset to Muse Spark (feedback returned, 1/5
attempts, step 2) and Stop ended it with no console errors. Standalone
checkout, Node 22: check, Node **265/265**, Vitest **44/44**, build, Playwright
**22/22**. PRs: [dorangao/explainback#21](https://github.com/dorangao/explainback/pull/21)
and [dorangao/explainbackapp#3](https://github.com/dorangao/explainbackapp/pull/3)
(the standalone one deploys production when merged). Not yet checked on explainback.app;
after the standalone merge deploys, open the Physics workbench through the
judge invite, press Start demo once, Stop, and sign out.
