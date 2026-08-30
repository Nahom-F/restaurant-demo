# Restaurant/Cafe Demo — build notes

Sibling portfolio piece to EcoFurnish. Mostly frontend; menu admin CRUD is the
one real, persisting backend piece.

## What's here

- `db/schema.ts` — full schema for `pnpm db:push`: `menu_items`, `gallery_images`, `reservations`
- `db/index.ts` — Drizzle client (Neon HTTP driver, same pattern as EcoFurnish)
- `db/seed.ts` — repeatable seed script (`pnpm db:seed`), full seed menu + gallery
- `drizzle.config.ts` — config for `db:push`
- `lib/ingredient-info.ts` — static ingredient-detail lookup (not DB-backed by design — see scoping notes). Pre-written for every seed ingredient; fallback text only shows for ingredients not yet added here.
- `app/menu/page.tsx` — public menu grouped by category, dietary tag chips
- `app/menu/[id]/page.tsx` + `IngredientDetailClient.tsx` — item detail with clickable ingredients → modal
- `app/gallery/page.tsx` — public gallery
- `app/reservations/page.tsx` + `app/api/reservations/route.ts` — reservation form, saves to DB, shows confirmation. No notification wiring (matches scope).
- `app/admin/menu-items/page.tsx` — real admin CRUD UI (add/edit/delete, toggle availability)
- `app/api/admin/menu-items/route.ts` + `[id]/route.ts` — menu item CRUD API
- `app/api/admin/gallery/route.ts` + `[id]/route.ts` — gallery CRUD API (UI page not built yet — API is ready, same pattern as menu items if you want to add it)

## Not built (out of scope per plan)

- Cart/checkout, payment integration, customer accounts — EcoFurnish already proves these
- Reservation notifications (email/SMS) — DB-only for this demo

## Scaffold (added after the first pass — was missing initially)

`app/page.tsx` (root homepage — its absence caused a 404 at `/` on the first
Vercel deploy), `app/layout.tsx`, `app/globals.css`, `tailwind.config.js`,
`postcss.config.js`, `tsconfig.json`, `next.config.js`, and a full
`package.json` (with `dev`/`build`/`start` scripts, not just `db:push`/`db:seed`).

## To wire up before deploy

1. `requireAdmin()` calls in the admin API routes are commented out — wire to
   the same admin-auth pattern as EcoFurnish before deploying, otherwise the
   admin routes are open.
2. Set `DATABASE_URL` (Neon Postgres connection string) — locally in `.env.local`,
   and in Vercel's project environment variables for the deployed site.
3. `pnpm install`, then `pnpm db:push` to create tables, then `pnpm db:seed` to seed.
4. `pnpm dev` to test locally before pushing to GitHub/Vercel.
5. Add real image files under `public/images/menu/` and `public/images/gallery/`
   matching the paths in `db/seed.ts`, or swap the `imageUrl` values.
