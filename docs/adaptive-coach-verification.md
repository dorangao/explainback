# Adaptive coach verification

## Change

Muse now selects one of six native Responses function calls per learner turn:
clarify meaning, request a prediction, check the predicted value, reveal a graph,
select a verified transfer variant, or compare reasoning. The server executes
the action and provides actual tool results in the next turn's bounded context.
No automatic second model request, arbitrary code, or model-created math problem.

There are two checked transfer variants for each of the three topics. The UI
shows the intervention, its teaching purpose, checked numerical observations,
the selected variant's purpose, and a grounded comparison. Any prior tutor turn
on the transfer problem is marked as scaffolding in the final comparison.

## Verification

- Full offline suite: **30 passing tests, zero failures**. Coverage includes all
  six actions, all nine checked functions, graph identity across transfer,
  prerequisite gates, transactional rejection, fabricated quotes/arguments,
  unknown/multiple native calls, transfer scaffolding, reset/concurrency, local
  HTTP restrictions, bilingual UTF-8 and request/cost limits.
- `npm run eval:live`: **6/6** synthetic adult cases passed initial label checks.
  Both unscoped English/Chinese crossing claims selected clarification. A Chinese
  nonzero-limit misconception selected prediction. Reasoned English/Chinese
  examples selected transfer. The run uses actual native function calls; see
  `docs/local-evaluation.json` for actions and results.
- Secret scan: configured key absent from other project files; `.env.local`
  private (0600) and ignored. No key or raw request/error logging was added.
- English browser: an unscoped claim was clarified; an explicit boundary claim
  led to a prediction at zero; code returned f(0)=0; Muse revealed the graph,
  selected the alternate negative-shift transfer, and completed a comparison
  after reasoning about y=-1 and x=-2. All six native actions were exercised.
  The numerical observation and first/reference versus transfer graph identities
  were visible in the UI. Primary starter examples were hidden during transfer.
- Final Chinese browser session: an already reasoned explanation went directly
  to the alternate negative-shift transfer, without a compulsory hint or graph.
  Correct sign/absolute-value reasoning completed the comparison in Chinese.
  The completed page retained the actual transfer question, not an unanswered
  follow-up question. No invented correction was claimed for the initially
  correct explanation.
- Final mobile width 390px: document width 390px, no horizontal overflow.
  Desktop checked at 1440×1000; browser warning/error log was empty.
  Screenshots: `output/qa/adaptive-mobile-zh.jpg` and
  `output/qa/adaptive-desktop-zh.jpg`.

## Issues found during live testing

1. This Meta endpoint rejects `tool_choice: required`. It accepts `auto`; the
   app now uses that setting and independently requires exactly one allowed
   function call. Missing, multiple, unknown and invalid calls fail visibly.
   No fallback, simulated feedback or automatic retry is used.
2. The first adaptive browser response treated an unscoped 'never touches' claim
   as a definite misconception. A narrow bilingual scope guard now restricts
   that known ambiguity to clarification and requires an ambiguous assessment.
   The corrected behavior passed native live checks in both languages and the
   browser. This guard is not a general semantic classifier.
3. Chinese mobile QA caught the alternate negative-shift question reusing the
   default positive-shift wording. Both language prompts now say to subtract 2,
   with a regression check tying that instruction to the variant's formula.

## Limits

Six smoke examples are not the planned independently reviewed 24–30-case
evaluation and do not establish tutoring accuracy. The model can still choose
an unhelpful question or misinterpret other explanations. Numeric observations
illustrate behavior; a finite sample alone does not prove a limit. Supported
answers must include reasoning matching the checked mathematical facts.

The prototype remains local, synthetic and adult-only. No student records,
account/profile system, uploads or deployment. Meta's under-18 restriction,
hackathon credit claim and reuse terms remain unresolved.

Run `npm run dev` and open http://127.0.0.1:4173. `npm test` and
`npm run security:check` are offline. `npm run eval:live` makes six bounded live
requests and overwrites the evaluation report; it is not part of `npm test`.
