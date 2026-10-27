# Tester access and Qwen ambiguity verification

Date: October 27, 2026. Local implementation; no commit, push or deployment.
Existing baseline archives are preserved. Earlier provider and guided-demo work
remains distinguishable in its original verification notes.

## Ambiguity defect and fix

The v3 English ambiguity case completed with HTTP 200 and one object-argument
native call, but `allowedToolCall` was false. A bounded diagnostic capturing only
tool names confirmed `propose_claim` while the turn offered only
`ask_clarification`. The general capture instruction conflicted with the local
unresolved-scope guard.

Prompt version `scope-and-tools-v4` gives that guarded turn a clarification-only
task and explicitly lists the available function names on every turn. Other
clear claims retain normal capture behavior. Native tool validation, quotation
checks and transfer numeric/reasoning gates remain strict. There is no output
repair, automatic retry, provider fallback or fabricated clarification.

## Live results

Focused canonical cases: `crossing-ambiguity-en`, `crossing-ambiguity-zh`.

| Provider/model | Passed | Mean wall time |
| --- | --- | --- |
| Meta muse-spark-1.3 | 2/2 | 2.7 s |
| Ollama muse-glimmer:latest | 2/2 | 54.7 s |
| Ollama qwen3.8:27b | 2/2 | 14.1 s |

The same per-case prompt hashes were sent to all three providers. Cold loading
is included. The other six original cases were then run on Qwen: **6/6 passed**,
including source-bound transfer and rejecting correct values with wrong reasoning.
Together these cover all original eight cases under v4. The preceding initial
Qwen-only ambiguity check also passed 2/2; pre-fix failures are retained locally.

Reports (ignored, synthetic, metadata and accepted feedback only):
- `output/eval/qwen-ambiguity-diagnostic.json` — reproduced v3 failure.
- `output/eval/qwen-ambiguity-tool-name.json` — separate bounded diagnostic.
- `output/eval/qwen-ambiguity-v4.json` — first focused verification.
- `output/eval/ambiguity-all-v4.json` / `.md` — three-provider comparison.
- `output/eval/qwen-regressions-v4.json` / `.md` — other six Qwen cases.
- `output/eval/ambiguity-residency.json` — 49 samples, maximum one resident model,
  empty residency between Glimmer and Qwen and after the comparison.

The coordinator continues to hold the cross-process lock through calls and
verified unloading. No concurrent Ollama inference was issued. Sampling is
additional evidence, not a host-wide enforcement mechanism for unrelated clients.
Meta remains the configured default. This is a small fixed synthetic smoke suite,
not a learning-effectiveness, broad accuracy or fluency benchmark. Feedback was
inspected for the intended clarification, but contract checks do not certify
every sentence a model could generate.

## Tester login

Required server settings: `EXPLAINBACK_TESTER_USERNAME` and
`EXPLAINBACK_TESTER_PASSWORD`. Password length is 12–512 characters; missing or
invalid configuration keeps access closed. `.env.local` is optional when the
server environment supplies the values. This checkout has a generated password
in the ignored, mode-600 `.env.local`; it is not reproduced in documentation.

Authentication uses random opaque tokens in an HttpOnly, SameSite=Strict cookie,
with an eight-hour maximum age and memory-only server sessions. Credential
comparisons use fixed-size hashes. Failed attempts and active sessions are bounded.
All learning, provider-status and trace APIs require login; every learning session
belongs to one login. Rotation, logout and expiry revoke its state. Sent inference
continues under its resource lock, but results after revocation are discarded.

The login page, errors and sign-out support English/Chinese. The app age checkbox
and age-based request checks are removed; a synthetic-example note remains.
This is shared tester access on the existing localhost-only POC, not a deployment
or an account-management system. Provider terms are not altered by app UI changes.

## Verification

Five post-implementation review rounds are tracked in
`implementation/tester-login-progress.md`; **5/5 rounds completed**.

- `npm test`: **141/141 passed**. Authentication tests cover fail-closed setup,
  bounded attempts/session counts, cookie rotation/expiry, every protected API,
  cross-browser ownership, logout during inference and multi-secret redaction.
- Browser: English desktop and Chinese 390px login, localized invalid-password
  feedback, cleared password after success, reload persistence and sign-out.
- Full guided workflow in both languages: nine Next checkpoints, three played
  animation segments, four visible provider-double calls, assisted result.
- Browser review found hidden claim/history text surviving reset/logout. It now
  clears rendered content as well as session state. The patched Chinese flow
  confirmed no stale claim/history; missing-cookie 401 and a delayed response
  after logout left the workspace hidden, history empty, traces zero and demo stopped.
- Running localhost app: real configured login, Meta-default session creation,
  logout revocation, three provider targets. No inference in this config check.
  Environment-only startup/login was tested separately with no `.env.local`.
- Final `npm run security:check`: both configured secrets absent from 316 other
  project files, env file private and ignored. `git diff --check` and syntax
  checks pass; baseline archives unchanged. Final Ollama `/api/ps` is empty.

Browser screenshots and scripts stay in ignored output directories. UI integration
uses a labeled deterministic provider double separately from live model evidence.
The regular local app remains running on port 4173; the browser fixture is stopped.
No commit, push or deployment was performed.
