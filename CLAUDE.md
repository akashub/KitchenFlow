# KitchenFlow

Kitchen management system for a commercial kitchen in Karnataka serving ~6K meals/day to 5-15 business clients. Phase 1: kitchen ops (recipes, menus, task board, dashboard). Workers are illiterate — all worker-facing UI is visual-first.

## Hard rules
- Every file ≤ 200 LOC. Refactor, never bypass.
- No secrets in code. Load from env.
- Prefer editing existing files over creating new ones.
- No emoji in code unless user explicitly asks.
- All user-facing text goes through next-intl — no hardcoded strings in components.
- Worker-facing screens: large touch targets (min 48px), color-coded status, dish photos/emoji for recognition, one action button per task, bilingual labels always visible.

## Stack
- **Framework**: Next.js 15 (App Router). `src/` directory structure.
- **Database**: SQLite via better-sqlite3. Drizzle ORM for schema + migrations. DB file at `data/kitchenflow.db`.
- **Auth**: NextAuth v5 (beta). Email/password for owner/head chef. PIN for supervisors. Workers use shared station — no individual login.
- **i18n**: next-intl with `[locale]` routing. English + Hindi. Message files in `messages/`. Kannada planned.
- **Styling**: Tailwind CSS v4. Theme tokens in `globals.css` via `@theme`. No `tailwind.config.js`.
- **Offline/PWA**: Serwist (next-pwa replacement) + Dexie.js for IndexedDB. Kitchen station caches today's data and works through full-day outages.
- **Real-time**: SSE for kitchen→dashboard status updates.
- **Deployment**: Single VPS (~$5/mo), Docker Compose. SQLite on a Docker volume.
- **Repo**: https://github.com/akashub/KitchenFlow.git

## UI principles
- Simple enough for illiterate workers, polished enough to impress the business owner.
- Card-based layouts over dense tables. Clean whitespace. Subtle color gradients for meal types.
- Status colors are semantic and consistent everywhere: grey (not started), blue (prepping), orange (cooking), green (done).
- Owner-facing screens: professional dashboard aesthetic. Data-dense but scannable.
- Mobile-responsive — owner accesses from phone. Kitchen station is desktop-width.

## Directory layout
```
src/
  app/
    [locale]/              i18n-routed pages
      login/               Auth pages (no sidebar)
      (authenticated)/     Auth-guarded pages (with sidebar)
        dashboard/         Owner dashboard
        recipes/           Recipe CRUD
        clients/           Client CRUD
        menu/              Menu planning
        kitchen/           Worker task board
    api/                   API routes (auth, SSE, data)
    globals.css            Tailwind v4 theme
  auth.ts                  NextAuth config
  db/
    schema.ts              Drizzle schema (all tables)
    index.ts               DB client singleton
    seed.ts                Dev seed data
  i18n/                    next-intl config
  components/              Shared UI components
  lib/                     Utility functions
messages/                  i18n message bundles (en.json, hi.json)
drizzle/                   Generated migration files
docs/superpowers/
  specs/                   Design specs
  plans/                   Implementation plans
```

## Development workflow
1. Read the active plan in `docs/superpowers/plans/`.
2. Implement task by task. Each task is a commit.
3. Test in browser — type checking alone doesn't verify UI correctness.
4. Commit with clear messages. No `--no-verify`.

## Offline architecture
- Owner → Cloud: menu planning, recipe edits (online-only, except head chef can plan offline)
- Cloud → Kitchen: published menus sync at start of day
- Kitchen → Cloud: only task status updates flow upstream
- No two-way sync conflicts by design. Head chef offline menus sync when connectivity returns.

## Phases
- **Phase 1** (current): Kitchen core — recipes, clients, menus, task board, dashboard
- **Phase 2**: Packaging & dispatch
- **Phase 3**: Fleet & delivery tracking
