# Powered Flight Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a verified bilingual hosted learning flow and a physically explicit powered vehicle journey.

**Architecture:** Preserve baseline flight/contact math. Add a deterministic powered journey using existing motion/rotation helpers and feed its states into the synchronized renderer. Use the existing Vercel project and Redis with environment-specific namespaces.

**Tech Stack:** Node 22, native browser modules/SVG, Meta Muse, Vercel, Upstash.

**Spec:** docs/superpowers/specs/2026-10-27-powered-flight-release.md

## Global Constraints

- Keep baseline experiments intact and label differing landing models.
- English/Chinese; Meta default and only hosted provider.
- No secrets, local eval output, or private configuration in Git/upload.
- Commit/push and production/domain release are explicitly authorized.

## Review Focus

- Phase boundaries must preserve position/velocity and stop roll before landing thrust.
- Mass changes must affect required thrust without changing prescribed trajectory.
- Language switching must preserve current animation time.
- Guided graphs must not conflate ground contact with landing thrust.
- Hosted creation/revision failures must preserve a usable draft and filtered console.

### Task 1: Powered vehicle journey

Files: public/powered-journey.mjs, public/journey-view.mjs, public/app.mjs,
public/demo-guide.mjs, test/powered-journey.test.mjs.
Interfaces: poweredJourneyScenario(motion,flight) returns launch, rollStart,
landing, touchdown, end; poweredJourneyAt(s,t) returns continuous motion and
thrust/support/rotation/jet states.

- [x] Write and observe failing tests for continuity, force balance, mass scaling, forward inertia and validation.
- [x] Implement the model, update renderer and guided bilingual copy.
- [x] Verify math tests and browser phase controls/language continuity.

### Task 2: Hosted verification and release

Files: .vercelignore, docs/vercel-deployment.md; cloud configuration.
Consumes Task 1's UI; produces tested preview and exact-commit Production release.

- [x] Run preview login, real creation, review, present, operate, language and console checks; fix observed failures.
- [x] Run full tests/build/secret and upload checks; obtain a fresh review.
- [ ] Commit scoped changes and push existing branch.
- [ ] Configure Production server variables/Redis, deploy, assign domain and verify DNS/HTTPS and hosted smoke.
- [ ] Record concrete evidence and remaining limitations.
