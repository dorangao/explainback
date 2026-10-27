# Guided-demo verification

October 26, 2026 Pacific. The preceding one-click implementation is preserved
as baseline in `docs/baseline/before-guided-demo.*`: 44 hashed source, test,
package and README files. No credentials are archived. Eligibility is unchanged.

## Delivered behavior

Start enters a paused claim checkpoint. Next advances only the current step;
there is no timed progression or queued click. Ten stages cover claim, script
confirmation, prediction, evidence, acceleration, flip, landing, revision,
transfer and result. Each has English/Chinese claim, graph and result notes.
Actual provider interpretation/feedback remains visibly separate.

The full motion pauses at t=5, 6.5 and 6.8 seconds. Acceleration, flip and landing
play at 0.5x, 0.25x and 0.1x, respectively. At the first two pauses, one-sided
samples retain the label/values of the segment just finished. Next starts the
following model. Manual controls cannot advance the guided player while paused.

The existing journey moves into the guide, alongside the console on desktop.
Mobile stacks panels and pins Next within the viewport. A starting scene stays
visible before prediction; graphs remain hidden until checked evidence. Primary
graphs persist during transfer with an explicit reference label; fresh transfer
values never replace them. Physics assumptions, script confirmation, trace flag
and assisted results remain. Four live calls complete a normal run; waiting and
playback use none. Smaller screens require scrolling between stacked panels.

## Validation

- **109/109 offline tests passed**, including loopback HTTP integration. New
  checkpoint tests failed against the timed runner, then passed: no calls while
  waiting, correct segment order, and stopping after a segment prevents future
  playback/calls. Existing no-retry, unexpected-phase, consent/flag, Chinese and
  response reconciliation tests remain green.
- `scripts/browser/guided-playback.txt` failed for missing range playback before
  implementation. It now checks exact held endpoints, matching stage labels,
  disabled manual controls, and interrupted playback returning false.
- Live English and Chinese runs each completed with four actual Meta calls.
  Each held t=5, 6.5 and 6.8 s without extra requests. Animation and console
  remained displayed during transfer/completion; the primary-reference label
  distinguished them from fresh transfer parameters.
- Real double-clicks at claim and confirmation advanced only one checkpoint:
  prediction still waited, with one provider call. Mobile Next stayed at
  y=784–828 in an 844 px viewport after scrolling to the console. Document width
  375 px fit within the 390 px viewport.
- `guided-wait-cancel.txt`: Stop/language switching while waiting produced zero
  requests and disabled stale Next. Updated `one-click-stop.txt` and
  `one-click-language.txt` delayed an actual first provider response: Stop
  retained its returned confirmation state; language switching cleared the old
  workspace, preset and trace. Each race script uses one live request.
- One fresh reviewer found a P2: manual continuation after early Stop retained
  preview mode. `guided-manual-recovery.txt` reproduced the failure, then passed
  after manual submission/confirmation restored the normal layout. It checks
  graphs visible, playback enabled, guide hidden and correct DOM parent. Each
  run uses two live requests. No other critical/important issue was reported.
- Reviewer declined live provider, mobile layout and browser input judgments;
  parent checks above cover them. Final browser logs had zero errors/warnings.
- Security check passed without displaying the key. All seven archives match
  their manifests: 18, 23, 23, 27, 33, 42 and 44 files. No added dependencies,
  publication or deployment.

Screenshots in `output/playwright/`: `guided-evidence-en.png`,
`guided-evidence-zh-mobile.png`, `guided-complete-zh-mobile.png`,
`guided-complete-zh-desktop.png`. Later mobile pinned-Next polish was additionally
checked live by its bounding rectangle.

The 4173 local server was restarted to serve the guide module. Trace remains
locally enabled. Language switching deliberately stops/resets; Start begins a
fresh run. Already-sent provider requests may still incur usage. These assisted
synthetic demos do not establish learning efficacy, real Tesla capability, or
safe landing. Earlier prototypes remain explicitly baseline work.
