# Flip and landing implementation plan

> Execute inline using superpowers:executing-plans and test-driven-development; request one fresh final review.

**Goal:** Add an interactive bilingual flip/landing stage to the existing Roadster claim lab.
**Architecture:** Pure closed-catalog physics shared by server and browser; a flight domain adapter in the existing claim engine; replayable deterministic evidence; SVG schematic and graphs with scrub/play controls.
**Tech stack:** Existing Node/browser ES modules and node:test, no dependencies.
**Spec:** User explicitly requested implementation of torque, rotation and landing forces through the same claim-testing workflow, with clear assumptions and English/Chinese. The choices below implement that scope.

## Design

- Add Roadster stage navigation between acceleration and flip/landing; changing stage resets the transient session. Keep both stages directly selectable in the topic list. Baseline archive `before-flip-landing.*` preserves current source.
- Settings: mass 1200/2000/2800 kg; airborne time T=1/1.5/2 s; radius of gyration k=0.6/0.9/1.2 m, I=mk²; ideal force-couple separation d=0.5/1/1.5 m; vertical stopping time D=0.05/0.15/0.3/0.6 s; constant/pulse contact profile. All hypothetical, no Tesla data.
- Vertical flight: same takeoff/touchdown reference height, uniform g=9.80665, no drag or lift. Initial upward speed gT/2; h=g t(T−t)/2; v_y=g(T/2−t); impact speed U=gT/2. Takeoff mechanism and horizontal motion omitted.
- Rotation A: initial ω=2π/T, θ=2πt/T, zero airborne torque. Its initial spin must have been supplied before flight, not modeled. Rotation B: θ=2πu−sin(2πu), ω=(2π/T)(1−cos(2πu)), α=(4π²/T²)sin(2πu), τ=Iα. Ideal external pure couple has zero resultant force; each perpendicular force magnitude |τ|/d. Positive then negative torque changes and brakes spin; angular impulse over a rest-to-rest turn is zero, not torque identically zero.
- Vertical contact model: no rebound, center-of-mass velocity goes from −U to 0 in D. Constant net acceleration U/D or pulse net acceleration (U/D)(1−cos(2πq)). Contact force N=mg+ma. Both average N=mg+mU/D and stopping travel UD/2; peaks respectively average N or mg+2mU/D. Contact impulse includes gravity, net impulse mU. Ideal endpoint force jumps are labeled.
- Pitch/contact coupling is NOT simulated. Rotation display ends at touchdown; A's residual spin/energy remains unresolved and is not silently stopped. Vertical-only contact curves do not certify any real landing. No suspension, tire contact distribution, structural/occupant loads, actuator capability, aero, rebound, or safety verdict. Schematic is not to scale and not a stunt guide.
- Claim kinds: rotation-torque, landing-impulse, landing-state. Numeric transfer fields: peak torque + A residual angular speed; average + peak contact force; downward impact speed + A residual angular speed respectively. Two fresh fixed transfer scenarios independent of primary settings. Correct numbers still require model-supported reasoning; no safety conclusions.
- All plots and tables gated behind prediction. Fresh transfer graphs/results hidden until explicit help or completion. Local replay preserves all settings and context. Units rad, rad/s, N·m, N, m/s are explicit.

## Review focus

Gravity in contact force versus net force; average versus peak; airborne initial angular momentum; nonzero residual spin not animated as stopped; transfer state/evidence leaks or mismatched configuration.

## Tasks

- [x] Write failing pure-model tests for ballistic endpoints/apex, torque/force-couple scaling, zero net angular impulse, residual spin, contact impulse/peaks/travel, and malformed/time inputs. Implement `public/flight.mjs` and pass.
- [x] Write failing engine/HTTP tests for new claims, numeric gating, replay tampering and hidden transfer data. Implement `src/flight-domain.mjs`, `src/flight-evidence.mjs`, shared engine/server registration; run full suite.
- [x] Implement bilingual settings, stage navigation, rotating schematic, six graph metrics, contact/rotation summary, scrubber and explicit play/pause. Verify desktop/mobile layout, transition boundaries, help gating and reset behavior.
- [x] Live English and Chinese synthetic claim cycles; fresh review; final suite/security/baseline verification; document result; restart only this project's local server and release wake lease.
