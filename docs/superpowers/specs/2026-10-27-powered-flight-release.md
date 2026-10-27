# Powered flight and hosted release

User-approved scope: verify hosted tester login, creation, review, presentation,
English/Chinese and provider console; fix issues, commit/push, deploy Production,
and connect the already-owned explainback.app domain.

The vehicle must accelerate on the ground, use downward exhaust to lift, roll
sideways while traveling forward, and use downward exhaust to brake its descent.
Keep the original ballistic/contact experiments as baseline work.

Use the existing prescribed horizontal acceleration and controlled roll. For a
roll interval T, use a lift burn T/2, an unpowered center-of-mass interval T, and
a landing burn T/2. Each powered interval assumes total upward thrust 2mg, so
net upward acceleration is g. Start/end at ground height with zero vertical
speed; all positions and velocities join continuously. Roll only during the
unpowered interval, using the original zero-net-force couple and T. Follow with
0.5 s of ground coasting to show touchdown. Forward speed stays constant in air
and after landing: no drag or horizontal braking. Separate support, thrust,
weight and torque. Ideal timing and instantaneous thrust switches are assumed;
fuel, capacity, suspension, finite-body clearance and safety are not established.

The guided demo must distinguish this powered journey from baseline contact
force evidence. Its torque evidence remains numerically identical. Language
changes retain playback position. All model details must be bilingual.

Release requires offline tests, build, secret/upload checks, a fresh review,
hosted browser tests with real Muse responses, and verified Production HTTPS.
Secrets remain server-only; local Ollama is unavailable in cloud. No domain
purchase, nameserver replacement, or unrelated DNS changes are in scope.
