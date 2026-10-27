# Next-guided Roadster demo implementation plan

User specification: pause at each stage to explain claim, graph and result with
Next; animation and console stay visible; English/Chinese. Implement inline
under executing-plans with one fresh final review. Existing code has no Git;
44-file before-guided-demo archive is the source baseline. No dependencies.

Visual thesis: calm teaching workspace, one current explanation beside persistent
motion and provider evidence. Content: stage heading/action, claim/graph/result,
primary animation, console; detailed preset available below. Motion: continuous
cursor/car within a segment, deliberate stops at model boundaries, no page jumps.

Use explicit awaited checkpoints before each provider request and local claim
confirmation, after evidence and after each animation segment. Exactly four
provider requests remain; no retries or inferred progression. Next cannot queue
clicks. Stop/reset/language change reject a waiting checkpoint and suppress all
future steps. Preserve the previous late-response reconciliation behavior.

Keep a static scene before prediction; reveal graphs only after checked evidence.
After transfer starts, keep the primary graph with an explicit reference label;
never substitute the fresh-transfer parameters. Scripted/assisted provenance stays.
The animation plays 0→5→6.5→6.8 s, pausing after acceleration, flip and landing.
Use left-hand samples at the first two boundaries so a paused result describes
the stage just completed. UI language switch retains current stop/new-run semantics.
Desktop places console alongside the animation; mobile stacks both without hiding
panels. Existing manual session layout restored on reset/start.

- [x] Runner checkpoint tests fail before code, then pass: no calls while waiting,
  one-step progression, segment order, cancellation and no retries.
- [x] Implement stage copy/gate UI, segmented player, persistent responsive workspace.
- [x] Full suite, browser segment/Next/race/English/Chinese checks, security/archive
  verification, final fresh review, docs, restart local preview.

Review focus: duplicate Next or stale gate listeners; Stop/language pending calls;
preview/fresh-transfer graph provenance; boundary model/cursor coherence; mobile
visibility and manual-flow restoration. Tests target these at runner/browser level.
