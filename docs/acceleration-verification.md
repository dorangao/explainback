# Roadster-inspired acceleration lab: contribution and verification

Actual implementation: October 26, 2026, America/Los_Angeles. This is local work, not a claim of eligibility for an event building period beginning October 27. No Git initialization, commit, publication, deployment or submission was performed.

## Baseline and new contribution

Before editing, 48 tests passed. `baseline/before-acceleration.json` and `.tar.gz` preserve 23 allowlisted source files from the previous coach/crossing implementation, without environment files. Source hashes establish this capture, not original creation dates. The original `before-claim-testing` archive remains unchanged.

New files:
- `public/motion.mjs`: bounded analytic motion catalog, exact unit conversion, velocity, derivative and integral calculations; shared by browser and server.
- `public/motion-graph.mjs`: accessible SVG plots with metric selector, time marker and two cars positioned using integrated velocity.
- `src/motion-evidence.mjs`: versioned evidence with SI units, scoped conclusions, formulas, assumptions and replay support.
- `src/claim-domains.mjs`: topic-specific claim categories, experiment compatibility, transfer contexts, numeric checks and model instructions.
- `test/motion.test.mjs`, `test/acceleration-claims.test.mjs`: new model and workflow coverage; evidence and HTTP tests were extended.

Existing claim engine, server and UI were adapted to use domain-specific data. Crossing remains the default for existing direct claim-session calls. Browser selection uses claim-testing for crossing and acceleration, and the existing coach for the other two topics. Meta transport, original problem catalog and original math evaluator remain baseline.

## Mathematical model

Hypothetical motion starts at rest, with final speed V after T seconds. Let u=t/T on 0<=t<=T only:

| Profile | v(t) | a(t) | Distance from start |
|---|---|---|---|
| A, uniform | Vu | V/T | VT u²/2 |
| B, rising | Vu² | 2Vu/T | VT u³/3 |
| B, falling | V(2u-u²) | 2V(1-u)/T | VT(u²-u³/3) |

Both average V/T. Distance is the integral of velocity; velocities are nonnegative, so distance equals displacement within the interval. Endpoint accelerations use within-interval one-sided derivatives; no continuation beyond the interval is asserted.

Primary settings: final speed 30/60/90 mph; duration 1/2/3 s; rising or falling B. 1 mph=0.44704 m/s. A 60 mph/1 s example is hypothetical, not a Tesla measurement. A's distance is 13.4112 m and rising B's is 8.9408 m. At T/4, accelerations differ: 26.8224 versus 13.4112 m/s².

Transfer uses either hypothetical e-bikes at 36 km/h over 5 s with falling B, or test carts at 72 km/h over 4 s with rising B. Expected average accelerations are 2 and 5 m/s². Signed distance B−A is 25/3 and −40/3 m. Numeric entries accept absolute rounding error up to 0.01 SI units. Expected answers are not included in the public transfer problem; requesting a transfer graph through Meta counts as assistance.

These are prescribed velocity curves, not a dynamics model. Drag, tire grip, power limits, launch transients/jerk, steering, rotation and landing are excluded. The model cannot verify Tesla performance, vehicle feasibility or safety. Language interpretation and reasoning quality remain model judgments, not deterministic proofs of understanding.

## Verification

- **61 offline tests pass, zero failures**, including the 48 earlier tests. New coverage: units; endpoints and signs; analytic derivative/area oracles; duration scaling; rejection of invalid settings/times; bilingual motion claims; experiment/scope compatibility; forged evidence and context replay; transfer numbers versus reasoning; graph-help assistance; and complete HTTP session/replay routing.
- Syntax checks passed for changed JavaScript modules. Configured-secret scan passed; environment file remains private and ignored. Archived source hashes were separately verified against their manifest.
- **Live English browser:** default 60 mph/1 s, rising B; explicit claim -> confirmation -> prediction -> computed evidence -> revision -> 36 km/h transfer -> independent completion. At t=.25 s, the acceleration view reported A=26.822 and B=13.411 m/s². Evidence replay worked without another model call.
- **Live Chinese mobile browser:** 90 mph/3 s, falling B; distance claim -> confirmation -> prediction -> evidence -> revision -> transfer. At t=3 s, distance view reported A=60.350 m and B=80.467 m. Correct numeric transfer entries paired with an explanation asserting identical motion stayed incomplete. A corrected explanation completed as assisted. Final t=2.5 s in the transfer velocity view showed A=5.000 and B=7.500 m/s.
- **Crossing live regression:** existing bounded six-request smoke passed English/Chinese ambiguity and a full already-correct crossing claim through independent transfer; results in `claim-smoke-results.json` have the fresh timestamp.
- **Layout:** English desktop 1440×1000; Chinese mobile viewport 390px with document scroll width 375px (scrollbar difference), no horizontal overflow. All three metric views and the time scrubber were exercised. Final browser console: zero errors/warnings. An initial missing favicon request was benign.
- **Independent review:** analytic math, units, bounded scenarios, evidence integrity, transfer gating and assistance accounting reviewed. One P2 issue was found and fixed: primary settings remained prominently visible alongside different transfer values. Those controls are now hidden during transfer/completion; browser verification confirmed this with a 90 mph/3 s primary and 36 km/h/5 s transfer.

Live checks use scripted fictional adult inputs and model `muse-spark-1.3`. They are demonstrations and regression evidence, not independent evaluation or evidence of learning efficacy. The separate 24-case evaluation is still pending. No automatic paid retries were added.

## Browser artifacts

- `output/playwright/acceleration-en-desktop.png`: English primary acceleration plot and evidence.
- `output/playwright/acceleration-zh-mobile.png`: Chinese primary distance plot and evidence.
- `output/playwright/acceleration-zh-final-mobile.png`: Chinese completed assisted transfer.
- `output/playwright/acceleration-zh-visual.png`: final interactive visualization at t=2.5 s.

## Try it

Run `npm run dev`, select the acceleration lab, confirm adult/synthetic use, choose hypothetical settings and start. Predict before exploring the plots. Reset to change the settings. Completion needs both correct numeric values and reasoning Meta assesses as supported; this judgment may be wrong. Replay and graph scrubbing are local and do not call Meta.
