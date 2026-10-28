# Vercel tester preview

The Vercel entry point uses **Meta muse-spark-1.3 only**. It ignores local Ollama
configuration and rejects Ollama target IDs. The local server and sequential
Ollama evaluation workflow remain available through the existing commands.

## Hosting and state

`api/index.js` uses the same validated learning handler as local development.
`npm run build` copies only public UI assets into `dist/`; Vercel serves these
and routes `/api/*` to the Node 22 function. `.vercelignore` limits the upload to
runtime source and build configuration, excluding credentials, eval output,
tests, documentation, and baseline archives. Those baseline archives stay in Git.

Cloud instances share tester tokens, learning sessions, rate limits and filtered
traces through an Upstash Redis REST database. Local development still uses
process memory. Cloud storage failures close access; there is no memory fallback.
Learning records and traces expire 30 minutes after creation. Login tokens expire
after eight hours. Logout immediately revokes access; inaccessible learning data
may remain until its 30-minute TTL. Reset deletes the session and trace. Cloud
function restarts do not reset these limits or revoke cookies. Changing tester
credentials creates a new namespace and invalidates previous cookies.

Cloud cookies use Secure, HttpOnly and SameSite=Strict. Allowed hosts come from
Vercel's deployment/branch/production host variables or explicitly configured
HTTPS origins. POST requests must carry the exact matching Origin. Shared atomic
session locks prevent overlapping mutations; writes verify the lock, live login
and session. A reset or logout during inference discards late results. A crashed
function leaves a lock for at most 90 seconds. Meta times out after 30 seconds;
the Vercel function limit is 60 seconds. No automatic provider or storage retries.

The shared POC limits remain 20 logins, 100 learning sessions, five failed logins
per minute, 12 provider attempts per session, and 60 attempts per hour in the
deployment environment. The last 12 filtered trace records are retained only
when `EXPLAINBACK_TRACE=1`. Clearing traces during an active request returns busy;
refresh remains available. No credential, cookie, private reasoning or raw
upstream error body belongs in traces.

## Configure and deploy

Create/link the `explainback` Vercel project in the intended account. Provision a
dedicated Redis database and connect it to the preview environment. Set these
server variables privately using the Vercel dashboard or stdin to `vercel env add`:

- `MODEL_API_KEY`
- `EXPLAINBACK_TESTER_USERNAME`
- `EXPLAINBACK_TESTER_PASSWORD` (12–512 characters)
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (the integration's
  `KV_REST_API_URL` / `KV_REST_API_TOKEN` names are also supported)
- `EXPLAINBACK_TRACE=1` for the guided demo and provider console

Do not upload `.env.local` or set any public-prefixed secret. Do not overwrite
local configuration with `vercel env pull`; use a separate ignored environment
file if needed. Do not configure `OLLAMA_BASE_URL` in Vercel.

Run `npm test`, `npm run build`, then `vercel deploy -y` for a preview deployment.
Production promotion is a separate action. A preview may also have Vercel account
protection; the app's tester login remains required after that protection.

## Verification before deployment

On October 27, 2026, all 148 offline tests passed with Node 22.23.1. The public
asset build, diff whitespace check and value-based Meta-key/tester-password
leak check passed. An independent review found and verified a fix for a console
write failure that previously could strand committed learning progress; final
state and completed console records now commit together.

`scripts/check-cloud-state.mjs` passed against a temporary real Redis database:
two separate cloud HTTP handlers shared login and a Chinese flight session;
the catalog exposed only muse-spark despite an injected local Ollama URL.
Direct storage checks covered rotation/revocation, locks, atomic state/trace
writes, reset, expiry and shared rate limits. No model calls were made. All
synthetic keys were removed afterward. The temporary database is not a deployed
application database.

## Initial preview (October 27, 2026)

After the account owner authorized the CLI, project `explainback` was created in
`doran-gaos-projects` (`prj_8y4jOH8v4zYVlNgRiwPfA0W0uAP5`). Its Node 22 build is
**Ready / Preview** at:

https://explainback-nbp8wnru1-doran-gaos-projects.vercel.app

Deployment ID: `dpl_9jww7uMZHkKC7GP5EUBvRJxnCRX2`. This contains commit
`b49d7f3` with a local `.vercelignore` correction: directory allowlist entries
must omit their trailing slash for the CLI to traverse them. A dry run confirmed
62 runtime files, with required app/API modules present and no environment
files, credentials, local outputs, tests, docs or downloaded skills included.

The dedicated `explainback-preview` Upstash database uses the free plan with
automatic paid upgrades disabled, connected only to Preview. The account owner
explicitly approved sending the existing Meta key and tester credentials to
server-only sensitive Preview variables. Trace capture is enabled. The original
`.env.local` credentials remain local and excluded from uploads.

Vercel automatically assigned the first deployment to Production despite the
preview request. A second deployment was confirmed as Preview, and the initial
Production deployment was removed. No production deployment is retained.

The current build succeeded. The real Redis integration check passed for shared
login/session state, Meta-only routing, Chinese sessions, locks, trace writes,
reset, expiry and quotas; its synthetic keys were removed afterward. Hosted browser/model-call verification was still pending at this initial checkpoint; see the release verification below. The Vercel connector's
project-creation permission remained unavailable; CLI authorization provided the
working deployment path.

中文：Vercel 预览仅使用 Meta muse-spark，不访问局域网 Ollama。测试登录、学习会话、
调用次数与已过滤的控制台记录存入共享 Redis。学习会话在创建 30 分钟后过期，登录
最多持续 8 小时。退出立即撤销访问权限；重置删除当前会话与记录。密钥、密码和
Redis 凭证只在 Vercel 服务端环境变量中配置。英文/中文切换、分步演示、动画、
图表与模型请求/响应控制台沿用同一流程。


## Release verification and production preparation (October 27, 2026)

Release preview: https://explainback-hy601thk2-doran-gaos-projects.vercel.app
(`dpl_6z3XsMHmBtXcSzxsy7rbRy7FudBW`). All 207 Node 22 tests pass, the public
build succeeds, and secret-value and whitespace checks pass. The upload allowlist
contains 63 runtime files and excludes environment files, credentials, local
outputs, docs, tests and downloaded skills.

Hosted browser checks used the real Meta provider and the shared Redis state:

- Tester login and logout; protected workspace disappears after logout.
- Coffee lesson creation, review gate, presentation, parameter changes resetting
  prediction, output selection, playback, English/Chinese switching, numerical
  transfer and completion.
- Draft revision returns a reviewed bilingual lesson and resets the review gate.
- Real English and Chinese explanations and visible filtered request/response,
  usage and timing records in the provider console.
- Full four-call vehicle claim/prediction/revision/transfer demo completes, with
  pauses after ground acceleration, lift/roll and powered landing. At 8.5 seconds
  the primary scene has y=0, vy=0 and vx=26.8224 m/s. Language switching preserves
  its timeline position; existing provider prose stays in its request language.

One initial generated Chinese sentence contained unrelated language fragments.
Instructions now request proofreading; a Cyrillic-script review hint flags this
specific failure class without prohibiting legitimate lesson topics. It updates
as the author edits. It is not a complete language-quality validator. A later
response incorrectly encoded the lesson as a string and was rejected without a
retry. The prompt now explicitly requires a nested object and complete chapter
objects. A subsequent fresh generation and revision were accepted. Stochastic
model responses may still be rejected; failures retain the draft and remain
visible when the language changes. Scientific claims still require review.

The new powered journey is separate from the preserved ballistic/contact
baseline. Lift and landing each assume 2mg upward thrust for T/2 seconds, with a
T-second ballistic roll between them. The existing torque curve is reused;
contact-stopping time/profile do not control powered landing. Forward velocity
continues by inertia. Exact timing, abrupt thrust switches, fixed mass/inertia,
no drag and no actuator/fuel/clearance/occupant simulation are explicit limits.

A fresh review identified the old language-reset handler and a stale warning;
both were fixed and checked in the hosted UI. No remaining review blockers.

Production preparation is complete: the existing free Redis resource is
connected to both Preview and Production (separate application namespaces),
and the account owner explicitly approved the existing Meta key and tester
credentials for server-only sensitive Production variables. Trace capture and
`EXPLAINBACK_PUBLIC_ORIGINS=https://explainback.app` are configured. The domain
is already Vercel-registered; project assignment, ownership and DNS verification
succeeded without changing nameservers or unrelated DNS records. Production
publication and HTTPS smoke verification follow this pre-release checkpoint.

## Structured lesson output correction

The first Production smoke test reproduced the string-encoded lesson failure
with a process topic. Meta documents that `tools[].strict` validates the supplied
schema but does not constrain generated tool arguments. Lesson composition now
opts into Responses `text.format` with a strict JSON schema. The adapter returns
structured data, and the same lesson/formula validators still decide acceptance.
The provider console retains the actual structured request/response. Guide and
claim-testing calls still use tools; Ollama keeps its existing tool path and
exclusive coordination. There are no automatic retries or malformed-JSON repairs.

References: [strict tool schemas](https://dev.meta.ai/docs/tool-calling#strict-tool-schemas),
[structured output](https://dev.meta.ai/docs/structured-output).

All 210 tests pass, including new transport/validation regressions. Two explicit,
sequential live Meta calls produced accepted process and mathematical lessons.
A fresh review found no blockers. Corrected preview:
https://explainback-33ahk9ij1-doran-gaos-projects.vercel.app
The corrected hosted preview accepted the previously failing web-process topic.
Its reviewed presentation supports stage selection and preserves the selected
stage while switching English/Chinese. The provider console shows the actual
`text.format.type=json_schema` request, without a fabricated tool call.


## Production release verified

Production URL: https://explainback.app/

Runtime commit: `70d272091904e0531a416eb0bdb04aa345309d3c`, pushed to
`feat/suction-design-lab`. Deployment: `dpl_41bdR9LtdxHdrLX3H7qEC29JnYzV`
(https://explainback-9b1nswh0a-doran-gaos-projects.vercel.app).
Vercel reported Ready / Production with explainback.app in its aliases and the
matching Git SHA. Browser HTTPS and tester login succeeded; the login remained
usable after the corrective deployment. On the custom domain, real process
lesson generation and revision succeeded, followed by review, presentation,
interactive stage selection and English/Chinese switching. The original
claim-testing provider workflow remains unchanged.

The Production Chinese guide returned accepted feedback, and the transfer
question completed the lesson. The provider console displayed all three real
calls (create, revise, guide), each accepted with HTTP 200, model, timing, and
inspectable request/response records.

Secrets were uploaded only after explicit approval for the respective Vercel
environments. Configured key/password values, .env.local and local QA/eval
outputs are excluded from Git and deployment uploads. Installed reference skills
remain untracked local files. Only synthetic topics were used for live tests.


## Studio-first production release — October 27, 2026

Runtime commit: `3f947d593282cf558e686395fca7037978e1a02b`, pushed to
`feat/suction-design-lab`. Production deployment:
`dpl_C8pcs3sGCMTmJsna2veohCn9D9td` at
[deployment URL](https://explainback-1iyp8sd4u-doran-gaos-projects.vercel.app/).
Vercel reports **READY / production** with **https://explainback.app/** assigned.
Both `githubCommitSha` and explicit release metadata match the runtime commit.
This release does not merge the feature branch into main.

The app now opens in Lesson Studio, introduces Create → Review & revise →
Operate, and provides editable starter/revision prompts in English and Chinese.
It includes the frozen twelve-case lesson evaluation and published sanitized
results; raw outputs remain local. The physics lab remains the supporting
showcase in the three-minute script.

Release validation: **221/221 Node 22 tests passed**, public build and whitespace
checks passed. The configured-value scan checked the staged files and all 65
Vercel upload files; API keys, tester passwords, `.env.local`, raw eval outputs,
screenshots and unrelated installed skill files were excluded. Existing
server-only Production configuration was reused without credential changes.

Hosted smoke checks on the custom HTTPS domain confirmed:

- The existing valid tester session opens the protected workspace and selects
  Studio at the root URL. This was session reuse, not a new login/logout test.
- The three-step walkthrough appears in English and Chinese; language switching
  preserves typed topic text. Each localized starter fills an editable question.
- Starter clicks leave the console at “no requests yet”; Meta Muse Spark is the
  sole hosted provider option. No additional provider or Ollama calls were made.
- Physics opens, and returning to Studio preserves the Chinese topic.
- Document width equals viewport width (1265 px), with no horizontal overflow.

The full create/revise/operate/transfer workflow was tested locally before this
release, as recorded in [the demo verification](studio-demo.md). It was not
re-run against the provider during this deployment smoke check. Narrow-screen
release verification and independent human content review remain open.
Screenshot: `output/studio-demo-eval/production-studio-zh.png` (local, ignored).
