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
| 11 | `/dsa` page (list/filter/detail; no `/dsa/[id]` route yet) | ✅ Visual shell done, static data |
| 12 | `/projects` Kanban board | ✅ Visual shell done, static data |
| 13 | `/notes` page (plain textarea view; no Tiptap yet) | ✅ Visual shell done, static data |
| 14 | `/stats` analytics page | ✅ Visual shell done, static data |
| 15 | `/interviews` log | ✅ Visual shell done, static data |
| 16 | `/review` weekly form | ✅ Visual shell done, static data |
| 17 | `/settings` | ✅ Visual shell done, static data |
| 18 | Wire all API routes (`app/api/**`) | 🟡 Dashboard + Today wired; 8 pages left |
| 19 | Loading states, error boundaries, empty states | 🟡 Empty states done per-page; no loading.tsx/error.tsx yet |
| 20 | Responsive mobile layout per page | 🟡 Shell + grids are responsive; not device-tested |
| 21 | Dark mode polish, accessibility pass | 🟡 Both themes render correctly; no accessibility pass yet |

**Dashboard and Today are now wired; the other 8 pages are still static/client-state shells** —
auth gates them, but no Prisma queries or API routes are wired in for those yet. This was a
deliberate scope choice for the design pivot: get the whole app visually right first, wire data in
one page at a time afterward. See "Static shell data sources" below for exactly what's real vs.
placeholder per remaining page.

**Next up: continue step 18 with `/roadmap` (real curriculum data already mirrored in
`lib/curriculum-data.ts`, so this one's mostly swapping the static import for a query module —
no new derivation logic needed like Today's "current week" was), then `/dsa`, `/projects`,
`/notes`, `/stats`, `/interviews`, `/review`, `/settings`.**

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

## Static shell data sources (important for the next session)

Two different philosophies were used, both deliberate — don't try to make them consistent with
each other, they're answering different questions:

- **Dashboard & Today** show *honest empty/zero states* (0 days active, "no activity yet", "no
  DSA due" etc.) rather than fabricated history — these pages are about *this user's* real
  progress, and a fresh account genuinely has none yet.
- **DSA Tracker, Notes, Interviews, Weekly Review, Stats** show *illustrative sample catalogs*
  (`lib/dsa-data.ts`, `lib/notes-data.ts`, `lib/interviews-data.ts`,
  `lib/weekly-review-data.ts`, `lib/stats-data.ts`) — these are catalog/list-management pages
  whose entire visual purpose (table density, badge variety, chart shapes) is unreadable when
  empty, and their underlying Prisma models are user-created with no seed data anyway. Stats'
  numbers are derived from the same placeholder universe as DSA/Interviews so they stay internally
  consistent with each other.
- **Roadmap, Projects** use the *real* seeded curriculum (`lib/curriculum-data.ts`, a static
  mirror of `prisma/seed.ts` — field shapes intentionally match the Prisma schema so swapping in
  real queries later is a drop-in, not a rewrite).
- All placeholder-data files use the real Prisma enum values/casing (e.g. `"NEEDS_REVIEW"`, not
  the mockup's `"needs review"`) for the same reason.
- Month/Project "status" (not-started/in-progress/completed) is derived from a single
  `CURRENT_MONTH` constant in each page — Month has no stored status field in the schema (it's
  progress-derived), Project does, so Project will switch to reading it directly once persistence
  lands; Month's derivation logic will need to move server-side.

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
- `lib/curriculum-data.ts` — static mirror of `prisma/seed.ts` for pages to render pre-wiring
- `lib/{dsa,notes,interviews,weekly-review,stats}-data.ts` — illustrative placeholder catalogs
  for the pages whose Prisma models are user-created (no seed data exists for these)
- `lib/status-colors.ts` — difficulty/status/score → CSS var() color helpers
- `lib/store/{theme,page-header}.ts` — theme toggle (persisted) and page header title/subtitle
- `components/layout/{Sidebar,PageShell,TopBar,MobileNav}.tsx` — app shell (rebuilt for the pivot)
- `components/ui/` — hand-written shadcn-style primitives (button, card, badge, avatar, switch,
  progress-bar, chip)
- `app/(app)/` — authenticated route group; all 10 pages exist as static/client-state shells
- `app/globals.css` + `tailwind.config.ts` — OKLCH design tokens (dark + light)

## Session-closing checklist

When wrapping a session, update the table above and add anything non-obvious to "Key decisions"
before stopping — that's what makes closing the session cheap next time.
