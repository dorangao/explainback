# Quantum computing showcase

October 27, 2026. The user requested a new area explaining how quantum computers work, with a demo/showcase, then explicitly selected direct implementation of the recommended bilingual stepped lab and skipped design questions.

## Experience

A separate **Quantum computing / 量子计算** area sits beside Physics & math. `/#quantum` opens it directly after tester sign-in. Existing physics, calculus, vehicle and suction work remains in its original area. A guided showcase supplies a clearly labeled assisted prediction and pauses at each gate. Independent exploration uses Agree / Disagree / Unsure before unlocking a circuit. It does not grade lasting learning or claim independent transfer validation.

Four experiments:

1. **One qubit**: H prepares equal amplitudes. Measure once, repeat that same measurement, or re-prepare and measure 256 times. A single readout is one bit, not both amplitudes.
2. **Interference**: H → P(φ) → H, with φ = 0, π/2 or π. Before the final H, probabilities remain equal; afterwards P(0) = cos²(φ/2), P(1) = sin²(φ/2). Arrows show complex amplitudes, not little spinning physical objects.
3. **Entanglement**: H on q0 → CNOT. Compare the Bell state with the classical mixture of 00 and 11, in Z or X. For X, H is applied to both qubits before computational-basis readout. Identical Z correlations alone do not certify entanglement. This is not a loophole-free Bell test or faster-than-light messaging.
4. **Small Grover search**: prepare four equal amplitudes, mark one supplied target with a phase flip, then reflect about the mean. Oracle alone preserves 25% probabilities; one iteration yields the target with probability one only in this ideal N=4, one-target case. The supplied oracle is a checking rule, and this is not a runtime/advantage benchmark.

Measurements are available only after the final gate. This prevents a mid-circuit measurement from being silently replaced by an unmeasured precomputed state. Restarting/replaying a circuit explicitly prepares it again. Fresh-run counts and one-run collapse are separate views. Guided playback samples 256 fresh preparations at each completed experiment, without a provider request.

The screen uses progressive disclosure: current claim, circuit, amplitudes/probabilities, and controls; deeper mathematics, hardware explanation and sources expand on demand. English/Chinese switching preserves the local circuit and resets provider-language context. The ordinary computer simulates ideal mathematical gates; no quantum device, pulse calibration, noise, decoherence, error correction or real timing is modeled.

## Implementation boundaries

- `public/quantum.mjs`: normalized complex state vectors for one/two qubits, H, phase, CNOT, oracle and diffusion; basis order |q0 q1>, q0 leftmost. Server and client share this calculation.
- `public/quantum-content.mjs`: bilingual bounded lessons and gate explanations.
- `public/quantum-view.mjs`: isolated showcase, prediction controls, readout, optional coach and optional prefixed provider console.
- `src/quantum-coach.mjs`: server reconstructs an allowlisted circuit, supplies checked facts and requires one bounded native explanation tool. Returned text cannot modify state or counts.
- Quantum endpoints reuse tester authentication, origin validation, session ownership, locks, TTLs, global turn limits, trace redaction and the provider router. The configured default is honored; Meta remains the current default. Ollama coordination is unchanged.
- Eight explanation attempts per quantum provider session, counted before invocation. No automatic retries. Expired IDs are discarded for the next explicit retry; a new explanation session can be requested after exhaustion without clearing the circuit.
- Explanation concerns the final prepared circuit, not a particular random shot. Provider text is labeled separately from code-derived facts. `EXPLAINBACK_TRACE=1` controls the console; otherwise the trace endpoint stays unavailable.
- No new dependencies, secret values, network-loaded media or quantum hardware credentials.

## Sources

- IBM Quantum Learning, [Quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information): amplitudes, phase and H.
- IBM Quantum Learning, [Entanglement in action](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/entanglement-in-action/introduction): Bell state and correlated classical mixture distinction.
- Microsoft Learn, [Grover search theory](https://learn.microsoft.com/en-us/azure/quantum/concepts-grovers): oracle, diffusion and the two-qubit example.

All graphics are drawn in code. External names identify reference sources and the actual model provider; no affiliation or endorsement is asserted.

## Review and verification

The first physics tests failed because the simulator did not exist, then passed against independently calculated cases. Read-only review found three issues: mid-circuit measurement reset, expired/exhausted coaching recovery, and ignoring the configured default provider. These were fixed; UI regression tests first reproduced the first two. Follow-up review found no remaining actionable issues.

Initial live English explanation failed explicitly with HTTP 200 / provider status `incomplete`: all 1,300 output tokens were consumed before an answer. This was diagnosed from the filtered console and corrected by using the established `reasoningEffort: low`, 4,096-token request settings. Failure was not reported as an accepted explanation; retries are explicit.

Final verification:
- Full Node 22 suite: **181/181 passed**. Focused quantum UI regressions were rerun after the final provider-label polish and passed.
- Asset build, configured-secret scan and whitespace/diff checks passed. No new dependencies. Screenshot and local outputs remain ignored.
- Browser, English: guided qubit and interference sequence, same-state repeated measurement, intermediate measurement disabled, final phase-π result 0%/100%, accepted live Muse explanation and actual provider trace.
- Browser, Chinese: language switch preserved the local circuit, accepted live Muse explanation with a bounded amplitude focus, Bell Z result 00/11 with matching classical reference, Bell X result 00/11 against a uniform classical mixture, and target-01 Grover oracle at 25% each followed by 100% target and 256/256 simulated counts.
- Area switching preserved the quantum experiment and allowed the original physics demo/manual modes and console to work. No duplicate element IDs or horizontal overflow at the current 654-pixel browser width.
- The active-area connection label follows its selected provider. Switching the quantum selector to Qwen and back updated the label without making any Ollama call. Meta was restored as the selected provider.
- Screenshot: `output/quantum-showcase-zh.png`. Preview remains open at `http://127.0.0.1:4173/#quantum` in Chinese, with the first guided experiment complete and Next ready.

Local changes only; no commit, push or deployment was performed.
