# Multi-provider and small evaluation iteration ledger
Baseline: da3ca898e371c6ba34f3e31c6af184715d1a82ec, local feature branch.
User requests Meta + Ollama model support and a small comparison eval; the
two Ollama models must never run together. Use context-iterate, ceiling 3 rounds.
No commit, push, deployment or remote Ollama service reconfiguration is included.

Plan:
1. Provider-neutral result contract, Meta compatibility, Ollama native tools,
   model allowlist and session pinning, bilingual selector/console, shared
   cross-process local lock and unload/verify before model switch. Verify offline.
2. Fixed bilingual evaluation cases with independently seeded workflow phases,
   deterministic action/shape/transition checks, timing/usage and failures reported.
   Sequential target groups; same prompt/version/inputs; no model judge or retries.
3. Live sequential local comparison plus Meta reference; refine concrete failures,
   browser QA, final independent review and full suite. Stop at three rounds.

Rulings:
- Both server /api/show responses advertise tools and thinking; use native tools.
  Set think=false initially for the two local models, temperature=0, context=16384.
  Keep hidden thinking out of the console and eval reports.
- Resource coordinator covers this app and its eval CLI on this Mac, by canonical
  endpoint lock file. No race-free control of unrelated Ollama clients is possible
  via this API. Recommend OLLAMA_MAX_LOADED_MODELS=1 / OLLAMA_NUM_PARALLEL=1 on host;
  do not pretend these host settings were configured.
- Unload only configured models; refuse a switch if an unrelated model is resident.
  Uncertain transport failures block further local calls until explicit recovery.
- Provider/model stay fixed per session, reset to select another. Selection never
  sends a model request. All numeric evidence/learning gates remain unchanged.
- User-provided LAN endpoint is configured only in ignored .env.local; example
  uses localhost. Browser receives IDs/labels only, never keys or endpoint config.
- Live eval uses synthetic cases; small developer comparison, not learning efficacy.

Round 1: in progress.

Round 1 complete:
- Meta and Ollama adapters share text/toolCall/model/usage result shape.
- Allowlisted model selection pinned to sessions; bilingual UI and provider-aware
  trace labels. Ollama origin is server-only; Meta key never sent to Ollama.
- Cross-process endpoint lock, managed-model unload + verification, fail-closed
  uncertainty marker and explicit recovery.
- 117 offline tests passed, including adapter, shared lock, unload failure,
  uncertainty and HTTP session-pin tests. Existing math and workflows pass.
Remaining gap: actual model output quality and fair compact comparison.
Round 2 in progress: eight fixed bilingual cases with seeded independent phases.

Round 2 complete:
- Eight fixed independent bilingual cases, reproducible prompt hashes, real app
  validators, action/assessment/phase checks, and explicit language-script proxy.
- Sequential matrix runner with partial JSON/Markdown reports, all failures in
  denominator, cold-load timing and usage, no retries or LLM judge.
- Timeout halts the matrix and persists the coordinator uncertainty block even
  when the evaluator catches the error to save its partial report.
- 121 offline tests passed. CLI defaults to the two configured local models;
  --models=all includes the configured Meta reference, --list performs no calls.
Round 3 in progress: live 24-request comparison, documentation, browser QA and review.

Final independent review found two recovery bugs, both fixed in the final pass:
- Concurrent stale-owner recovery could unlink a replacement lock. Added an
  atomic recovery guard, normal-acquisition guard checks, and owner-token cleanup.
  Guard rejection regression RED→GREEN; eight concurrent recovery attempts and
  active-owner refusal pass without overlapping control work.
- A crash during lock metadata write could leave an unrecoverable empty file.
  Publish complete metadata by atomic hard link; explicit recovery refuses fresh
  incomplete legacy metadata and accepts abandoned metadata after ten minutes.
  Incomplete-lock regression RED→GREEN.
- Full offline suite: 124/124. Browser: English/Chinese selector, pinned session,
  reset unlock and 390px/1440px layouts checked; no horizontal overflow.
- Ruling: a crash in the brief recovery guard itself stays blocked for operator
  inspection. Never automatically steal that guard; this favors no concurrent
  model operations over automatic recovery from every crash window.
- Security check passed: configured key absent from other project files, ignored
  private-permission .env.local retained. Baseline archives unchanged.

Live human-review finding (not hidden by the automatic score):
- Glimmer landing-claim-zh passed action/schema/phase checks, but its feedback
  stated average contact force depends on gravity and stopping distance. In this
  time-average impulse model the relevant relation is mg + m*impactSpeed/D;
  stopping duration D matters. Record this as a factual feedback error, separate
  from automated protocol success. No prompt tuning or selective rerun to erase it.
- Clarified evaluator documentation/report wording: contract passes do not
  validate every feedback sentence; saved feedback needs human review.
- Real browser contention check: while eval held the endpoint lock, a Qwen demo
  submission returned HTTP 409 in 2 ms. No provider request was sent and the guide
  stopped; Glimmer remained the only running local model.
- Browser check found a misleading prepared-request label. Added requestSent
  metadata, localized prepared-versus-sent console labels and submission-attempt
  counters. Regression RED→GREEN; full suite 125/125.

Initial live matrix stopped safely:
- Meta 8/8 contract cases, mean 3.901 s.
- Glimmer 6 passed, case 7 timed out at 180 s, case 8 not run. Mean attempted
  latency 97.123 s; first model load 15.093 s. No success was fabricated.
- Timeout blocked all local calls and prevented Qwen starting in that matrix.
- Explicit npm run llm:recover succeeded: managed models unloaded and absence
  verified. Started a separate Qwen-only eight-case run with the identical suite;
  no Glimmer case was retried and original partial artifacts remain intact.

Round 3 complete (three of three rounds used):
- Qwen 5/8 contract passes, 7/8 valid outputs, mean attempted latency 13.960 s.
  Two unexpected clarification actions and one rejected transfer output retained.
- All 15 attempted local cases match their corresponding Meta prompt hashes.
- Qwen Chinese browser request returned HTTP 200 and visible filtered console
  payloads in 26.4 s; unexpected clarification stopped the guide with no retry.
  Reset and returned browser selection to Meta; unloaded managed models afterward.
- Authored docs/multi-provider-verification.md preserves failures, human feedback
  error, measured latency and protocol-score limitations. No model-quality claim.
- No further iteration: provider/eval acceptance checks are met; local-model
  response quality and speed remain measured limitations, not hidden failures.
