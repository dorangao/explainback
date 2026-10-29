# Lesson Studio demo: sketch or question → Wonder drafts → Spark tries it → explain it back → show

Updated **October 28, 2026, Pacific**. Target: an adult learner or lesson author
who turns a question or a sketch into a bilingual interactive lesson that code
checks and two Muse models help shape. **Lesson creation leads; the vehicle lab
is at most a 15-second aside, or cut.**

**Pitch:** "ExplainBack turns a question or a sketch into a bilingual lesson you
can operate. Muse Wonder drafts it, Muse Spark tries it as a learner, code checks
every answer, the learner explains it back, and the lesson becomes a narrated
show."

**中文：**"ExplainBack 把一个问题或一张草图变成可操作的中英双语课程。Muse Wonder
起草，Muse Spark 以学习者身份试学，代码核验每个答案，学习者用自己的话解释，
最后课程变成有旁白的讲解秀。"

## Three-minute sequence

| Time | Action | Say / 讲解重点 |
|---|---|---|
| 0:00–0:15 | Open the library signed out; open the sketch-pendulum card | A hand-drawn sketch became this lesson. Muse read it; code runs it. 一张手绘草图变成了这节课。 |
| 0:15–0:45 | Sign in with the invite link; attach a sketch or type a question; **Create** with Wonder | One structured request. Wonder returns a lesson contract, never code; the renderer compiles and range-checks the formulas. 一次结构化请求；模型只返回课程契约。 |
| 0:45–1:15 | **Let the test learner try this lesson** (Spark); read its report | Spark predicts, explains back and answers the transfer; the code marks its answer correct or not; its confusions are its opinion. 代码核验答案，困惑是它的看法。 |
| 1:15–1:35 | **Use these suggestions in a revision**; **Revise**; show *What Muse changed* | The learner's feedback goes straight back to the creator; every changed field is visible. 反馈直接回到创作者，改动逐项可见。 |
| 1:35–2:10 | Present: predict, run, change an input; in **Explain**, press **Say it instead** and speak the explanation (or type it); **Check my explanation with Muse** | The learner explains it back, by voice (Muse Voice Transcribe writes it down; edit the transcript) or by typing; Muse grades it against the checked result and asks one follow-up that does not give the answer away. 学习者解释，Muse 对照核验结果评估。 |
| 2:10–2:40 | **Make a narrated show**; play the cover and the experiment slide | Wonder wrote the narration, Muse Image drew the cover, the browser speaks; the values come from the checked lesson. 旁白由 Wonder 撰写，封面由 Muse Image 绘制。 |
| 2:40–3:00 | Frozen eval numbers, limits, source and live URL | Spark 6/6 and judge 10.0 on the text suite with prompt v2; generated science still needs review. 自动检查通过不代表科学内容已获验证。 |

**Timing and honesty.** Wonder creates in 16–25 s and passed 5 of 6 frozen text
cases, so a retry on camera is plausible. Either record Wonder with honest time
cuts, or record the creation with **Spark as creator** (the selector allows it;
Spark creates in 7–14 s and passed 6 of 6) and say so. The test learner is
always Spark. The six gallery shows are pre-generated and play without sign-in,
so the show segment can use `#show:cooling` if the live show is slow. Label
anything cached or edited; never pass a stored result off as live.

**Rehearsal without spending requests.** Create, tryout, revision and show
replies are remembered in the browser with the inputs they answered. Reopening
Create or reloading restores the draft without a provider request; a button
reads **Re-run** while inputs are unchanged and **Send changes to Muse** after
an edit. For a hands-free walkthrough, set **Guided replay** to *normal* in the
player (space pauses, any click takes over); **Start a new lesson** forgets the
remembered draft before a fresh take.

**Pre-flight.** Fresh browser, judge invite link ready, a sketch file on disk,
EN/ZH switch once, provider console closed unless a request detail is asked for.

## Shot list, verified live on October 28, 2026 Pacific (LIVE-001)

Every beat below was run on `explainback.app` (deployment source `a6e151e`) in
the Claude browser pane, signed in with the judges invite, in one sitting with
four model requests. Timings are the app's own elapsed-time lines; the show
timing is wall clock. Record in a fresh 1280-px browser window, EN, provider
console closed. Cut to the live URL in every shot so the address bar shows it.

| # | Time | Screen / action | What the camera sees | Say | Live cost |
|---|---|---|---|---|---|
| 1 | 0:00–0:12 | `/` signed out | Six library cards, "Free to explore · No sign-in"; hover card 06 *Pendulum sketch* | A hand-drawn sketch became this lesson. Muse read it, code runs it. | none |
| 2 | 0:12–0:22 | Click **Open lesson** on card 06 (`#lesson:sketch-pendulum`) | Predict step, claim card, gravity slider 1→20, attribution line "Drafted by muse-spark-1.3 from this hand-drawn sketch" | Every lesson is predict, operate, explain, transfer. | none |
| 3 | 0:22–0:30 | Open `#invite:…` (pre-pasted), land on `#create` | Header shows *judges · N/40 live requests*; three-step strip; cooling prompt pre-filled; **Creator model = muse-wonder-1.0** | One structured request. Wonder returns a lesson contract, never code. | none |
| 4 | 0:30–0:58 | Click **Create a lesson** | Spinner, then "Draft ready"; line *muse-wonder-1.0 drafted this lesson · 22.7 s · 1382 in / 1567 out*; title *Why Does Coffee Cool Near Room Temperature?*; formulas `troom+(t0-troom)*exp(-k*x)` | The renderer compiles and range-checks the formulas; the model never ships code. (Measured 22.7 s; cut the wait honestly or say "about twenty seconds".) | 1 request |
| 5 | 0:58–1:10 | Scroll to **Test learner report**, click **Let the test learner try this lesson** | Spark report in ~4 s: *Overall 4/5 clarity*, Predicted *Not sure*, Explained back with numbers 90→37.17→25.39, **Transfer answer 38.07 °C correct**, two Confusions, two Suggestions | Spark predicts, explains back and answers the transfer. Code marked its answer correct; its confusions are its opinion. | 1 request (4.0 s) |
| 6 | 1:10–1:40 | Click **Use these suggestions in a revision**, then **Revise lesson & demo** | Revision prompt fills with Spark's two suggestions; after ~21 s a **What Muse changed · 2 fields changed** panel shows old vs new *Chapter 1 explanation* and *Assumptions*; **Restore previous draft** visible | The learner's feedback goes straight back to the creator and every changed field is visible. Nothing is a verified improvement until a human reads it. | 1 request (21.5 s) |
| 7 | 1:40–1:50 | Tick **I reviewed the demo definition…**, click **Present this lesson →**, click **Disagree**, **Test this claim →** | Learner view; claim "cools at the same rate"; curve from 90 °C bending to 22 °C; **Show final state** → *Time = 60 min · Temperature = 25.386 °C* | The learner commits before seeing the result. | none |
| 8 | 1:50–2:15 | **Explain the result →**; type (or **Say it instead** and speak) one explanation; **Check my explanation with Muse** | Calculated evidence line (25.386 °C, 0.16928 °C/min); after ~3.5 s a green **Supported by the evidence** verdict and one follow-up question that does not give the answer away | Muse grades against the checked result, names the gap (assumptions), asks a follow-up. Voice path: Muse Voice Transcribe writes it down, you can edit the transcript. | 1 request (3.5 s; +1 if spoken) |
| 9 | 2:15–2:25 | **Try the transfer question →**; type `38.07`; **Check answer locally** | New case 80 °C / 20 °C / 0.08 at 15 min; green *That matches this model.* | Same number Spark got in beat 5; checked by code, not a model. | none |
| 10 | 2:25–2:50 | **Lesson overview**, click **Make a narrated show**; press ▶ twice | Dark show frame, Muse Image cover (coffee by a window), slide 1/6 narration; slide 3/6 is the live curve with a moving time marker; credits line *narration by muse-wonder · cover by muse-image · voice by your browser* | Wonder wrote the narration, Muse Image drew the cover, the browser speaks; every value comes from the checked lesson. (Measured ~40 s wall clock; if slow, cut to `#show:cooling`, which is pre-generated, and say so.) | 1 request |
| 11 | 2:50–3:00 | Switch EN → 中 on the show, then back; end card | Chinese narration and controls on the same slide; URL, repo, eval numbers | Spark 6/6 and judge 10.0 on the frozen text suite with prompt v2. Automatic checks do not validate the science. | none |

**Budget.** The run above used 4 of the invite's hourly live requests (Wonder
create, Spark tryout, Wonder revise, Spark grade) plus the show. The provider
session counter also drops per request; start the recording with a fresh
session so beat 10 is not refused.

**Known cosmetic issues seen on this run (not blockers).** After switching to
中文 while the show was open, the status line "The show is ready. Watch it, or
present the lesson as usual." stayed in English, and the "requests left in this
provider session" figure read 3 in EN and 8 in 中文. Record beat 11 on the show
slide itself, where everything is translated, and keep the status banner out of
frame or dismiss it first.

**Not verified in this run.** The spoken path of beat 8 (the pane cannot grant a
microphone); narrow-screen layout; a second chapter. The transfer question and
show were exercised on the revised draft only.

## Controls and review

- `/` and `#studio` open Lesson Studio. `#physics` and `#quantum` retain the
  existing areas. Area buttons preserve the draft and experiment state.
- The three-step introduction hides once a draft exists. **Try with cooling
  coffee** loads an editable topic without a provider call.
- **Load a revision idea** fills an editable prompt suited to a model or process.
  Inspect the draft first: a useful second output may already exist.
- A real revision requires **Revise lesson & demo** and clears the review check.
  Validate the changed definitions before presenting again.
- Changing an input resets the prediction. Play, scrub or show the final state;
  select an output when available. Process stages can instead be selected.
- The provider console is controlled by the existing `EXPLAINBACK_TRACE=1` flag.
  It shows actual filtered request/response data and elapsed time. It may expose
  checked answers, so a console-enabled presentation is a developer demo.
- Meta stays the default. This task made no Ollama requests.

A concrete cooling revision, adaptable to the returned draft:

> Keep the existing input IDs and formulas. Use a testable claim: coffee loses
> the same degrees each minute. Replace “initial heat” with “initial temperature”
> in both languages. Make the transfer explicitly ask for a numeric temperature
> with units; change its cooling coefficient within the allowed range. Retain
> ideal assumptions and keep pre-test framing neutral.

> 保留现有输入标识和公式。使用可检验观点：咖啡每分钟降低相同的度数。
> 将中英文中的“初始热量”改为“初始温度”。迁移题明确要求带单位的数值温度，
> 并在允许范围内改变其冷却系数。保留理想假设，实验前的情境文字不要提前揭示结论。

The renderer has no authored “comparison preset” field for generated models;
operate the inputs or revise the transfer inputs instead. Check the accepted
result rather than assuming every request was fulfilled.

## Local verification, October 27 (historical: Spark-only Studio before roles, explain-back and shows)

The checks below were performed locally before release. Runtime commit
`3f947d593282cf558e686395fca7037978e1a02b` is now pushed and deployed to
[explainback.app](https://explainback.app/). See [production verification](vercel-deployment.md#studio-first-production-release--october-27-2026).
Main-branch integration remains an item in the [readiness tracker](hackathon-readiness.md).

- Fresh root URL showed Studio as selected after tester sign-in; no provider
  request occurred when loading the editable starter.
- Live Meta creation accepted in 6.788 s; explicit revision accepted in 7.317 s.
  These two UI calls are separate from the twelve frozen evaluation attempts.
- Created a model with temperature and positive cooling-speed outputs. Revision
  replaced “starting heat,” changed the claim to constant degrees per minute,
  and changed transfer cooling coefficient from 0.03 to 0.10 per minute. Default
  live coefficient remained 0.05. Review stayed unchecked until explicitly set.
- At initial temperature 80 C, ambient 20 C and coefficient 0.05/min, the graph
  ended at 22.987 C at 60 minutes. Changing the slider to 0.06/min reset prediction;
  the rerun gave 21.639 C and cooling speed 0.098365 C/min.
- Switching to Chinese retained coefficient 0.06, progress 1 and the cooling-speed
  output. Transfer inputs 90 C, 18 C, 0.10/min, time 20 min gave
  `18 + 72 exp(-2) = 27.744140393… C`, accepted by the local check.
- Provider console showed two accepted HTTP 200 records and both actual filtered
  request and response panels. Switching Physics → Studio retained the checked
  transfer, answer and selected output. No extra provider calls were made.
- Browser at 1280 px had document width 1280 px, with no horizontal overflow.
  Local screenshot: `output/studio-demo-eval/transfer-zh.png` (ignored).
  Deployed/narrow-screen verification remains a release-candidate task.
- Browser startup exposed missing local routes for the new walkthrough and an
  existing powered-journey module. Both fixed; the HTTP regression now traverses
  the full browser module import graph.
- **221/221 Node 22 tests passed**, public build passed, configured-secret scan
  passed, diff whitespace check passed. HTTP tests ran with localhost socket
  permission. Raw evaluation outputs and environment files remain ignored.
- Fresh code review identified one evaluator false positive. The versioned
  sensitivity supplement fixed it; re-review found no remaining material issue.
  [Evaluation protocol/results](studio-evaluation.md) preserves the first run.

Generated science still needs review: in this smoke demo the revised framing
continued to hint at the conclusion. That editorial limitation is recorded,
not presented as a verified teaching outcome. A separate human content review
and a matching live process revision/transfer run are still checklist items.

## Contribution timeline

Doran clarified: **before October 26, only Muse API-key setup was done**;
application work started October 26. Earlier baseline archives identify
iterations within development. They do not establish a pre-event app. The
organizer’s kickoff/build-window boundary remains a separate eligibility question.
