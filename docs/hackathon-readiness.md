# ExplainBack hackathon readiness

Updated **October 28, 2026, Pacific** (refresh after REVIEW-002). This tracks
submission readiness. Current engineering work, Codex/Claude/Devin ownership and
the latest local validation are in the
[shared progress ledger](implementation/progress-ledger.md). Dated
implementation and release notes remain historical evidence. The user selected and
authorized priorities 1–2: Studio-first presentation and a frozen 12-case lesson
evaluation. Studio-first runtime commit `3f947d5` was deployed at that checkpoint;
later gallery, reviewer-code, Wonder and image-input work is mapped in the shared
ledger and [release verification](vercel-deployment.md). Remaining checklist items
below retain their individual evidence and completion conditions.

**Assessment (Oct 28): the product is ahead of the submission.** Eight
features shipped on Oct 28 (gallery and sketch lesson, explain-it-back grading,
Wonder-creator/Spark-tester roles with a checked tryout, narrated shows with
Muse Image covers, rejection reasons, invite reuse). Every P0 gate below is
still open. Remaining effort should go to the demo script, the video, the
submission copy and the organizer questions, not new features.

**Proposed pitch:** ExplainBack turns a question into a bilingual, reviewable
interactive lesson. Learners predict, operate the model, inspect evidence, revise
their explanation, and try a new case.

**Selected story (revised Oct 28):** a sketch or question → Wonder drafts →
Spark tries it as a learner and its suggestions go into a revision → the learner
explains it back and is graded → the lesson becomes a narrated show. The
powered-vehicle lab is a 15-second aside at most. See the
[demo script](studio-demo.md) and the [frozen evaluation](studio-evaluation.md).

**Timeline correction, supplied by Doran on Oct 27:** before October 26, only
Muse API-key setup had been done. Application development started October 26.
“Baseline” in earlier records means a development snapshot, not proof of a
pre-event application. The Oct 26 kickoff / Oct 27 building-window boundary still
needs organizer clarification; this is separate from the corrected provenance.

### October 28 Pacific — organizer clarification and provenance follow-up

The [Discord FAQ](https://discord.com/channels/1557169028080869426/1557169028626251802/1564257793945632779) says that an existing project must submit a fresh standalone repository containing only event work; its demo should open by identifying pre-existing work and what was built this week. A separate [correction](https://discord.com/channels/1557169028080869426/1557169028626251802/1564291996036759676) says the building period starts after the kickoff session. The guide schedules kickoff for 9 a.m. Pacific on October 26; its actual end is not established here. This clarification supersedes the earlier assumption that the stated dates alone determine the boundary, but does not resolve every file's eligibility.

The preserved `docs/baseline/before-claim-testing.json` (captured 5:18 p.m. Pacific on October 26) records pre-9 a.m. modification times for application files, including `public/graph.mjs`, `public/math.mjs`, `src/server.mjs` and `src/meta.mjs`. The first two are byte-identical to the current checkout at `acb0ed3`. Timestamps are evidence requiring reconciliation with the user's earlier statement; they do not independently establish authorship or the origin of every line. See [submission provenance review](submission-provenance.md). The original repo cannot be described as a verified event-only extract on the basis of its first Git commit.

A local, narrow candidate exists at `output/submission-candidate-explainback/`: its included code first appears in later commits, but it is not the full product, not yet source-proven, not published and not a submission. Confirm the event-only boundary and rights, establish how to handle mixed dependencies, and finish a complete, runnable and publicly accessible judge-facing package before claiming R07 complete.

### October 28 Pacific — user timeline clarification

Doran believes the application work was after kickoff and requested that insignificant disputed files be removed and that the old helpers and server be replaced with more standard implementations. The earlier modification-time evidence remains recorded above and has not been independently reconciled. A full standalone local candidate now includes those replacements and has passed local tests and a clean install/build; see the [provenance review](submission-provenance.md) and SUBMIT-001 in the shared ledger for its validation and remaining eligibility questions.

### October 28 Pacific — public candidate and preview

The standalone candidate was published as [dorangao/explainbackapp](https://github.com/dorangao/explainbackapp), public `main` commit `a6e151e8404848eb4d52e5d14bf210c6ee424689`. A clean local clone is at `~/app/explainbackapp`. Vercel preview deployment `dpl_D4d3Uu4ZdZB99eNB6NtXPGRWyDsz` is reported READY at [the preview](https://explainback-kg8htkl23-doran-gaos-projects.vercel.app), with metadata for that same commit. Live access, sign-in and the full lesson flow have not yet been verified. **Follow-up, Oct 28 Pacific (LIVE-001, Claude):** after the domain cutover, the full flow was verified on `explainback.app` signed in with the judges invite: Wonder create 22.7 s, Spark tryout 4.0 s with a code-checked transfer answer, Wonder revision 21.5 s with two changed fields, explain-back graded in 3.5 s, local transfer check accepted, narrated show with Muse Image cover in about 40 s, EN/中 switch. The shot list is in the [demo script](studio-demo.md); spoken explain-back and narrow screens remain unverified live. Existing preview tester, model and Redis settings were retained; this did not deploy to production or submit to the hackathon. Eligibility and rights remain separate review items.

## Requirements checkpoint

Read the [participant guide](https://cerebralvalley.ai/e/meta-ai-developer-hackathon/details)
in signed-in Chrome on October 27. Deadline: **November 4, 9 PM Eastern / 6 PM
Pacific**; target submission **November 3**. The guide lists October 27–November 4
for building; the event home also describes an October 26 kickoff. Do not infer
eligibility from that date discrepancy.

| Requirement | Status | Evidence or remaining action |
|---|---|---|
| Meta model integration | Done | Latest release record includes default `muse-spark-1.3` and optional `muse-wonder-1.0`; accepted hosted calls are recorded in [release verification](vercel-deployment.md). |
| Public repository | Done | GitHub reports [dorangao/explainback](https://github.com/dorangao/explainback) public, MIT-licensed (copyright 2026 Doran Gao; `LICENSE`, `package.json`, README). Oct 28: no license requirement beyond a public repository was found in the Credit Terms PDF or public event copy; the Official Rules sit behind the Cerebral Valley sign-in, so Doran confirms them under R02. Final signed-out access check still due. |
| Event-built contribution clearly identified | **Unresolved** | User confirms pre-Oct-26 work was API setup only. Record the development ledger and clarify the Oct 26 kickoff / Oct 27 building-window boundary. Commit dates alone do not establish creation dates. |
| Beyond a simple education chatbot | Stronger fit; no eligibility ruling | Interactive authoring, controlled execution, review and transfer are working. Demonstrate these directly. |
| Track, theme and contributors | To confirm | Recommend Indie Developer + Build for Your World, subject to actual eligibility and date-boundary clarification. |
| Working product and accessible video | Partial | Live tester app exists; judge credential delivery and three-minute video remain open. |

Do not treat earlier development snapshots as evidence of pre-event app reuse.
Only the organizers can settle the guide’s kickoff/build-window date boundary.
Source/asset rights and applicable platform policies still apply.

## Where effort will help most

Weights are from the guide; assessments below are our own, not predicted scores.

| Judging area | Current strength | Best next evidence |
|---|---|---|
| Impact — 30% | Bilingual, interactive learning with an inspectable result | Observe 3–5 adult testers using the same short task; record completion, confusion, assistance and time. No learning-effectiveness claim from this small study. |
| Meta tooling — 25% | Muse authors structured lessons, revises them, selects bounded actions and explains computed results | Show a new topic becoming an operable lesson, then one explicit revision changing its behavior. Show the actual call/result. |
| Execution — 20% | Bounded interpreter, validation gates, replay, authentication, shared cloud state; current local checks: 243 Node tests, 21 component tests, 18 browser flows | Frozen generated-lesson checks, failure retention, reproducible setup, release/main alignment. Tests are engineering evidence, not model accuracy. |
| Demo — 25% | Powered vehicle animation, synchronized graphs, bilingual presentation | One rehearsed three-minute sequence with readable labels and reliable judge entry. |

## Lead story selected; alternatives retained

| Direction | What the judge sees | Tradeoff | Recommendation |
|---|---|---|---|
| **Lesson Studio leads** | A question becomes a reviewed interactive lesson; changing an input changes the result; Muse revises it; the learner tries transfer | Generated science needs review; creation latency must fit the video | **Selected by user.** Best reflects the latest work and makes Muse's role visible. Use the vehicle lab as a brief curated showcase. |
| Physics claim-testing leads | A surprising torque or suction claim becomes a checked experiment and revised explanation | Emphasizes earlier development snapshots; narrower authoring story | Strong fallback if Studio reliability is insufficient. Resolve the contribution boundary first. |
| Sketch-to-experiment leads | Muse reads a learner's force-arrow sketch, confirms its interpretation, then tests a bounded numerical claim | New image transport, ambiguity handling and a new evaluation set | Stretch only after the submission essentials; do not make it a dependency. |

**Authorized scope:** improve the Studio create → review → operate → explain →
transfer loop; retain the existing physics and quantum examples as supporting
material. The current generated renderers cover formulas/graphs and process
diagrams. They do **not** generate arbitrary 3D scenes or CFD. Do not present the
hand-built vehicle animation as something Muse created live.

### Use Muse more meaningfully

- **First:** let the demonstration show one explicit critique/revision, such as
  correcting a cache assumption or adding a cooling-rate output. Existing Studio
  supports this. Keep review, actual requests and changed results visible.
- **Next candidate:** a bounded experiment proposal: Muse suggests a parameter
  change and predicts its effect; the user applies it; code calculates the result;
  Muse reconciles any disagreement. Extend existing bounded suggestions and the
  suction design pattern; measure the quality of the proposal before expanding it.
- **Partially implemented:** Studio now accepts a bounded image with lesson
  creation; the latest release record includes a Wonder pendulum-sketch check.
  Confirming arrows/unknowns and checking ambiguous-image controls remain further
  work under X02; image transport does not establish faithful interpretation.

[Structured output](https://dev.meta.ai/docs/structured-output) is already used
for Meta lesson composition. It improves the data contract; it does not establish
scientific correctness. Avoid adding models, agents, voice or generated artwork
solely to increase the feature count. Keep Meta as hosted default; any local
Ollama evaluation remains strictly sequential.

## Progress checklist

Owner labels are proposed: **Doran** handles entrant decisions, organizer contact
and submission; **Build** handles implementation, QA and draft artifacts;
**Reviewer** means a person separately checking content. No messages have been
sent, rules accepted, or submission made by this update.

### Already delivered

- [x] **D01 — Live app:** production domain, tester login and server-only provider settings. [Evidence](vercel-deployment.md)
- [x] **D02 — Studio:** create, edit/revise, review, present, operate, export/import and EN/ZH. [Evidence](lesson-studio.md)
- [x] **D03 — Vehicle:** ground acceleration, thruster lift, sideways roll, forward inertia and powered landing, with separate baseline contact model. [Evidence](superpowers/plans/2026-10-27-powered-flight-release.md)
- [x] **D04 — Inspection:** provider console under a flag, filtered actual requests/responses, deterministic evidence and assistance labels. [Evidence](../README.md)
- [x] **D05 — Validation:** Studio-first production release passed 221 tests, build/secret checks and hosted entry/EN-ZH smoke checks. Full creation/revision/transfer checks for this change were local; see the demo record. [Evidence](vercel-deployment.md)
- [x] **D06 — Provider regression:** compact comparison and Qwen fixes exist. v4 ambiguity is 2/2 per model; Qwen's other six cases passed separately. This is not a fresh full three-model v4 comparison. [Evidence](tester-access-verification.md)
- [x] **D07 — Documentation correction:** README now describes current powered timing and language preservation; older verification records remain dated.

### P0 — Resolve before calling this submission-ready

- [ ] **R01 · Doran · Oct 28 — Contribution eligibility.** Clarify whether Oct 26 development after the kickoff qualifies when the guide lists Oct 27–Nov 4 for building. Disclose that pre-Oct-26 activity was only API setup. Record the reply and its scope; do not assume an eligibility ruling.
- [ ] **R02 · Doran · Oct 28 — Entry choice and rules.** Confirm track, theme, all contributors, eligibility and any required official-rule acceptance. Reading the guide or seeing the form is not acceptance.
- [ ] **R03 · Build + Doran · Oct 28 — Contribution ledger.** The [shared engineering ledger](implementation/progress-ledger.md#reconciled-progress-history) now maps features to commits and preserves the user-provided timeline. Commit dates do not establish every feature's creation date. Confirm remaining dates and contributors and add demo timestamps; eligibility remains separate.
- [x] **R04 · Doran + Build · Oct 27 — Choose the main story.** User chose Studio-first: help an adult learner/author turn a question into a reviewable interactive lesson. [Selected script](studio-demo.md)
- [~] **R05 · Build · Oct 29 — Source/release alignment.** Oct 28: `main` through PR #16 (`7e0f458`, docs at `8e39aee`) is deployed and aliased to explainback.app; every release since PR #8 is recorded in [the deployment notes](vercel-deployment.md) with a hosted check. Remaining: one final fresh remote/source/deployment check on the submission candidate.
- [ ] **R06 · Build + Doran · Oct 30 — Judge access.** Partly addressed Oct 27: five reviewed lessons now open at explainback.app without sign-in (`#lesson:<id>` deep links; playback makes no provider call). Creation/revision now accepts reviewer access codes (`EXPLAINBACK_ACCESS_CODES`, per-code hourly quota and expiry, `#invite:CODE` links) so the tester password stays private. Oct 28: a `judges` code (40/hour, expires 2026-11-20) is configured in Vercel Production and the invite link was verified on explainback.app, including one live creation and the Redis quota decrement. Oct 28 later: invite links now sign in again after sign-out in the same tab (PR #16), and six gallery lessons plus their narrated shows open signed out. Remaining: put the invite link in the submission copy; check session expiry and quota recovery once more in a fresh browser. Do not remove authentication silently.
- [~] **R07 · Build · Oct 30 — Publishable source package.** Oct 28: an MIT `LICENSE` and the GitHub `verify` workflow (Node 22 tests, build and browser checks on every PR) exist and pass. Remaining: setup from a clean clone, asset/attribution review (six Muse Image covers, one hand-drawn sketch), and a secret scan of the full history before publication. Raw eval outputs stay private.

### P1 — Make the submission convincing

- [x] **Q01 · Build · Oct 27 — Freeze a small Studio eval.** Six bilingual pairs, 12 cases; checksum, independent numeric probes and manual rubric fixed before the run. [Frozen protocol and results](studio-evaluation.md). This is separate from the older proposed 24-case claim benchmark.
- [ ] **Q02 · Build + Reviewer · Oct 31 — Run and report.** Automated baseline complete: 12/12 attempted, 12 valid contracts, 12 automated checks passed (8 drafts, 4 expected deferrals/refusals), no retries. AI-assisted author review found content issues; independent human review remains open. [Case findings](studio-evaluation.md). One model create/revise/operate/transfer flow is verified locally; process revision/transfer still needs a matching live run. Do not treat schema success as teaching readiness.
- [ ] **Q03 · Doran + Build · Nov 1 — Observe 3–5 testers.** Ask each to create/review a lesson, predict, change one input and explain a new case. Record assistance and friction with consent; no real student records. Decide fixes from observed problems.
- [ ] **Q04 · Build · Nov 1 — One presentation path.** Oct 28: the [demo script](studio-demo.md) is rewritten around the current product (sketch/question → Wonder → Spark tryout → revision → explain-back → show). Hosted checks exist for each step separately. Remaining: one full rehearsal of the sequence in a fresh browser, with timing, and narrow-screen checks.
- [ ] **Q05 · Build · Nov 1 — Release quality gate.** CI now runs Node 22 tests, build and browser checks on every PR (`.github/workflows/verify.yml`). Remaining for the final source: the secret scan and a last run on the candidate commit. Resolve review findings; the PR #2 bot review did not complete because of a usage limit, so it is not passing-review evidence. Local fresh-review evidence remains separately documented.
- [ ] **S01 · Build + Doran · Nov 2 — Rehearse and record.** Make a three-minute video with legible interactions, one real creation/revision, assumptions, a transfer result, and an accurate contribution disclosure. Label recorded/cached/demo-assisted material.
- [ ] **S02 · Build + Doran · Nov 2 — Submission copy.** Prepare team name, description, track/theme, public repo, accessible video, Meta usage and why Meta matters. Include the live app and judge access instructions in the description if the form has no dedicated field.
- [ ] **S03 · Doran · Nov 3 — Submit and verify receipt.** Recheck all required fields, repository/video access and final deployment; personally handle publication-consent/rule checkboxes. Submit through CV, then record confirmation/status. Deadline is Nov 4 at 6 PM Pacific; reserve the final day for recovery.

### Stretch, only after P0/P1

- [ ] **X01 — Bounded experiment proposal:** implement and evaluate one parameter-change → prediction → computation → reconciliation cycle.
- [~] **X02 — Sketch input:** Oct 28: Lesson Studio accepts a photo/sketch/diagram with the compose request (bounded data URL, browser downscaling, traces omit bytes); a frozen two-case pendulum-sketch suite exists and a sketch-drafted lesson is in the gallery. Open: the transfer question can name lengths the sketch does not show (a prompt rule "transfer values come from visible labels or are stated as assumed" is the proposed fix, to be measured on the image suite), and ambiguous/missing-arrow handling.
- [ ] **X03 — Open-weight demonstration:** only if an eligible Meta model completes the actual lesson workflow acceptably. A local provider selector or Qwen run is not proof for the Meta open-weight award. Keep the two Ollama models exclusive.

## Three-minute story

The storyboard lives in the [demo script](studio-demo.md) (updated Oct 28):
sketch or question → Wonder drafts → Spark tries it and its suggestions go into
a revision → the learner explains it back and is graded → narrated show → eval
numbers, limits, source and live URL. Record Wonder with honest time cuts or
use Spark as creator and say so; never pass a stored result off as live.

<details>
<summary>Evidence, unresolved questions and update log</summary>

### State at this checkpoint

- Production runtime: `3f947d593282cf558e686395fca7037978e1a02b`; live at
  [explainback.app](https://explainback.app/). [Deployment verification](vercel-deployment.md)
  distinguishes this release smoke test from earlier provider-flow checks.
- Runtime feature-branch commit: `3f947d593282cf558e686395fca7037978e1a02b`;
  deployment evidence is recorded in a subsequent documentation-only commit.
- Remote main: `aa69769316d4c330da55e6160c56119a67b9b625`, verified by remote
  reference lookup. [PR #2](https://github.com/dorangao/explainback/pull/2) merged
  `b49d7f3`; later powered-flight/output fixes still need integration.
- Initial Git commit `da3ca89` is dated October 26. Doran clarified that only
  API setup preceded Oct 26; application work began Oct 26. Reconcile the
  feature-level ledger with that user-provided timeline.
  October 27 commits bundle work; they do not establish when every line was built.
- Candidate event additions include suction, quantum, Studio and the powered
  journey, subject to the ledger and organizer ruling. Do not call them approved.
- The 24 attempts in the older provider matrix are **8 shared cases × 3 models**,
  not the separately proposed 24 distinct held-out claim cases. Generated-topic
  Studio evaluation now has a frozen baseline; independent human content review
  remains open.
- Formal acceptance, a submitted project, video publication, and judge access
  have not been verified. The submission form was inspected without editing it.

### Draft organizer questions — not sent

1. Application development began October 26 after the event kickoff; only Muse
   API setup preceded that date. Does that work qualify when the participant
   guide lists October 27–November 4 as the building period?
2. Does a reviewable lesson-authoring and executable claim-testing workflow fit
   the event's education guidance, when it distinguishes computed evidence from
   model judgments and does not present itself as general chat tutoring?
3. Is a tester-gated hosted app acceptable, and where should access instructions
   be supplied without placing shared credentials in the public repository/video?

### Updating this tracker

Keep IDs stable. Check an item only when its completion condition is met; add the
date and evidence link. A checked product item does not imply eligibility. Add
new blockers to P0, and move optional ideas to Stretch. Never put passwords,
tokens, private provider responses or tester personal information here.

- Oct 27: refreshed guide/form in signed-in Chrome; verified public GitHub and
  remote branches; reconciled shipped capabilities, current limitations and old
  evaluation plans; prepared this tracker and corrected current README claims.

</details>

- Oct 27: incorporated user timeline correction; implemented selected Studio-first
  flow and froze/ran 12 Meta cases. Content-review issues retained separately from
  automated passes. No commit, deployment, organizer message or submission.

- Oct 27: user requested commit, push and deployment. Studio-first runtime
  `3f947d5` is published at explainback.app; hosted entry/language/area smoke
  checks passed. No main merge, organizer message or submission.

- Oct 27 (later): added the signed-out lesson gallery (cooling, pendulum, HTTP caching, vehicle, quantum) with per-lesson provenance, and rewrote the README top as a judge-facing pitch. Local tests 226/226; not yet committed or deployed.

- Oct 28: deployed `318746b` (gallery, demo end-state fix, reviewer access codes) to production and verified the invite flow on the live site. See [release record](vercel-deployment.md#gallery-and-reviewer-code-production-release--october-28-2026). Submission copy and organizer questions remain open.
