# One-click demonstration verification

Implemented October 26, 2026 Pacific. Local adult/synthetic prototype only.
The previous continuous-demo implementation remains baseline work in
`docs/baseline/before-one-click-demo.tar.gz` with a 42-file SHA-256 manifest.
Source dates and archives do not establish hackathon eligibility.

## Behavior

After the user selects English or Chinese and explicitly checks adult/synthetic
use, Run full demo starts a fresh session. It submits four presets through the
actual provider and server state machine: claim, prediction, revision, transfer.
Between claim and prediction, local confirmation records `scripted-demo` as its
source; the UI never attributes that action to a learner. Evidence is checked
by the existing deterministic physics workflow. The complete continuous journey
plays after evidence and before revision/transfer, at 0.5x playback speed.

The preset uses 2000 kg, 60 mph in 5 s, cosine acceleration, a 1.5 s controlled
turn, and 0.3 s pulse contact. All existing assumptions and stage-boundary labels
remain: prescribed acceleration, assumed launch impulse, ideal external torque,
and separate vertical stopping. The animation is not real Tesla data, a complete
vehicle simulation, or a safe-landing verdict. The fresh transfer has its own
parameters and is recorded as assisted, never independent learning evidence.

The existing console moves into the walkthrough dashboard, opens automatically,
polls pending calls, expands the newest record, and follows it within the console.
Its filtering, memory-only lifecycle, session isolation and flag remain intact.
`EXPLAINBACK_TRACE=0` disables capture and the one-click path; manual flows remain
available. Unexpected model decisions, errors and interrupted playback halt the
runner without retries or fabricated progression. Stop cancels future actions;
a provider request already sent can still finish and incur usage.

## Verification

- Full offline suite: **107/107 passed**, including loopback HTTP integration.
  Six new runner cases cover ordered calls, consent/flag gates, script source,
  playback completion, unexpected decisions, no retries, cancellation and
  Chinese presets. A claim test verifies scripted confirmation provenance.
- Live English and Chinese one-click runs completed with **four calls each**,
  checked transfer values/reasoning, and assisted/scripted outcomes. Both reached
  journey t=6.8 s. Chinese mobile layout fit within a 390 px viewport without
  horizontal overflow. Desktop and mobile screenshots were visually inspected.
- Full-playback browser regression checked cancellation returns false, normal
  completion returns true, the cursor reaches the exact endpoint, and all three
  phase labels occur. Saved in `scripts/browser/one-click-playback.txt`.
- Independent review found one P2: Stop during a pending call left frontend
  state behind the completed server response. The runner now reconciles that
  same-session response before cancelling future actions. A failing unit case
  and actual-provider browser reproduction passed after correction; manual local
  confirmation then advanced normally without an extra model call.
  Saved regression: `scripts/browser/one-click-stop.txt`.
- Language-switch race check held an actual first provider response, switched
  to Chinese, then released it. Old workspace, preset preview and trace remained
  cleared; exactly one call was sent. Saved regression:
  `scripts/browser/one-click-language.txt`. These two race scripts consume one
  live request each and are separate from the offline test suite.
- Flag-off browser check confirmed hidden console, disabled one-click button
  with an explanation, and enabled manual session start after adult confirmation.
- Latest port 4173 run completed with 4/4 calls, expanded latest request and
  actual function-call response, re-enabled Run, and no browser errors/warnings.
  Its new server serves the runner module and records scripted confirmation.
- Security check passed without displaying the configured key. All six baseline
  archives matched their manifests: 18, 23, 23, 27, 33 and 42 files. No credentials
  are archived. No added dependencies, publication or deployment.

Screenshots: `output/playwright/one-click-en-desktop.png` (final console follows
the newest expanded record) and `output/playwright/one-click-zh-mobile.png`
(Chinese completed walkthrough before the automatic record expansion polish).
These are functional synthetic demos, not an efficacy study or provider benchmark.

The project-owned local server was restarted on port 4173; both temporary QA
servers were stopped. The local trace flag remains enabled. Change it to 0 and
restart to hide/disable tracing. Restarting clears transient sessions.
