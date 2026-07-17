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
| 6 | NextAuth config (`auth.ts`, API route) | ⬜ Pending |
| 7 | Root layout + Sidebar + PageShell | ✅ Done (rebuilt for the design pivot) |
| 8 | `/dashboard` page | ✅ Visual shell done, static data |
| 9 | `/today` page + Pomodoro timer | ✅ Visual shell done, static data |
| 10 | `/roadmap` page | ✅ Visual shell done, static data |
| 11 | `/dsa` page (list/filter/detail; no `/dsa/[id]` route yet) | ✅ Visual shell done, static data |
| 12 | `/projects` Kanban board | ✅ Visual shell done, static data |
| 13 | `/notes` page (plain textarea view; no Tiptap yet) | ✅ Visual shell done, static data |
| 14 | `/stats` analytics page | ✅ Visual shell done, static data |
| 15 | `/interviews` log | ✅ Visual shell done, static data |
| 16 | `/review` weekly form | ✅ Visual shell done, static data |
| 17 | `/settings` | ✅ Visual shell done, static data |
| 18 | Wire all API routes (`app/api/**`) | ⬜ Pending |
| 19 | Loading states, error boundaries, empty states | 🟡 Empty states done per-page; no loading.tsx/error.tsx yet |
| 20 | Responsive mobile layout per page | 🟡 Shell + grids are responsive; not device-tested |
| 21 | Dark mode polish, accessibility pass | 🟡 Both themes render correctly; no accessibility pass yet |

**Every page above is a static/client-state shell** — no NextAuth (step 6), no Prisma queries, no
API routes (step 18) wired in yet. This was a deliberate scope choice for the design pivot: get
the whole app visually right first, wire data in afterward. See "Static shell data sources" below
for exactly what's real vs. placeholder per page.

**Next up: step 6 (NextAuth) then step 18 (wire real Prisma queries into every page below),
replacing the static data sources one page at a time.**

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
