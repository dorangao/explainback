# Adaptive ExplainBack coach

Approved direction: adaptive coaching with verified math tools, from the existing
local bilingual adult/synthetic MVP. Implement inline; no deployment.

## Design

Muse makes one native Responses function call per submitted explanation. Six
allowlisted tools express learning actions: clarify, request a prediction,
evaluate a predicted point, reveal a graph, choose a checked transfer variant,
and compare the original and transfer reasoning. The server owns mathematical
results and transition eligibility. No arbitrary code, formulas, URLs, or tools
are accepted from the model. The next user turn includes the actual tool results
in bounded session history, not a second automatic paid call.

Every decision includes an exact current quote, a tentative assessment, a short
learner-facing reason, a focus (meaning/concept/algebra/transfer/explanation),
feedback and one question. Numeric checks require an earlier prediction request;
graph reveal requires an observed check or supported reasoning. Transfer and
completion require supported reasoning; completion quotes the original words
as well. This is evidence of performance on the task, not lasting mastery.

Each topic has two verified transfer variants. Selected variants, observations,
and action history stay in server memory. Secret handling, local-only origin
checks, adult/synthetic gate, timeouts and request limits remain unchanged.

## Implementation and checks

- [x] Extend transport for exactly one native function call; test malformed,
  unknown and multiple calls without changing the ordinary smoke-test path.
- [x] Add three alternate verified functions and transfer metadata; test both
  end limits and crossings of every variant.
- [x] Replace the fixed learning transitions with validated adaptive actions;
  test all six actions, prerequisite gates, invalid arguments, fabricated quotes,
  transactional failure and reference-vs-current graph identity.
- [x] Show the selected action, why it was selected, checked observation and
  transfer purpose. Hide primary starter examples during transfer.
- [x] Re-run HTTP/security regression tests, bounded bilingual live cases, and
  desktop/mobile browser flows. Record limitations and verification evidence.
