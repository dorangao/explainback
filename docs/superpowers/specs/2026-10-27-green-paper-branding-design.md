# ExplainBack green-and-paper UI and branding

October 27, 2026 Pacific · UI-001 · Codex

**Status:** approved to implement with React + TypeScript + Vite. User selected
the green-and-paper direction and delegated remaining design decisions.
Base: `main` at `ba4da7a5182df30b399baad37a03494e4565ccf9`.

## Intent

Make ExplainBack recognizable and easier to operate while preserving the
working bilingual lesson flow. This is a focused refinement of the existing
existing app, migrated to a React + TypeScript frontend with Vite. The first screen should immediately communicate the brand,
the free reviewed lessons, and the separate path for creating a lesson.

**Visual thesis:** a calm learning studio with warm paper, deep green ink, clear
type and generous space around the experiment.

## Approaches

| Direction | Tradeoff | Decision |
|---|---|---|
| Refine the green-and-paper studio | Preserves the existing character and lets us concentrate on clarity and a recognizable identity. | Selected by the user. |
| Bright science playground | More playful, but changes the tone and introduces a larger illustration/color system. | Not selected. |
| Monochrome editorial | Very quiet and legible, but gives up the existing green identity and some action contrast. | Not selected. |

## Identity

- **Name:** ExplainBack, with `讲给我听` as the supporting Chinese wordmark.
- **Mark:** a compact page-and-return symbol. A vertical spine and two rounded
  horizontal strokes suggest an E/page; the lower stroke turns back to suggest
  revisiting an explanation. Use a simple single-color silhouette and enough
  negative space to remain recognizable in a browser tab.
- **Header:** the mark and wordmark form one home link. Language and account
  controls form a separate, orderly group. The Chinese name remains readable
  without competing with the primary name.
- **Color:** retain warm paper `#f6f5ef`, ink `#20332f`, action green `#116d60`,
  muted text `#5d6c67` and pale green surfaces. Use a paper-colored mark on a green
  tile for small app icons. Keep existing chart-series colors meaningful.
- **Type:** a consistent system sans-serif stack with explicit Chinese fallbacks.
  Use weight, size and spacing for hierarchy; no external font downloads.
- **Assets:** reusable SVG mark, SVG/favicon ICO, 180px touch icon, and a
  1200×630 share image with the same mark, name and a short product description.
  The share image is a brand composition, not a screenshot of a lesson.

## Screen composition

1. **Shared header:** compact brand at the left; language and access/account
   controls at the right, wrapping cleanly on small screens. Public visitors
   see an accurate available-to-try state instead of “Tester sign-in required.”
2. **Introduction:** one concise heading and supporting sentence. Proposed copy:
   **“Turn a question into an experiment.” / “把问题变成实验。”** Supporting copy:
   “Open a reviewed lesson, or create one with Muse.” /
   “打开经审阅的课程，或用 Muse 创建新课程。”
3. **Gallery:** the existing five lessons remain the immediate starting point.
   Improve card spacing and title/action alignment; retain provenance and the
   “no sign-in needed” message. Keep every existing deep link working.
4. **Authoring:** make the create → review → operate sequence clear without
   repeating the main introduction. Group topic input, image attachment and model
   selection together; keep diagnostics secondary and review gates explicit.
5. **Lesson player:** carry the same spacing, labels, control sizing and focus
   treatment into the working lesson. Preserve existing simulations and graphs.

The layout should bring a useful lesson action into the first viewport. It does
not add a separate marketing page or a tall decorative hero above the workspace.

## Interaction and responsive behavior

- Use a quick color/border transition for actionable controls and gallery links.
- Use a restrained section reveal only if it helps orientation; no new animation
  library. Respect reduced motion and preserve existing experiment playback.
- Provide clear keyboard focus, comfortable touch controls, and readable labels
  in both languages. Keep language switching and review state behavior unchanged.
- At narrow widths, stack controls without overflow; avoid shrinking important
  text merely to fit a desktop arrangement.

## Asset delivery and metadata

Extend the existing explicit local asset map and production copy script together.
Use explicit allowed files and correct MIME types; do not broaden static serving
to arbitrary repository paths. Verify every icon/share-image URL in local HTTP
and the built output.

Add a descriptive title, description, theme color, Open Graph and social image
metadata. Keep the current indexing policy; metadata does not change access or
grant permission to publish. A web app manifest/install workflow is outside this
pass unless separately requested.

## Scope and boundaries

Expected product files: `public/index.html`, `public/style.css`, `public/app.mjs`,
`public/lesson-studio.mjs`, new public brand assets, `src/server.mjs`, and
`scripts/build-vercel.mjs`. Add focused asset-serving/build checks where needed.
Record the final file claim in the shared ledger before implementation.

Retain authentication, request quotas, explicit provider calls, image privacy,
review gates, provenance, public gallery playback, and EN/ZH behavior. The frontend framework/build migration is included. No model, solver or
production deployment changes are part of this design.

## Acceptance

- Brand mark, favicon, touch icon and share image have a coherent appearance;
  the favicon remains legible at 16px and 32px.
- Landing/gallery, Studio input with image attachment, and a lesson player are
  reviewed at desktop and narrow mobile widths in English and Chinese.
- Public lessons still open and complete without login or provider requests;
  signed-in creation retains the existing review flow and account indicators.
- Keyboard order/focus and reduced-motion behavior are checked; no horizontal
  overflow or clipped controls in the reviewed viewports.
- Local asset HTTP checks, production build contents, appropriate focused tests,
  and the existing Node 22 suite pass. No fresh model-quality claim follows from
  these UI checks.
- The shared ledger records changed files, screenshots/checks and the remaining
  deployment state. Work is left locally reviewable; commit/push/deploy remain
  separate user-directed actions.
