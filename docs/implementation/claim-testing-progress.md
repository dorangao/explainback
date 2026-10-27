# Implementation ledger — plan: docs/superpowers/plans/2026-10-26-hackathon-scope.md

- Baseline: no Git repository; all 30 tests passed before edits. Captured 18 allowlisted source files in docs/baseline/before-claim-testing.json and .tar.gz. Environment files excluded; configured-secret scan passed.
- Actual work started October 26, 2026 Pacific. The guide's stated building period starts October 27. This is an extension of baseline work, not a claim of competition eligibility.
- Ruling: implement inline in the existing non-Git folder; do not initialize Git, create a misleading history, commit, publish, or deploy.
- Ruling: current authorization covers the crossing core (P0), not partner hosting, public submission, or the separate 24-case evaluation project.
- Interfaces: claim state selects eligible experiments; server-owned evidence gates transfer; transfer answers come directly from learner fields and are checked separately from model interpretation.
- Ruling: use an explicit workflow selector in session creation to keep the baseline learning API/tests reproducible; the browser selects claim-testing automatically for crossing only.
- Ruling: one model call per teaching submission; confirmation, changing the interpretation, and evidence replay are local actions and consume no API requests.
- Tasks: baseline complete; evidence engine pending; claim workflow pending; UI pending; verification pending.

- Evidence engine: complete. Observed missing-module RED, then four evidence tests GREEN.
- Claim workflow: complete. Observed missing-module RED; state, citation, answer and bilingual-context tests GREEN.
- HTTP integration: complete. New endpoints/workflow RED before integration, GREEN after. Expiry/reset checks included.
- UI: complete. Live browser replay-control failure reproduced and fixed. Confirmed claim and separate local/model decision trail remain visible.
- Native schemas: live Chinese clarification/assessment mismatch reproduced with safe local diagnostic; schema regression RED, then GREEN. Final live smoke passed both languages.
- Verification: 48 offline tests passed, all 18 baseline archive hashes match, secret scan passed, bounded six-call live smoke passed, desktop/mobile browser checks passed, independent review and follow-up found no blocking defects.
- Ruling: no numeric-only completion; learner values checked by code while reasoning remains a labeled model judgment. Transfer help causes assisted outcome; incomplete attempts remain insufficient.
- P0 core complete. P1 24-case evaluation and external eligibility/publication/deployment/submission are not completed or authorized by this implementation task.
