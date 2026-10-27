# Open-topic Lesson Studio iteration

Target: Muse creates a bilingual lesson and an operable demo for a topic outside the eight catalog experiments, with in-app review/editing and presentation.

Budget: 3 planned rounds; hard ceiling 5. No publishing, commits or deployment requested.

Success criteria:
- Generate new topic-specific mathematical models or process diagrams without adding topic-specific code.
- Validate a declarative version 2 contract. Interpret bounded arithmetic; never execute generated JS/HTML or make model-directed network requests.
- Show assumptions, formulas/ranges or process steps for review. Distinguish execution checks from scientific verification. Preserve version 1 lessons.
- Present, play, scrub, change parameters, explain, and transfer in English/Chinese; use existing provider, auth, tracing and Ollama exclusion.
- Test malformed content and stale state, and exercise live Muse creation of both demo types.

Design: version 2 chapters carry a generated model (sliders, independent axis, formula outputs, numerical transfer) or process (ordered interactive stages, authored multiple-choice transfer). Generic renderers operate these definitions. Models use a small arithmetic parser and conservative interval validation over the declared input domains; process content and its answers remain explicitly authored/unverified. Draft review acknowledgment is local and resets on edits/import/regeneration. Export/import keeps the definition, never the approval.

Ledger:
- Round 1, complete: version 2 model/process contract, bounded expression parser and conservative interval checks, generic adapters. Seven new/existing focused tests pass. Cooling and request-process fixtures execute without catalog additions. Remaining gap: live authoring and review/player integration.
- Round 2, complete: Muse version 2 creation/revision, explicit definition review, sliders/number controls, process navigation, authored-vs-computed checks, guide recomputation and v1 compatibility. Independent review found tiny-value display/scaling and answer-tolerance bugs; reproduced and fixed with significant-digit formatting and relative checks. All 202 tests pass. Remaining gap: live generated output quality and browser flow.
- Round 3, complete: live Meta created a cooling model, explained changed inputs in Chinese, and revised the model to add a second selectable output. Browser checks covered play, changed inputs, preserved language state, incorrect-answer blocking and numerical transfer completion. The first process response split titles/details into separate objects and was rejected while preserving the draft. Clarified the prompt with a complete stage-object example; the next explicit creation succeeded. Its bilingual process playback, direct step selection, authored quiz and in-app definition editing passed. Editing correctly cleared review approval. All 202 tests pass after the fix; build, secret and diff checks pass. No duplicate IDs or horizontal overflow observed at the current 1280 px viewport.

Stop reason: all bounded acceptance criteria met in 3 of 3 planned rounds; ceiling 5 unused. New topics are limited to declarative numerical models and ordered process demos, not arbitrary generated software. Scientific claims and process answers remain reviewable and unverified. Meta stayed default; no Ollama requests. No commit, push or deployment.
