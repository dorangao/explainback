# Qwen claim and transfer refinement
Ceiling: three context-iterate rounds. Continue the existing uncommitted
feat/multi-provider-eval work; no commit, push or deployment authorized.

Acceptance: faithfully capture clear false claims without inventing ambiguity;
produce valid evidence-linked transfer decisions; preserve clarification for
unclear claims and wrong reasoning, exact-quote checks, numeric gates, English /
Chinese, Meta default and exclusive Ollama scheduling. Compare every model on
identical frozen cases/prompts and retain failures rather than retrying them away.

Round 1 in progress: diagnose transfer rejection with one original-prompt Qwen
request; remove ambiguous claim-capture guidance and verify focused regressions.
Round 2 planned: use diagnostic evidence to refine transfer output, add safe
failure categories, and verify Qwen plus unseen wording/negative cases.
Round 3 planned: freeze shared instructions, rerun all-model comparison, inspect
feedback and verify the full suite and unchanged defaults/concurrency behavior.

Baseline: Meta 8/8; Glimmer six passes, one timeout, one unrun; Qwen 5/8 with
unnecessary clarification on two explicit claims and one rejected transfer output.
Original reports and before-source copies remain in ignored output/.

Round 1 complete (partial gain):
- Reproduced old transfer failure with identical original prompt hash: Qwen copied
  revision/current wording into priorEvidence; validator rejected it as an
  original-quote fabrication. Diagnostic stored locally, no hidden reasoning.
- Removed ambiguous 'unsupported claim' wording and distinguished false content
  from unclear meaning in shared claim instructions/tool descriptions.
- Qwen focused cases: 3/4 (both ambiguity controls and Chinese landing claim
  pass; English torque claim still unnecessarily clarified). Offline 125/125.
- Manual review also caught corrected wording in the model's confirmation question.

Round 2 in progress:
- Isolate instructions to the current phase to reduce conflict with revision and
  transfer rules; explicitly preserve quantifiers and neutral claim confirmation.
- Bind priorEvidence to the full originalExplanation in schema and runtime, never
  a current/revision quote. Strengthens validation rather than repairing responses.
- Safe eval failure codes for quote-source errors; accepted interpretation and
  original quote retained for human review. Prompt version phase-and-source-v2.
- Three regression tests RED→GREEN; offline suite 128/128 before live controls.
- Four extra fixed controls: different-domain false claim, supported Chinese
  claim, help with no claim, and sound reasoning with a wrong numeric answer.

Round 2 complete:
- Qwen passes 8/8 refinement controls: original three failures, correct-numbers /
  wrong-reasoning trap, plus four additional wording and negative cases.
- Manual review confirms both captured interpretations preserve the false claims;
  priorEvidence now exactly copies the initial claim, not revision text.
- Raw model questions can still over-clarify. The visible confirmation question is
  now owned by the local state transition, in English/Chinese; original provider
  output stays inspectable in history/trace. Regression RED→GREEN.
- Full suite 129/129. Meta remains configured default; no coordinator/adapter or
  host settings changed. Prompt policy phase-and-source-v2 is frozen for round 3.

Round 3 in progress: real Chinese four-call Qwen HTTP workflow, then identical
original eight-case comparison in order Meta, Qwen, Glimmer. This puts the slow
Glimmer last without hiding its timeout/failures or retrying them. Keep all outputs.

Round 3 finding before matrix:
- First real Chinese HTTP walkthrough passed claim, confirmation and experiment,
  but stopped on an accepted unexpected revision action. No automatic retry.
- Script lacked exact failure diagnostics; retain that failure and perform one
  explicitly instrumented repeat to identify the revision action. Do not treat a
  second success as erasing the first failure. Comparison has not started yet.
- Instrumented repeat reproduced the revision pause: Qwen requested a causal
  explanation of positive/negative torque that the current revision already gave.
- Final round refinement (policy v3): assess current reasoning against an explicit
  sufficiency criterion; select transfer for a sound reconciliation without a
  compulsory restatement, while preserving clarification for missing/false links.
- Added vague and incorrect revision controls. Replaying the captured live state
  plus these controls before freezing v3 for the full comparison. This is the
  final prompt change in the three-round budget; retain any remaining failures.
- v3 captured-state replay: 3/3 pass (sound actual revision advances; vague and
  incorrect revisions remain at revision with clarification). No gates removed.
- Freeze phase-and-source-v3. Final end-to-end verification and 24-case matrix
  follow with no further prompt tuning in this run. Explicit repeated diagnostic
  runs retain separate filenames; they are not automatic provider retries.
- Final v3 Chinese HTTP walkthrough completed with four accepted Qwen calls,
  correct claim/confirmation/evidence/revision/transfer transitions, and assisted
  outcome. Requests and responses appeared in the session trace. This test bypassed
  animation/checkpoint rendering; it is not a new visual animation test.
- Final 24-case matrix started with v3, unchanged eight-case fixtures, order
  Meta -> Qwen -> Glimmer, exclusive local lock and verified unload boundaries.
- Final matrix intermediate result: Meta 8/8, Qwen 7/8. All three original Qwen
  failures now pass. English ambiguity instead failed inside provider/adapter
  handling; no normalized response was returned and the category does not identify
  the exact cause. Retained without retry or speculative explanation. Glimmer
  runs last after Qwen unloading. Manual capture/transfer review matches sources.
- Reporter-only follow-up after the matrix started: future reports capture bounded
  HTTP/completion/tool-count/allowed-tool/argument-type metadata through existing
  trace callbacks. No raw text, thinking, tool names, arguments or raw errors are
  retained. Privacy regression RED→GREEN; suite 130/130. This does not change
  prompts or grading, and cannot retrospectively classify the current Qwen error.

Round 3 complete; three of three rounds used:
- Final matrix completed all 24 attempts, no retries: Meta 8/8, Qwen 7/8,
  Glimmer 8/8. Exit 1 truthfully signals Qwen's English-ambiguity provider/adapter
  failure; no exact cause is claimed. All three targeted Qwen failures now pass.
- All 16 local prompt hashes match Meta; model digests and Ollama 0.40.11 unchanged.
- Final Chinese four-call Qwen HTTP workflow completed with assisted outcome.
- 130 offline tests pass. Additional safe failure metadata is reporter-only;
  all eight current prompt hashes still match the frozen live comparison.
- Meta remains default; exclusive model control unchanged and verified unloads
  preserved. No fourth tuning round: original defect checks pass, while the
  unclassified provider/adapter failure remains an explicit limitation.
- Full evidence and retained intermediate failures in
  docs/qwen-refinement-verification.md. No commit, push or deployment.
