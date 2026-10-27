# Crossing claim-testing extension: verification and contribution record

Implemented October 26, 2026, America/Los_Angeles. This is the actual local work date, not a claim that this work qualifies under a competition building period beginning October 27. Organizer confirmation remains unresolved. No publication, deployment, submission, Git initialization, or commit occurred.

## Baseline preserved before edits

`baseline/before-claim-testing.json` records UTC capture time, observed modification times, and SHA-256 hashes for 18 allowlisted source files. `baseline/before-claim-testing.tar.gz` preserves their content. All archived files were checked against the manifest after implementation. Environment files and credentials are excluded. Modification times and this capture are not proof of original creation dates.

Baseline capabilities: bilingual local adult/synthetic app, Meta Responses transport, six adaptive coach actions, nine fixed math formulas, graphs, two transfer variants per topic, request/security controls, and 30 passing tests. The baseline transport in `src/meta.mjs`, formula catalog, evaluator, graph renderer, and original learning tests were not changed.

## New contribution

| Work | Files | Result |
|---|---|---|
| Bounded evidence and deterministic replay | `src/evidence.mjs`, `test/evidence.test.mjs` | Versioned claim/session/formula/experiment records; fixed algebra distinguishes equality, crossing and end behavior; forged/stale replay fails |
| Claim-testing state machine | `src/claim-testing.mjs`, `test/claim-testing.test.mjs` | Native Meta claim proposal and experiment choice; local confirmation/revision; prediction before execution; evidence-linked transfer |
| Existing app integration | `src/learning.mjs`, `src/server.mjs`, `test/server.test.mjs` | Explicit workflow selection; local confirm/replay endpoints; inherited request caps, reset, expiry, Origin/Host and static-file restrictions |
| Bilingual UI and outcome report | `public/app.mjs`, `public/index.html`, `public/style.css` | Visible confirmed claim and decision history, checked evidence, replay, learner-entered values, model judgment and assistance status |
| Repeatable opt-in live smoke | `scripts/claim-smoke.mjs`, `package.json`, `docs/claim-smoke-results.json` | At most six synthetic calls; no retries; model and latency recorded without keys, prompts, or raw upstream errors |

Claim confirmation means the learner accepts the interpretation, not that the claim is true. Learner numeric values must match the fixed catalog before completion is offered. Meta still assesses the substance of the prediction and explanation; server checks do not prove semantic understanding. The report separates these judgments from deterministic facts.

## Fresh verification

- `npm test`: **48 passing, 0 failing**, including the 30 baseline tests. New coverage includes claim correction and confirmation provenance, native schema constraints, scoped experiment eligibility, fabricated/duplicate/stale evidence, replay integrity, checked transfer values, assisted/incomplete outcomes, malformed input, HTTP confirmation/replay, reset races and 30-minute expiry.
- Syntax checks passed for changed server/browser modules.
- `npm run security:check`: configured key absent from other project files; `.env.local` retains private permissions and its ignore rule. Baseline source contents were also scanned before modification. A compressed archive's bytes alone are not a sufficient secret scan; its recorded source contents were separately checked.
- Final live smoke: **6/6 expected actions passed**, model `muse-spark-1.3`, timestamp and latencies in `claim-smoke-results.json`. Two bilingual ambiguity checks and four stages of an already-correct English claim through independent transfer. This uses scripted adult synthetic inputs, author-created expectations, and no independent human label review.
- Live browser: English claim interpretation was revised, then confirmed; prediction produced checked crossing evidence; revision reached transfer; correct values plus reasoning completed an independent attempt.
- Live browser: Chinese ambiguity clarification, confirmation, prediction, evidence execution, replay and assisted transfer worked. Correct numeric fields with contradictory boundary reasoning remained incomplete; a corrected explanation completed as assisted. The confirmed claim stayed visible and both replay buttons were enabled after completion.
- Final Chinese mobile viewport: 390px, document scroll width 375px (scrollbar included in viewport), no horizontal overflow. Desktop checked at 1440×1000. Final browser console reported 0 errors and 0 warnings.
- Separate read-only code review and follow-up review found no actionable blocking defects. This is review evidence, not proof of model accuracy.

## Issues found and repaired

1. Browser replay buttons initially stayed disabled because rendering occurred during a teaching request and final controls did not reenable dynamic buttons. Controls now update them; live replay was verified before and after transfer completion.
2. A Chinese unscoped statement initially returned a clarification tool with an incompatible assessment. Server validation rejected it without advancing state. A direct synthetic reproduction isolated the schema/validator mismatch. Native schemas now constrain clarification to `ambiguous`, proposals to supported/misconception, and progression to `supported`. Regression test and final bilingual live checks passed; there is no silent coercion or automatic retry.

## Artifacts

- `output/playwright/claim-testing-en-desktop.png`: English independent completion before the final claim-event display refinement; the old disabled replay controls visible in this capture are historical evidence of the issue above.
- `output/playwright/claim-testing-zh-mobile-final.png`: final Chinese mobile completion with visible confirmed claim and working replay.
- `output/playwright/claim-testing-transfer-report.png`: final assisted transfer report.

## Scope and limits

The implemented core is the crossing topic only. The other two topics retain the baseline coach. The three crossing experiments use vetted fixed identities; there is no arbitrary symbolic verification, user-generated formula execution, or general claim prover. Evidence replay recomputes fixed experiment records, not model interpretations or learning outcomes.

The separate frozen 24-case evaluation, independent mathematical/label review, public-source release, judge-access hosting, video and submission package, provider age-policy resolution, organizer eligibility clarification, and open-weight serving remain outside this completed core implementation. No claim of learning efficacy, lasting mastery, or competition acceptance is made.

## Run

`npm run dev` starts the local adult/synthetic app at the configured loopback port (default 4173). Select crossing to use the new workflow. `npm test` and `npm run security:check` are offline. `npm run claim:smoke` explicitly makes up to six live calls and overwrites its results file.
