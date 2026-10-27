# One-click Roadster walkthrough

User requests one click to run presets through claim testing and play the whole
journey, with English/Chinese and visible provider calls. Implement on the
existing local app; no new dependencies or deployment. Preserve prior source
in `before-one-click-demo.*` because this workspace has no Git repository.

Use a fixed hypothetical scenario: 2000 kg, 60 mph in 5 s with cosine B,
1.5 s controlled flip, k=.9 m, couple separation 1 m, .3 s pulse contact.
Demo uses the torque claim and four calls: claim, prediction, revision, transfer.
Confirmation is local and recorded as scripted, not learner confirmation.
Wait for each expected server phase; do not bypass validation or retry. Play
the full journey after evidence and before fresh transfer. Label all outcomes
scripted/assisted. Use the existing adult/synthetic checkbox; never auto-check it.

Run starts a fresh demo, opens and moves the existing console into its dashboard,
shows current preset and feedback, and updates trace while requests are pending.
EXPLAINBACK_TRACE=1 and configured provider are required for the one-click path;
flag-off retains manual workflows and disables this control with an explanation.
English/Chinese is selected before running. Switching language/reset or hiding
the tab stops the runner; never silently restart paid calls. Stop cancels future
steps immediately, but cannot undo a sent provider request. Guard every await
against stale state; no duplicate runners or hidden retry loops.

Tasks:
- [x] Failing runner tests: four ordered calls, explicit confirmation provenance,
  full playback, unexpected-phase stop, errors/no retry, cancellation/races.
- [x] Implement runner, journey completion promise, automated controls/status,
  live console updates and bilingual copy; preserve manual interaction.
- [x] Offline + live bilingual one-click QA, stop/language/flag-off/browser
  checks, independent review, baseline/security checks and local restart.

Review focus: cancellation after async boundaries; claiming learner confirmation
or independent transfer; auto-retries/call count; hidden or incomplete playback;
trace visibility/lifecycle; manual-flow regression and consent handling.
