# Sideways roll and air-jet visualization

User request: make the flip sideways and add air-thruster effects. This is an incremental change to the existing bilingual claim-testing lab and continuous vehicle animation.

Implementation choice: interpret sideways as roll around the vehicle's longitudinal (front-to-back) axis. Use a shared code-drawn, projected 3D vehicle in the standalone lab and continuous journey. Rotation changes the vehicle's cross-section, rather than turning a side-view silhouette end over end. Keep the existing analytic one-axis rotation and separate contact model. Radius of gyration k now explicitly refers to roll; the same hypothetical numerical defaults are retained.

Two opposite air jets illustrate the existing ideal external torque couple: each required force has magnitude |tau|/d; total force is zero. Exhaust points opposite its reaction force. The active pair reverses when torque changes sign, pauses at zero torque, and stays off for the unpowered comparison and during contact. Plume lengths/particles are illustrative and deterministic, not CFD or measured flow. No tank pressure, gas consumption, actuator capability, takeoff, powered landing, or real feasibility is inferred.

Alternatives considered: a purely cosmetic side-view rotation would still look like pitch and obscure the axis; a complete six-degree-of-freedom vehicle/propulsion simulation would exceed this model and require new validation. The projected roll view fits the existing checked workflow.

Verification: force-vector sum and torque about the roll axis, exhaust/reaction opposition, reversal and shutoff, existing physics/workflow tests, and English/Chinese browser inspection. Keep generic lesson names and the independent educational framing.

Physics references:
- https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/aircraft-rotations/
- https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/propulsion-system/

## Verification — October 27, 2026

- Node 22 full suite: 171/171 passed. New checks cover zero resultant force, the signed roll moment, exhaust/reaction opposition, reversal/shutoff, and preservation of the longitudinal axis.
- Production asset build, configured-secret scan and `git diff --check` passed. The new shared renderer is served by the local static allowlist and included in the production assets.
- Independent read-only review found no blocking issues. Fixed a leftover English pitch/contact preset and removed per-frame live announcements from the jet caption. Evidence now identifies `ideal-roll-and-vertical-contact-v1` and the longitudinal roll axis.
- Browser: English guided claim capture and prediction each completed one live Muse Spark call; acceleration, roll and contact playback reached their pause boundaries. Chinese claim capture and prediction also completed successfully. No extra provider call is needed for the jet animation. The transfer leg was covered by automated regression tests, not rerun live in this visual check.
- Standalone scrubber at t=0.375 s: A has no jets; B has two spin-up jets and +28.424 kN·m. At t=0.75 s both are inverted with jets off and nonzero angular velocity. At t=1.125 s B has two reversed braking jets and −28.424 kN·m. Contact has jets off.
- Chinese continuous view at journey t=5.375 s: roll angle 0.570796 rad, two active jets, caption +28.42 kN·m and synchronized graph +28.424 kN·m. Captions and controls remain bilingual. Screenshot: `output/sideways-roll-air-jets-zh.png` (local QA output, ignored by Git).

This change is local; no commit, push or deployment was performed. Existing baseline archives are preserved.
