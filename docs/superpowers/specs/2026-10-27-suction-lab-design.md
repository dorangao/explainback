# ExplainBack: suction, grip and design comparisons

Status: approved by user October 27, 2026; implementation approved.
Chosen direction: interactive physics lab with Muse-guided design comparisons.
Date: October 27, 2026. Earlier Vercel preparation remains a separate uncommitted change.

## Purpose

Turn “How can a car stay upside down?” into a reproducible engineering argument:
claim → prediction → checked model → explanation → proposed improvement →
comparison → fresh transfer. Retain English/Chinese, tester access, the provider
console, guided Next checkpoints, and explicit baseline provenance.

This is a new pressure/contact domain. The existing acceleration model explicitly
omits downforce; its formulas and earlier flight/contact assumptions must remain
unchanged and visibly separate. No new force is silently added to the old demo.

## Sources and evidence status

- [Tesla Roadster](https://www.tesla.com/roadster) describes powered fans and ground
  sealing producing stationary upside-down support. Treat this as a manufacturer
  claim; the lab has no measured Tesla mass, seal geometry, fan curve or telemetry.
- [McMurtry's demonstration](https://mcmurtry.com/upside-down-driving/) reports
  stationary upside-down driving on a rotating rig using a fan system. It is a
  useful independent vehicle example, not a measurement of the Roadster.
- [NASA lift equation](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-equation/)
  supplies the conventional aerodynamic force model and explains that its
  coefficient generally needs experimental determination.
- [DOE fan sourcebook](https://www.energy.gov/sites/prod/files/2014/05/f16/fan_sourcebook.pdf)
  relates air power to pressure and flow and emphasizes the fan operating curve.
- [NASA's integration of CFD and wind tunnels](https://ntrs.nasa.gov/citations/20220009523)
  treats the methods as complementary. [BMW's 2024 wind-tunnel opening](https://www.press.bmwgroup.com/asia/article/detail/T0446903EN/quiet-testing-for-quiet-cars-the-bmw-group-s-new-aeroacoustic-and-electric-drive-center-goes-into)
  provides a current automotive example of continued physical testing.

Maintain separate labels: sourced manufacturer statement; hypothetical input;
calculated model result; Muse interpretation; untested design hypothesis.

## Approaches considered

1. Explanation/worked examples: small and clear, but cannot test a proposed change.
2. **Interactive reduced model + Muse design comparisons — user-selected.** Fast,
   auditable counterexamples and parameter comparisons fit the existing workflow.
3. Actual CFD/CAD research: requires geometry, meshing, boundary conditions, fan
   data, convergence checks, compute infrastructure and measured validation.
   This is a possible later integration, not part of the first lab.

## Checked models

### A. Speed-dependent aero versus active suction

Conventional aerodynamic force magnitude: `F_aero = 0.5 ρ v_air² S C_down`.
The coefficient, area and air conditions are explicit hypothetical constants.
With zero relative external airflow and no fan-induced flow, this term is zero.
Stationary relative to the ground is not necessarily zero relative airspeed.

Fan pressure force: `F_s = Δp A`, where A is effective sealed area and Δp is
ambient pressure minus cavity pressure. External air pushes toward the lower
pressure region. Fan-generated flow can exist at zero vehicle speed.

Compare these mechanisms separately. Do not add their forces as though their
flow fields were independently calibrated. Leaving the surface breaks the sealed
cavity model; do not continue suction into airborne flight or equate it to thrust.

### B. Static contact and orientation

Define θ as surface/car orientation: 0° upright, 90° vertical wall, 180° inverted
against a horizontal ceiling. All force arrows are forces **on the car**.

`N = F_s + mg cos θ`; tangential gravity magnitude `T_g = mg |sin θ|`.
Necessary static conditions: `N >= 0` and `μN >= T_g`.
If the computed N is negative, contact equilibrium is impossible; do not display
negative friction or a passing grip result. Equality is marginal, with no reserve.

At the ceiling, suction points up; both gravity and the ceiling reaction on the
car point down. `N = F_s − mg`. The car's opposite force on the ceiling is a
different free-body diagram. Downforce means toward the nearby surface, not
always downward in world coordinates.

Defaults: m=2000 kg, g=9.80665 m/s², A=4 m², Δp=6000 Pa, μ=1.
Calculated suction=24.000 kN; weight=19.6133 kN.

| Orientation | N | Required tangential force | μN | Necessary static conditions |
|---|---:|---:|---:|---|
| 0° | 43.6133 kN | 0 | 43.6133 kN | Pass |
| 90° | 24.0000 kN | 19.6133 kN | 24.0000 kN | Pass |
| 135° | 10.1313 kN | 13.8687 kN | 10.1313 kN | Fail |
| 180° | 4.3867 kN | 0 | 4.3867 kN | Pass |

The counterexample tests: “If it can remain upside down, it can remain at every
angle.” For μ>0, all-angle static support needs at least
`F_s >= mg sqrt(1 + 1/μ²)` in this model: 27.7374 kN at μ=1.

Assumptions: quasi-static point-mass force balance, a maintained sealed cavity,
uniform pressure, fixed μ, and all normal load available for static friction.
No rolling dynamics, curved-path centripetal acceleration, tipping/pitch moments,
axle load distribution, suspension, seal deformation or structural capacity.
The orientation animation is a sweep of static cases; it does not simulate a
moving car following a loop. A failed condition is labeled equilibrium impossible,
not rendered as a numerically simulated fall.

### C. Leakage, power and an optimistic pressure bound

Use a deliberately simplified, quasi-steady orifice leakage model:

`A_leak = L h_effective`
`Q = C_d A_leak sqrt(2 Δp / ρ)`
`P_electric = Δp Q / η_total`

Here η_total includes electrical-to-air conversion and the simplified pressure
rise is the cavity deficit. Real duct/exhaust losses and fan curves are missing.
The effective gap is a leakage parameter, not a prediction of seal deformation.

At ρ=1.225 kg/m³, C_d=0.65, L=8 m, η_total=0.60, Δp=6000 Pa:

| Effective gap | Required flow | Required electrical power |
|---|---:|---:|
| 2.5 mm | 1.2867 m³/s | 12.8667 kW |
| 5 mm | 2.5733 m³/s | 25.7333 kW |
| 10 mm | 5.1467 m³/s | 51.4667 kW |

At a fixed power budget, algebra gives an optimistic envelope:
`Δp_bound = [P_budget η_total / (C_d L h_effective) sqrt(ρ/2)]^(2/3)`.
At 30 kW and 10 mm it is 4186.79 Pa, or 16.7472 kN over 4 m²: below weight.
This is an upper-bound calculation within this ideal model, not a measured fan
operating point. A real fan's pressure/flow curve can impose a lower limit.
Do not imply that every fan can reach the computed envelope.

Validate finite, positive mass/area/perimeter/density/efficiency, nonnegative
pressure/power, μ>0 for all-angle formulas, positive leak gap and 0<η<=1.
Limit pressure-controlled examples to a declared low-pressure range; calculations
outside the chosen incompressible approximation receive an out-of-model label.
Zero fan power yields zero steady supported pressure in this leaking-cavity model.
No zero-gap division, vacuum beyond ambient, infinite flow or arbitrary formulas.

## Guided demonstration and interaction

Start with three bilingual preset claims:

- “Downforce disappears when the car stops.” / “车一停，下压力就消失。”
- “If it can remain upside down, every angle works.” / “能倒挂，就能停在任意倾角。”
- “A more powerful fan is always the best improvement.” / “更大功率的风扇总是最佳改进。”

Keep the learner-confirmed claim, prediction, evidence IDs, revision and transfer
workflow. Add a bounded design branch for this domain only. The guided path uses
at most five live calls: capture claim; select/run checked evidence after the
prediction; propose a candidate; explain the checked comparison and move to
transfer; assess transfer. Confirmation, Next, sliders, replay, comparison
calculation and animation playback are deterministic and make no provider call.
Unexpected actions or invalid output stop the guide without automatic retries.

The default guide uses the all-angle claim and visits: stationary pressure force;
ceiling balance; the 135° counterexample; a doubled-gap challenge; candidate
comparison; fresh transfer. Pause at each stage with Next, an explanation of the
graph, and explicit result/limitation. Keep the animation, graphs and opt-in
provider console visible. English/Chinese switching follows the existing reset
behavior so old-language pending results cannot overwrite the new session.

Use a car/surface schematic with labeled force arrows, an orientation slider,
normal/friction demand graphs, and a pressure/flow/power view. Any animated air
particles are labeled schematic; no CFD contours or simulated turbulence claims.
Controls can explore a copy of the scenario. The confirmed claim and evidence
remain pinned to their original inputs; changing them starts a new comparison
record or session rather than silently rewriting accepted evidence.

## Muse-guided design comparison

The initial task has one explicit objective: maintain stationary inverted normal
force reserve of at least 20% of weight under the doubled-gap scenario, within a
30 kW budget. This is a teaching target, not an engineering safety factor.

Allow only a fixed candidate catalog:

| Candidate | Power limit | Ideal worst-gap force envelope | Screen result |
|---|---:|---:|---|
| Original | 30 kW | 16.7472 kN | Below 23.5360 kN target |
| Double power | 60 kW | 26.5845 kN | Violates power budget |
| Halve effective leakage | 30 kW | 26.5845 kN | Passes necessary model screen |
| Reduce mass by 20% | 30 kW | 16.7472 kN | Below revised 18.8288 kN target |

Halving effective leakage is a hypothesis, including at the doubled physical
gap. The UI must ask how it could be achieved and measured; it is not a fabricated
seal design. Do not call this a proven optimum or imply it satisfies all tilts.
Unmodeled tradeoffs include seal wear, road clearance, debris, heat, noise, mass,
actuator response and failure behavior. Show missing measurements beside results.

Muse proposes from the catalog, explains its tradeoff, cites existing evidence,
and identifies the next measurement. Checked code evaluates every candidate and
the objective. Proposals cannot alter constraints, invent pressure fields or
author executable equations. Tool enums and evidence references are validated
server-side; malformed output is rejected, never silently coerced.

The next real engineering step would measure fan pressure-flow curves, electrical
power, cavity pressure uniformity and leakage over gaps/roughness on a controlled
rig. CFD could later investigate geometry/flow and be checked against those
measurements. Neither Muse prose nor this model replaces a wind tunnel or test rig.

## Everyday-life transfer

Use a hypothetical window-cleaning robot: mass 2 kg, suction area 0.02 m²,
μ=0.4, pressure difference 2000 Pa. Suction=40 N exceeds weight=19.6133 N,
but vertical-wall friction capacity is only 16 N. Thus the necessary condition
fails. Ask for minimum model pressure (2451.6625 Pa) and friction at 2000 Pa
(16 N), with an explanation of why the ceiling condition cannot be reused.
Provide an unused verified alternative for transfer and keep hints/presets
marked assisted. This connects the car example to suction mounts and appliances.

## Integration and validation

Builder decisions: exact component split, colors and spacing can follow existing
components. Extend the domain/evidence interfaces with a suction domain, add
the design state/actions only there, and preserve all existing domains and their
tests. Reuse shared server-side sessions so the module works both locally and on
the prepared Vercel/Meta-only path. No deployment, commit or push in this design step.

Required deterministic tests: units and pressure sign; force directions; ceiling
threshold; 135° counterexample; μ/orientation limits; zero-speed/zero-power
distinction; gap/power scaling; objective/candidate ranking; invalid inputs;
evidence pinning and replay; rejected model fields; no stale response after reset;
fresh transfer answer checks; English/Chinese preset consistency.

Add a small author-created bilingual eval (six paired cases): source ambiguity;
inverted reaction direction; all-angle overclaim; leakage/power tradeoff; budget
violation; unsupported CFD/safety claims. Report each failure and denominator.
These checks do not establish engineering capability or learning effectiveness.

Acceptance: a viewer can see a claim fail, inspect why, compare a bounded
improvement, and explain a fresh everyday example. Every result has identifiable
inputs, units, model version and limitations; every Muse statement is separated
from computed evidence and externally measured data.

## Research iteration ledger

1. Verified Tesla's current manufacturer description; distinguished surface
   suction from speed-dependent aero and free-flight thrust.
2. Computed and checked the orientation counterexample, all-angle threshold,
   leakage/power scaling and candidate objective with deterministic arithmetic.
3. Two live muse-spark-1.3 probes selected the correct verdict/candidate and
   referenced valid evidence, but both returned a string instead of the required
   Boolean. The English prose also reversed the ceiling reaction direction.
   Both outputs fail acceptance; the schema request alone was insufficient.
4. Follow-up used a fixed validation-status enum, an explicit force-on-car frame
   and a required reaction-direction enum. Both revised live probes passed all
   eight checked fields: exact claim, verdict, tilt evidence, candidate evidence,
   budget-compliant candidate, unvalidated status, reaction direction and valid
   evidence IDs. Prose review confirmed the downward ceiling reaction and the
   inverted-only design objective. The two original outputs remain rejected.
   Four total provider calls were made, with no automatic retries or Ollama use.
   These were author-created probes, not a benchmark or complete workflow eval.

An independent builder review found nothing important left unanswered and no
material mathematical contradiction. It independently checked the orientation,
all-angle threshold, leakage/power scaling, candidates and robot transfer.
Raw local probe output stays in ignored `output/`, without credentials or private
model reasoning. Product implementation and its stricter validation remain pending.
