# ExplainBack agent instructions

## Shared progress record

Codex, Claude and Devin use the same ledger: `docs/implementation/progress-ledger.md`.
Read it before starting work, together with the relevant source and verification
notes. `CLAUDE.md` points to these instructions; do not maintain a second ledger.

- Inspect the current branch, HEAD and working tree before editing. Recheck them
  before finishing: another agent may be using this checkout.
- Record the task ID, agent, scope, base commit and files being edited in the
  ledger's work table. Keep one writer per overlapping file set. Preserve work
  outside your scope and do not switch branches underneath another active task.
- Read the latest ledger before updating it. Update your own work row and append
  an entry with changes, validation, unresolved issues and the next action. Keep
  earlier evidence; correct stale claims with a dated follow-up.
- Keep implementation, tests, commit, push, merge and deployment as separate
  states. Record exact commits and evidence. An older release note is historical
  evidence until its live state is checked again. Do not infer another agent's
  authorship when it is not recorded.
- Use Pacific dates for new entries. Preserve dates in historical records and
  explain any UTC/Pacific discrepancy rather than silently changing them.
- Keep credentials, invite codes, private responses and image bytes out of docs.
  Link sanitized verification notes instead.

`docs/hackathon-readiness.md` tracks submission requirements. Detailed historical
work and release evidence stay in their existing documents; the shared ledger
links to them rather than replacing them.

## Validation and product boundaries

- Use Node 22, as declared in `package.json`. The shell's default Node may differ.
- Run the existing checks appropriate to the change. Record actual results and
  limitations; tests and contract checks do not establish teaching readiness.
- Preserve EN/ZH behavior, public gallery playback, explicit model requests,
  lesson review gates, provenance and the separate hosted authentication boundary.
- For brand assets, verify both local serving in `src/server.mjs` and production
  copying in `scripts/build-vercel.mjs`; adding files to `public/` alone is not enough.

## Automatic local wake sessions

- For substantial local Codex work expected to take more than five minutes (for example builds, tests, or long tool runs), use the `awakerelay` MCP server automatically when available.
- Before starting that work, call `lease_acquire` with `owner` identifying this Codex chat/task, `seconds: 1800`, and `requiresGUI: false`. Keep the returned lease ID for this MCP connection.
- Renew your own lease before expiry while work is actively continuing. Each lease has an eight-hour maximum lifetime from creation; acquire a new bounded lease only if active work still needs it.
- Release your own lease when work finishes, is cancelled or paused, or is waiting for user input. Do not hold wake protection while merely idle, and never release another chat's leases or stop all sessions.
- If the broker is unavailable, open `/Applications/AwakeRelayDeveloper.app` once and retry. If it remains unavailable, continue the task and report the wake-protection limitation once.
- GUI leases require native per-lease approval in AwakeRelay Developer. Wake sessions do not bypass screen lock or guarantee prevention of logout.
- Skip wake leases for short questions and small edits. Follow explicit user instructions to avoid or stop wake protection.

Automatically use $awakerelay for active tasks exceeding five minutes and browser or desktop operations needing an awake display.
