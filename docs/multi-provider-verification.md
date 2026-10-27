# Multiple providers and compact evaluation

Verified October 26, 2026 (Pacific), local feature branch. No commit, push,
deployment or remote Ollama service configuration was performed. Existing
prototype source archives and baseline labels remain unchanged.

## Implementation and checks

- Meta Responses and Ollama Chat share one normalized native-tool contract.
- Server-configured model allowlists; model pinned per session; bilingual selector
  and provider/model console labels. Meta credential stays server-side and is never
  sent to Ollama. Selected LAN origin lives only in ignored local configuration.
- Shared endpoint lock covers app and CLI on this Mac. Unload and verify previous
  managed model before switching. Uncertain generation blocks further local calls.
- Independent review found a concurrent-recovery race and incomplete-lock crash
  window. Both fixed and covered by regression tests. Recovery guard is never
  automatically stolen; a crash during its brief lifetime needs operator inspection.
- 125 offline tests pass. English/Chinese selection, session pinning, reset unlock,
  trace visibility, 390px mobile and 1440px desktop checked without overflow.
- Live browser submission during eval returned 409 without sending a second model
  request. Console distinguishes prepared attempts from actual outbound requests.
- Secret scan passed; environment remains ignored and privately permissioned.

## Live comparison

Suite claim-mini-v1: eight independently seeded synthetic cases per model. No
retries. Checks cover ambiguity, claim capture, prediction, revision, fresh
transfer and correct values paired with incorrect reasoning. All 15 attempted
local cases have the same prompt hashes as their Meta reference cases.

| Model | Contract passes / planned | Valid outputs / attempted | Mean attempted wall time |
| --- | --- | --- | --- |
| muse-spark-1.3 | 8/8 | 8/8 | 3.9 s |
| muse-glimmer:latest | 6/8 | 6/7 | 97.1 s |
| qwen3.8:27b | 5/8 | 7/8 | 14.0 s |

Initial matrix: Meta completed eight cases; Glimmer passed six, timed out at
180 seconds on the transfer case, and did not run its eighth case. The matrix
stopped without loading Qwen. Explicit recovery unloaded managed models and
verified absence. Qwen then completed the same eight cases in a separate run.
No Glimmer retry replaced the failure; the partial original report is retained.

Qwen asked for clarification instead of capturing two already-scoped claims and
returned one output rejected by application validation on transfer. Its other
five contract cases passed. This can interrupt the guided demo, which correctly
stops rather than manufacturing progress. Meta remains the configured default.

Glimmer first-load time was 15.09 s; Qwen first-load time was 14.59 s. Cold loading
and failures count in wall time. Tokenizers and provider settings differ. Local
requests use think=false, temperature=0, context=16384, output cap=4096 and a
180-second timeout; Meta uses low reasoning effort, cap=4096 and 30 seconds.
Ollama version and exact model digests are captured in the JSON reports.

**Manual review found an error despite a passing action check:** Glimmer's Chinese
landing feedback tied average contact force to stopping distance. This model uses
time-average force mg + m*impactSpeed/D, so stopping duration is the relevant
quantity. The automated score does not validate every generated sentence. It is
a small developer smoke comparison, not a teaching-quality or learning benchmark.

Local-only artifacts (ignored by Git):
- output/eval/provider-comparison-initial.json and .md
- output/eval/provider-comparison-qwen.json and .md
- output/multi-provider-tests.txt

Run commands and recovery behavior are documented in README.md. Other Ollama
clients do not share this Mac's lock. Host-wide concurrency settings remain the
operator's responsibility; they were not changed or claimed as verified.

Additional Chinese browser smoke check with Qwen: one real request returned
HTTP 200 in 26.4 s, with provider/model, filtered request and response visible in
the console. Qwen asked for clarification, so the guided demo stopped without
retrying or auto-confirming. Reset restored the model selector; the browser was
left on Meta in Chinese. Managed local models were unloaded after the check.
