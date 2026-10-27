# Flip and landing extension — October 26, 2026 Pacific

## Delivered

The Roadster lab has a second bilingual stage with mass, airborne time, radius
of gyration, pure-couple force separation, stopping time, and contact-profile
settings. It uses the existing claim confirmation → prediction → checked evidence
→ revision → fresh transfer workflow. A rotating SVG schematic, play/pause,
time scrubber, six graph metrics and numeric evidence connect the mathematics
to torque, residual spin and landing loads. Contact-force graphs zoom into the
short stopping interval; the dashed line identifies average contact force.

Three bounded claim types cover torque/angular momentum, contact impulse/peak
force, and upright orientation versus touchdown motion. Confirmation and replay
make no model requests. Independent and assisted transfer remain distinct.

## Physics and limits

All settings are hypothetical. Use g=9.80665 m/s², constant mass, a rigid body
about one pitch axis, and I=mk². k is radius of gyration, not wheel radius.
The center of mass returns to the same takeoff/touchdown reference height with
U=gT/2, h=g t(T−t)/2, and v_y=g(T/2−t). No horizontal motion, drag or lift.

For u=t/T:

- A begins with ω=2π/T and coasts with zero airborne torque. Its initial spin
  comes from an unmodeled pre-flight process.
- B uses θ=2πu−sin(2πu), ω=(2π/T)[1−cos(2πu)],
  α=(4π²/T²)sin(2πu), and τ=Iα. Positive then negative torque changes and brakes
  spin. Zero net angular impulse does not mean zero torque throughout.
- B assumes two equal opposite perpendicular external forces separated by d,
  each of magnitude |τ|/d. Their resultant force is zero. No actuator capability
  or takeoff mechanism is established.
- Both finish at θ=2π; A retains ω and rotational energy Iω²/2, while B has zero
  spin. The schematic stops at a labeled touchdown snapshot, and post-touchdown
  rotation is explicitly unmodeled. A's angular momentum is not erased.

The separate vertical contact calculation takes velocity from −U to zero in D,
without rebound. Constant net upward acceleration is U/D; the pulse is
(U/D)[1−cos(2πq)], q=(t−T)/D. Total upward contact force N=mg+ma, so:

- N_avg=mg+mU/D for both profiles.
- Constant N_peak=N_avg; pulse N_peak=mg+2mU/D.
- Net impulse=mU; contact impulse=mU+mgD.
- Required vertical stopping travel=UD/2 for both profiles.

Contact endpoints use ideal one-sided values and can have force jumps. The
timeline uses the airborne value at t=T; the zoomed contact curve starts with
the right-side contact value. This is a vertical body calculation, not a tire,
occupant, suspension or structural load calculation. Pitch/contact coupling,
wheel geometry, rebound, actuator limits and real landing safety remain outside
the model. Returning upright is not a safe-landing verdict. No Tesla data is used.

References: [Newton's second law for rotation](https://openstax.org/books/university-physics-volume-1/pages/10-7-newtons-second-law-for-rotation)
and [impulse and collisions](https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions).
The chosen sinusoidal profiles are this lab's analytic constructions.

## Verification

- **85 offline tests passed, 0 failed.** Fourteen new tests cover analytic
  endpoints and derivatives, mass/inertia/time scaling, force-couple separation,
  numerical impulse integration, gravity in contact force, peak versus average,
  stopping travel, malformed inputs, all three claim types, fresh transfer,
  evidence tampering, hidden answers, and real loopback HTTP behavior.
- English live Meta flow at 1440×1000: torque claim, local confirmation,
  prediction, checked experiment, local replay, revision, and fresh transfer.
  Transfer values 26318.95 N·m and 5.24 rad/s with grounded reasoning completed
  **independent transfer**. Graphs and tables stayed hidden before prediction
  and on the fresh problem before completion.
- English interaction checks: all six graph modes; playback advances, pauses,
  and stops when switching stage. After touchdown, rotational readouts say
  rotation is unmodeled rather than displaying invented zero spin.
- Chinese live Meta flow at 390×844: landing-impulse claim with m=1200 kg,
  T=1 s, D=0.05 s and pulse contact. The table shows average force 129.448 kN,
  peak force 247.128 kN and stopping travel 0.123 m. The contact graph's exact
  midpoint t=1.025 s shows 247.128 kN. Slider resolution was adjusted so these
  short-interval event times are reachable.
- Chinese fresh constant-force transfer used m=1500 kg, T=1.2 s and D=0.2 s.
  Correct numeric answers (58839.9 N for average and peak) with false reasoning
  did **not** complete. Corrected reasoning about gravity, shape, spin and model
  limits completed **assisted transfer**. One response does not establish mastery.
- Live provider: muse-spark-1.3, synthetic adult inputs only, no automatic retries.
  These are integration checks, not an independent model benchmark or efficacy
  study. One browser wait timed out because successful completion disables the
  submit button; the completed report and absence of errors were then verified.
- Mobile document width 375 px in a 390 px viewport (scrollbar included), with
  no horizontal overflow. Desktop and mobile viewport screenshots were visually
  inspected; both numeric columns, contact curve and caveats are readable.
- Fresh independent reviewer found no actionable issues; all 12 focused model
  and claim tests passed. Final full-suite run passed after the slider change.
- Current browser navigation reported zero console errors or warnings.
- Security check passed: configured key absent from other project files;
  private `.env.local` permissions and ignore rule intact. No added dependencies.

Visual evidence: `output/playwright/flip-en-rotation-desktop.png`,
`output/playwright/flip-landing-zh-contact-mobile.png`, and
`output/playwright/flip-landing-zh-summary-mobile.png`.

## Baseline and local operation

`docs/baseline/before-flip-landing.tar.gz` and its SHA-256 manifest preserve
27 prior source/test/package files, excluding credentials. All four baseline
archives were reverified against their manifests (18, 23, 23 and 27 files).
The current UI distinguishes this extension from prior baseline work.
Capture timestamps establish neither original creation dates nor eligibility.

No Git repository, deployment, publication or hackathon submission was created.
The project-owned preview and temporary QA server were stopped; the current
preview was restarted at `http://127.0.0.1:4173`. Both new `/assets/` modules
returned HTTP 200 and a fresh flight session loaded with results hidden. Initial
manual probes omitted `/assets/` and correctly returned 404; corrected checks
and a fresh browser navigation showed no application errors. Earlier in-memory
sessions were reset. Existing event and Meta eligibility questions are unchanged.
