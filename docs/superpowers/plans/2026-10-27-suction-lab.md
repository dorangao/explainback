# Suction lab implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved bilingual pressure, orientation, leakage and constrained-design lab with a fresh robot transfer.
**Architecture:** Shared pure bounded physics; immutable replayable server evidence; a suction-only design phase in the existing claim engine; SVG exploration and a five-call Next-guided demo using the existing authenticated provider console.
**Tech Stack:** Node 22, native ESM, HTML/CSS/SVG, node:test, headless Playwright.
**Spec:** ../specs/2026-10-27-suction-lab-design.md (approved by user October 27).

## Global Constraints
Meta remains default. No Ollama calls. Preserve existing uncommitted Vercel work. No deployment, push, or commit in this task. Secrets and live artifacts remain ignored. Existing labs are baseline; this extension is dated October 27, with no eligibility assertion. Every model call is visible in the gated console; deterministic exploration does not call a model. No safety certification, CFD, measured vehicle inputs, or fan-capacity claim. Orientation is a sequence of static cases.

## Review Focus
Ceiling reaction direction; unilateral contact; friction at intermediate angles; leakage power scaling and bounds; 30 kW constraint; replay integrity; design citation requirements; stale/cancelled demo protection; bilingual transfer correctness and no leaked answers before help.

- [x] 1. Add pure suction model and fixed scenario catalog. Test default numerical anchors, negative contact, pressure/power limits, all-angle threshold, candidates and robot variants before integration.
- [x] 2. Add suction domain/evidence, strict propose_design action and design-review phase. Integrate server session/status/static routes. Test phase prerequisites, schema/citation rejection, replay, unchanged legacy workflows and HTTP persistence.
- [x] 3. Add integrated bilingual lab controls, synchronized SVG force/pressure/orientation views, comparison cards, presets, and five-call guided demo with Next. Exercise cancellation and unexpected responses.
- [x] 4. Run compact bilingual synthetic eval and live Meta guided workflows. Inspect desktop/mobile UI. Obtain fresh independent review, fix findings, run full tests/build, and record limitations and evidence.

Execution ruling: the user approved the detailed design and asked to build; no repeated approval gate. Native execution in a feature branch preserves pending cloud changes needed by the app. Use a fresh reviewer for the final integrated diff. No per-task commits because this request is implementation only.

Completion evidence: docs/suction-lab-verification.md. 162 tests, 12 + 2 focused live cases, final bilingual five-call demos, eight real-DOM review regressions, build and secret check passed. All review findings addressed.
