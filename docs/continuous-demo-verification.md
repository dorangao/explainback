# Continuous Roadster demo — October 26, 2026 Pacific

## Delivered behavior

One animated B car connects the existing prescribed acceleration, ideal
controlled pitch turn, and separate vertical contact models. It shares a
timeline with three selectable graph tracks and numeric current values.
Phase buttons, play/pause, restart, three playback rates and scrubbing work in
English and Chinese. Responsive SVG axes retain readable text; the desktop
layout places the animation beside graphs and mobile stacks them.

Both primary setting groups are available in either Roadster topic; their mass
selectors synchronize and all settings lock during the session. Position and
horizontal speed are continuous at the joins. The launch vertical impulse is
explicitly assumed, not simulated. Horizontal speed remains V in flight and
contact; there is no horizontal braking. At touchdown, rotation becomes a
labeled snapshot, and torque/angular-speed readouts become unmodeled. The
separate contact model has N=mg+ma and no pitch coupling. Schematic scales differ;
the band below the touchdown reference depicts stopping travel, not terrain.

The continuous view is gated behind prediction and hides on fresh transfer.
It uses primary demonstration settings, while the existing evidence graph and
transfer fields keep their own checked scenarios.

Phase-aware presets cover three claim choices per Roadster topic, prediction,
evidence-based revision, worked numeric transfer and a help request. Text stays
editable and submission/claim confirmation are explicit. Transfer explanations
use the fresh scenario's parameters and actual profile. Preset provenance is
sticky and cannot produce an independent-transfer outcome.

## Provider console

`EXPLAINBACK_TRACE=1` enables capture and UI. The default off setting disables
capture and `/api/trace`. Same-origin POST plus the existing random session token
scopes read/clear access. At most 12 records per session are retained in memory.
Each contains filtered request body, assistant text/function-call response,
usage, HTTP status, duration, and accepted/rejected/discarded/pending state.
Headers, configured credential, private reasoning and raw upstream error bodies
are omitted. Strings are redacted before truncation; request and response string
budgets are bounded. Clearing pending records cannot resurrect them afterward.
Reset/expiry removes the session and trace. No trace file, localStorage, cookie
or export is created. Enabling tracing labels sessions as developer demos because
the request context can include checked answers. It is not independent evidence.

## Verification

- Final offline suite: **100 passed, 0 failed**. New coverage includes position
  continuity, explicit launch-velocity discontinuity, residual horizontal speed,
  unmodeled contact rotation, canonical settings, bilingual/fresh preset answers,
  trace redaction/bounds/clear, transport success and HTTP errors, flag off/on,
  session isolation/reset and sticky assisted provenance. Existing labs pass.
- English live Meta torque demo: preset claim → confirmation → prediction →
  revision → transfer. Numeric values 26318.95 N·m and 5.24 rad/s completed as
  scripted/developer demo. Console showed four records, tool actions and usage,
  with no headers or private reasoning entries.
- Chinese live landing demo: m=1200 kg, T=1 s, D=0.05 s. At journey t=4.025 s
  after 3 s acceleration, contact force reads 247.128 kN. A first generic worked
  explanation received clarification; presets were improved to substitute fresh
  values and profile explicitly. A new four-request preset-only cycle completed
  with 58839.9 N average/peak for the constant-contact transfer.
- English mass/force demo completed through presets with 12000 N and μ=0.82.
  It was marked scripted/developer, never independent. Fresh transfer hid the
  primary animation; changing language/stage cleared session and trace UI.
- All three graph cursors matched at the sampled time. Play advanced time;
  pause held it. Shared mass synchronized. Mobile document width 375 px within
  a 390 px viewport; desktop width 1425 within 1440. Current mobile/desktop
  screenshots were visually inspected. No application console errors in the
  active live workflow. Flag-off probes produced the expected 404; favicon 404
  is unrelated to application behavior.
- Fresh independent review found one P2: identical new sessions could retain
  prior scrub time. Browser reproduction failed before correction and passed
  after cache/time reset. Follow-up responsive QA found stale dimensions when
  a hidden workspace reappeared at the same width; the saved browser regression
  also failed before correction, then passed after deferred layout measurement.
  `scripts/browser/journey-regression.txt` can run through the Playwright code
  tool; it checks reset to zero and SVG units matching rendered chart width.
- Reviewer found no further blockers in model boundaries, trace isolation,
  redaction or demo provenance. Reviewer's loopback tests were sandbox-blocked;
  this task ran the full real loopback suite successfully. Live provider and
  bilingual visual checks were verified here separately.
- Flag-off browser/server check confirmed hidden console, no developer-demo
  banner on an untouched session, and trace endpoint HTTP 404.
- Security check passed without revealing the configured key. All five baseline
  manifests matched their archives: 18, 23, 23, 27 and 33 source files; no env
  files are archived. No added package dependencies or public deployment.

Screenshots: `output/playwright/journey-en-desktop.png`,
`output/playwright/journey-zh-desktop.png`, and
`output/playwright/journey-zh-mobile.png`. Live Meta checks used synthetic adult
inputs with explicit submissions, not an efficacy study or provider benchmark.

## Remaining limits

This is an analytic demonstration of separate ideal models. No actuator sizing
validation, full rigid-body contact, suspension/occupant loads, real Tesla
specification, safe-landing guarantee or competition-eligibility determination
is added. The earlier source snapshots remain baseline work. The local server
restart resets previous transient sessions.

The project-owned server was restarted on port 4173 with local EXPLAINBACK_TRACE=1. Both temporary QA servers were stopped. Fresh live claim/prediction loaded the final layout at 852 px total height in a 1440×1000 viewport; graph units matched rendered width (572 / 571.8 px). Current console reported zero errors. Set the flag to 0 and restart to disable tracing.
