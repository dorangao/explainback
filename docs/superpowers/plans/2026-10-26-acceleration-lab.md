# Roadster-inspired acceleration lab

User approved implementation: interactive acceleration first, English and Chinese, using the existing claim-testing workflow. This extends the completed crossing prototype; prior work is baseline, preserved in `docs/baseline/before-acceleration.*`. Record actual dates; do not claim competition eligibility.

## Design and constraints

Compare hypothetical cars A and B starting from rest and reaching the same final speed V after T seconds. A uses v=V(t/T). B uses either v=V(t/T)^2 (rising acceleration) or v=V(2t/T-(t/T)^2) (falling acceleration). Closed-form derivatives and integrals provide instantaneous acceleration and displacement. Domain 0<=t<=T only; endpoints use within-interval one-sided derivatives. No claims about motion before/after the interval.

The scenario is inspired by curiosity about Roadster, not measured Tesla telemetry, a specification, or a force/power/traction model. Prescribed 1D velocity profiles omit drag, traction, drivetrain limits, jerk transitions and 3D motion. No flip/landing simulation, safety assessment, vehicle control or stunt instructions.

Before starting, select hypothetical speed (30/60/90 mph), duration (1/2/3 s), and B's profile. Freeze settings per session. After claim confirmation and prediction, the server executes a scoped experiment, then releases speed/acceleration/displacement graphs with a time scrubber. Graphs derive from the same analytic model as evidence. Parameters cannot silently change an existing claim/evidence record.

Claims: average versus instantaneous acceleration; same endpoints versus distance. Experiments cite exact formulas, SI unit conversions and analytic integrals; scoped conclusions distinguish what was tested. Both experiments expose sufficient checked values for a transfer requiring the average acceleration and signed distance B-A; the reasoning must explain the distinction relevant to the confirmed claim. Transfer contexts use km/h and new time/profile values. Enter numbers separately; accept rounding within 0.01 SI units. A correct number without sound reasoning cannot complete. Meta judges language; deterministic code checks numbers and evidence.

Reuse the claim state machine through domain adapters, preserving crossing defaults, confirmation/revision/replay, request caps, reset/expiry and independent/assisted reporting. During transfer the graph is hidden; requesting it through Meta counts as help. No hidden transfer answers in the public scenario payload.

## Tasks and checks

- [x] Analytic motion model: independent numerical oracles, units, endpoints, domain validation, signed areas and forbidden settings.
- [x] Domain adapters and evidence: both languages, immutable scenario IDs, claim/experiment compatibility, replay/context integrity; existing crossing tests remain green.
- [x] HTTP integration: allowlisted topic/settings/answer shapes, session-scoped parameters, reset/races/security regression checks.
- [x] Interactive UI: controls, assumptions, graph views with units/time scrubber, accessible text metrics, transfer fields/report labels in both languages.
- [x] Verify: full offline suite, bounded live Meta flow, English desktop and Chinese mobile browser, wrong reasoning with correct numbers, baseline hash and configured-secret scan.

No dependency install, publication, deployment or Git initialization is required. Keep a contribution/verification record. The frozen 24-case independent evaluation remains separate work.

Implementation complete for this scope; see `docs/acceleration-verification.md`. No competition eligibility determination or external publication occurred.
