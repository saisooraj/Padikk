# Padikk — Build Progress

> Read this file at the start of any new session on this project before doing anything else.
> It tracks what's built, what's left, and the decisions/gotchas a fresh session needs to know.
> Full original spec (design system, schema, page-by-page requirements) is in the first user
> message of the session that started this build — not duplicated here, only referenced.

## What Padikk is

A personal, single-user learning OS (Next.js 14 App Router) tracking a 12-month Senior AI
Software Engineer roadmap: daily tasks, DSA practice, projects, mock interviews, weekly reviews.
Think Notion + LeetCode tracker + Obsidian journal, purpose-built for one roadmap.

## Design pivot (mid-build)

Partway through, the user handed over a fully interactive design mockup (a "Claude design"
export) and asked to adopt it as the actual UI/UX, superseding the original design system from
the first session. Plan file: `~/.claude/plans/mellow-bouncing-pinwheel.md` (kept for reference).
This changed:

- **Color system**: hex vars → OKLCH tokens, themed via `[data-theme="dark"|"light"]` on
  `<html>` (a real toggle now, not a hardcoded `dark` class). Six phase colors
  (backend/ai/cloud/dsa/sysdesign/interview) + `--brand` all derive from the same two formulas
  (see `app/globals.css` header comment) — don't hand-pick new colors outside that formula.
- **Fonts**: dropped Space Grotesk. Just Inter (body + headings, weights up to 800) + JetBrains
  Mono (labels/stats/mono data).
- **Sidebar**: dropped the collapse-to-icon-rail feature and Lucide icons in favor of a
  fixed-width, grouped nav (Daily / Curriculum / Reflect / System) with dot indicators.
- Both themes are real, not a "dark-only, light stubbed" situation — verified both compile
  correctly (see verification note below).

## Overall build plan (21 steps from the original spec)

| # | Step | Status |
|---|------|--------|
| 1 | Scaffold Next.js 14 (TS, Tailwind, App Router) | ✅ Done |
| 2 | Install all dependencies | ✅ Done |
| 3 | `globals.css` — CSS vars, fonts | ✅ Done (rewritten for the design pivot, see above) |
| 4 | Prisma schema + initial migration | ✅ Done |
| 5 | Seed script (curriculum data) | ✅ Done |
| 6 | NextAuth config (`auth.ts`, API route) | ✅ Done (Credentials-only, see below — not Google) |
| 7 | Root layout + Sidebar + PageShell | ✅ Done (rebuilt for the design pivot) |
| 8 | `/dashboard` page | ✅ Wired to real Prisma queries (see below) |
| 9 | `/today` page + Pomodoro timer | ✅ Visual shell done, static data |
| 10 | `/roadmap` page | ✅ Visual shell done, static data |
| 11 | `/dsa` page (list/filter/detail; no `/dsa/[id]` route yet) | ✅ Wired to real Prisma queries (see below) |
| 12 | `/projects` Kanban board | ✅ Visual shell done, static data |
| 13 | `/notes` page (plain textarea view; no Tiptap yet) | ✅ Visual shell done, static data |
| 14 | `/stats` analytics page | ✅ Visual shell done, static data |
| 15 | `/interviews` log | ✅ Visual shell done, static data |
| 16 | `/review` weekly form | ✅ Visual shell done, static data |
| 17 | `/settings` | ✅ Visual shell done, static data |
| 18 | Wire all API routes (`app/api/**`) | ✅ All 10 pages wired to real Prisma queries |
| 19 | Loading states, error boundaries, empty states | ✅ Done — shared `loading.tsx`/`error.tsx`, empty states already done per-page |
| 20 | Responsive mobile layout per page | ✅ Audited all 10 pages; fixed 2 dense tables that didn't collapse |
| 21 | Dark mode polish, accessibility pass | ✅ Contrast-audited both themes, fixed focus/labels; 1 known gap flagged below |

**All 21 steps of the original build plan are now done.** No more static/client-state shells or
illustrative placeholder catalogs feeding any page's primary data (see "Static shell data sources"
below, fully superseded — kept for the historical philosophy notes, safe to delete in a cleanup
pass). This session moved off the earlier one-page-per-session-turn cadence — the user asked to
work through everything remaining in the plan (steps 18–21) in one continuous pass instead, still
with the same rigor (real-DB verification, one commit per page/phase).

**Border-contrast gap (flagged in step 21) — now fixed.** The accessibility pass found `--border`/
`--border-strong` failed WCAG 1.4.11's 3:1 non-text-contrast minimum against `--surface2` in both
themes (dark: 1.14–1.42:1, light: 1.22–1.64:1). Asked the user how to scope the fix: bump the
shared `--border` token globally (affects every border in the app — inputs, cards, dividers, table
rows) vs. a new input-only token that leaves the rest of the UI untouched. User chose the global
bump. Fix, in `app/globals.css`:
- Recomputed real contrast ratios via the actual OKLCH→linear-sRGB→relative-luminance math (not
  L%-eyeballing) to find the minimum-L threshold per theme, then added a safety margin above it
  rather than shipping values that sit right at the 3:1 line.
- Dark: `--border` 28%→55%L (3.44:1 vs `--surface2`), `--border-strong` 34%→62%L (4.59:1) — same
  hue (155) and chroma (0.009/0.01) as before, only L changed, so this stays inside the existing
  token formula rather than hand-picking new colors.
- Light: `--border` 89%→60%L (3.46:1 vs `--surface2`), `--border-strong` 80%→50%L (5.25:1).
- Also checked the new values against `--surface`/`--bg` (the other two backgrounds `--border`
  appears on) to confirm they don't look wrong there: 3.7–4.1:1 in both themes, still comfortably
  in range, not overshooting into a jarring high-contrast look.
- **`--border-strong` turned out to be dead code** — defined in `globals.css` but grepped 0 usages
  anywhere in `app/`/`components/`. Bumped it anyway to preserve the two-tier relationship (still
  more contrasty than `--border`) in case a future session wires it up, but this pass didn't add
  any new call sites for it.
- Two bare `border` (no explicit color) usages exist (`ProjectsClient.tsx`/`DsaClient.tsx` status
  buttons) — checked both: every branch of their ternary sets `borderColor` inline via `style`, so
  they never fall through to the `* { border-color: hsl(var(--border-hsl)) }` global default.
  `--border-hsl`/`--input` (the shadcn-mapped HSL tokens) were correctly left untouched.
- Verified `npm run build` stays green after the token change; no visual/browser check possible in
  this environment (same limitation as steps 19–21), so a real look at both themes is still worth a
  quick glance next time there's browser access.

**What's left is genuinely open-ended, not a checklist**: a real `/dsa/[id]` or `/interviews/[id]`
deep-linkable route if ever wanted, and swapping `DATABASE_URL` to a real cloud Postgres before any
real deployment. Neither is "step N still pending" — they're possible future asks, listed here so a
future session doesn't mistake this for unfinished plan work.

## Tiptap rich text for Notes (post-plan follow-up)

Closed the gap step 13 explicitly scoped out — Notes now has a real rich-text editor instead of a
plain textarea. `Note.content` was always typed `@db.Text // rich text JSON (Tiptap)` in the schema
(the comment was there from the very first migration), so this was completing an already-designed
data shape, not inventing one — and `@tiptap/react`/`@tiptap/starter-kit`/`@tiptap/pm` were already
in `package.json` as unused dependencies from the initial scaffold.

- `lib/tiptap-content.ts` — `emptyNoteDoc()`, `parseNoteContent(content)` (empty string → empty
  doc, otherwise `JSON.parse`), `noteContentToPlainText(content)` (walks the doc tree flattening
  text nodes, for the notes-list preview — previews must never show raw JSON), and
  `isValidNoteContent(content)` (API-boundary check: empty string is valid, otherwise must parse to
  `{ type: "doc", ... }`).
- `components/ui/rich-text-editor.tsx` — new generic primitive (alongside `chip.tsx`/`switch.tsx`
  etc.), not Notes-specific. **Deliberately uncontrolled**: takes `initialContent` (seeds `useEditor`
  once) and an `onChange` fired only on real user edits via `onUpdate`; the caller remounts it via
  `key` (`selected.id` for the detail panel, a static key for the add-form) when switching documents,
  rather than a sync-effect that diffs JSON on every render — simpler and avoids a class of "is this
  edit intentional or just React re-rendering" bugs. Toolbar is plain text labels (B/I/S/H2/H3/•
  List/1. List/❝❞/`</>`) matching the app's established no-icon-library convention from the design
  pivot, with `aria-pressed` reflecting `editor.isActive(...)` per button.
- `app/globals.css` — added `.tiptap` content styles (headings/lists/blockquote/code/pre) using only
  existing `var(--x)` tokens, no new colors; `--font-jetbrains-mono` for inline code, matching the
  rest of the app's mono usage for data/labels.
- `app/(app)/notes/NotesClient.tsx` — both the add-form and the detail-panel textareas are now
  `RichTextEditor`. `contentDraft`/`addContent` stay `string` (the same JSON-string shape the DB
  already returns) — only the editor boundary converts to/from `JSONContent`, so the existing
  `JSON.stringify`-comparison dirty-gate on `contentDraft !== selected.content` needed no changes.
  The notes-list preview now calls `noteContentToPlainText(note.content)` instead of rendering
  `note.content` directly (which would otherwise dump raw JSON into the card).
- **New validation on both `POST /api/notes` and `PATCH /api/notes/[id]`**: `content`, if provided,
  must satisfy `isValidNoteContent` (400 if not) — this is the actual system boundary (an API route
  accepting arbitrary request bodies), unlike `NotesClient` itself which always sends well-formed
  JSON it just produced, so no parse-fallback was added inside the client or `noteContentToPlainText`
  — trusting the API-enforced invariant rather than defending against a state that can't reach it.
- **Verified end-to-end against the real DB** (confirmed `Note` was genuinely empty, 0 rows, before
  starting — same table other sessions test against): unauthenticated signed in via a real
  credentials POST to confirm the flow end-to-end; confirmed non-JSON and JSON-but-not-a-doc
  `content` bodies 400 on both `POST` and `PATCH`; created a real note with a valid Tiptap doc
  (paragraph text) and confirmed `/notes`'s rendered HTML shows the plain-text preview with **no**
  raw JSON leaking through; `PATCH`ed in a heading + nested bullet-list/list-item/paragraph structure
  and confirmed the flattened preview text updated correctly across all three nesting levels; deleted
  the test note and confirmed the table returned to the "No notes yet" empty state, 0 rows.
- `npm run build`/`tsc --noEmit` both clean; `/notes`'s First Load JS grew from ~4kB to ~127kB
  (Tiptap's real cost) — expected, not a regression to chase down.
- **No browser available in this environment** (same limitation as steps 19–21) — contenteditable
  behavior, cursor stability across re-renders, and the toolbar's actual click-to-format UX were not
  visually exercised, only verified via the rendered HTML/API responses above. Worth a real
  browser pass (type a mix of formatting, switch between notes, reload) next time there's browser
  access.

## Accessibility pass (step 21)

Contrast-audited both themes' actual OKLCH token values (not just eyeballing render output) and
fixed the accessible-name/keyboard-focus gaps a code-level audit could find with no
browser/screen-reader access in this environment:

- **Contrast audit**: converted every relevant `--text`/`--muted`/`--brand`/`--danger` OKLCH token
  to sRGB and computed real WCAG contrast ratios (not L%-value eyeballing) against the backgrounds
  they're actually used on, in both themes. Every text pairing checked passes WCAG AA comfortably
  (4.97:1–17.45:1 across text/muted/brand-text against bg/surface/surface2 in both themes — well
  above the 4.5:1 text minimum). The one real finding — input border contrast — is flagged above,
  not fixed, since it's a global token change outside this pass's scope.
- **Keyboard focus**: found 3 inputs in `NotesClient.tsx` (title, tags, content) with `outline-none`
  and **zero** replacement focus style — a real WCAG 2.4.7 violation, tabbing to them left no visible
  indicator at all. Added `focus-visible:ring-2 focus-visible:ring-[var(--brand)]` to all three.
  Every other interactive element in the app is a raw `<button>`/`<input>` (the app never actually
  uses the `components/ui/button.tsx` shadcn primitive — grepped, 0 usages in `app/(app)/**`) and
  none of the other ~45 buttons set `outline-none`, so they already keep the browser's default
  focus-visible outline — unstyled/not brand-matched, but not actually broken. Left those alone;
  restyling 45 buttons application-wide is a design-system change, not a pass-scope fix.
- **Accessible names**: added `aria-label` to the DSA/Notes search inputs and DSA's three filter
  `<select>`s (placeholder-as-name is spec-valid but disappears once text is typed, and bare filter
  selects had no persistent name describing what they filter). Added `role="group"` +
  `aria-label`/`aria-pressed` to the 1–5 button-row selectors (Interviews' `ScoreRow` for
  difficulty/performance, Review's rating row) — previously just a visually-adjacent `<div>` label
  with no programmatic association to the button group. Settings' inputs already got real
  `<label htmlFor>` elements in the Settings wiring commit earlier this session — nothing further
  needed there.
- **Already correct, checked not touched**: semantic landmarks (`<aside>`/`<main>`/`<nav>` in
  `PageShell`), the theme-toggle `Switch` already had `aria-label="Toggle theme"`, no icon-only
  buttons anywhere except `MobileNav` (which pairs every icon with visible text), Radix-based
  `Switch`/dropdown primitives handle their own `aria-checked`/keyboard behavior.
- **Dark mode**: both themes were already verified rendering correctly in the design-pivot session;
  nothing in this session's changes introduced a hardcoded color outside the `var(--x)` token system
  (grepped for stray hex/rgb in every file touched this session — none found), so no re-verification
  needed beyond confirming the build stayed green.
- **Limitation, same as step 19**: no headless browser available in this environment (confirmed no
  Playwright/Puppeteer) — verified via `curl` that the new `aria-label`/`role` attributes render in
  the served HTML, and via computed contrast math, but couldn't run a real screen reader or visually
  confirm focus rings. If a future session has browser/device access, a real screen-reader pass
  (VoiceOver/NVDA) would catch anything a code-level audit can't.

## Responsive mobile audit (step 20)

**No browser/device access in this environment** (confirmed: no Playwright/Puppeteer installed,
just curl) — this was a code-level audit (grep every `grid-cols`/fixed-width usage across all 10
pages, read the shell components, reason about breakpoints) plus structural verification via curl
that the right classes land in the rendered HTML at each breakpoint, not a visual/device check. Flag
this to the user if they want a real visual pass on an actual phone.

- **The app shell was already solid, no changes needed**: `Sidebar` is `hidden md:flex` (desktop
  only), `TopBar` + `MobileNav` are `md:hidden` (mobile only, bottom tab bar with all 10 routes,
  horizontally scrollable via `overflow-x-auto` if the viewport is too narrow for all 10 at once —
  that's a contained scroll within the nav bar, not a page-level overflow bug), `PageShell`'s
  `<main>` has `pb-24` on mobile specifically to clear the fixed bottom nav. Every top-level page
  layout split (`grid-cols-1 lg:grid-cols-[...]`) was already mobile-first responsive across all 10
  pages, going back to the very first design-pivot session — this wasn't new work, just confirmed by
  grepping every `grid-cols` usage in `app/(app)/**`.
- **Found and fixed two real gaps**: DSA's problem table (`grid-cols-[2.2fr_1.3fr_0.8fr_1fr_0.7fr_
  0.8fr_1fr]`, 7 columns) and Interviews' table (`grid-cols-[0.9fr_1fr_1.3fr_1.2fr_0.8fr_0.8fr]`, 6
  columns) had **no** responsive variant at all — same 6–7 columns always, which would render
  unreadably cramped on a phone (each column a few px wide) even though nothing would technically
  overflow (all `fr` units, not fixed px). Fixed both with a narrower mobile `grid-cols-[...]`
  (DSA: Problem/Diff./Status — the 3 most load-bearing at a glance; Interviews: Date/Platform/Score)
  plus `hidden sm:block` on the now-mobile-hidden header/cell `div`s for the remaining columns
  (Pattern/Att./Time/Next review for DSA; Type/Company/Difficulty for Interviews), switching to the
  full column set at `sm:` (640px) and up. `display:none` correctly removes a grid item from the
  track flow, so the fewer visible cells auto-place into the narrower mobile template without empty
  gaps — verified this renders correctly via curl (grepped the served HTML for the right count of
  `hidden sm:block` cells per row).
- Everything else checked and found already correct: Projects' Kanban (`grid-cols-1 sm:grid-cols-2
  lg:grid-cols-4`), Stats' heatmap (`repeat(20,minmax(0,1fr))` — deliberately dense at every width,
  same pattern as GitHub's contribution graph, not a bug), Dashboard's momentum row (`flex`+
  `flex-1`, not a fixed grid, shrinks naturally), all filter/add-form rows across DSA/Notes/
  Interviews (`flex flex-wrap`, wrap to new lines rather than overflow).

## Loading states & error boundaries (step 19)

Shared across all 10 `(app)` pages rather than one `loading.tsx`/`error.tsx` per route — Next's App
Router convention is that the nearest boundary up the tree applies to every page below it that
doesn't define its own, so one pair at `app/(app)/` covers all 10 without near-duplicate files:

- `app/(app)/loading.tsx` — generic pulsing skeleton (stat-tile row + two large blocks), renders
  inside `PageShell`'s `<main>` (Sidebar/TopBar stay visible, only the content area shows the
  skeleton) since `loading.tsx` nests inside the segment's own `layout.tsx`, not above it.
- `app/(app)/error.tsx` — client component error boundary (required by Next — must be `"use client"`
  with `{ error, reset }` props), same "Sidebar/TopBar stay mounted" placement. "Try again" calls
  `reset()`; "Back to dashboard" is a plain link out.
- `app/error.tsx` — root-level fallback for anything error.tsx-uncovered above the `(app)` group
  (e.g. `/signin`, the `/` redirect page). Cannot rely on `PageShell`/Sidebar (may not have mounted),
  so it's a standalone centered message instead.
- Deliberately did **not** catch errors thrown inside `app/(app)/layout.tsx` itself (`PageShell`) —
  Next's rule is an `error.tsx` can't catch errors from its own parent layout in the same segment;
  only `app/error.tsx` above it can. Not worth restructuring `PageShell` to avoid this for an app
  this size.
- **Verified real behavior, not just that the files exist**: temporarily added a 2.5s delay to
  `getDashboardData` and confirmed via `curl -N` that the streamed response actually contains the
  `loading.tsx` skeleton markup (`animate-pulse` blocks) before the real content — Next's streaming
  SSR sends the fallback first, then swaps it client-side, so this is visible in the raw HTTP
  response even without a browser. Temporarily made `getSettingsData` throw and confirmed
  `app/(app)/error.js` is registered for that route and the thrown error's message/digest/stack
  correctly stream through the RSC payload for the client error boundary to pick up — **couldn't
  visually confirm the final rendered "Something went wrong." UI itself**, since that only renders
  after client-side hydration executes the error boundary's fallback, and no headless browser is
  available in this environment (checked: no Playwright/Puppeteer installed). Both temporary
  changes were fully reverted (`git diff` confirmed clean) before moving on. If a future session
  has real browser access, worth a quick visual sanity check of both.

## Settings wiring (step 18, tenth and final page)

Simplest wiring pass of step 18 — `UserSettings` is a 1-row-per-user resource already lazily
created by `getOrCreateUserSettings` (from the Dashboard session), so this page only needed to read
and PATCH that one row, no create/delete:

- `lib/queries/settings.ts` — `getSettingsData(userId)`: thin wrapper reusing
  `getOrCreateUserSettings` from `lib/queries/dashboard.ts` rather than duplicating the upsert
  logic.
- **New API route**, `PATCH /api/settings` (no `[id]` segment — `UserSettings` is keyed by `userId`
  directly, a singleton per user, unlike DSA/Notes/Interviews' id-addressed resources). Validates
  `currentMonth` (1–12), `dailyGoalMinutes` (30–180), non-empty `timezone`, `startDate` parses to a
  valid date; all fields are independently optional (flat patch, only provided keys are written).
  Uses `prisma.userSettings.upsert` (not a plain `update`) for defensive robustness even though the
  row should always already exist by the time Settings loads.
- `app/(app)/settings/SettingsClient.tsx` — same three-section layout as the old static shell
  (Account/Roadmap-config/Preferences), now dirty-gated like Notes/Interviews (`JSON.stringify`
  comparison against the loaded values) before enabling Save. Added `<label htmlFor>` on every
  input (the old shell only had placeholder-less bare inputs with no associated label) — a small
  head start on the step 21 accessibility pass, not a scope change.
  `reminderTime` is only sent (and only rendered as an input) when `reminderEnabled` is true; saving
  with the toggle off sends `reminderTime: null` explicitly rather than leaving a stale time behind.
- The Account card (session email/name + sign out) is untouched — it was already using real
  `next-auth/react` session data, no Prisma involved.
- **Verified end-to-end against the real DB**: read the pre-existing real `UserSettings` row first
  (`dailyGoalMinutes: 90, currentMonth: 1, timezone: Asia/Kolkata, reminderEnabled: false` — genuine
  values from prior real usage, not test data) and confirmed the form loaded them exactly with Save
  correctly disabled (not dirty); confirmed unauthenticated `/settings` 302s and `PATCH` 401s;
  confirmed out-of-range `currentMonth`/`dailyGoalMinutes` 400s; PATCHed real changes (month 2, 120
  min goal, new timezone, reminder on at 08:30) and confirmed the same row `id` was updated in place
  (not duplicated) and the page re-rendered every changed field correctly; PATCHed the exact original
  values back and confirmed the DB row is byte-for-byte what it was before this session touched it.

## Review wiring (step 18, ninth page)

Read-mostly with one write path (submit/update this week's review) — `WeeklyReview` has no unique
constraint on `(userId, weekStart)` in the schema, so the route does its own findFirst-then-update-
or-create instead of a DB-level upsert:

- `lib/queries/review.ts` — `getReviewData(userId)`: all `WeeklyReview` rows (`orderBy: weekStart
  desc`) plus the current week's `autoTotalMinutes` (summed from `DailyLog.totalTime` in-range),
  `autoDsaSolved` (count of `DSAProblem` with `solvedAt` in-range), `existingReview` (this week's
  row if already submitted, else `null`), and `showBanner` (`isSunday(today) && !existingReview`).
- **Week range reuses the old static shell's exact date-fns defaults** (`startOfWeek`/`endOfWeek`
  with the default `weekStartsOn: 0`, i.e. Sun–Sat) rather than reinterpreting what "this week"
  should mean relative to the Sunday prompt — worth flagging as a judgment call, not a fix: with a
  Sunday-start week, "today is Sunday" lands on the *first* day of the week being reviewed, not the
  last, so the auto-computed totals will be near-zero right when the banner fires. Not redesigning
  this during a wiring pass (matches the "keep the old shell's logic, back it with real data"
  precedent from every prior page) — flag for the user if they notice the auto-fill looking sparse
  on Sundays specifically.
- `date`-column boundaries use `dateOnly()` for `weekStart`/`weekEnd` (both `@db.Date`) and an
  **exclusive** upper bound (`weekStart + 7 days`) for the `solvedAt` (`DateTime`, has real
  time-of-day) range query — an inclusive `lte: weekEnd` would silently drop any problem solved
  after midnight on the week's last day. Verified this matters: didn't hit it in testing since the
  test insert used `NOW()`, but the exclusive-bound form is correct regardless of time-of-day.
- **New API route**, `POST /api/review` (no `PATCH`/`DELETE` — this is a submit-or-resubmit-this-
  week form, not an editable list like Notes): validates `totalMinutes`/`dsaSolved` as non-negative
  integers and `rating` as 1–5, computes `weekStart`/`weekEnd` server-side (never trusts a
  client-supplied week), then `findFirst({ userId, weekStart })` → `update` if found else `create`.
  Resubmitting the same week updates the existing row in place rather than duplicating it.
- `app/(app)/review/ReviewClient.tsx` — same two-column retro-form/history layout as the old static
  shell. Form defaults to `existingReview`'s saved values if this week was already submitted,
  otherwise to the auto-computed totals (both still freely editable) — title changes to "This
  week's retro (submitted — edit below)" when a review already exists. Banner renders above the
  form when `data.showBanner` is true. History list renders `data.reviews` directly (real `Date`
  fields via date-fns `format`, no manual casting, same as every other wired page).
- `lib/weekly-review-data.ts`'s `WEEKLY_REVIEWS`/`WeeklyReviewEntry` are now fully dead code (Review
  was their only caller) — left in place, same treatment as other superseded placeholder exports.
- **Verified end-to-end against the real DB**: confirmed `WeeklyReview` was genuinely empty (0 rows)
  before starting; confirmed unauthenticated `/review` 302s and `POST` 401s; confirmed an
  out-of-range `rating` 400s; submitted a real review and confirmed `weekStart` landed as the
  correct calendar day (`2026-07-19`, no IST off-by-one); confirmed the page re-rendered with the
  "submitted — edit below" copy and the saved values prefilled; resubmitted the same week with
  different values and confirmed the row count stayed at 1 (same `id`, fields updated, not
  duplicated); inserted a real `DailyLog` (120 min) and a real solved `DSAProblem` for this week
  directly in Postgres, deleted the just-created `WeeklyReview` row, and confirmed the auto-computed
  defaults (2.0h / 1 solved) appeared correctly with the banner still correctly absent (today isn't
  Sunday); cleaned up all test rows, leaving the one genuine pre-existing `DailyLog` row (from real
  browser use on 2026-07-17, outside this week's range) untouched.

## Interviews wiring (step 18, eighth page)

Followed the DSA/Projects/Notes pattern — `MockInterview` is user-created with no seed data, full
CRUD, no separate `/interviews/[id]` route (inline detail/edit panel instead, same "no drawer
component in this codebase" reasoning as DSA/Projects):

- `lib/queries/interviews.ts` — `getInterviewsData(userId)`: all of this user's `MockInterview`
  rows, `orderBy: date desc`.
- **New API routes**, both under `auth()` guard:
  - `POST /api/interviews` — creates an interview (`date`/`platform`/`type`/`difficulty`/
    `performance` required; `type` validated against `INTERVIEW_TYPE_LABEL`'s keys from
    `lib/interviews-data.ts`, difficulty/performance validated as integers 1–5; `company`/`topics`/
    `feedback`/`improvements` optional). Returns `{ interview }`.
  - `PATCH /api/interviews/[id]` — flat field patch (same shape as Notes/Projects, not DSA's
    action-based one — no state-machine transitions here, every field is independently editable).
    Ownership check (`findFirst({ id, userId })`, 404 if missing) before any write.
  - `DELETE /api/interviews/[id]` — same ownership check, then deletes.
- `app/(app)/interviews/InterviewsClient.tsx` — same table layout as the old static shell, plus: an
  inline "+ Log interview" form and an inline detail/edit panel (opened by clicking a row) with the
  same field set, both using a small local `ScoreRow` component (1–5 button row) for
  difficulty/performance — mirrors the exact 1–5 button pattern the (still-unwired, at the time)
  `/review` page's rating selector already used, not a new star-rating widget (none exists in this
  codebase). Detail panel is dirty-gated (`JSON.stringify` comparison against the row's current
  values, same technique Notes uses) before enabling Save.
- `platform` is a free-text DB column (not an enum) but the UI offers it as a `<select>` seeded with
  the 4 spec values (Pramp / interviewing.io / Peer / Self) for both add and edit — matches the
  spec's form field list without adding an enum to the schema.
- `lib/interviews-data.ts`'s `INTERVIEWS` array/`InterviewEntry` type are now dead code (Interviews
  was their last caller) — left in place, same treatment as other superseded placeholder exports.
  `INTERVIEW_TYPE_LABEL`/`InterviewType` are still used post-wiring (real enum/label source).
- **Verified end-to-end against the real DB**: confirmed `MockInterview` was genuinely empty (0
  rows) before starting; confirmed unauthenticated `POST`/`PATCH`/`DELETE` all 401 (and a trailing-
  slash `DELETE` with no id 308-redirects to the collection route rather than 404ing — not a bug,
  just Next's route-matching, worth remembering if a future curl test omits the id); confirmed
  missing-field and invalid-`type`/out-of-range-score `POST`/`PATCH` bodies 400; created a real
  interview via `POST` and confirmed it rendered on `/interviews`; `PATCH`ed `performance`/
  `feedback` and confirmed the edit rendered; confirmed a nonexistent id 404s on both `PATCH` and
  `DELETE`; deleted the interview and confirmed the table returned to the "No mock interviews
  logged yet" empty state with 0 rows.

## Stats wiring (step 18, seventh page)

Read-only analytics page — no new API routes needed (matches Roadmap's read-only pattern), but
first page whose numbers are **derived/aggregated** from several other models rather than a
near-direct passthrough of one:

- `lib/queries/stats.ts` — `getStatsData(userId)`, four parallel queries (`TaskCompletion` joined
  with `task.type`, `DailyLog`, `DSAProblem`, `MockInterview`) reduced into: `statTiles`
  (totalHours/dsaSolved/dsaTotal/interviewCount/avgSessionMinutes), a 20-week×7-day `heatmap`
  (0–4 intensity levels bucketed from each day's `DailyLog.totalTime`, defaulting to 0 for days
  with no log), `hoursByType` (minutes summed per `TaskType` from `TaskCompletion.timeSpent`, not
  from `DailyLog` — a "session" and a "completed task" are different units, kept distinct rather
  than conflated), `difficultyDistribution` (solved = `SOLVED` or `OWNED`, same definition DSA's
  `patternMastery` uses), and `interviewTrend` (all `MockInterview` rows ordered oldest→newest for
  the bar chart, real `Date` objects passed straight through like other pages).
- **"Total hours logged" and "Hours by task type" are now internally consistent by construction**
  (total = sum of the per-type minutes, both computed from the same `TaskCompletion` query) —
  unlike the old placeholder catalog where `HOURS_BY_TYPE` and `INTERVIEWS.length` etc. were
  independent hardcoded numbers with no relationship to each other.
- **"Avg. session length" is average `DailyLog.totalTime` across all logged days** (a "session" =
  one day's logged time via the Daily Log form), not average `TaskCompletion.timeSpent` — different
  concept from "hours by type," intentionally not reused.
- Added `formatMinutes()` to `lib/parse-duration.ts` (companion to the existing
  `parseDurationToMinutes`) — turns whole minutes back into `"1h 45m"`/`"1h"`/`"45m"`/`"0m"` for the
  avg-session tile. Reusable for `/review`'s `totalMinutes` field when that page gets wired.
- Heatmap bucketing thresholds (0 / <30 / <60 / <120 / ≥120 minutes → levels 0–4) are a judgment
  call, not derived from anywhere in the spec — revisit if they read wrong once there's real
  multi-week data to look at.
- `app/(app)/stats/page.tsx` — Server Component, same `auth()` → redirect → fetch → pass `data`
  prop shape as every other wired page; `app/(app)/stats/StatsClient.tsx` is the new client
  component (old logic lived directly in `page.tsx` as a `"use client"` page, which the
  Server/Client split doesn't allow anymore).
- `HEATMAP_LEVEL_OPACITY` is still imported from `lib/stats-data.ts` (a real presentation constant,
  not fabricated data — same "still used post-wiring" treatment as `DSA_PATTERNS`/`PATTERN_LABEL`
  in `lib/dsa-data.ts`). `buildHeatmapWeeks`/`hoursByTypeRows`/`HOURS_BY_TYPE` in that file and
  `DSA_PROBLEMS`/`difficultyDistribution()` in `lib/dsa-data.ts` are now fully dead code (Stats was
  their last caller) — left in place rather than deleted, same reasoning as `notes-data.ts`'s
  `NOTES`: cheap to leave, `lib/interviews-data.ts`'s `INTERVIEWS` is still genuinely used by the
  unwired `/interviews` page so that file wasn't touched.
- **Verified end-to-end against the real DB**: confirmed the pre-existing real `TaskCompletion` row
  (60 min, `LEARN`) was the only non-zero input and `/stats` rendered "1h" total, a 100%-width
  Learn bar with all others at 0%, "0/0" DSA solved, "0" interviews, "0m" avg session, and the "No
  mock interviews logged yet" empty state; inserted a real `DailyLog` row (90 min, today) directly
  in Postgres and confirmed avg session length recalculated to "1h 30m" and today's heatmap cell
  (last of 140) jumped from opacity 0.15 (level 0) to opacity 0.8 (level 3, since 60 ≤ 90 < 120);
  deleted that test row and confirmed `/stats` returned to the exact original zero-state; confirmed
  unauthenticated `/stats` still redirects (302) via middleware.

## Notes wiring (step 18, sixth page)

Followed the DSA/Projects pattern — `Note` is user-created with no seed data, so this needed full
CRUD, not just read-mostly queries:

- `lib/queries/notes.ts` — `getNotesData(userId)`: all of this user's `Note` rows, `orderBy:
  updatedAt desc`. No server-side pin-sort (unlike DSA's server-computed stats) — pinned-first
  ordering is cheap client-side and matches what the old static shell did, so `NotesClient` re-sorts
  the same way after fetch.
- **New API routes**, both under `auth()` guard, same shape as DSA/Projects:
  - `POST /api/notes` — creates a note (`title` required and trimmed; `content` defaults to `""`,
    `tags` defaults to `[]`, `monthRef` optional). Returns `{ note }`.
  - `PATCH /api/notes/[id]` — flat field patch (title/content/tags/monthRef/pinned), same shape as
    Projects' route rather than DSA's action-based one — Notes has no state-machine-like transitions
    to model, just independent editable fields. Ownership check (`findFirst({ id, userId })`, 404 if
    missing) before any write; empty/whitespace-only `title` 400s.
  - `DELETE /api/notes/[id]` — same ownership check, then deletes.
- `app/(app)/notes/NotesClient.tsx` — same two-column search-list/detail layout as the old static
  shell, now with: an inline "+ New" note form in the list panel, an editable title/content/tags/
  month-ref (via `MONTHS` from `lib/curriculum-data.ts`) form directly in the detail panel (no
  separate view/edit mode — matches the "plain textarea view" scope from step 13, no Tiptap), a
  Pin/Unpin button that PATCHes immediately (no dirty-state gate, unlike the other fields), and a
  Save button gated on `isDirty` for the rest. Delete button in the detail header, `confirm()`
  before calling `DELETE`, same UX as DSA's delete.
- **Real `Date` props pass through the Server→Client boundary fine** — `formatDistanceToNow(note
  .updatedAt, ...)` works directly on the Prisma-returned `Date` without a manual `new Date()` cast
  or a server-computed offset, same as Projects' `format(selected.startedAt, "MMM d")`. Don't
  over-engineer date handling for new pages; only reach for a server-computed day-offset (like DSA's
  `reviewInDays`) when the UI needs relative-day math, not just a formatted string.
- **Verified end-to-end against the real DB**: confirmed `Note` was genuinely empty (0 rows) before
  starting; confirmed unauthenticated `POST`/`PATCH`/`DELETE` all 401; confirmed `POST` without a
  title 400s; created a real note via `POST` and confirmed it rendered on `/notes`; PATCHed `pinned`,
  then PATCHed title/content/tags/monthRef together and confirmed the edited title rendered on
  `/notes`; confirmed a whitespace-only title PATCH 400s and a nonexistent id 404s on both `PATCH`
  and `DELETE`; deleted the note and confirmed the table returned to 0 rows; confirmed the
  pre-existing real `TaskCompletion` row (from actual browser use, not test data) and the `User` row
  were untouched throughout.
- **Hit the known `SEED_USER_PASSWORD` DB-hash-drift gotcha again** (see the Today wiring entry
  below) — sign-in via curl failed with `CredentialsSignin` even though `.env`/`.env.local` agreed on
  the password, meaning the DB's hash predated the current env value. **Did not run `npx prisma db
  seed`** this time because a genuine `TaskCompletion` row already existed (real progress from the
  user actively using the app in-browser during this session) and the seed script's `main()`
  unconditionally `deleteMany`s `DailyTask` before recreating it, which FK-violates against any
  existing `TaskCompletion` and would have forced deleting real user data to unblock a reseed.
  Fixed narrowly instead: temporarily wrote `prisma/_reset-pw.ts` (deleted immediately after running)
  that calls the same upsert `seedUser()` does in isolation — bcrypt-hashes `SEED_USER_PASSWORD` and
  upserts only the `User` row's `hashedPassword`/`name`, touching nothing else. **If sign-in fails
  with `CredentialsSignin` again and any per-user table already has real rows, use this narrow
  password-only fix, not a full reseed** — a full reseed is only safe when every user-generated table
  is confirmed empty first (as it was in the Today session).

## Projects wiring (step 18, fifth page)

**Deviated from the plan noted in the previous session's entry** (which said this page would need
"the same `UserSettings.currentMonth`-derived status Roadmap established," i.e. a read-only
status like Roadmap's month cards). That's wrong once you look at the schema: there's a whole
unused `Project` model (`userId`, `monthNumber`, `status: ProjectStatus`, `githubUrl`, `liveUrl`,
`techStack`, `notes`, `startedAt`, `completedAt`) sitting alongside the seeded `MonthProject` —
clearly built for real per-user editing (status toggle, links, notes), matching the original
spec's "Edit Project Drawer" section exactly, and `lib/status-colors.ts` already had
`projectStatusColor`/`projectStatusLabel` for its 4-value enum despite nothing using them yet. Used
that model instead of a derived-status approach:

- `lib/queries/projects.ts` — `getOrCreateProjects(userId)`: lazily creates one `Project` row per
  user per month (12 total) from the seeded `MonthProject` catalog the first time they're missing —
  same lazy-upsert idea as `UserSettings`/`Streak`, just 12 rows via `createMany` instead of one
  via `upsert`. `name`/`description`/`techStack` start as a copy of the curriculum `MonthProject`
  but are independently editable per user from there on (status defaults `NOT_STARTED`, matching
  the schema default — a fresh account has genuinely started nothing, no fabricated progress).
  Returns each `Project` row joined with `monthTitle` and `phase` (for the phase-color chip).
- **New API route**, `PATCH /api/projects/[id]` (no `POST`/`DELETE` — these 12 rows are
  system-seeded per user, not user-created, so there's nothing to add or remove, only edit; matches
  the original spec's route list). `auth()` guard → ownership check (`findFirst({ id, userId })`,
  404 if missing) → validates `status` against the 4-value enum before writing. Auto-stamps
  `startedAt`/`completedAt` on status transition into `IN_PROGRESS`/`COMPLETED`/`DEPLOYED`, same
  "auto unless already set" pattern as DSA's `solvedAt` — never clobbers a value once set, so this
  doesn't fight a future manual date-picker if one gets added. `githubUrl`/`liveUrl`/`techStack`/
  `notes` are flat field updates.
- `app/(app)/projects/ProjectsClient.tsx` — same 4-column Kanban the old static shell had, now
  grouped by real `Project.status` instead of a `CURRENT_MONTH`-derived one. Selecting a card opens
  an inline detail panel (right column, same pattern as DSA's problem detail — no drawer component
  exists in this codebase, don't reach for one) with status buttons and an editable
  githubUrl/liveUrl/techStack(comma-separated)/notes form, saved via one PATCH on "Save details".
  No manual start/complete date pickers were built (spec mentions them) — the auto-stamp above
  covers the same need with less UI; revisit only if the user specifically asks to backdate a
  project.
- **Verified end-to-end against the real DB**: confirmed `Project` was genuinely empty (0 rows) for
  the seed user before starting; hit `/projects` and confirmed all 12 rows were lazily created with
  correct `name`/`techStack` counts matching the seeded `MonthProject`s and `status = NOT_STARTED`;
  confirmed unauthenticated `PATCH` 401s, an invalid `status` 400s, and a nonexistent id 404s;
  PATCHed a real transition to `IN_PROGRESS` with `githubUrl`/`liveUrl`/`techStack`/`notes` and
  confirmed `startedAt` auto-set plus all fields persisted; reloaded `/projects` and confirmed the
  card moved to the "In progress" column and rendered the GitHub/Live badges; deleted all 12 test
  rows and reloaded once more to confirm they regenerate cleanly at `NOT_STARTED` with no leftover
  test data, restoring genuine zero-state.

## DSA wiring (step 18, fourth page)

First page with genuinely empty seed data — `DSAProblem` is user-created, so this was also the
first page needing real **write** capability (create/update/delete), not just read-mostly queries
like Dashboard/Today/Roadmap. Kept the existing shell's list/filter/inline-detail UI (no separate
`/dsa/[id]` route — that was never built even in the static-shell pass, so wiring didn't add it
either) but backed it with real mutations:

- `lib/queries/dsa.ts` — `getDsaData(userId)`: all of this user's `DSAProblem` rows, plus
  server-computed `stats` (owned/solved/needsReview/total), `patternMastery` (per-pattern
  solved/total, only patterns with ≥1 problem), and `dueForReview` (reviewAt ≤ today AND status is
  NEEDS_REVIEW or SOLVED) — same shape the static shell derived client-side from `DSA_PROBLEMS`,
  now derived server-side from the DB. `reviewInDays` (days from today, negative = overdue) is
  computed here via `differenceInCalendarDays` rather than stored.
- **New API routes**, both under `auth()` guard:
  - `POST /api/dsa` — creates a problem (`title`/`difficulty`/`pattern` required, validated against
    `DSA_PATTERNS` and the difficulty enum before hitting Prisma; `leetcodeUrl`/`notes`/
    `monthTarget` optional). Returns `{ problem }`.
  - `PATCH /api/dsa/[id]` — action-based, not a flat field patch: `{ action: "setStatus", status }`,
    `{ action: "reviewDone" }`, `{ action: "markOwned" }`, `{ action: "markNeedsReview" }`, or
    `{ action: "updateFields", notes?/leetcodeUrl?/tags?/monthTarget?/timeSpent? }`. Every branch
    re-fetches the problem scoped to `{ id, userId }` first and 404s if it doesn't belong to the
    signed-in user, before applying any mutation.
  - `DELETE /api/dsa/[id]` — same ownership check, then deletes.
- **Spaced-repetition logic, simplified from the original spec** (the spec's wording was internally
  inconsistent — "Mark as Owned" sets `reviewAt` to +7d in one section, but the review-ladder
  section says the 3rd review clears `reviewAt` to null *because* the problem is now fully owned,
  which is a contradiction if both fire on the same status). Resolved as: `setStatus → SOLVED` on a
  problem that's never been solved sets `solvedAt = now` and schedules the first review at +3 days.
  From there, each `reviewDone` click (used for both the inline detail panel and the "Due for
  review" sidebar) advances a ladder tracked via `attempts` (the spec explicitly says to track
  review count through this field, despite `attempts` semantically doubling as "solve attempts"
  elsewhere — an existing ambiguity in the spec, not introduced here): 1st → `reviewAt` = +7d, 2nd →
  +14d, 3rd → `reviewAt = null` and `status = OWNED` (fully owned, no more scheduled reviews). The
  manual "Mark as Owned" / "Needs review" status buttons are independent overrides — Owned always
  clears `reviewAt`, Needs-review sets `reviewAt = now` if it wasn't already scheduled, so it shows
  up as due immediately.
- `app/(app)/dsa/DsaClient.tsx` — same filter/search/table/pattern-mastery/due-for-review layout as
  the old static shell, plus: an inline "+ Add problem" form (title/pattern/difficulty required),
  a status-button row and "Done reviewing" action in the detail panel, an editable/saveable notes
  textarea, and a delete button. Empty state text changes depending on whether filters are hiding
  everything vs. the table being genuinely empty (0 problems ever added).
- No `/dsa/[id]` route was added — out of scope for this pass, matching what the static shell
  already had (inline detail panel only). If a future session wants deep-linkable problem pages,
  that's a new addition to the original 21-step plan, not something this wiring silently dropped.
- **Verified end-to-end against the real DB**: confirmed `DSAProblem` was genuinely empty (0 rows)
  before starting; created a problem via `POST /api/dsa` and confirmed a bad `pattern` value 400s;
  drove it through `setStatus → SOLVED` (confirmed `solvedAt` set, `reviewAt` = +3d) and three
  `reviewDone` calls in sequence (confirmed the ladder: +7d/attempts=1 → +14d/attempts=2 →
  `reviewAt=null`/`status=OWNED`/attempts=3); confirmed `updateFields` notes persisted; confirmed an
  unauthenticated `PATCH` 401s; confirmed `/dsa` renders the real title server-side both while the
  problem existed and the correct empty-state copy after; deleted the problem via `DELETE` and
  confirmed the table returned to 0 rows.

## Roadmap wiring (step 18, third page)

- `lib/queries/roadmap.ts` — `getRoadmapData(userId)`: all 6 `Phase` rows (for the legend) plus
  all 12 `Month` rows with `phase`/`project`/`topics`/`resources` included and `dailyTasks` (with
  this user's `completions`) used only to compute status/progress, then stripped back out of the
  returned shape.
- **Month status/progress moved server-side**, resolving the note in "Static shell data sources"
  below that flagged this as owed: no stored status field, so it's derived from
  `UserSettings.currentMonth` exactly like the old client-side `CURRENT_MONTH` constant did —
  `number < currentMonth` → `COMPLETED` (100%, treated as done by definition since progress moved
  past it, regardless of actual per-task completion), `=== currentMonth` → `IN_PROGRESS` (real
  `completedTasks/totalTasks` ratio, same formula as Dashboard's `monthProgress`), `>` → 0%. Same
  "past months aren't re-verified, only the current one has real progress" philosophy as before,
  now computed from the DB instead of hardcoded to 0/0/100.
- `app/(app)/roadmap/RoadmapClient.tsx` — same expand/collapse UI as the old static shell, just
  reading `data.months[i].topics`/`.resources`/`.project` instead of `lib/curriculum-data.ts`.
  `month.project` is optional in the schema (`MonthProject?`) even though every seeded month has
  one — guarded with `?? "No project"` rather than assuming it's always present.
- No new API routes needed — read-only page, reuses the existing task-toggle route's effect on
  `TaskCompletion` (toggling a task elsewhere immediately changes Roadmap's current-month progress
  on next load, verified below).
- **Verified end-to-end against the real DB**: signed in via curl, confirmed `/roadmap` renders
  real phase names, and Month 1 as `IN_PROGRESS` at 0% / months 2–12 as `NOT_STARTED` at 0%
  (matching the genuine zero-state left after the Today session's cleanup); toggled one task
  completion via the existing API route and confirmed Month 1's progress recalculated to 8%
  (1/12 tasks) on the next `/roadmap` fetch, then toggled it back off and confirmed `TaskCompletion`
  count returned to 0.

## Today wiring (step 18, second page)

Followed the Dashboard pattern exactly — no deviations:

- `app/(app)/today/page.tsx` — Server Component, same `auth()` → redirect → fetch → pass `data`
  prop shape as Dashboard.
- `lib/queries/today.ts` — `getTodayData(userId)`, reuses `getOrCreateUserSettings` from
  `lib/queries/dashboard.ts` and the exact same "first week with an incomplete task" derivation
  (kept in sync manually — if that logic changes, update both places). Returns just
  `{ monthNumber, currentWeek, weekTasks }`, since Today doesn't need `phase`/`project`/streak/
  momentum/recent-activity — those stay Dashboard-only.
- `app/(app)/today/TodayClient.tsx` — task checkboxes and the log form wired to the same two API
  routes (`/api/tasks/[taskId]/toggle`, `/api/daily-log`) Dashboard already uses, no new routes
  needed. The Pomodoro timer logic (`useEffect`/`useRef` interval) is untouched from the old static
  shell — stays client-only, no persistence, per the original plan.
- Page subtitle changed from the old shell's hardcoded `"Day 1 of Month {n}"` to
  `"Week {currentWeek} · Month {monthNumber}"` — there's no per-month start date stored anywhere
  to derive a real "Day N" count from, so don't reintroduce a fabricated day counter here.
- **Verified end-to-end against the real DB**, same method as Dashboard: signed in via curl,
  confirmed `/today` renders a real seeded task title/id and the correct `monthNumber`/
  `currentWeek`, toggled a real task completion on and off (`TaskCompletion` row created then
  deleted), saved a daily log and confirmed `DailyLog`/`Streak` update correctly including the
  same-day-resave-doesn't-double-count case, then cleaned up all test data back to zero-state.
- **Resolved this session**: the `.env`/`.env.local` `SEED_USER_PASSWORD` drift flagged below
  turned out to be half-fixed already (both files now say `Sai@1235`) but the DB still had the
  old hash — sign-in failed with `CredentialsSignin` until `npx prisma db seed` was re-run. Re-run
  the seed anytime you change the password in the env files; it's an upsert, safe to repeat.

## Dashboard wiring (step 18, first page done this session)

Established the pattern the rest of step 18 should follow:

- **Server Component fetches, Client Component renders.** `app/(app)/dashboard/page.tsx` is now an
  `async` Server Component: calls `auth()`, redirects to `/signin` if no session (belt-and-braces —
  middleware already gates this route), then calls `getDashboardData(userId)` and passes the result
  as a single `data` prop to `app/(app)/dashboard/DashboardClient.tsx` (client component, holds all
  interactive state — task checkboxes, log form — and calls `usePageHeader` since that hook needs
  `"use client"`). Follow this split for every other page in step 18, not a client component doing
  its own `fetch("/api/...")` on mount.
- **Query module**: `lib/queries/dashboard.ts` — `getDashboardData(userId)` plus two reusable
  `getOrCreateUserSettings`/`getOrCreateStreak` helpers (both `UserSettings` and `Streak` are
  1-per-user rows with no seed data, so they're lazily upserted with defaults on first read rather
  than requiring an onboarding flow). Mirror this "one query module per page" structure for the
  remaining pages rather than inlining Prisma calls in page.tsx.
- **"Current week" is progress-derived, not stored**: there's no `weekNumber` field anywhere
  tracking progress (only `UserSettings.currentMonth`, which the user sets by hand in Settings).
  Dashboard computes it as the first week (1–4) in the current month that still has an incomplete
  `DailyTask` (checked via `TaskCompletion` existence), defaulting to week 4 once everything in the
  month is done. Reuse this exact logic for `/today` rather than reinventing it — don't add a
  stored "current week" field, this was intentional.
- **Two new API routes**, both under `auth()` guard, both following the same shape (`auth()` →
  401 if no session → mutate → return small JSON):
  - `POST /api/tasks/[taskId]/toggle` — toggles a `TaskCompletion` row for the signed-in user
    (delete if exists, else create with `timeSpent = task.duration`). Returns `{ done: boolean }`.
  - `POST /api/daily-log` — upserts today's `DailyLog` (`{ userId_date }` compound unique) and
    updates `Streak` in the same request: `currentStreak` resets to 1 if `lastActiveDate` isn't
    exactly yesterday, +1 if it is, unchanged if re-saving the same day (checked via whether a
    `DailyLog` already existed for today before the upsert — re-saving must not double-count).
    Client re-fetches via `router.refresh()` on success rather than optimistic local state.
  - `lib/parse-duration.ts` — `parseDurationToMinutes("1h 45m" | "90m" | "1.5h" | "45")`, used by
    the daily-log route to convert the free-text time input into the `Int` minutes column.
- **Timezone gotcha (real bug hit and fixed this session, watch for it elsewhere)**: the app's
  server runs in IST (UTC+5:30). `DailyLog.date` / any future `@db.Date` column has no timezone —
  Postgres stores it as given. Building "today" with date-fns `startOfDay(new Date())` produces
  **local** midnight, which serializes to UTC and lands on the **previous** calendar day for any
  positive-UTC-offset server (verified: a save at 2026-07-17 local landed as `2026-07-16` in the
  DB). Fixed with `lib/date-only.ts`'s `dateOnly()` — builds the Date from local Y/M/D at **UTC**
  midnight instead, so the round trip through a `date` column keeps the correct calendar day. Use
  `dateOnly()`, not `startOfDay(new Date())`, anywhere a JS `Date` is about to be written to or
  compared against a `@db.Date` column (`DailyLog.date`, `WeeklyReview.weekStart/weekEnd`,
  `Streak.lastActiveDate` will hit this in later steps too).
- **Verified end-to-end against the real DB** (not just `tsc`/`next build`): signed in via curl
  against `/api/auth/callback/credentials` (same approach as the auth session), then hit
  `/dashboard` and confirmed real seeded task titles/ids render; toggled a real task completion on
  and off and confirmed the `TaskCompletion` row was created then deleted; saved a daily log and
  confirmed `DailyLog`/`Streak` rows update correctly including the same-day-resave-doesn't-double-
  count case; confirmed the momentum grid and recent-activity list reflect the saved log after a
  `router.refresh()`. All test data cleaned up afterward (`DailyLog` deleted, `Streak` counters
  reset to 0) so the DB is back to genuine zero-state, not left with test artifacts.
- **Found this session, resolved in the Today session** (see "Today wiring" above): `.env`'s
  `SEED_USER_PASSWORD` had drifted from `.env.local`'s — since the seed script only reads `.env`
  (its `dotenv/config` doesn't load `.env.local`), the DB's hashed password didn't match whichever
  value was in `.env.local`.

## Auth (step 6, done this session)

Original spec said "Google + Credentials." Asked the user; they picked **Credentials-only** —
single-user app, Google OAuth would need Google Cloud Console setup with no benefit here. Google
provider was dropped entirely (not stubbed) — no `GOOGLE_CLIENT_ID`/`SECRET` anywhere anymore.

- **Schema**: added `User.hashedPassword String?` (migration
  `20260717112402_add_user_hashed_password`). Re-run `npx prisma generate` after pulling this if
  your local client is stale (the seed script will throw "Unknown argument `hashedPassword`"
  otherwise).
- **Config split across two files** — required for Prisma/bcrypt to stay out of the Edge runtime:
  - `auth.config.ts` — edge-safe (pages, jwt/session callbacks, empty `providers: []`). Imported by
    `middleware.ts`, which builds its own lightweight `NextAuth(authConfig)` instance just to read
    `req.auth` and redirect. Do **not** add the Credentials provider or `PrismaAdapter` here —
    bcryptjs and `@prisma/adapter-pg` both use Node APIs (`crypto`, `setImmediate`) that break the
    Edge bundle; `npm run build` will fail loudly with Edge Runtime warnings if you do.
  - `auth.ts` — full config (spreads `authConfig`, adds `PrismaAdapter` + the `Credentials`
    provider with bcrypt `compare`). Used by `app/api/auth/[...nextauth]/route.ts` (Node runtime)
    and everywhere server code needs `auth()`.
- `middleware.ts` protects all 10 `(app)` routes (matcher list, not a blanket matcher — `/signin`
  and `/api/auth/*` must stay reachable). Redirects to `/signin?callbackUrl=<path>`.
- `app/(auth)/signin/` — `page.tsx` is a server component that wraps `SignInForm.tsx` (client) in
  `<Suspense>`, required because the form reads `callbackUrl` via `useSearchParams()` and Next.js
  14 fails the build without a Suspense boundary around that hook.
- `app/providers.tsx` now also wraps children in `next-auth/react`'s `SessionProvider` (needed for
  `useSession()`/`signOut()` client-side, used in Settings).
- **Single user is seed-managed**, not created by the signup flow (there is no signup flow —
  single-user app). `prisma/seed.ts` now has a `seedUser()` step that upserts one `User` row with
  a bcrypt-hashed password, reading `SEED_USER_EMAIL` / `SEED_USER_PASSWORD` / `SEED_USER_NAME`
  from env (`.env`, since the seed script's `dotenv/config` only reads `.env`, not `.env.local` —
  both files need these three vars kept in sync if you change the password). To reset/change the
  password: edit the env var(s) and re-run `npx prisma db seed` (it's an upsert, safe to re-run).
- Settings page got a small "Account" card at the top (email/name + Sign out button) — the
  identity element `PROGRESS.md` said Sidebar might need back; it landed in Settings instead, per
  the original spec's intent ("account info surfaces via the Settings page").
- Fixed two pre-existing lint errors while getting `npm run build` green (unrelated to auth, were
  already broken on `main` before this session): `next.has(title) ? next.delete(title) :
  next.add(title)` ternary-as-statement in `dashboard/page.tsx` and `today/page.tsx` — both
  rewritten as if/else. If you see this pattern reintroduced elsewhere, it's an ESLint
  `no-unused-expressions` error, not a runtime bug — Set mutators return nothing useful.
- Verified end-to-end via raw `curl` against the CSRF/callback/session endpoints (not just a
  browser click-through): unauthenticated `/dashboard` → 302 to `/signin`; correct credentials →
  session cookie set, `/dashboard` → 200; wrong password → `CredentialsSignin` error, still
  redirected.

## Static shell data sources (historical — all 10 pages are wired now, see below)

**Superseded as of the Settings wiring** — every page now reads real Prisma data and shows honest
empty/zero states (0 days active, "no activity yet", months `NOT_STARTED` at 0%, "No problems
tracked yet", all 12 projects `NOT_STARTED`, "No notes yet", "No mock interviews logged yet", "No
reviews submitted yet", etc.) rather than fabricated history. Kept this section for the placeholder-
file bookkeeping below, which is still accurate:

- `lib/{dsa,notes,interviews,stats,weekly-review}-data.ts`'s illustrative catalogs
  (`DSA_PROBLEMS`/`difficultyDistribution()`, `NOTES`, `INTERVIEWS`, `buildHeatmapWeeks`/
  `hoursByTypeRows`/`HOURS_BY_TYPE`, `WEEKLY_REVIEWS`) are all dead code now (nothing imports them)
  — left in place rather than deleted across every wiring session, cheap to leave unused exports
  rather than risk deleting something still referenced; safe to remove in a dedicated cleanup pass.
- `lib/dsa-data.ts`'s `DSA_PATTERNS`/`PATTERN_LABEL`, `lib/interviews-data.ts`'s
  `INTERVIEW_TYPE_LABEL`/`InterviewType`, and `lib/stats-data.ts`'s `HEATMAP_LEVEL_OPACITY` **are**
  still used post-wiring — real enum/label/presentation constants, not fabricated data, kept
  deliberately distinct from the dead illustrative arrays above.
- All placeholder-data files used the real Prisma enum values/casing (e.g. `"NEEDS_REVIEW"`, not
  a mockup's `"needs review"`) even while still illustrative, for the same reason.

## Key decisions & gotchas (don't relitigate these)

- **Prisma is v7**, not v5/v6. Breaking change: `datasource.url` can no longer live in
  `schema.prisma` — it's in `prisma.config.ts` (`datasource.url` from `process.env.DATABASE_URL`).
  `PrismaClient` now *requires* an explicit driver adapter at runtime — see `lib/prisma.ts`, which
  uses `@prisma/adapter-pg`. Don't try `new PrismaClient()` bare, it throws.
- **shadcn/ui**: the CLI's current default (`npx shadcn add`) generates Base UI + Tailwind v4
  components (`color-mix()`, `@base-ui/react`, `has-data-*` variants) — incompatible with this
  project's Tailwind v3 setup. Do **not** run `npx shadcn add <component>` — it will regenerate
  incompatible files. Instead, hand-write new `components/ui/*.tsx` files following the existing
  pattern (classic Radix primitives + `cva`/Tailwind v3 arbitrary values, e.g. `bg-[var(--surface)]`).
- Data-driven colors (status/difficulty/phase, anything computed at runtime) must go through
  **inline `style={{ color: someColorVar }}`**, never a dynamically-built Tailwind className —
  Tailwind's JIT scanner does a static text scan and can't see `` `text-[var(${x})]` ``. See
  `lib/status-colors.ts` and `phaseColorVars`/`taskTypeColorVars` in `lib/curriculum-data.ts` for
  the established pattern (functions return `"var(--x)"` strings for inline style, not classNames).
- Theme is driven by `data-theme` on `<html>`, not Tailwind's `darkMode: "class"` mechanism (no
  `dark:` variants are used anywhere in the codebase — don't introduce them, they won't do
  anything; add the color as a token in `globals.css` instead).
- Page title/subtitle in `PageShell`'s header bar come from a zustand store
  (`lib/store/page-header.ts`) via the `usePageHeader(title, subtitle)` hook — call it once at
  the top of each page component. This avoids prop-drilling through every route.
- **No cloud database configured yet.** Local dev runs against a Docker Postgres container:
  `padikk-postgres` (`docker start/stop padikk-postgres`), user/pass/db all `padikk`,
  `postgresql://padikk:padikk@localhost:5432/padikk`. Before deploying, swap `DATABASE_URL` in
  `.env` and `.env.local` to a real Supabase/Railway connection string and rerun
  `npx prisma migrate deploy`.
- **Env files**: `.env` (Prisma CLI reads this) and `.env.local` (Next.js runtime) both need
  `DATABASE_URL`. `.env.example` documents the full var list. Neither `.env` nor `.env.local` is
  committed (see `.gitignore`).
- **Auth is not wired yet** — Sidebar/PageShell no longer take user-identity props at all (the
  redesigned Sidebar has no avatar/username row, matching the new mockup). Once NextAuth (step 6)
  lands, account info surfaces via the Settings page instead; revisit whether Sidebar needs an
  identity element back.
- Project folder was renamed `MelleMelle` → `Padikk` (now at `/Users/macbook/Documents/Padikk`).
- Git repo is initialized with a **repo-local identity** (not global):
  `Sai Sooraj <saisoorajpnair@gmail.com>`. Global git config is untouched.
- Commits are made **one per phase** (not one big commit) — keep doing this going forward.
- **Remote is configured**: `origin` → `https://github.com/saisooraj/Padikk.git`, `main` branch,
  pushed via a fine-grained PAT (not stored in git config). Auth uses the user's own token when
  they push manually; if a future session needs to push, ask the user to run it or supply a token
  rather than assuming cached credentials work — a stale/wrong-scoped token in the macOS keychain
  caused a 403 earlier in this project.
- **Never add a `Co-Authored-By: Claude` trailer to commits in this project** (or any project —
  saved as a global feedback memory). User explicitly opted out; existing history was rewritten
  with `git filter-branch --msg-filter` + `git push --force-with-lease` to remove it. Plain commit
  messages only, going forward.

## Where things live

- `prisma/schema.prisma` — full data model (curriculum + user tracking + NextAuth tables)
- `prisma/seed.ts` — 6 phases, 12 months, 86 topics, 140 tasks, 36 resources, 12 projects
- `lib/curriculum-data.ts` — static mirror of `prisma/seed.ts`, still used at runtime (Roadmap's
  `MONTHS`, Notes' `monthRef` select, etc.), not just a pre-wiring artifact
- `lib/{dsa,notes,interviews,weekly-review,stats}-data.ts` — former illustrative placeholder
  catalogs; now dead code except the enum/label/presentation constants noted in "Static shell data
  sources" above (`DSA_PATTERNS`/`PATTERN_LABEL`, `INTERVIEW_TYPE_LABEL`/`InterviewType`,
  `HEATMAP_LEVEL_OPACITY`)
- `lib/queries/*.ts` — one query module per page (`dashboard`, `today`, `roadmap`, `dsa`,
  `projects`, `notes`, `stats`, `interviews`, `review`, `settings`), each exporting a single
  `get*Data(userId)` the page's Server Component calls
- `lib/status-colors.ts` — difficulty/status/score → CSS var() color helpers
- `lib/store/{theme,page-header}.ts` — theme toggle (persisted) and page header title/subtitle
- `components/layout/{Sidebar,PageShell,TopBar,MobileNav}.tsx` — app shell (rebuilt for the pivot)
- `components/ui/` — hand-written shadcn-style primitives (button, card, badge, avatar, switch,
  progress-bar, chip)
- `app/(app)/` — authenticated route group; all 10 pages are Server Component `page.tsx` + Client
  Component `*Client.tsx` pairs, wired to real Prisma data (step 18 complete)
- `app/globals.css` + `tailwind.config.ts` — OKLCH design tokens (dark + light)

## Session-closing checklist

When wrapping a session, update the table above and add anything non-obvious to "Key decisions"
before stopping — that's what makes closing the session cheap next time.
