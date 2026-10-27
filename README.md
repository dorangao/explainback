# ExplainBack / 讲给我听

Explain it in your own words. Discover what you’re missing.

用自己的话讲出来，找到真正没懂的地方。

## Create lessons in the app

**Create a lesson / 创建课程** turns a topic into an editable bilingual lesson using the configured model (Meta by default). Choose **Create a new topic demo** to generate an adjustable mathematical model or an interactive process diagram, including topics beyond the original eight experiments. Review its assumptions, formulas or steps, edit the definition or ask Muse to revise it, then present a guided prediction → experiment → explanation → transfer sequence. Switch between English and Chinese while operating the same demo.

Generated demos use a bounded declarative format, never generated JavaScript or HTML. Numeric checks verify calculations from the authored formulas; they do not independently validate the science or units. Process answers remain explicitly authored. **Use existing experiments** retains the original eight physics/quantum experiments and their checked calculations. Export/import versioned JSON to keep a lesson; drafts are otherwise temporary and imports require a fresh review. The existing trace flag also controls the Studio provider console. See [Lesson Studio](docs/lesson-studio.md) for scope, limits and verification.

## Independent educational framing

Lessons use generic names: **Acceleration & force lab / 加速度与力实验室**,
**Sideways roll & landing lab / 侧向翻滚与着陆实验室**, and **Suction & design lab / 吸附与设计实验室**.
Vehicle diagrams are code-drawn schematics and the numerical inputs are hypothetical.
The About panel explains the independent status and makes no sponsorship or
endorsement claim. Provider names identify the actual service used. The optional
McMurtry link is an attributed external example, not evidence validating our model.
See [naming and source notes](docs/naming-and-sources.md). Dated development records
and baseline archives retain their historical names.

## Hosted tester app

Live at [explainback.app](https://explainback.app/) with tester login.

The cloud entry point uses **Meta muse-spark-1.3 only**; local Ollama models are
not exposed or contacted. Tester login, bilingual claim tests, guided vehicle
animation and the opt-in provider console use shared Redis storage across
function instances. See [Vercel setup and retention](docs/vercel-deployment.md).
`npm run dev` keeps the existing localhost workflow and multi-provider options.

## Hackathon direction

### Guided vehicle physics walkthrough

Choose **English / 中文**, sign in with your tester account, then click
**Start demo / 开始演示**. The preset workflow now waits for **Next / 下一步**
at each checkpoint: claim → scripted confirmation → prediction → checked
evidence → acceleration → flip → landing → revision → fresh transfer → result.
Each stage explains the claim, how to read the graph, and the result or next
action. The actual model interpretation/feedback appears beside those notes;
expand “This step’s preset and live feedback” to inspect the submitted preset.

The primary animation and expanded provider console stay in the same workspace.
Desktop places the console alongside motion/graphs; mobile stacks the panels and
keeps Next in the guide heading without a floating overlay. Before the
prediction, a static starting scene appears and graphs stay hidden. During fresh
transfer, the animation remains explicitly labeled **primary reference**, with
its original parameters rather than the fresh problem’s values.

The hypothetical preset uses 2000 kg, 60 mph in 5 s with cosine acceleration,
a 1.5 s controlled flip, and 0.3 s vertical stopping. Playback pauses at 5.0,
6.5 and 6.8 s; Next begins each following segment. Acceleration plays at 0.5×,
flip at 0.25×, and landing at 0.1× so each is readable. Graph cursors and model
boundary labels stay synchronized. The math and separate-model assumptions remain.

A completed walkthrough uses four live provider calls. Waiting or playing does
not call a provider. Unexpected feedback or errors stop without retries. Confirmation
and results remain **scripted/assisted**, never independent learner evidence.
The console requires a configured provider and `EXPLAINBACK_TRACE=1`; restart
after changing that flag. Trace-off still permits manual learning workflows.

Stop, reset, language switching, or hiding the tab prevents future steps. Sent
requests may still finish and incur usage. Switching language resets the session;
click Start for the new language. Stopping a pending request keeps its returned
state usable, and continuing manually restores the ordinary animation layout.

The earlier one-click prototype remains baseline work in
`docs/baseline/before-guided-demo.*` (44 files), alongside previous archives.
See [guided-demo verification](docs/guided-demo-verification.md) and the
[earlier one-click verification](docs/one-click-demo-verification.md).

### Continuous vehicle demo

Choose an acceleration or flip/landing topic. Each manual topic has its own
settings; the guided demo uses a fixed primary scenario with a shared mass. After confirming a claim and submitting a
prediction, the **continuous journey** plays acceleration, a controlled flip,
and vertical stopping on one clock. Three graph tracks share a cursor; select
speed/drive force, rotation/torque, and vertical motion/contact force. Phase
buttons jump to boundaries; playback supports 1×, 0.5×, 0.25× and 0.1×.

The stages remain separate physics models. Horizontal exit speed carries into
ideal coasting. Launch adds an assumed vertical impulse with no takeoff
mechanism. Contact stops only vertical velocity; horizontal braking and
post-touchdown rotation are not modeled. The orientation during contact is a
snapshot. Position continuity is not proof of a feasible or safe stunt.

For an easy bilingual demo, use **Load preset / 载入预设**, then Submit at each
step: claim → local confirmation → prediction → revision → worked transfer.
Presets fill editable explanations and, on a fresh transfer, the relevant
numeric answers. A run using presets is labeled **scripted demo**, not
independent learning evidence. The primary animation hides during manual transfer; the guided demo retains it with a reference label.

Set `EXPLAINBACK_TRACE=1` in the server environment or `.env.local`, then restart
the server, to show the **Developer · Provider request / response console**.
`EXPLAINBACK_TRACE=0` (the default) disables both capture and the trace endpoint.
The console can expand/collapse, refresh, and clear its records. It keeps the
last 12 calls per session, including filtered request bodies,
assistant/tool outputs, usage, HTTP status, elapsed time and validation outcome.
Credentials, headers, provider private reasoning and raw error bodies are
omitted. Large bodies are truncated. Reset or 30-minute session expiry removes
them. Local storage is process memory; Vercel uses shared Redis with TTLs.
Because developer context can contain checked answers, tracing also marks the
session as a developer demo. Local diagnostics are not written to disk.

Earlier work is preserved as `docs/baseline/before-continuous-demo.*` (33 files).
See [continuous demo verification](docs/continuous-demo-verification.md).

### Quantum computing showcase / 量子计算展示

Open **Quantum computing / 量子计算** in the area navigation, or use `/#quantum`.
The guided showcase pauses at each gate: qubit/readout → phase interference →
Bell correlations → four-item Grover search. Local predictions, complex-amplitude
arrows, theoretical probabilities and fresh-shot counts explain what changes.
Single-run measurement collapse is separate from 256 freshly prepared runs.

The simulator works without a model request. After finishing a circuit, ask the
configured model to explain its checked state or challenge the preset claim.
Native bounded responses use the existing authenticated provider router and
optional trace console (`EXPLAINBACK_TRACE=1`). Meta remains the default; the
Ollama coordinator still serializes local models. No quantum hardware is used,
and no quantum speed advantage or independent-learning result is claimed.
See [quantum showcase design and verification](docs/quantum-showcase.md).

### Sideways roll and landing stage

Select **2 · Sideways roll & landing / 2 · 侧向翻滚与着陆** beside the acceleration stage,
or choose it in the topic list. Switching stages resets the transient session.
Choose hypothetical mass, airborne time, radius of gyration, torque-couple
separation, stopping time, and constant or cosine-pulse contact acceleration.

Compare an already-spinning, torque-free body A with an ideal controlled
rest-to-rest turn B. Confirm a claim, predict, then play or scrub the rotating
schematic and six graphs: angle, angular speed, torque, height, vertical velocity,
and contact force. Contact force has a zoomed time axis and an average-force line.
The evidence table separates angle from angular speed, average from peak force,
and contact impulse from net impulse. Fresh transfer questions test torque,
landing-force, or touchdown-state reasoning with separately checked numbers.

The shared code-drawn vehicle rolls sideways about its front-to-back axis. Blue air exhaust points opposite the orange reaction-force arrows. Opposed forces cancel while their roll torques add: each force is |τ|/d. Jets reverse to brake and switch off at zero torque and during contact; A has no jets. The plume is illustrative, with no gas storage, flow or actuator-performance model. See [roll and jet verification](docs/sideways-roll-and-jets.md).

Both languages explain the assumptions: fixed roll-axis rigid body, I=mk², ideal
external torque couple, ballistic flight back to the same reference height, and
a **separate vertical-only stopping calculation**. Rotation ends at a labeled
touchdown snapshot; A's remaining spin is unresolved. Contact force is total
body force, not an occupant or individual tire load. No suspension, roll/contact
coupling, structural limits, actuator capability, rebound, or real-vehicle safety
verdict is modeled. These are hypothetical curves, not manufacturer specifications.

The prior acceleration/force lab and claim workflow are preserved in
`docs/baseline/before-flip-landing.*` (27 source/test/package files with hashes).
See [flip and landing verification](docs/flip-landing-verification.md) for the
physics, live bilingual checks, and baseline record. Earlier work remains
explicitly labeled as baseline; capture dates do not establish event eligibility.

### Acceleration & force lab

Select **Acceleration & force lab / 加速度与力实验室**.
Choose hypothetical final speed, time, total mass, tire grip and wheel power.
Car A accelerates uniformly; B can use increasing, decreasing, or a **cosine
acceleration pulse**. The claim-testing flow asks for confirmation and prediction
before showing checked evidence, six graph views (speed, acceleration, distance,
force, power, jerk), a time scrubber and moving position markers.

The **Force & feel** table distinguishes mass (kg) from weight (N), shows current
and peak force/power, compares whole-interval demands against μmg and wheel-power
limits, and explains jerk and abrupt start/cruise joins. A cosine pulse joins
with zero acceleration and jerk but needs twice the uniform profile's peak
acceleration at the same speed/time. Sine and cosine are useful, not mandatory.

Try **Mass & force / 质量与力** or **Smoothness / 平滑度** as a starting claim.
Settings stay fixed for a session; reset to compare another mass, grip, power or
time. Force transfer checks peak force and required grip coefficient; smoothness
transfer checks peak acceleration and absolute jerk. Existing motion transfer
still checks average acceleration and signed distance B−A. All have separate
numeric checks, model-assessed reasoning, evidence replay and assistance tracking.

English and Chinese share one model. These are **hypothetical prescribed curves,
not measured vehicle data or specifications**. The level-road force check omits drag,
downforce/thrust, load transfer, motor torque curves, thermal limits, suspension,
rotation and landing. Passing its two ideal limits establishes neither real
feasibility nor comfort/safety. The curves are targets, not a vehicle simulation.

The previous coach, crossing workflow and acceleration lab remain baseline work:
source archives and SHA-256 manifests are in `docs/baseline/`, including
`before-force-feel.*`. See [force and feel verification](docs/force-feel-verification.md)
for current results, and [earlier acceleration verification](docs/acceleration-verification.md)
for the preceding baseline. Development dates remain explicit; event eligibility
has not been established.

The crossing topic now includes a learner-confirmed claim-testing workflow:
The selected model chooses a bounded experiment, code produces qualified mathematical evidence,
and a fresh problem tests transfer with an inspectable evidence trail. The
existing adaptive coach is baseline work. Actual extension work started October 26
Pacific, before the guide's listed October 27 building start; competition eligibility
remains unresolved. See the [revised hackathon plan](docs/superpowers/plans/2026-10-26-hackathon-scope.md)
for build priorities, acceptance checks, provenance, and unresolved eligibility.

### Try the crossing workflow

1. Start the crossing topic with an English or Chinese synthetic explanation.
2. Confirm the model's interpretation, or revise it. Confirmation is local; it does not
   mean the claim is mathematically correct.
3. Predict before executing the selected fixed-catalog experiment. Inspect the
   equality, crossing, or end-limit evidence, including what it does not establish.
4. Reconcile the evidence in your own words, then attempt a fresh verified problem.
   Enter the asymptote and crossing input separately from the explanation. Leave
   both values blank if you need help.
5. Inspect the report: checked values, the model's reasoning judgment, evidence IDs,
   and independent/assisted/incomplete status. Evidence replay makes no model call.

The nonzero-limit and two-end-limit topics retain the baseline adaptive coach. All sessions remain
tester-gated, synthetic, and transient. Source publication is separate from app
deployment or hackathon submission. See [verification and contribution record](docs/claim-testing-verification.md).

`npm run claim:smoke` is an opt-in live check using at most six synthetic requests
with no retries. It overwrites `docs/claim-smoke-results.json`; it is separate
from offline `npm test` and is not an independent accuracy evaluation.

## Run the local MVP

Source repository: [dorangao/explainback](https://github.com/dorangao/explainback).
After cloning, copy `.env.example` to `.env.local` and configure Meta or Ollama
privately. The example contains no key; the real environment file stays ignored.
Set local file permissions with `chmod 600 .env.local` before running.

```sh
npm run dev
```

Open **http://127.0.0.1:4173**. The server reads `.env.local`; the browser never
receives the key. Select English or Chinese, sign in with your tester account,
choose a topic, and start a session. Use the supplied fictional starting
points or type a synthetic explanation. No real student records.

The selected model chooses a learning action for each explanation: clarify meaning, ask for
a prediction, check the predicted value, reveal a graph, choose a fresh problem,
or compare reasoning. It can send a reasoned explanation directly to transfer
instead of forcing a hint. The three original topics, acceleration lab, and
flip/landing stage each have checked transfer variants with relevant numeric fields.
Graphs and numeric observations use fixed formulas, not generated mathematics.
The server requires a prediction before numeric evaluation, and a checked
observation or supported reasoning before graph reveal. Transfer graph support
is allowed when useful and recorded as scaffolding, not independent success.

Each turn uses one native provider function call (Meta Responses or Ollama Chat). Functions are
allowlisted for the active topic and phase; server validation rejects arbitrary names/arguments, premature
progression and ungrounded quotes. Actual tool results enter the next user turn's
bounded context as data. There is no automatic second paid call or unbounded
agent loop. The live endpoint currently accepts `tool_choice: auto`; the app
still requires exactly one valid function call or shows a visible error.

The interface shows the selected intervention, a short teaching purpose and any
code-checked numerical observation. The selected model chooses between the two verified
transfer variants using their learning purposes. The final comparison quotes
both explanations and notes any additional help used on the transfer problem.

This is a **tester prototype**. The app has no age checkbox or age-based
access restriction. Use synthetic examples; no real student records.

### Tester login

Set `EXPLAINBACK_TESTER_USERNAME` and `EXPLAINBACK_TESTER_PASSWORD` in ignored
`.env.local` (mode 600), or provide them as server environment variables. The
password must contain 12–512 characters; the username must be nonblank and at
most 80 characters. Environment variables take precedence. `npm run dev` also
works without an env file when the values are supplied by the environment.
Missing or invalid credentials keep access closed and show setup guidance.
Do not commit credentials or send them to the provider.

Sign in once per browser. Login lasts up to eight hours; sign-out and server
restart revoke access. Each browser owns its learning sessions and console
records. Sign-out clears those sessions and discards any in-flight result;
a sent provider request is still allowed to finish under the Ollama lock.
Five failed logins in a minute temporarily block further attempts. This is a
shared local POC account, without account registration or password recovery.
The local server remains bound to localhost. Vercel uses Secure cookies and
shared storage; see the cloud setup above for its retention and restart behavior.

### Local boundaries and cost controls

- Server binds only to `127.0.0.1`; requests must have a local Host and matching
  Origin. Static files are served from an explicit allowlist, never the repo root.
- `.env.local` is excluded by `.gitignore`; only the empty `.env.example` is tracked.
  Keep the environment ignore rules in place. iCloud synchronization is
  separate from Git; the key file is still within an iCloud folder.
- No disk access/prompt/key/raw-error logging. The opt-in developer console
  stores filtered per-session request/response records only in memory. No browser localStorage,
  analytics, CDN resources or transcript persistence. One HttpOnly, SameSite=Strict
  cookie holds an opaque tester-session token; it contains no username or password.
- Session text lives in process memory for up to 30 minutes (expired sessions
  are pruned on the next API action), until reset, or until the server stops.
  Recent synthetic turns go to the selected provider. Meta requests use
  `store: false`; this does not override broader retention terms. Ollama requests
  go to the configured server, whose logging/retention is managed separately.
- One model call per submission, 1200-character input limit, one in-flight call
  per session, 12 attempts per session and 60 attempts per server hour. Failed
  calls count too. Resetting during a call discards the result but does not
  undo API charges already incurred. Restarting the server resets local limits.
- Tutoring requests have a 4096-output-token ceiling. Meta uses low reasoning
  effort and a 30-second timeout; Ollama uses `think: false` and a 180-second
  timeout to allow cold loading. No automatic retries.
- Native function arguments must pass shape/length/enum checks and quote the
  learner's current words exactly. Completion also quotes the original words.
  A narrow bilingual guard requires clarification for an unscoped 'never touches'
  claim. Broader interpretation is still model-based; these checks do not prove
  conceptual accuracy.

Run `npm test` for offline math, learning-state, adapter and real loopback HTTP
integration tests. Run `npm run security:check` to verify that the configured
Meta key and tester password do not appear in any project file outside `.env.local`
(without printing either value). Automated tests use fake credentials; live smoke/evaluation calls
are separate and consume API usage.

Browser captures (`output/`, `.playwright-mcp/`, `.playwright-cli/`), generated live-evaluation JSON,
logs and downloaded reference PDFs remain local and are excluded from Git.
Historical verification notes may refer to those local-only artifacts. Authored
verification summaries and credential-free baseline source archives are tracked.

中文：在 `.env.local` 或服务端环境变量中设置测试用户名与密码（至少 12 个字符），
运行 `npm run dev` 后打开本地地址并登录。已移除应用内的年龄确认，只使用虚构示例。
密钥和登录密码只在服务器读取；中英双语流程保留解释、澄清、证据、迁移和推理对照。尚未部署。

## Providers and compact evaluation

See [tester access and ambiguity verification](docs/tester-access-verification.md) for
the current login and v4 focused results. See [Qwen refinement and comparison](docs/qwen-refinement-verification.md) for
the prior full comparison, and [initial provider verification](docs/multi-provider-verification.md)
for the original comparison and resource-control review.

Select **Model / 模型** before starting a session. The selector supports Meta
Muse Spark and the two configured Ollama models. The choice stays fixed for that
session; reset to change it. Selecting a model makes no generation request.
“Configured” means configuration is present, not that a live check has succeeded.
All providers use the same claim workflow and deterministic math checks.
Instructions are specific to the current phase. False but clear claims are
captured before testing; local confirmation preserves the learner's meaning.
Transfer completion must quote the full first explanation exactly, separately
from a quote of the current reasoning; wrong-source quotes remain rejected.

Server-only configuration (put local values in ignored `.env.local`):

```dotenv
# Meta remains optional when using Ollama. Keep the real key private.
MODEL_API_KEY=
META_MODEL=muse-spark-1.3
OLLAMA_BASE_URL=http://localhost:11434
EXPLAINBACK_OLLAMA_MODELS=muse-glimmer:latest,qwen3.8:27b
EXPLAINBACK_DEFAULT_MODEL=meta:muse-spark-1.3
# Optional comma-separated Meta allowlist:
# EXPLAINBACK_META_MODELS=muse-spark-1.3
EXPLAINBACK_TRACE=1
```

Use your Ollama server's origin for `OLLAMA_BASE_URL`. For a local-model default,
set `EXPLAINBACK_DEFAULT_MODEL=ollama:qwen3.8:27b` (or the Glimmer ID). Restart
`npm run dev` after configuration changes. The browser receives only allowlisted
IDs and labels; the Meta key is never sent to Ollama. The console labels each
provider/model and shows filtered payloads, timing and model-switch events.

Ollama calls use native tools, `think: false`, temperature 0, context 16384 and
at most 4096 output tokens. A shared lock prevents the app and evaluation CLI
on **this Mac** from overlapping local requests. Before a switch, the old managed
model is unloaded and `/api/ps` must confirm it is absent. Unknown resident
models block the request instead of being stopped. Evaluation owns the lock for
the whole matrix. Other clients and other computers do not share this lock.
For a host-wide limit, configure `OLLAMA_MAX_LOADED_MODELS=1` and
`OLLAMA_NUM_PARALLEL=1` on the Ollama host; this project does not change those
settings. See [Ollama concurrency and model loading](https://docs.ollama.com/faq).

After an uncertain timeout/disconnect, local requests stay blocked. With no
active ExplainBack request, run `npm run llm:recover`: it refuses a live owner,
unloads configured resident models, verifies their absence, and clears the block.
It does not evict unrelated models. Do not manually delete lock files while a
request may be running. A crash leaves a stale lock for this explicit recovery.
Lock metadata is published atomically. Recovery refuses recent incomplete legacy
metadata (ten-minute grace period). If a process crashes during the brief recovery
guard itself, subsequent calls remain blocked: verify that process has exited
before removing only its `.recovery` guard. This conservative case needs operator
inspection; recovery never guesses that a live owner has stopped.

```sh
npm run eval:models -- --list
npm run eval:models
npm run eval:models -- --models=all
npm run eval:models -- --models=ollama:qwen3.8:27b --out=output/eval/qwen.json
```

The default run sends **16 synthetic requests** (eight per local model); `all`
adds configured Meta models. Targets and cases run sequentially with no retries.
Each target gets identical independently seeded claim, prediction, revision and
transfer inputs, including a correct-numbers/wrong-reasoning trap. Prompt hashes,
Ollama model digests/version and generation settings make the run inspectable.

JSON and Markdown reports go under ignored `output/eval/`. They include valid
output counts, expected action/assessment/phase checks, a simple language-script
proxy, accepted feedback/interpretations, quote-source failure codes, wall/load
latency and token counts. Provider diagnostics keep only bounded HTTP/completion
status, tool-call counts and shape checks, never raw responses or hidden thinking. Failures
stay in the denominator. Cold loading counts in wall time; tokenizers and provider
settings differ. Partial reports survive a stopped run. A failing case or an
incomplete run exits nonzero. No raw provider errors or hidden thinking are saved.

A passing case checks the expected action and workflow contract; it does not
validate every generated feedback sentence. Review the saved feedback manually.

This is a **small developer smoke comparison**, not evidence of teaching quality,
fluency, safety, or learning outcomes. Existing `eval:live` and `claim:smoke` remain
Meta-only historical checks. The guided demo still stops visibly if any provider
returns an unexpected action; there is no automatic fallback or invented success.

中文：开始前选择模型，重置后才能切换。两个本地模型按顺序运行，切换前会卸载并
核验旧模型；本机应用和评测脚本共享锁，其他客户端需由 Ollama 主机限制并发。
`npm run eval:models` 默认运行两模型各 8 条固定合成案例，记录失败、耗时和用量；
这只是开发用小型比较，不代表教学效果。超时后先运行 `npm run llm:recover`。

## Meta connection setup

The app uses a local Node.js connection to Meta Model API. These standalone
commands check that connection without publishing or submitting anything.
Node.js 22.9+ is required. There are no package dependencies to install.

1. Open [Meta for Developers](https://dev.meta.ai/) and its Model API dashboard, confirm your
   account's access and hackathon credit status, and create an API key. Review
   any credit terms yourself before accepting them.
2. Set `MODEL_API_KEY` privately in your terminal. Because this project is in
   iCloud Drive, a session-only environment variable avoids writing a key into
   a synced file. In zsh, enter the following commands separately:

   ```zsh
   read -rs 'MODEL_API_KEY?Meta API key: '
   export MODEL_API_KEY
   ```

   Alternatively, enter the key in `.env.local`. That file is ignored by Git,
   but Git ignore does not prevent iCloud synchronization. Never paste a key
   into chat or put it in a public/client-prefixed environment variable.
3. Run `npm run meta:check`. This checks configuration without making a request.
4. Run `npm run meta:smoke` to make **one live request** with synthetic text.
   It can consume API credits. Success requires a completed response containing
   the exact marker `EXPLAINBACK_META_OK`.
5. Run `unset MODEL_API_KEY` when finished with a session-only key.

`META_MODEL` defaults to `muse-spark-1.3`, the current official quickstart model.
Override it if your hackathon account grants access to a different model.
The endpoint is fixed at `https://api.meta.ai/v1/responses`; credentials are
sent only to that endpoint and redirects are rejected. Requests time out after
30 seconds and are not automatically retried. No raw API error bodies or
reasoning output are printed. `store: false` is requested; this is not a claim
about all provider retention policies.

`npm test` runs offline transport, parsing, and error-handling tests. These
tests do not establish live access or mathematical feedback quality.

中文：先在 Meta 控制台确认账号和比赛额度，再私下设置 API key。配置检查不发送请求；
连接测试会发送一条合成文本，可能消耗少量额度。请不要将真实学习对话或学生资料用于连接测试。

## Scope carried into this project

- Bilingual learning support for high-school students, initially horizontal
  asymptotes and limits at infinity.
- Explain reasoning → clarify ambiguity → one hint/counterexample → fresh
  transfer problem → compare reasoning. One answer is not lasting mastery.
- Verified mathematics and deterministic graphs; no canned output presented
  as live AI feedback.
- Hosting moved from the earlier SketchPlayWrite proposal to
  [explainback.app](https://explainback.app/). Vercel Production, domain ownership,
  HTTPS and tester login were verified October 27, 2026.
- Acceptance is user-reported. The participant guide was reviewed October 26:
  building period October 27–November 4, public repository, three-minute video,
  and submission due November 4 at 6 PM Pacific. Existing-prototype reuse and
  fit with the education-project guidance still need organizer clarification;
  see the revised hackathon plan above.

Read-only reference: the math-calculus-ab project and its “Create similar
calculus practice” conversation include bilingual explanation requests,
IVT/MVT distinctions, and algebra prerequisites within limit problems. This
informs future tutoring design; no transcripts or student files are copied
into prompts, fixtures, or public artifacts here.

## Official API references

- https://dev.meta.ai/docs/quickstart
- https://dev.meta.ai/docs/protocols/responses
- https://dev.meta.ai/docs/models
- https://dev.meta.ai/docs/tool-calling

Integration prepared October 25, 2026 (America/Los_Angeles). See
`docs/adaptive-coach-verification.md` for current verification evidence and remaining gaps.

Repeat just the English/Chinese ambiguity comparison:

```sh
npm run eval:models -- --models=all --cases=crossing-ambiguity-en,crossing-ambiguity-zh --out=output/eval/ambiguity-focus.json
```

The case filter uses canonical IDs and rejects unknown or duplicate entries before
any provider call. Leaving it out runs the original eight cases. Login protects
the browser APIs; the local eval CLI reads provider configuration directly.

## Suction and design lab · October 27 extension

After tester sign-in, choose **Suction & design lab** for a manual session,
or choose **Suction · design comparison** in the guided demo and press **Start demo**.
English and Chinese have the same claim → confirmation → prediction → checked
experiment → design proposal/comparison → fresh robot transfer workflow.
The guided version pauses at each stage and makes at most five provider submissions.
It requires `EXPLAINBACK_TRACE=1`; ordinary manual sessions work with tracing disabled.
Meta remains the default. No Ollama instance is required by this lab.

The reduced model separates external-flow aerodynamics from sealed fan suction,
checks normal force and friction across orientation, and compares four designs
against a 30 kW budget and a teaching target of 20% ceiling reserve at doubled gap.
Exploration sliders do not change the pinned evidence. Code computes the results;
Muse interprets claims and proposes a bounded design hypothesis plus a measurement.
It does not run CFD, certify safety, or establish real manufacturer specifications.
Existing math and vehicle labs remain identified as baseline work.

```sh
# Offline tests
npm test
# Opt-in synthetic Meta regression: 14 calls, no retries; ignored local output
node --env-file=.env.local scripts/eval-suction.mjs --live
# Focused final-transfer check: 2 calls
node --env-file=.env.local scripts/eval-suction.mjs --live --cases=transfer-citations
```

See [the verification record](docs/suction-lab-verification.md) and
[the approved design](docs/superpowers/specs/2026-10-27-suction-lab-design.md).
