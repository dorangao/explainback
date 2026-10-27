# Suction lab verification · October 27, 2026

The user approved `docs/superpowers/specs/2026-10-27-suction-lab-design.md` and asked to build the interactive bilingual lab. Implementation is local on `feat/suction-design-lab`; no commit, push, or deployment was performed for this extension. Pre-existing Vercel preparation is preserved. The previous math and Roadster labs are baseline work; this document makes no competition-eligibility claim.

## Implemented behavior

- English/Chinese manual claim testing and a Next-guided demonstration. Default guided claim: ceiling support implies support at every angle.
- Five bounded live steps: propose claim; run pinned experiment after confirmation and prediction; propose a catalog design; explain the checked comparison and select transfer; compare fresh robot reasoning. Confirmation, graphs, replay, exploration, and Next use no model calls. Unexpected responses stop the script without automatic retries.
- Pressure and force diagram, synchronized orientation/friction graph, pressure-force and gap-power views, and local mass/area/friction/pressure/gap/power/relative-airflow controls. Sliders remain separate from pinned evidence.
- Code compares original, double fan power, half effective leakage, and 20% lower mass. Muse's choice and next measurement are labeled as a model proposal. A compliant segmented skirt is one unvalidated implementation hypothesis; clearance, wear, and debris are explicit tradeoffs.
- Fresh window-cleaning robot transfer with two independently checked numeric inputs and a model judgment of the causal explanation. Manual graph help uses the robot; the guided animation retains a labeled primary-car reference. Presets and visible provider context always count as assisted practice.
- Existing tester access and gated provider console reused. Meta remains default; no Ollama calls were made. Local eval outputs and screenshots remain ignored.

## Checked numerical anchors

At 2000 kg, 4 m², Δp=6000 Pa, μ=1, suction is 24 kN and weight is 19.6133 kN. Ceiling normal reserve is 4.3867 kN. At 135°, normal/friction capacity is 10.1313 kN while tangential gravity is 13.8687 kN, so static equilibrium is impossible. The all-angle minimum suction is 27.7374 kN under these simplified conditions.

With L=8 m, Cd=0.65, density 1.225 kg/m³ and total electrical-to-air efficiency 0.6, maintaining 6 kPa requires 25.7333 kW at 5 mm effective gap and 51.4667 kW at 10 mm. At 30 kW and 10 mm, the optimistic pressure bound is 4186.79 Pa. The default half-leakage candidate meets the necessary 20% ceiling-reserve screen; the 60 kW option violates the power budget. Bounds above the declared 0–10 kPa range are labeled outside the model.

For the default 2 kg, 0.02 m², μ=0.4 robot, minimum wall pressure deficit is 2451.6625 Pa. At 2000 Pa, friction capacity is 16 N, below weight 19.6133 N. Suction alone exceeding weight is insufficient on a vertical wall.

All forces are on the vehicle: at the ceiling suction points up; gravity and ceiling reaction point down. Orientation is a sequence of static cases, not a loop-driving or falling simulation. No pitching moments, structural loads, seal transients, calibrated fan curve, CFD or real safety validation are claimed.

## Verification and review

- Automated suite: final result recorded below. It covers legacy domains, provider isolation/auth/cloud state, suction numerical anchors, design/citation/replay integrity, demo stopping, and HTTP routes.
- Real-DOM regression (`scripts/browser/suction-regression.txt`): eight checks passed for pinned nondefault inputs, preserving intentional exploration, hidden transfer answers, explicit robot graph help, guided primary reference, treating model text as text, clearing prior proposal text on reset, and ignoring legacy-domain evidence.
- Compact author-created Meta regression: 12/12 on six English/Chinese pairs covering source ambiguity, ceiling direction, all-angle claims, leakage tradeoffs, budget violations, and unsupported CFD/safety assertions. This is a synthetic regression set, not a capability benchmark or evidence of independent student learning.
- Initial full English and Chinese browser demos each completed in five provider calls with visible console records. After review fixes, an English rerun completed but one Chinese final turn was rejected; it stopped safely. That run did not retain enough diagnostic detail to distinguish transport from output validation. Isolated final-transfer checks then passed in both languages. Inspection found the native schema allowed one citation while the server required two: the schema and prompt now explicitly require both original and design evidence. This addresses the contract gap; it does not establish the exact cause of the earlier rejection. A new bilingual citation regression was added.
- Independent review found a nondefault-initialization bug, incorrect manual robot graph help, a missing implementation-tradeoff question, and a legacy-domain isolation regression during the fixes. All were fixed and rechecked; the reviewer reported no remaining actionable findings.
- Headless Chrome desktop and 390 px Chinese layouts were inspected. No page errors or horizontal overflow in the initial complete bilingual run. The guided desktop layout was compacted to keep force diagrams, graphs, teaching notes and provider console together.
- Security check confirms configured API key and tester password absent from other project files, `.env.local` private and ignored. No secrets were committed or printed. Build validates asset packaging only; it is not a deployment.

Final checks: **162/162 automated tests passed**, build passed, and secret scan passed. The final full English and Chinese browser runs each completed with **5/5 provider submissions**, visible Muse console records, no page errors, and no document overflow on desktop or at 390 px. The added focused transfer-citation eval passed **2/2**; the preceding six-pair regression passed **12/12**. Final review reported no remaining actionable findings. A completed-demo sticky header was removed so it no longer covers mobile exploration controls; the comparison table is keyboard-scrollable.

Private artifacts: `output/eval/suction-latest.json`, `output/eval/suction-focused.json`, `output/suction-implementation/browser-results.json`, `output/suction-implementation/dom-regression.txt`, and `output/playwright/suction-*.png`. They are intentionally excluded from Git.
