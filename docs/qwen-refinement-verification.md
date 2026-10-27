# Qwen claim-capture and transfer refinement

October 26, 2026 (Pacific). Three-round ceiling; refinement builds on the existing
uncommitted multi-provider implementation. Meta remains the default. Baseline
archives and original evaluation reports are preserved.

## Root causes and changes

The original claim guidance conflated an unsupported/false claim with unclear
meaning. Qwen asked for clarification of explicit claims instead of capturing
those claims for testing. Shared instructions now cover only the current phase,
distinguish meaning from correctness, preserve quantifiers and negation, and ask
for a faithful interpretation before prediction. There is no Qwen-specific answer
mapping, keyword classifier, forced progression, response repair or automatic retry.

A diagnostic rerun reproduced the transfer rejection using the original prompt
hash: Qwen copied a later revision into `priorEvidence`. The original validator
correctly rejected it. The tool schema now offers the full `originalExplanation`
as the only allowed `priorEvidence` value, and runtime validation requires exact
equality. Partial quotes and quotes from later turns are rejected transactionally.
Current-word quotations, numeric gates, evidence IDs and replay checks remain.

Confirmation stays a local state transition. Its visible English/Chinese question
asks the learner to confirm or revise the interpretation. Actual model wording
remains visible in history and the provider console; it is not silently rewritten.

Evaluation reports now include a prompt-policy version, accepted interpretations
and original quotations for human review, and allowlisted quote-source failure
categories. Rejected text, raw provider errors and hidden thinking are not saved
in comparison reports.

## Verification so far

- Offline suite: 130 tests pass. New regressions cover source-bound schemas,
  non-mutating quote rejection, safe failure categorization and bilingual local
  confirmation. Existing numeric/meaning gates and resource-lock tests pass.
- First prompt-only pass: 3/4 focused cases; English torque capture still failed.
  This result remains recorded rather than being replaced by later passes.
- Phase/source refinement: 8/8 Qwen controls pass. These include the three original
  failures, correct-values/wrong-reasoning, another-domain false claim, a supported
  Chinese claim, a help request without a claim, and incorrect entered values.
- Manual review of accepted interpretations confirms the two false claims stayed
  false in the captured wording; transfer quotation matches the initial claim.
- Original eight-case comparison fixtures are byte-for-byte unchanged. The new
  prompt and stricter quote contract are intentional changes, initially versioned as
  `phase-and-source-v2`; this is a development comparison, not an unbiased benchmark.

Local artifacts are under ignored `output/eval/`, including
`qwen-claim-refinement.json` and `qwen-refinement-controls.json`/`.md`.

## Final revision criterion

Two real Chinese HTTP walkthroughs with v2 reached revision and stopped when
Qwen asked for reasoning already supplied. The first diagnostic did not save the
exact action; an instrumented repeat captured it. Those failures are retained.
The final shared policy, `phase-and-source-v3`, explicitly assesses the current
explanation for a mathematical relation, causal meaning and reconciliation. It
accepts a sound explanation without requiring another restatement, while still
rejecting vague agreement, incorrect links and unsupported real-world conclusions.

Replay of the captured live revision plus vague and incorrect revision controls
passed 3/3. The original eight comparison fixtures remain unchanged. The six
additional controls are defined in `src/eval/holdouts.mjs`; they are supplementary
checks, not replacements for the original comparison cases.

## End-to-end workflow

The final v3 Chinese preset workflow completed with four HTTP 200 Qwen calls, all
accepted, progressing through claim, local confirmation, experiment, revision
and fresh transfer. The final outcome was assisted. The session trace recorded
provider/model, sent-request status and response outcomes. Checkpoint/playback
callbacks were bypassed for this test; animation rendering was not re-tested.
The two earlier failed v2 walkthroughs remain recorded.

Future evaluation failures now retain bounded HTTP/completion status, tool-call
count, allowed-tool boolean and argument type through existing trace hooks. A
privacy regression verifies that tool names, arguments, text, hidden thinking
and raw errors do not enter these diagnostics. This reporter-only addition was
made after the final matrix started and cannot retrospectively identify its
Qwen provider/adapter error; prompts and scoring were unchanged.

## Final frozen comparison

All 24 cases were attempted with phase-and-source-v3, with no retries. The CLI
exited 1 because one case failed; the matrix itself completed.

| Model | Contract passes | Valid / attempted | Mean attempted wall time |
| --- | --- | --- | --- |
| muse-spark-1.3 | 8/8 | 8/8 | 3.6 s |
| qwen3.8:27b | 7/8 | 7/8 | 13.4 s |
| muse-glimmer:latest | 8/8 | 8/8 | 88.1 s |

Qwen improves from 5/8 to 7/8. Both claim-capture failures and the wrong-source
transfer failure now pass. Its English ambiguity case instead failed inside
provider/adapter handling; the report does not identify the precise cause. That
failure remains in the denominator and was not retried. Meta stays at 8/8.
Glimmer completes 8/8, versus six passes, a timeout and one unrun case initially.

All 16 local-case prompt hashes match their Meta counterparts. Both local model
digests and Ollama version 0.40.11 match the initial comparison. The generation
settings and timeouts were not changed. Mean wall time includes cold starts and
failed requests; tokenizers and provider settings differ. Manual review of the
accepted claim interpretations and transfer quotations found them faithful to
the supplied synthetic text. Scores still do not validate every feedback sentence
or establish teaching effectiveness, fluency or reliable performance across runs.

Meta remains the configured default. Models were run in order Meta, Qwen, Glimmer
under the existing exclusive endpoint lock. The coordinator unloaded and verified
the preceding managed model before switching, and unloaded Glimmer at the end.
Read-only residency checks observed Qwen alone, then Glimmer alone. Host-wide
settings were not changed; unrelated clients remain outside this Mac's lock.

Artifacts (local-only, ignored by Git):
- output/eval/provider-comparison-refined.json and .md
- output/eval/qwen-revision-controls.json
- output/eval/qwen-guided-refined-attempt3.json
- output/eval/qwen-guided-attempt1.md and qwen-guided-failure-attempt2.json
- output/qwen-final-tests.txt

Three of three context-iterate rounds completed. No commit, push or deployment.
