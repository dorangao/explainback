# Continuous Roadster demo and provider trace

User scope: one continuous acceleration/flip/landing animation, synchronized
graphs, explicit model boundaries, English/Chinese, stage-aware preset prompts,
and a flag-controlled provider request/response console.

Design: reuse existing pure motion and flight models. One prescribed B car
accelerates, coasts horizontally at final speed during flight/contact, completes
the ideal controlled flip, and undergoes separate vertical stopping. Position
is continuous. Launch adds an assumed instantaneous vertical impulse; contact
does not simulate pitch, horizontal braking, tires or occupant loads. Freeze
orientation after touchdown as a labeled snapshot. Show three synchronized
graph tracks with selectable speed/force/rotation quantities, phase bands and
boundary labels. Existing detailed evidence views remain available. Hide the
journey during a fresh transfer and before prediction in an active claim.

Use both primary setting groups with shared mass; they lock for a session.
The journey is explicitly the primary demonstration, not the fresh transfer.
Preset prompts load editable text for claim, prediction, revision and worked
transfer; confirmation and submission stay explicit. Using presets marks the
session as a scripted demo, never independent transfer.

Tracing: EXPLAINBACK_TRACE=1 enables capture and console; default off means no
capture or trace route access. Per-session in-memory bounded records contain
request body (no headers), safe response messages/function calls/usage, timing,
HTTP outcome and validation outcome. Exclude provider reasoning and raw error
bodies; redact configured key before truncation. Console uses text nodes, same
origin POST and the existing session token. Reset/expiry drops records; clear
is available. Tracing exposes checked context, so enabled sessions are labeled
developer demos and cannot count as independent transfer.

Tasks (native implementation, final fresh review):
- [x] Test/implement continuous-time model and safe trace lifecycle.
- [x] Integrate server flag, capture, per-session read/clear and demo provenance.
- [x] Implement synchronized animation, bilingual presets and console.
- [x] Verify offline, live bilingual workflows, flag off/on, mobile/desktop;
  review, baseline/security checks, docs, restart local preview and release lease.

Review focus: model discontinuities disguised as physical transitions; transfer
answer leakage; trace scope/redaction/errors/reset races; scripted demonstrations
reported independent; playback or data persisting across stage/language/reset.

Ruling: current workspace has no Git repository; use baseline archive and inline
implementation. User has authorized the feature scope; routine implementation
choices above do not require another approval or deployment.
