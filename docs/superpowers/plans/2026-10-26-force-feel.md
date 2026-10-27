# Force and feel implementation plan

> Use superpowers:executing-plans inline, with a fresh final code review.

**Goal:** Extend the existing bilingual claim lab with mass, force, grip, power, jerk and a sine/cosine profile.
**Architecture:** Shared pure model and deterministic evidence; existing confirmation/prediction/revision/transfer gates. Integrate plots and a comparison table into the current visual pane.
**Tech stack:** Existing Node ES modules, browser DOM/SVG, node:test; no dependencies.
**Spec:** User requests weight, practical acceleration/force, smooth feel and sin/cos in the current interactive lab. Choices below are implementation decisions within that authorized extension.

## Design and constraints

- Retain existing source archives; capture this acceleration version as `docs/baseline/before-force-feel.*`. No Git repository, commit or deployment requested.
- Extend settings with total mass 1200/2000/2800 kg, effective grip μ=0.6/1/1.5, wheel power 300/600/1200 kW; add 5/8 second intervals. These are hypothetical values, never Tesla specs.
- A remains uniform acceleration; B may rise, fall or use a cosine acceleration pulse. For u=t/T: a_B=(V/T)(1−cos(2πu)), v_B=V[u−sin(2πu)/(2π)], j_B=(2πV/T²)sin(2πu). Analytic distance ends at VT/2. Acceleration and jerk join zero at rest/cruise endpoints; peak acceleration is 2V/T.
- Use level ground, constant mass, all normal load available for propulsion, g=9.80665; no drag, rolling resistance, downforce, thrust, load transfer, torque curve, thermal limits, suspension, rotation or landing. F=ma, weight=mg, traction ceiling=μmg, wheel P=Fv. Necessary ideal checks only, no feasible/safe/comfortable vehicle verdict.
- Calculate profile peak demands analytically (one bounded root for cosine power). Show in-interval jerk and separately label acceleration jumps for uniform/rising/falling when joined to rest/cruise. Do not claim zero interior jerk implies a smooth start.
- New force-feasibility and smoothness claims use checked evidence and appropriate fresh transfer fields. Old crossing and motion claims keep their workflows. Hide numeric evidence/plots until prediction; hide new transfer answers until help or completion.
- English/Chinese, accessible table/controls, mobile layout. Current settings immutable per session; reset to change.

## Approach

An integrated ideal limit check answers this request within the current claim workflow. A full vehicle simulation would need unavailable tire/motor/aero parameters. A static explanation alone would not let the learner test assumptions. Build the integrated check and explicitly expose its limits.

## Review focus

Mass versus weight units; peak versus average power; uniform jerk endpoint discontinuities; cosine equal-distance cases; evidence/transfer binding to new settings without answer leaks.

## Tasks

- [x] Model: add independent numerical fixtures for force, power, jerk, scaling, boundaries, grip and invalid inputs; observe failure, implement `motionAt` extension plus `physicsAt` and `physicsSummary`, run tests.
- [x] Workflow: add new experiment kinds, physics-bound IDs, replay checks and claim-specific transfer fixtures; observe failure, implement prompts/evidence/schema handling, run tests.
- [x] UI: add fixed settings, profile, graph metrics and bilingual force/feel table, sources and boundary explanations. Verify current desktop and narrow Chinese UI plus a full live claim cycle.
- [x] Final: full suite, security check, baseline integrity, fresh independent review, verification record and release wake lease.
