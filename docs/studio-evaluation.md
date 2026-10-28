# Generated-lesson evaluation: frozen bilingual smoke suite

October 27, 2026 (Pacific). **12 planned, 12 attempted, 12 valid contracts,
12 automated passes.** That is eight generated drafts plus four expected
clarification/unsupported responses, not twelve scientifically verified lessons.
AI-assisted author review found teaching issues below. Independent human review
is still pending.

## Protocol and reproducibility

The [12 cases](../eval/studio-v1.json) were frozen before the first provider run.
Six topic pairs each have an English and a Chinese prompt; each generated draft
must contain both languages. This is a developer-authored synthetic smoke suite,
not a held-out benchmark or a learning-effectiveness study.

| Family | Cases | Expected behavior | Automated evidence |
|---|---|---|---|
| Newton cooling | cooling-en / cooling-zh | Adjustable temperature model | Independent temperature probes, inputs, axis, numeric transfer |
| Small-angle pendulum | pendulum-en / pendulum-zh | Adjustable ideal period model | Period probes, gravity dependence, mass invariance, numeric transfer |
| Browser caching | web-cache-en / web-cache-zh | Process with conditional network steps | Valid process contract; content checked separately |
| Water cycle | water-cycle-en / water-cycle-zh | Process with explicit simplifications | Valid process contract; content checked separately |
| Ambiguous request | ambiguous-en / ambiguous-zh | Ask for missing object/quantity before modeling | Non-ready status; clarity of questions checked separately |
| CFD / safety certification | unsupported-cfd-en / unsupported-cfd-zh | Decline unsupported simulation/certification | Non-ready status; explanation checked separately |

The current author contract has `ready` or `unsupported`, so a clarification
request uses `unsupported` plus a bilingual message. Status checks alone cannot
distinguish a useful clarification from a generic refusal. Process correctness,
units, language quality, pedagogy and the wording of transfer questions are
manual-review criteria, not automated successes.

```sh
# Node 22; no calls, checks checksum and lists cases
npm run eval:studio
# Exactly one Meta attempt per case, sequentially, no automatic retry
npm run eval:studio -- --live
# Explicit smaller rerun; never present a subset as the full suite
npm run eval:studio -- --live --cases=cooling-en,cooling-zh
```

The CLI forces Meta `muse-spark-1.3` even if the local default changes. Neither
Ollama model is invoked. Provider errors and contract/expectation failures remain
in the denominator. Each new run creates a separate ignored `output/eval/`
directory; reports are private local files. Reports record the frozen hash,
scorer hash, exact request hash per case, model, usage, latency and failures.
Do not publish raw responses, traces or credentials with this summary.

Frozen fixture SHA-256:
`e2817e2c4cd6ea4550ca96c455e4a7242d391af25111cdbeed68ddac961683aa`.

## First live run

Run: `2026-10-27T23:58:02.325Z` to `23:59:14.353Z` (16:58 Pacific).
Meta `muse-spark-1.3`; version 2 generated-lesson contract; one attempt per case;
no retries, repairs, prompt tuning or LLM judge. The author prompt was unchanged
through this task. All twelve HTTP requests returned 200 and passed the stated
contract/expectation checks.

| Case pair | EN latency | ZH latency | Returned outcome |
|---|---:|---:|---|
| Cooling | 7.311 s | 6.773 s | Two model drafts |
| Pendulum | 9.375 s | 7.396 s | Two model drafts |
| Browser caching | 7.318 s | 6.635 s | Two process drafts |
| Water cycle | 7.472 s | 10.185 s | Two process drafts |
| Ambiguity | 2.665 s | 1.527 s | Two clarification messages |
| Unsupported CFD | 3.585 s | 1.744 s | Two refusals |

Mean request latency: **5.999 s** (range **1.527–10.185 s**). This combines
short refusals and full drafts; it is not a production latency estimate. Usage:
25,418 input / 17,830 output tokens. No repeated trials or confidence estimates.

Original scorer SHA-256:
`14e498afcbe32e055dc4599d8289eaf36a0d70ccbcdbc19aaf9d566749157e46`.
Original private report SHA-256:
`1ce9e5ce8e7f68d83a48595d6f180920c0fc7fcfec43e62d93a9194916aa8f6a`.
The local record is under `output/eval/studio-2026-10-27T23-58-02.324Z-da8417c2/`.

## Review-driven scorer supplement

A fresh code reviewer demonstrated a false positive: the original cooling probes
could accept a formula hard-coding ambient temperature to 20 C. The original
fixture and report are preserved. **`studio-score-v2`** adds two explicit,
post-baseline probes at 10 minutes, changing ambient to 25 C and initial
temperature to 90 C independently. Regression tests reject formulas that ignore
either control. This is a disclosed scoring improvement, not a new held-out set.

Offline re-scoring of the same twelve saved responses still gives **12/12**
automated passes, including both sensitivity probes for both cooling drafts.
**Zero additional provider calls.** Results are separately saved in
`rescore-v2.json`. Future CLI runs use the versioned scorer and record its hash.
Current scorer SHA-256:
`7d0f4c07c61c9a81a19861e7f6a92903f6a8eebd2326fa487e69bd6952040475`.

## Content review: automated passes are not teaching readiness

This is an AI-assisted author review of all twelve returned responses, not an
independent human assessment and not a blinded grading exercise. Each row below
identifies a concrete issue or limitation, without assigning a science-pass rate.

| Output | Finding / follow-up |
|---|---|
| Cooling EN | The framing gives away the conclusion before prediction. Intro/explanation uses “heat” for initial temperature. Revise to a testable claim and precise quantity names. |
| Cooling ZH | Formula and units are consistent with the requested ideal model; refine the “initial heat” wording and review the paired translation. |
| Pendulum EN | Transfer calculation is correct, but the question asks how periods compare while the UI expects a numeric period. Rewrite the question and unit explicitly before presenting. |
| Pendulum ZH | No specific numeric error found in this review; retain small-angle/ideal assumptions and obtain independent language/content review. |
| Browser caching EN/ZH | Clarify that HTTP validation does not itself eliminate DNS lookup; DNS cache or connection reuse can do that. Keep fresh-cache and stale-revalidation branches distinct. |
| Water cycle EN | The condensation step includes ice formation without distinguishing deposition. Correct phase-change language before teaching. |
| Water cycle ZH | English assumptions call the four process stages “reservoirs”; align the two languages. Do not imply that the linear step renderer displays all branches of the real cycle. |
| Ambiguity EN/ZH | Both ask for an object/quantity/conditions instead of inventing a model; human review of usefulness remains pending. |
| Unsupported CFD EN/ZH | Both decline the requested CFD/certification. Keep the boundary explicit: this renderer does not become CFD merely by receiving more measurements. |

Content references used during review: [MDN HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)
for caching/revalidation, and [USGS water cycle](https://www.usgs.gov/water-science-school/water-cycle)
for stores, fluxes and physical phases. They inform the review; this suite does
not automatically check generated claims against sources.

## Next measured improvement

- [x] Preserve first-run cases, outputs, hashes and counts.
- [x] Fix the evaluator's ignored-parameter false positive and verify the supplement.
- [x] Exercise a separate live cooling creation → explicit revision → reviewed
  presentation → parameter operation → EN/ZH → numerical transfer. See [demo record](studio-demo.md).
- [ ] Have a separate human reviewer inspect both languages and the flagged content.
- [ ] Run a live process revision/transfer flow with the same recorded expectations.
- [ ] Only then tune the author prompt for neutral predictions, precise quantity
  names and transfer-question/answer agreement. Compare a new run against this
  preserved baseline; add genuinely new cases before claiming generalization.
