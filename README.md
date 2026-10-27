# ExplainBack / 讲给我听

Explain it in your own words. Discover what you’re missing.

用自己的话讲出来，找到真正没懂的地方。

## Hackathon direction

### Guided Roadster walkthrough

Choose **English / 中文**, check adult/synthetic use, then click
**Start demo / 开始演示**. The preset workflow now waits for **Next / 下一步**
at each checkpoint: claim → scripted confirmation → prediction → checked
evidence → acceleration → flip → landing → revision → fresh transfer → result.
Each stage explains the claim, how to read the graph, and the result or next
action. The actual Meta interpretation/feedback appears beside those notes;
expand “This step’s preset and live feedback” to inspect the submitted preset.

The primary animation and expanded provider console stay in the same workspace.
Desktop places the console alongside motion/graphs; mobile stacks the panels and
keeps Next at the bottom of the screen while the guide is active. Before the
prediction, a static starting scene appears and graphs stay hidden. During fresh
transfer, the animation remains explicitly labeled **primary reference**, with
its original parameters rather than the fresh problem’s values.

The hypothetical preset uses 2000 kg, 60 mph in 5 s with cosine acceleration,
a 1.5 s controlled flip, and 0.3 s vertical stopping. Playback pauses at 5.0,
6.5 and 6.8 s; Next begins each following segment. Acceleration plays at 0.5×,
flip at 0.25×, and landing at 0.1× so each is readable. Graph cursors and model
boundary labels stay synchronized. The math and separate-model assumptions remain.

A completed walkthrough uses four live provider calls. Waiting or playing does
not call Meta. Unexpected feedback or errors stop without retries. Confirmation
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

### Continuous Roadster demo

Choose either Roadster topic. Both setting groups now configure one primary
demonstration with a shared mass. After confirming a claim and submitting a
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
last 12 calls per session in memory, including filtered request bodies,
assistant/tool outputs, usage, HTTP status, elapsed time and validation outcome.
Credentials, headers, provider private reasoning and raw error bodies are
omitted. Large bodies are truncated. Reset/expiry/server shutdown removes them.
Because developer context can contain checked answers, tracing also marks the
session as a developer demo. No diagnostic records are written to disk.

Earlier work is preserved as `docs/baseline/before-continuous-demo.*` (33 files).
See [continuous demo verification](docs/continuous-demo-verification.md).

### Flip and landing stage

Select **2 · Flip & landing / 2 · 翻转与着陆** beside the acceleration stage,
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

Both languages explain the assumptions: fixed-axis rigid body, I=mk², ideal
external torque couple, ballistic flight back to the same reference height, and
a **separate vertical-only stopping calculation**. Rotation ends at a labeled
touchdown snapshot; A's remaining spin is unresolved. Contact force is total
body force, not an occupant or individual tire load. No suspension, pitch/contact
coupling, structural limits, actuator capability, rebound, or real-vehicle safety
verdict is modeled. These are hypothetical curves, not Tesla specifications.

The prior acceleration/force lab and claim workflow are preserved in
`docs/baseline/before-flip-landing.*` (27 source/test/package files with hashes).
See [flip and landing verification](docs/flip-landing-verification.md) for the
physics, live bilingual checks, and baseline record. Earlier work remains
explicitly labeled as baseline; capture dates do not establish event eligibility.

### Roadster-inspired acceleration lab

Select **Roadster-inspired acceleration lab / Roadster 灵感加速度实验室**.
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
not Tesla data or specifications**. The level-road force check omits drag,
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
Meta selects a bounded experiment, code produces qualified mathematical evidence,
and a fresh problem tests transfer with an inspectable evidence trail. The
existing adaptive coach is baseline work. Actual extension work started October 26
Pacific, before the guide's listed October 27 building start; competition eligibility
remains unresolved. See the [revised hackathon plan](docs/superpowers/plans/2026-10-26-hackathon-scope.md)
for build priorities, acceptance checks, provenance, and unresolved eligibility.

### Try the crossing workflow

1. Start the crossing topic with an English or Chinese synthetic adult explanation.
2. Confirm Meta's interpretation, or revise it. Confirmation is local; it does not
   mean the claim is mathematically correct.
3. Predict before executing the selected fixed-catalog experiment. Inspect the
   equality, crossing, or end-limit evidence, including what it does not establish.
4. Reconcile the evidence in your own words, then attempt a fresh verified problem.
   Enter the asymptote and crossing input separately from the explanation. Leave
   both values blank if you need help.
5. Inspect the report: checked values, Meta's reasoning judgment, evidence IDs,
   and independent/assisted/incomplete status. Evidence replay makes no model call.

The nonzero-limit and two-end-limit topics retain the baseline adaptive coach. All sessions remain
local, adult/synthetic, and transient. Source publication is separate from app
deployment or hackathon submission. See [verification and contribution record](docs/claim-testing-verification.md).

`npm run claim:smoke` is an opt-in live check using at most six synthetic requests
with no retries. It overwrites `docs/claim-smoke-results.json`; it is separate
from offline `npm test` and is not an independent accuracy evaluation.

## Run the local MVP

Source repository: [dorangao/explainback](https://github.com/dorangao/explainback).
After cloning, copy `.env.example` to `.env.local` and enter your own Meta key
privately. The example contains no key; the real environment file stays ignored.
Set local file permissions with `chmod 600 .env.local` before running.

```sh
npm run dev
```

Open **http://127.0.0.1:4173**. The server reads `.env.local`; the browser never
receives the key. Select English or Chinese, confirm adult/synthetic use,
choose a topic, and start a session. Use the supplied fictional starting
points or type a synthetic adult explanation. No real student records.

Muse chooses a learning action for each explanation: clarify meaning, ask for
a prediction, check the predicted value, reveal a graph, choose a fresh problem,
or compare reasoning. It can send a reasoned explanation directly to transfer
instead of forcing a hint. The three original topics, acceleration lab, and
flip/landing stage each have checked transfer variants with relevant numeric fields.
Graphs and numeric observations use fixed formulas, not generated mathematics.
The server requires a prediction before numeric evaluation, and a checked
observation or supported reasoning before graph reveal. Transfer graph support
is allowed when useful and recorded as scaffolding, not independent success.

Each turn uses one native Meta Responses function call. Functions are
allowlisted for the active topic and phase; server validation rejects arbitrary names/arguments, premature
progression and ungrounded quotes. Actual tool results enter the next user turn's
bounded context as data. There is no automatic second paid call or unbounded
agent loop. The live endpoint currently accepts `tool_choice: auto`; the app
still requires exactly one valid function call or shows a visible error.

The interface shows the selected intervention, a short teaching purpose and any
code-checked numerical observation. Muse selects between the two verified
transfer variants using their learning purposes. The final comparison quotes
both explanations and notes any additional help used on the transfer problem.

This is a **local adult prototype**, not an app approved for minors. Meta's
age restrictions and the original audience remain unresolved. No deployment
or external project changes are included.

### Local boundaries and cost controls

- Server binds only to `127.0.0.1`; requests must have a local Host and matching
  Origin. Static files are served from an explicit allowlist, never the repo root.
- `.env.local` is excluded by `.gitignore`; only the empty `.env.example` is tracked.
  Keep the environment ignore rules in place. iCloud synchronization is
  separate from Git; the key file is still within an iCloud folder.
- No disk access/prompt/key/raw-error logging. The opt-in developer console
  stores filtered per-session request/response records only in memory. No browser localStorage,
  cookies, analytics, CDN resources or transcript persistence.
- Session text lives in process memory for up to 30 minutes (expired sessions
  are pruned on the next API action), until reset, or until the server stops.
  Recent synthetic turns go to Meta for feedback with `store: false`. This does
  not override Meta's broader retention terms.
- One model call per submission, 1200-character input limit, one in-flight call
  per session, 12 attempts per session and 60 attempts per server hour. Failed
  calls count too. Resetting during a call discards the result but does not
  undo API charges already incurred. Restarting the server resets local limits.
- Tutoring requests use low reasoning effort with a 4096-output-token ceiling,
  including reasoning tokens, and a 30-second timeout. No automatic retries.
- Native function arguments must pass shape/length/enum checks and quote the
  learner's current words exactly. Completion also quotes the original words.
  A narrow bilingual guard requires clarification for an unscoped 'never touches'
  claim. Broader interpretation is still model-based; these checks do not prove
  conceptual accuracy.

Run `npm test` for offline math, learning-state, adapter and real loopback HTTP
integration tests. Run `npm run security:check` to verify that the configured
key does not appear in any project file outside `.env.local` (without printing
the key). Automated tests use fake credentials; live smoke/evaluation calls
are separate and consume API usage.

Browser captures (`output/`, `.playwright-mcp/`), generated live-evaluation JSON,
logs and downloaded reference PDFs remain local and are excluded from Git.
Historical verification notes may refer to those local-only artifacts. Authored
verification summaries and credential-free baseline source archives are tracked.

中文：运行 `npm run dev` 后打开本地地址。仅使用虚构成人示例；密钥只在服务器读取。
中英双语流程包括解释、澄清、一个提示、新题迁移和推理对照。尚未部署，也未解决面向未成年人的使用限制。

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
- Planned hosting was `sketchplaywrite.com/try/explainback/`. The user is now
  considering `explainback.app`; registration and a hosting change are unconfirmed.
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
