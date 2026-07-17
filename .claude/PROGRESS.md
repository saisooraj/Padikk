# Padikk — Build Progress

> Read this file at the start of any new session on this project before doing anything else.
> It tracks what's built, what's left, and the decisions/gotchas a fresh session needs to know.
> Full original spec (design system, schema, page-by-page requirements) is in the first user
> message of the session that started this build — not duplicated here, only referenced.

## What Padikk is

A personal, dark-themed, single-user learning OS (Next.js 14 App Router) tracking a 12-month
Senior AI Software Engineer roadmap: daily tasks, DSA practice, projects, mock interviews,
weekly reviews. Think Notion + LeetCode tracker + Obsidian journal, purpose-built for one roadmap.

## Overall build plan (21 steps from the original spec)

| # | Step | Status |
|---|------|--------|
| 1 | Scaffold Next.js 14 (TS, Tailwind, App Router) | ✅ Done |
| 2 | Install all dependencies | ✅ Done |
| 3 | `globals.css` — CSS vars, fonts | ✅ Done |
| 4 | Prisma schema + initial migration | ✅ Done |
| 5 | Seed script (curriculum data) | ✅ Done |
| 6 | NextAuth config (`auth.ts`, API route) | ⬜ Pending |
| 7 | Root layout + Sidebar + PageShell | ✅ Done |
| 8 | `/dashboard` page (static shell → wired data) | 🟡 Placeholder only |
| 9 | `/today` page + PomodoroTimer | ⬜ Pending |
| 10 | `/roadmap` page | ⬜ Pending |
| 11 | `/dsa` page + `/dsa/[id]` | ⬜ Pending |
| 12 | `/projects` Kanban board | ⬜ Pending |
| 13 | `/notes` editor (Tiptap) | ⬜ Pending |
| 14 | `/stats` analytics page | ⬜ Pending |
| 15 | `/interviews` log | ⬜ Pending |
| 16 | `/review` weekly form | ⬜ Pending |
| 17 | `/settings` | ⬜ Pending |
| 18 | Wire all API routes (`app/api/**`) | ⬜ Pending |
| 19 | Loading states, error boundaries, empty states | ⬜ Pending |
| 20 | Responsive mobile layout per page | 🟡 Shell is responsive; pages pending |
| 21 | Dark mode polish, accessibility pass | ⬜ Pending |

**Next up (as of last session): asked user whether to build `/dashboard` or `/today` next —
unanswered when the session moved to git/repo setup instead. Confirm with user before starting
step 8/9.**

## Key decisions & gotchas (don't relitigate these)

- **Prisma is v7**, not v5/v6. Breaking change: `datasource.url` can no longer live in
  `schema.prisma` — it's in `prisma.config.ts` (`datasource.url` from `process.env.DATABASE_URL`).
  `PrismaClient` now *requires* an explicit driver adapter at runtime — see `lib/prisma.ts`, which
  uses `@prisma/adapter-pg`. Don't try `new PrismaClient()` bare, it throws.
- **shadcn/ui**: the CLI's current default (`npx shadcn add`) generates Base UI + Tailwind v4
  components (`color-mix()`, `@base-ui/react`, `has-data-*` variants) — incompatible with this
  project's Tailwind v3 setup. Do **not** run `npx shadcn add <component>` — it will regenerate
  incompatible files. Instead, hand-write new `components/ui/*.tsx` files following the pattern
  already in `button.tsx` / `card.tsx` (classic Radix primitives + `cva` + Tailwind v3 arbitrary
  values, e.g. `bg-[var(--surface)]`).
- **No cloud database configured yet.** Local dev runs against a Docker Postgres container:
  `padikk-postgres` (`docker start/stop padikk-postgres`), user/pass/db all `padikk`,
  `postgresql://padikk:padikk@localhost:5432/padikk`. Before deploying, swap `DATABASE_URL` in
  `.env` and `.env.local` to a real Supabase/Railway connection string and rerun
  `npx prisma migrate deploy`.
- **Env files**: `.env` (Prisma CLI reads this) and `.env.local` (Next.js runtime) both need
  `DATABASE_URL`. `.env.example` documents the full var list. Neither `.env` nor `.env.local` is
  committed (see `.gitignore`).
- **Auth is not wired yet** — Sidebar/PageShell currently take optional props with placeholder
  defaults (`userName="Guest"`, badges hidden). Once NextAuth (step 6) lands, wire real session
  data into `app/(app)/layout.tsx` → `PageShell` → `Sidebar`.
- Project folder was renamed `MelleMelle` → `Padikk` (now at `/Users/macbook/Documents/Padikk`).
- Git repo is initialized with a **repo-local identity** (not global):
  `Sai Sooraj <saisoorajpnair@gmail.com>`. Global git config is untouched.
- Commits are made **one per phase** (not one big commit) — keep doing this going forward, e.g.
  one commit per numbered step above once it's meaningfully done, not a mega-commit at the end.
- **No remote configured yet** — was waiting on the user to paste a repo URL when this file was
  written. Check `git remote -v` before assuming push access exists.

## Where things live

- `prisma/schema.prisma` — full data model (curriculum + user tracking + NextAuth tables)
- `prisma/seed.ts` — 6 phases, 12 months, 86 topics, 140 tasks, 36 resources, 12 projects
- `components/layout/{Sidebar,PageShell,TopBar,MobileNav}.tsx` — app shell
- `components/ui/` — hand-written shadcn-style primitives (button, card, badge, avatar so far)
- `app/(app)/` — authenticated route group; only `dashboard/page.tsx` exists (placeholder)
- `app/globals.css` + `tailwind.config.ts` — Padikk design tokens

## Session-closing checklist

When wrapping a session, update the table above and add anything non-obvious to "Key decisions"
before stopping — that's what makes closing the session cheap next time.
