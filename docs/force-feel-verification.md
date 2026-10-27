# Force and feel extension — October 26, 2026 Pacific

## Delivered

The current Roadster-inspired lab now includes total mass, ideal tire grip and wheel-power settings; a cosine acceleration pulse; force, power and signed-jerk graph views; a bilingual force/feel table; and new force-feasibility and smoothness claim experiments. The same claim confirmation → prediction → checked evidence → revision → fresh transfer workflow applies. Confirmation and evidence replay remain local.

Previous work is baseline: `docs/baseline/before-force-feel.tar.gz` and its SHA-256 manifest preserve all 23 prior source/test/package files. Both earlier baseline archives also remain intact (18 and 23 files). All three manifests were verified against their archives. No credentials are included. Capture timestamps do not establish original creation dates or hackathon eligibility; no Git repository, deployment or submission was created.

## Model and interpretation

Use constant total mass m, level road, g=9.80665 m/s² and full tire normal load available for propulsion. Weight is mg N; mass is in kg. Required force F=ma, ideal tire ceiling μmg, and wheel power P=Fv. The prescribed motion is unchanged by mass; its required force/power scale with mass. At fixed applied force, a=F/m. Mass cancels from the ideal tire acceleration ceiling μg.

For u=t/T, cosine B uses:

- v=V[u−sin(2πu)/(2π)]
- a=(V/T)[1−cos(2πu)]
- j=(2πV/T²)sin(2πu)
- s=VT[u²/2+(cos(2πu)−1)/(4π²)]

This joins rest and cruise with a=j=0 at both ends. Peak acceleration is 2V/T; peak |jerk| is 2πV/T². Uniform A has zero jerk inside the interval, but ideal acceleration jumps at the joins imply unbounded jerk there. Its table value is explicitly interior jerk. Cosine and uniform total distances are equal, VT/2; the evidence does not incorrectly claim this pair refutes universal equal-distance reasoning.

Peak force and jerk are analytic. Uniform/rising power peaks at T; falling power peaks at T(1−1/√3). Cosine peak power solves a²+vj=0 in (T/2,3T/4) with 60 bounded bisections. It is not inferred from endpoint power or coarse graph samples. A shape's minimum duration is the greater of its grip-bound and power-bound times, with V and shape fixed. It is approximate when displayed and is not a real vehicle minimum time.

No drag, rolling resistance, downforce/thrust, load transfer, motor torque curve, heat, suspension, rotation or landing simulation. Passing is only a necessary ideal check, never a feasible/safe/comfortable verdict. Jerk is not a validated passenger comfort score. All values are hypothetical and are not Tesla specifications.

Physics references: [Newton's second law](https://openstax.org/books/physics/pages/4-3-newtons-second-law-of-motion), [friction](https://openstax.org/books/university-physics-volume-1/pages/6-2-friction), [power](https://openstax.org/books/university-physics-volume-1/pages/7-4-power), [jerk and trajectories](https://www.mathworks.com/help/fusion/ug/define-waypointTrajectory-using-position-and-ground-speed.html). The specific pulse is this lab's analytic construction, not a measured vehicle trajectory.

## Verification

- Full offline suite: **71 tests passed, 0 failed**. Ten new tests exercise the cosine derivatives/integral/joins, SI forces/power/weight, mass/time scaling, interior power maxima, invalid settings, both new claim/transfer types, evidence tampering, hidden transfer answers and equal-distance handling. Existing crossing and motion tests pass.
- First full run was blocked by sandbox loopback binding (`EPERM`); rerun with local socket permission passed. No failing product tests remain.
- English live Meta flow, 1440×1000: mass claim → local confirmation → prediction → force evidence → local replay → revision → fresh force transfer. 12000 N / μ=0.82 plus grounded reasoning completed **independent**. Primary and transfer graphs/physics values stayed hidden until the respective gates; settings hid on transfer.
- Chinese live flow, 390×844: unsupported comfort guarantee was clarified first; the bounded smoothness claim was confirmed and checked. At 60 mph in 8 s, m=2800 kg, μ=1 and 300 kW, A fits both ideal limits while B exceeds power (about 317.42 kW). Signed jerk at t=6 s was −2.633 m/s³. No horizontal overflow (document width 375, viewport 390 including scrollbar).
- Chinese transfer: correct numeric 8 m/s² and 5.03 m/s³ with contradictory comfort/peak claims did **not** complete. Corrected derivative/limitations reasoning completed **assisted**. Transfer force/feel values were hidden before completion. One response is not evidence of lasting mastery.
- Live provider: muse-spark-1.3; synthetic adult inputs only, no automatic retries. These are integration checks, not an independent learning-efficacy study or model accuracy benchmark.
- Fresh reviewer reported no actionable findings; focused tests 10/10 passed. Browser console showed no new application errors; favicon 404 is unrelated. Earlier port-4174 logs belonged to prior work, not this verification.
- Security check passed: configured key absent from other project files, private `.env.local` permissions and ignore rule intact.
- Existing project server on 4173 was verified by PID, working directory and command, then restarted with the new code. New static module returned HTTP 200; default cosine profile and new controls loaded on that address. Its earlier in-memory session was reset.

Visual evidence: `output/playwright/force-feel-settings-desktop.png`, `force-feel-zh-mobile.png`, and `force-feel-mobile-viewport.png`. The viewport screenshot was visually inspected with both A/B columns readable. Tall element screenshots can clip at the capture boundary; they are not used as layout evidence.

## Remaining boundaries

No real vehicle calibration, flight/rotation/landing model, ride-comfort certification or 24-case independent evaluation. No new dependency, account/billing changes, publishing or deployment. Existing Meta/hackathon eligibility constraints are unchanged.
