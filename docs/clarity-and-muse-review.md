# ExplainBack clarity and Muse review · October 27, 2026

Scope: improve the existing English/Chinese app's information organization and use of Muse, preserving the checked physics, auth, provider configuration and baseline history. No deployment or commit requested. Up to three substantive rounds; no visual rebranding.

## Round 1 · Audit and capability research

Current-run captures: output/clarity-audit/01-entry-before.png, 02-claim-before.png, 03-evidence-before.png. Entry capture is the narrow in-app viewport; evidence capture is a full-page desktop view. The visible page mixes manual setup, guided setup, two physics-settings panels, warnings, developer traces, stage notes, duplicate worksheets, evidence and assumptions. Eleven stage labels compete with the active question. Full JSON is opened automatically. Suction is absent from the static manual selector even though the server catalog includes it. A stopped background animation also produced an error instead of a normal cancellation.

Chosen structure: Watch a demo / Test my claim. One active idea and visual; four brief progress milestones. Keep a concise model-scope label and visible provider activity summary. Put calculation detail, controls, assumptions, raw requests and the session record behind deliberate disclosures. Preserve the existing notebook palette and working physics diagrams.

Sources checked today:
- https://dev.meta.ai/docs/models — Spark 1.3 supports multimodal input and tool-based workflows; Glimmer is self-hosted. Documented availability is distinct from account access.
- https://dev.meta.ai/docs/tool-calling — the app executes developer tools; Muse chooses calls and interprets results.
- https://dev.meta.ai/docs/image-understanding — image/diagram/chart input and grounded text output.
- https://dev.meta.ai/docs/video-understanding — video input. Its audio section warns that Spark 1.3 audio understanding is not yet fully supported; examples use 1.2. Do not promise reliable 1.3 voice input.
- https://dev.meta.ai/docs/protocols/responses — typed multimodal messages, tool results and reasoning continuity.
- https://dev.meta.ai/docs/search-grounding — built-in search for current-source grounding.
- https://dev.meta.ai/docs/reasoning — adjustable reasoning effort.

Current integration: text-only string input, one native tool per turn, fixed low reasoning effort, server-owned plain history/evidence, no image/audio/video input, search or replayed reasoning state. This is narrower than the documented API. It deliberately preserves deterministic evidence and one-request budgeting.

Highest-value uses:
1. Now: Muse selects the visual that answers the learner's specific confusion through a bounded reveal_graph argument; feedback stays short and localized. The existing request budget is unchanged.
2. Next: photograph/sketch explanation — interpret a free-body diagram, identify a missing or reversed arrow, then test the numerical claim with code. Requires explicit upload UI, validation and image-input transport before it is a product feature.
3. Later: short demonstration video → separate observation, manufacturer claim and measurable hypothesis; add source-grounded retrieval for current product claims. A video or search result cannot establish force or safety without calibration and measurements.
4. Voice can reduce typing, but should follow a clear visual flow. More autonomous calls, long reasoning or image generation are not default remedies for information overload.

## Round 2 · Implementation

Implemented two experience modes, four milestone labels, optional calculation/session/trace details, a single relevant suction visual, localized exploration tabs, compact design outcomes, fixed manual topic discovery, and bounded/cancellable playback. Added strict Muse visual selection to the existing reveal_graph call; graph help during transfer remains assisted. Meta default and provider serialization are unchanged.

## Round 3 · Verification and refinement

Independent code review found three regressions, all corrected: required problem inputs hidden by a disclosure; guided errors hidden when session creation fails; new Muse focus ignored after local exploration. Added regressions for focus reapplication and background animation completion/stop/abort. Browser mobile review found the floating Next button covered content; moved it into normal flow.

Verification: 168/168 offline tests, public build, secret scan, four focused live Muse checks (English/Chinese × angle/leakage, 4/4 expected native tool/view choices). English five-call walkthrough completed with assisted outcome and accepted provider traces. Chinese mobile walkthrough also completed with five accepted provider calls and an assisted outcome. The expandable console exposed both filtered request and response panels. Mobile content width matched the viewport (375 CSS px); the revised Next button uses normal flow. Baseline crossing still shows its expression immediately, and switching back to demo closes the optional session record. No local Ollama model loaded.

Flow health after changes:
| Step | Before | After | Evidence |
| --- | --- | --- | --- |
| Choose a path | Competing manual/demo setup | Clear | Two entry actions, settings collapsed |
| Follow a test | Multiple charts and repeated text | Clear | One chart per stage; four milestone groups |
| Understand the result | Long parallel explanations | Improved | One main idea; graph/result explanation available on demand |
| Explore and verify | Controls mixed with primary story | Clear | Manual focus tabs and optional controls/evidence |
| Inspect model behavior | Raw requests open by default | Clear | Visible activity summary, expandable actual requests |

Capability priorities remain recommendations beyond the delivered tool-selection change. Spark 1.3 is the existing default and was exercised live. Glimmer is documented as a self-hosted text/image model; the local Ollama build’s vision support was not tested. Wonder, Image, Voice Transcribe and SAM are separate model families, not capabilities implicitly enabled by choosing Spark. No need to switch models or introduce generated physics illustrations to solve this information-organization problem.


Roadster presentation follows the same rule: acceleration shows its speed/force graph, flip shows torque/rotation, landing shows contact/vertical motion; revision returns to torque. The common timeline and model-boundary labels remain. Full inputs/assumptions are expandable, and all synchronized graphs remain available in manual mode.

Recommended next increment (not implemented): let a learner submit a force-arrow sketch. Muse should describe the interpreted arrows and ask the learner to confirm them, select one discrepancy, and pass a bounded numerical hypothesis to the existing solver. Evaluate on synthetic missing-arrow, reversed-arrow and ambiguous-diagram cases in both languages before treating the interpretation as useful feedback. Preserve the distinction between image interpretation, checked numerical evidence, and real-world validation. First add typed image input to the provider adapter; the current app accepts text only. Treat the local Glimmer runtime as a separate capability test, without loading Qwen concurrently.

Three substantive rounds completed: audit/research, implementation, and review/verification with corrections. Changes are local; no commit, push or deployment was performed. The main remaining product question is whether real testers can explain the distinction after the guided flow; author-created smoke checks do not establish learning outcomes.

Current-run captures are in ignored `output/clarity-audit/`: `04-entry-after.png` (two-path entry), `05-pressure-after.png` (single suction graph), `06-mobile-zh-after.png` (mobile audit before fixing floating Next), `07-mobile-final.png` (corrected mobile Next), `08-roadster-final.png` (full-page Roadster), and `09-preview-final.png` (normal viewport). The final Roadster check showed one torque graph with the plotted width taken from the visible panel, keeping labels readable. Temporary viewport overrides were reset. The local preview is left at a paused evidence step for manual continuation.
