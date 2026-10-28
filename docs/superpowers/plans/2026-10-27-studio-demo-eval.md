# Studio-first demo and evaluation implementation plan

> **For agentic workers:** Use superpowers:executing-plans for this selected scope.

**Goal:** Present Studio as the entry experience and measure twelve frozen bilingual lesson requests.
**Architecture:** Reuse Studio and its strict generated contract. Add small presentation helpers, a versioned fixture/manifest, a pure scorer and an explicit live CLI using Meta only.
**Tech Stack:** Node 22, browser modules/SVG, Meta Responses.
**Spec:** docs/superpowers/specs/2026-10-27-studio-demo-eval.md

## Global constraints
- English/Chinese; preserve draft, review gating, explicit requests and visible trace flag.
- No Ollama requests. Freeze cases before any author-prompt changes; retain failures.
- User clarified pre-October-26 work was API setup only; preserve dated historical records with a correction pointer.
- Stay in this existing feature checkout; no commit/push/deploy in this task.

## Review focus
- Changing an area or language must preserve draft/input state; explicit physics deep links remain usable.
- Example/revision starter clicks must not send a provider call or auto-approve a draft.
- Invalid generated output must not be counted as an accepted lesson or erase the existing draft.
- Missing/wrong model parameters and false numeric formulas must fail evaluation, even when schema-valid.
- Rejected calls remain in denominators; manual content review cannot be implied by a green contract score.

### Task 1: Frozen cases and evaluation

Files: eval/studio-v1.json, eval/studio-v1.sha256, src/eval/studio.mjs, scripts/eval-studio.mjs, test/studio-eval.test.mjs.
Interfaces: loadStudioSuite validates the checksum and case IDs; scoreStudioCase(case, response) reports contract/expectation/probe outcomes and manual review required; runStudioEvaluation({cases,call,onUpdate}) processes sequentially and retains rejected attempts.
- [x] Freeze six pairs with specified numeric probes and manual criteria.
- [x] Write failing tests for tampering, unknown/duplicate filtering, wrong numeric models, refusal categories, rejected-output denominators and sequential calls.
- [x] Implement scorer/runner and explicit --live CLI; raw reports under ignored output/eval only.
- [x] Run focused tests. Expected: all pass without provider access.

### Task 2: Studio-first presentation

Files: public/studio-showcase.mjs, public/lesson-studio.mjs, public/app.mjs, public/index.html, public/style.css, test/lesson-view.test.mjs, test/studio-showcase.test.mjs.
Interfaces: areaFromHash(hash) preserves explicit routes; showcaseCopy(language,kind) supplies short walkthrough and editable starter prompts.
- [x] Write failing tests for default routing and explicit routes, localized prompt loading without calls/review, revision preservation and busy-state guards.
- [x] Add Studio-first navigation and concise create/revise/operate guidance with prompt-loading buttons.
- [x] Run focused view/model tests. Expected: all pass.

### Task 3: Live verification, review and record

Files: docs/studio-evaluation.md, docs/studio-demo.md, docs/hackathon-readiness.md, README.md and dated plan pointers.
- [x] Run twelve frozen Meta cases, no automatic retry; save first-run hashes/results before considering a fix.
- [x] Review returned content against frozen rubric; disclose author review and unresolved errors. Verify create/revise/operate plus EN/ZH and console in the actual browser.
- [x] Run full tests/build/secret scan; request a fresh read-only review and fix material findings.
- [x] Correct provenance and update checklist with actual evidence, not inferred event eligibility.

Completion record: [demo verification](../../studio-demo.md), [frozen evaluation and supplemental scoring](../../studio-evaluation.md). Independent human content review and deployed candidate checks remain explicitly open in the readiness checklist.
