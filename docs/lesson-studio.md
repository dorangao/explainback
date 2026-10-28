# Lesson Studio

The user asked to move lesson creation into ExplainBack so a topic can become a lesson that the app presents and operates. Carry forward the preference for direct implementation and the bilingual, claim-testing learning loop.

## Image input and model choice (October 28)

**Add a photo, sketch or diagram** sits above the Create button. The browser
reads the file, downscales anything over about 1 MB to at most 1280 px JPEG,
shows a thumbnail, and sends the data URL once with the compose request. The
server accepts PNG, JPEG, WebP or GIF data URLs up to 1.2 million characters,
forwards them as a Responses user message with `input_text` and `input_image`
parts, and records only `[image omitted · N chars]` in traces. A topic is
optional when an image is attached. Muse is told the image is untrusted subject
matter and asked to say in its message what it saw and what it could not read.
Image input needs a Meta model; selecting a local Ollama model returns a clear
error without sending anything.

The model selector now offers **muse-spark-1.3** (default) and
**muse-wonder-1.0** locally and on Vercel. Wonder is larger and slower, so its
request budget is 50 s against Spark's 30 s. Switching models starts a new
provider session and keeps the draft.

## Studio-first presentation (October 27)

Studio is now the default entry. A short Create → Review & revise → Operate
walkthrough introduces the flow, with editable topic/revision starters and the
existing review gate. See the [demo script and current verification](studio-demo.md)
and [12-case frozen evaluation](studio-evaluation.md). Earlier counts below remain
historical. Current local validation: 221 tests; build and configured-secret scan passed.

## Open-topic creation (current)

The default **Create a new topic demo / 创建新主题演示** mode asks Muse to author a version 2 lesson rather than select a fixed experiment. Two generic renderers support new topics without adding topic-specific application code:

- **Mathematical model:** one to four adjustable inputs, an independent axis and one to three formula outputs. Play or scrub the graph, choose an output, change inputs, and answer a new numerical case computed from the same formulas.
- **Process diagram:** three to six interactive stages with play, scrub and direct step selection. A multiple-choice transfer question checks against the authored answer, explicitly labeled as unverified.

The eight original experiments remain available through **Use existing experiments / 使用原有实验**. Version 1 files still work. Version 2 permits one to three chapters and up to 24 KB of compact JSON; file import permits 40 KB for formatting. Version 1 retains its 12 KB content bound. Generated creation normally asks for one focused chapter. Topics unsuitable for either renderer may be declined rather than forced into an unrelated catalog lesson.

### Create, review, present, operate

1. Sign in, open Create a lesson, choose a preset or enter a new question, and generate a draft. Meta remains the default. The app sends one provider request per explicit action.
2. Inspect the bilingual claim, assumptions, parameter ranges and formulas or process steps. Edit teaching text, edit the structured definition, or enter a revision request for Muse. Invalid definition edits preserve the last valid draft and block presentation until applied or discarded.
3. Acknowledge review of generated definitions and present. Editing, importing or regenerating clears this acknowledgment; exported files never carry approval.
4. Predict, operate, reconcile and transfer. Parameter changes reset the prediction and evidence. Language switching preserves the current demo and inputs. Optional Muse explanations receive server-recomputed model values; suggestions are applied only when the learner clicks.
5. Export to preserve the bilingual definition; drafts otherwise live only in this page's memory. Logout clears the draft and discards pending responses. The provider console remains controlled by the existing trace flag.

### Trust and execution boundaries

Generated definitions are data, never executable JavaScript, HTML or network instructions. The arithmetic interpreter supports numeric literals, named inputs, `x`, `pi`, `e`, `+ - * / ^`, and `sin`, `cos`, `exp`, `log`, `sqrt`, `abs`, `min`, `max`. Outputs may reference earlier outputs. Bounded parsing, finite result checks and conservative interval analysis reject unsupported expressions, cycles, singularities and unsafe domains across declared ranges. Conservative interval checks can reject mathematically valid correlated expressions; simplifying a formula or narrowing its domain can help.

These checks establish supported structure and computable arithmetic, **not scientific truth, dimensional consistency, or factual accuracy**. Numeric transfer answers follow the authored formulas. Process steps and answer keys have no independent factual validator; stage order is not physical time. Reviewers must check explanations, units and assumptions before teaching from them. The model cannot create arbitrary 3D simulations, real CFD engines or additional executable widgets through this contract.

Provider routing, tester authentication, ownership, quotas, locks, trace redaction and exclusive Ollama scheduling are reused. No simultaneous Ollama execution or automatic retry was introduced. The original catalog and earlier prototype remain separate baseline work.

### Open-topic verification

Completed three planned context-iterate rounds (ceiling five). All 202 tests pass, including generated contract rejection, arithmetic/domain checks, tiny-value rendering and answer tolerance, review invalidation, bilingual state, guide recomputation and HTTP validation. An independent code review identified tiny-value issues; regression tests cover the fixes. Build, configured-secret scan and diff whitespace checks pass.

Live Meta checks created an exponential cooling demo, explained changed parameters in Chinese, and revised the demo to add a second output. At the default values its final temperature was 20.535 degC; changing the cooling rate from 0.08 to 0.17 changed it to 20.002 degC. These numbers are formula results, not measurements. Browser checks covered playback, parameter resets, output selection, English/Chinese preservation, rejected wrong answers and a completed numerical transfer case.

A Chinese web-loading topic produced an interactive process lesson. The first response split stage titles/details into separate objects; validation rejected it and retained the cooling draft. After adding an explicit complete-stage example to the prompt, one new explicit request succeeded. Direct step selection, playback, bilingual transfer choices, wrong-answer blocking and completion worked. In-app JSON editing removed duplicate authored step numbers and correctly revoked presentation approval. No duplicate IDs or horizontal overflow appeared at the current 1280 px viewport. Four live requests were accepted across the two sessions; one malformed response was rejected. Ollama was not invoked. Screenshot: local/ignored `output/open-topic-studio.png`.

Both browser drafts were kept open. Automatic approval review prevented reloading the unsaved cooling draft, so the final process check used a separate tab. No commit or deployment was performed.

## Original catalog baseline

Add a third learning area. Muse (or another configured provider) selects and sequences one to three existing, deterministic experiment types, writing English and Chinese titles, framing, and explanations. The author reviews and edits the text, then starts a player: predict → operate the experiment → reconcile the result → answer a fresh numerical transfer question. The player pauses between these stages. Playback and a scrubber operate a trusted renderer; the model never supplies executable HTML, JavaScript, formulas, URLs, or new simulation engines.

The initial catalog covers acceleration, roll, landing, suction, qubits, interference, entanglement, and four-item quantum search. Claims, calculated evidence, parameter variants, transfer answers and assumptions come from application code. Generated teaching text is visibly labeled as a draft, not checked scientific evidence. Unsupported topics receive an honest coverage message. This choice prioritizes runnable lessons over unrestricted slide generation or arbitrary generated code.

Drafts can be edited, reordered, removed (at least one chapter), exported as versioned JSON, and imported with the same strict validator. No silent local persistence; downloads are the durable artifact. Import does not execute code or create provider calls. Language switching preserves the lesson and playback position. All authored text renders as text, never markup.

Creation and optional explanations use the existing provider router, Meta default, tester authentication, ownership checks, rate limits, session locks, trace flag/redaction and Ollama exclusivity. No automatic retries. Provider explanations can suggest a bounded action; the learner explicitly applies it. Logout clears the in-memory draft/player and discards pending responses. Authored text and imported text are untrusted data.

## Initial implementation and verification

1. Add a versioned, size-bounded lesson contract and experiment adapters over the existing math modules; test invalid content and independent numeric expectations.
2. Add authenticated composition and explanation endpoints with native tools and server-computed evidence; test ownership, reset races, protocol isolation, limits and rejected output.
3. Build the bilingual author/player UI with export/import, playback, transfer checking and optional provider console. Keep existing areas intact.
4. Run focused and full tests, build and secret checks; exercise real creation, presentation, language switch and console in the browser. Request a fresh code review and resolve material findings.

No commit, push or deployment is part of this request. Existing prototype/baseline files remain identified separately.

## Initial catalog verification

Open **Create a lesson / 创建课程** after tester sign-in. Choose a preset or type a topic, then create one bilingual draft. Review the canonical claims and edit the title, introduction, framing or explanation in the selected language. Reorder/remove chapters if needed, then present. Each chapter pauses for a prediction, a local experiment, explanation, and a numerical transfer check. Import/export preserves both languages; the JSON contract is version 1, one to three distinct experiments, maximum 12 KB compact content (20 KB file allowance for formatting). Browser memory is cleared on logout; export before closing/reloading the page.

The model may suggest replay, comparison or transfer during an explanation. Apply that suggestion explicitly. Language switching retains the lesson and completed provider trace; changing language during an active request discards that request's result. Switching models starts a fresh provider session while retaining the lesson. There are eight provider attempts per Studio session and the existing shared hourly quota. Exhaustion recovery is explicit; no automatic retry or Ollama concurrency changes.

Quantum curves show pre-measurement probabilities. A single readout measures a separate copy; repeated readout of that copy preserves the result, while 256-shot sampling re-prepares each trial. Entanglement includes the classical-mixture comparison in the same basis. Quantum gate snapshots are discrete, and the physical model boundaries remain explicit.

Validation: 193 tests passed, including contract, numerical adapters, progression, independent transfer cases, API auth/ownership/output validation/exhaustion, logout races, and stale measurement reset. Two code-review passes identified issues that were reproduced and fixed; the final focused re-review found no remaining material issue. Live Meta creation and in-lesson explanation succeeded. Browser checks covered editable bilingual output, guided playback, applying a suggested comparison, export/reimport, incorrect-answer blocking and completion of all three physics chapters. Generated framing needed one editorial correction in the first smoke test; generated teaching text remains explicitly reviewable rather than scientifically certified.

A second live creation from a Chinese topic produced a qubit → interference → search lesson (HTTP 200, accepted). A single simulated readout returned one bit; the fresh 256-shot sample displayed 130 zeros and 126 ones in this run. Switching to English preserved these observations and the provider trace. The browser showed both filtered request and response panels, no duplicate element IDs, and no horizontal overflow at its current 654 px width. The build and configured-secret scan passed. Ollama was not invoked. Preview screenshot is local/ignored under `output/lesson-studio-preview.png`.
