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

Actual Vercel provisioning/build/routing and a hosted browser walkthrough are
still pending account access. The connector denied project creation, and the
CLI requires the account owner's device sign-in. No deployment URL exists yet.

中文：Vercel 预览仅使用 Meta muse-spark，不访问局域网 Ollama。测试登录、学习会话、
调用次数与已过滤的控制台记录存入共享 Redis。学习会话在创建 30 分钟后过期，登录
最多持续 8 小时。退出立即撤销访问权限；重置删除当前会话与记录。密钥、密码和
Redis 凭证只在 Vercel 服务端环境变量中配置。英文/中文切换、分步演示、动画、
图表与模型请求/响应控制台沿用同一流程。
