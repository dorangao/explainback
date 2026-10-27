# ExplainBack hackathon plan: test a claim, inspect the evidence, try again

Revised October 26, 2026, Pacific time. Proposed build scope, not an eligibility ruling or authorization to publish. This plan supersedes the earlier plans for hackathon scope; those files remain records of the existing prototype.

Implementation update: the crossing P0 core is now implemented locally. See [verification and contribution record](../../claim-testing-verification.md). Actual work began October 26 Pacific; baseline reuse and competition eligibility remain unresolved. P1 evaluation and submission work remain open.

## Product promise

**ExplainBack turns a learner's mathematical claim into a checked experiment, then tests whether the learner can use the resulting distinction on a different problem.**

Audience for this entry: adults learning or revisiting calculus, using synthetic examples in the demonstration. English and Chinese remain supported. Do not describe the entry as ready for schoolchildren while the provider age-policy question remains unresolved.

Problem statement: **Build for Your World**. Proposed competition track: **Indie Developer**, subject to the entrant's actual eligibility. These are separate choices.

The useful result is an inspectable record of a claim, a prediction, a checked observation, a revised explanation, and a transfer attempt. A conversation or a fluent answer alone does not complete the task.

## Why this is a substantive extension

The participant guide explicitly names simple education chatbots among projects to avoid. A new name, agent label, voice interface, or extra prompt does not resolve that concern. The entry must show a functional distinction:

| Capability | Existing prototype | Hackathon contribution proposed here |
|---|---|---|
| Adaptive coaching | Meta chooses among six native function tools | Meta proposes an explicit, learner-confirmed claim and an experiment that can distinguish it |
| Mathematics | Nine fixed formulas, point evaluation, graphs, known facts | Structured evidence records tied to claim scope, formula identity, and bounded verification methods |
| Progression | Prediction, graph, and transfer prerequisites | Separate numerical task results from model judgments about the learner's explanation |
| Transfer | Two checked variants per topic | An evidence-linked comparison that distinguishes independent, assisted, and inconclusive attempts |
| Inspection | Action history and teaching purpose | A visible claim-to-evidence trail with replay of recorded tool execution |
| Evaluation | Six live initial-response smoke cases documented | A frozen bilingual challenge set plus complete multi-turn workflow checks |

This is a proposed differentiation argument. Organizer acceptance remains unresolved.

## Existing work and the event boundary

Current source and documentation already contain the local Node application, bilingual UI, Meta Responses integration, six adaptive actions, fixed mathematics and graphs, transfer variants, validation gates, request limits, and verification notes. All are baseline work; none should be relabeled as hackathon inventions.

The guide lists October 27–November 4 as the building period. Earlier local plan files are dated October 25. Dates in documents alone do not establish exact implementation times. Before competition implementation:

- [ ] Preserve a private, secret-free baseline inventory with actual timestamps and checksums for relevant source files; record what is known and unknown about when it was created.
- [ ] If Git is initialized, preserve the baseline honestly. Do not backdate commits or imply newly initialized history proves earlier dates.
- [ ] Ask organizers whether a solo entrant may extend this existing prototype and whether the proposed claim-testing workflow fits their education-project guidance. Draft questions below; sending is a separate action.
- [ ] Maintain a contribution ledger linking each new feature to its files, dates, checks, and demo timestamp. Only show eligible work as the competition contribution.

If reuse is not permitted, do not rebuild the same features and call them new. Re-scope with organizers before implementation.

## Recommended approach and alternatives

**Recommended: a bounded mathematical claim-testing workbench.** Extend the existing Node/JavaScript application and Meta API adapter. Concentrate depth on horizontal-asymptote crossing; retain the other two topics as baseline examples until the main workflow is complete.

Alternative: expand the coach across more calculus topics. This increases curriculum breadth but gives weaker evidence of differentiation and adds mathematical QA work.

Alternative: prioritize a self-hosted open-weight model and bonus-prize entry. This is eligible in principle under the guide, but serving and adapter work could consume the event without improving the learning workflow. Keep it optional after the core demo works. Do not claim local-model compatibility until tool behavior and the full workflow pass on that model.

## The new workflow

1. **Capture the claim.** Meta proposes a supported claim category, an exact quote, and its scope. The learner confirms or edits the interpretation before the experiment. Ambiguous wording leads to clarification. Unsupported claims stay explicitly outside the checked scope.
2. **Choose a distinguishing experiment.** Meta selects a server-defined experiment ID and eligible parameters. For the first vertical slice, the question is whether a horizontal asymptote forbids equality or crossing at finite input. The learner predicts before results appear.
3. **Execute and qualify the evidence.** The server evaluates an allowlisted formula and returns a structured result. It separates equality at a point from crossing, and finite behavior from end behavior. No model-generated code or arbitrary formula execution.
4. **Revise the explanation.** Show the original claim, prediction, checked evidence, and a place to explain what the evidence establishes. Meta can ask a focused follow-up. The model's interpretation remains labeled as a judgment.
5. **Attempt transfer.** Select an unused verified variant that changes both the asymptote height and crossing input. Record any hints or graph assistance. Compare the explanations with exact quotes and referenced evidence.
6. **Inspect the outcome.** Show checked task facts, the model's reasoning assessment, assistance used, and unresolved uncertainty separately. Successful performance on one transfer task is not proof of lasting mastery.

### Concrete demonstration

Claim: “A horizontal asymptote means the curve cannot cross that line at any finite x.”

For `f(x) = x/(x²+1)`, the learner predicts what happens at zero. Code checks `f(0)=0`; that establishes intersection. Crossing is supported separately by the sign change: the denominator is positive, and the numerator changes sign across zero. The end-limit explanation uses the verified algebraic fact that the ratio tends to zero, not a collection of plotted points.

After revision, use an existing unused variant such as `g(x) = -1 + (x+2)/(x²+1)`. The learner must distinguish the asymptote `y=-1`, the finite crossing at `x=-2`, and why they are compatible. This example uses baseline formulas; the new contribution is claim confirmation, qualified evidence execution, and evidence-linked transfer reporting.

## Build priorities and acceptance criteria

### P0. Claim confirmation and bounded experiment selection

Primary touchpoints: `src/learning.mjs`, `src/problems.mjs`, `src/meta.mjs`, `public/app.mjs`, `public/index.html`.

- [x] Introduce a small claim taxonomy for finite intersection, finite crossing, and end behavior; use explicit scope and exact source quotes.
- [x] Add learner confirmation and an unsupported/ambiguous path before testing the interpretation.
- [x] Let Meta select only an eligible experiment from the current server state. Preserve one bounded model call per learner submission and existing cost limits.
- [x] Test scope changes, misquoted text, unsupported claims, unknown experiments, and attempts to skip prediction. Rejections must leave session state unchanged.

Done when both a clear false claim and an ambiguous claim take the appropriate different routes in English and Chinese, without an invented diagnosis.

### P0. Evidence engine and trace

Proposed additions: `src/evidence.mjs`, `test/evidence.test.mjs`; integrate with `src/learning.mjs` and `src/server.mjs`.

- [x] Define versioned evidence records containing claim ID, formula ID/version, experiment ID, inputs, computed result, method, supported conclusion, and limitations.
- [x] Use exact checked identities or vetted analytical facts for the fixed catalog. Label floating-point samples as observations. Do not equate a graph, approximate equality, or a finite search with proof of a limit or absence of crossings.
- [x] Separate model-proposed interpretation, deterministic result, and model explanation in the trace. Expose decisions and tool outcomes, not private model reasoning.
- [x] Reject evidence references from another session, formula, or claim. Only accepted server results may support progression.
- [x] Add deterministic replay that recomputes recorded experiments and checks results without another model call. Replay verifies execution, not the correctness of the language interpretation or tutoring judgment.

Done when the crossing demo has a reproducible evidence trail and fabricated or stale evidence cannot unlock progression.

### P0. Evidence-linked transfer report

Touchpoints: `src/learning.mjs`, `public/app.mjs`, `public/index.html`, `public/style.css`, `test/learning.test.mjs`.

- [x] Present a compact sequence in the existing interface: claim → prediction → evidence → revision → transfer.
- [x] Cite actual evidence IDs in the report, alongside original and revised quotes. Do not invent a correction for an initially correct explanation.
- [x] Distinguish independent transfer, assisted transfer, and insufficient evidence. A correct number with incorrect or missing reasoning must not be presented as demonstrated conceptual understanding.
- [x] Show API failure as an error; never substitute a scripted response labeled as live AI. Preserve reset, session expiry, language behavior, and mobile usability.

Done when the learner and a judge can inspect what was checked, what Meta inferred, what help was used, and what remains uncertain.

### P1. Frozen evaluation and demonstrable reliability

Proposed additions: `eval/claim-cases.json`, `docs/hackathon-evaluation.md`; extend `scripts/evaluate.mjs` and relevant tests.

- [ ] Freeze 24 synthetic cases before tuning: 12 English/Chinese pairs covering explicit misconceptions, valid explanations, ambiguity, equality versus crossing, approximate evidence misuse, and adversarial/out-of-scope requests. Each case includes allowed actions and prohibited conclusions, rather than one mandatory wording.
- [ ] Obtain a separate human review of expected mathematical conclusions and ambiguous wording. If unavailable, disclose author-created labels rather than claiming independent validation.
- [ ] Keep development cases separate from a held-out subset. Record any later exposure or prompt changes that compromise the holdout.
- [ ] Run complete multi-turn scenarios: misconception to transfer; ambiguity to clarification; already-correct explanation; assisted transfer; invalid evidence; upstream failure/reset. Include both languages across the set.
- [ ] Report denominators and failure examples separately for claim interpretation, evidence correctness, transition safety, and transfer-report faithfulness. Record model/version, date, prompt/catalog versions, latency, and bounded call usage.

Target: every deterministic math/integrity check passes; no fabricated evidence or false independent-success claim in reviewed scenarios. Fix critical failures and rerun affected checks. Publish actual model results even if imperfect; the small synthetic evaluation does not establish learning efficacy or tutoring accuracy in the wild.

### P1. Submission artifacts and accessible demonstration

- [ ] Prepare a public-source candidate, reproducible setup, sample configuration, model requirements, limitations, contribution ledger, and three-minute video script.
- [ ] Audit the entire proposed public tree and any history for credentials, private data, generated logs, and synced secret files. Git ignore alone is insufficient.
- [ ] Decide how judges can try the product: a deployed adult-only demo requires a separate deployment design, server-side secrets, access/abuse limits, and a review of applicable model terms. The existing loopback-only server must not simply be exposed publicly.
- [ ] If hosting is not feasible, prepare reproducible local setup and a working live presentation, and clarify with organizers whether that access is sufficient. Do not assume video alone satisfies their live-product expectation.
- [ ] Verify repository/video access from a signed-out view after publication is authorized. Publishing, deployment, and submission remain separate actions.

### Optional after P0/P1

- Verify one eligible open-weight model on DGX Spark or partner inference against the same workflow; retain accurate provider/model labeling. Pursue the open-weight bonus only with working evidence.
- Extend claim/evidence coverage to the other two existing topics once crossing is reliable.

Do not prioritize voice, avatars, RAG, general homework help, extra subjects, accounts, classroom features, autonomous grading, or a second agent merely to create an agentic appearance.

## Suggested event schedule

All dates are 2026, Pacific time. Adjust to confirmed baseline/reuse permission and actual progress.

| Date | Deliverable |
|---|---|
| Oct 27 | Baseline inventory, eligibility clarification, frozen claim/evidence schema and first vertical slice |
| Oct 28–29 | Checked crossing experiment, trace, replay, and invalid-evidence checks |
| Oct 30–31 | Evidence-linked transfer, bilingual/mobile interaction, frozen evaluation labels |
| Nov 1–2 | Held-out/live workflow evaluation, failure fixes, judge-access decision and submission candidate |
| Nov 3 | Feature freeze; full rehearsal, source/access audit, video recording and contribution review |
| Nov 4 | Final access checks and submission well before **6 PM Pacific / 9 PM EST** |

If behind schedule, cut extra topics and open-weight serving first. Keep claim confirmation, one sound experiment, qualified evidence, transfer, and honest provenance.

## Three-minute video outline

- **0:00–0:20:** A concrete learner claim and the practical problem; identify reused baseline and new event contribution briefly.
- **0:20–1:10:** Learner confirms the claim, predicts, and sees Meta select a checked experiment. Show intersection versus crossing evidence.
- **1:10–1:50:** Revised explanation and a fresh transfer attempt; show what changes when help is requested.
- **1:50–2:25:** Evidence trace, deterministic replay, and one rejected invalid progression. Explain the boundary between checked math and model interpretation.
- **2:25–3:00:** Actual evaluation results, known failures/limits, and where judges can inspect code and try the product.

Recorded sessions must be labeled; live calls must actually use the stated model. Do not portray synthetic cases as real student outcomes.

## Organizer questions to resolve

1. May a solo Indie Developer entrant extend an existing local prototype if the baseline and event-built features are clearly identified? The prototype predates the listed October 27 building period.
2. Does this bounded workflow—learner-confirmed claims, model-selected experiments, deterministic mathematical evidence, and transfer verification—fit the event's guidance excluding simple education chatbots?
3. What access is required for the live product: must it have a public hosted URL, or is reproducible local setup with a working demo acceptable?

## Rule source and evidence boundary

Source: [Meta Global AI Developer Hackathon Participant Guide](https://cerebralvalley.ai/e/meta-ai-developer-hackathon/details), reviewed in logged-in Chrome on October 26. The guide requires Meta model use, public repositories, identification of event-created contributions, and a three-minute video; it lists the building period and education anti-project examples. The rubric weights impact 30%, Meta tooling 25%, technical execution 20%, and demo 25%.

Current baseline was inspected through `README.md`, `docs/adaptive-coach-verification.md`, the October 25 adaptive plan, `src/problems.mjs`, `src/learning.mjs`, `public/math.mjs`, and `scripts/evaluate.mjs`. Historical verification notes are reported evidence, not newly rerun results. This revision changes planning documents only.
