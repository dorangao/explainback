# Local MVP verification

This records the original fixed-loop MVP. The adaptive-coach update and current
test evidence are in `docs/adaptive-coach-verification.md`; `local-evaluation.json`
now contains the newer six-case adaptive run.

## Implemented

Local English/Chinese workspace with three verified primary/transfer pairs,
grounded model feedback, clarification, a targeted reflection probe, graph
exploration, transfer reasoning and before/after comparison. All examples
used in development were synthetic adult-user examples.

## Evidence

- `npm test`: **20 passed, 0 failed**. Includes fixed-function math checks,
  state transitions, malformed feedback, evidence grounding, separate developer
  instructions, redacted errors, timeout, allowlisted static files, local Host
  and Origin checks, adult/synthetic confirmation, UTF-8 split across HTTP
  chunks, reset during an in-flight call, duplicate suppression and input/
  request-count limits.
- `npm run meta:smoke`: completed live response with the exact expected marker,
  model `muse-spark-1.3`. Reported 481 tokens including reasoning.
- `npm run eval:live`: **4/4** initial live cases matched expected labels, using
  synthetic adult reasoning. The sample covers English/Chinese support for
  unequal end limits, English support for a nonzero rational limit and a Chinese
  misconception. Results are in `docs/local-evaluation.json`.
- Browser English crossing flow: ambiguous claim → clarification → explicit
  boundary misconception → f(0) probe → corrected reasoning → fresh transfer
  → completed before/after comparison. Graph withheld before reflection and
  transfer graph withheld until the transfer explanation was supported.
- Browser Chinese unequal-end flow: reasoned primary explanation → fresh
  transfer → reasoned response → completed comparison. Feedback was Chinese.
- Desktop layout checked at 1440×1000. Mobile checked at 390×844; document
  width was 390px with no horizontal overflow. Keyboard ArrowRight changed
  the graph input to 0.1 and displayed the correct value 1.0999.
- Browser console: no warnings or errors in the final loaded page.
- Screenshots: `output/qa/desktop-complete.jpg`,
  `output/qa/desktop-zh-complete.jpg`, `output/qa/mobile-zh-complete.jpg`.
- `npm run security:check`: configured key absent from other project files;
  `.env.local` has mode 0600 and is covered by `.gitignore`. No Git repository
  has been created. No raw keys, prompts or upstream error bodies are logged
  by the app; the browser gets no key and cannot request server/source/env files.

## Failure found and corrected

The first tutoring response and its diagnostic follow-up were incomplete
with the initial 2048-token cap and unspecified reasoning effort. The UI
reported failure and preserved the text. Tutoring now explicitly uses low
reasoning effort and a 4096-token ceiling; subsequent English/Chinese flows
completed. Calls still fail closed on incomplete or invalid output, with no
automatic retry and a 30-second timeout. Offline HTTP tests initially needed
loopback permission outside the terminal sandbox; the authorized loopback
runs passed.

## Limits and remaining work

- The planned independently reviewed 24–30-example bilingual evaluation has
  **not** been completed. Four live label checks and six successful browser
  turns are initial smoke evidence, not a measured tutoring accuracy claim.
- The model can still misinterpret an explanation despite correct checked
  facts and grounded quotes. This prototype does not establish lasting mastery.
- Adult/synthetic confirmation is a local prototype boundary, not verified age
  assurance. Meta's restrictions for under-18 users remain unresolved. No real
  student data or minor-facing pilot was used.
- Hackathon credit balance, the alternate-account claim and existing-work
  reuse terms remain unverified. Live API usage was authorized for local tests;
  no subscription, payment change or credit claim was made here.
- Session state is ephemeral. No account system, database, uploads, voice or
  full curriculum. The static marketing site was not modified.
- **No deployment, publication, hackathon submission or domain change.**

## Reproduce

Use a private `.env.local` with `MODEL_API_KEY` and optional `META_MODEL`.
Run `npm run dev`, then open http://127.0.0.1:4173. Offline tests are `npm test`;
secret checks are `npm run security:check`. `npm run eval:live` makes four paid
API requests and overwrites the small evaluation report; it is never part of
the default offline test command.
