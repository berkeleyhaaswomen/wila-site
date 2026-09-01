# WILA, Women in Leadership Alumnae

Site for the Berkeley Haas Women in Leadership Alumnae network.
Next.js 14 + Tailwind CSS + Postgres.

Board members manage events and the alumnae spotlight through an admin site
built into the app at **`/admin`**, reachable from the "Administrator? Sign in
here." link in the footer. No code required.

## What's in this repo

- `app/`, Next.js App Router: the public site, `/admin`, and the upload route
- `components/`, public site sections; `components/admin/`, admin UI
- `db/schema.sql`, database schema (idempotent)
- `lib/db.ts`, `lib/repo.ts`, Postgres connection and queries
- `lib/auth.ts`, password hashing, sessions, role guards
- `lib/content.ts`, public content layer, with hardcoded fallbacks
- `scripts/`, migrate, create-admin, verify-sql
- `ADMIN.md`, **setup, roles, and everyday tasks (start here)**
- `ONBOARDING.md`, the guide to hand to a new board member

## Quick start (developer)

```bash
cp .env.example .env.local
# Fill in DATABASE_URL and AUTH_SECRET (see ADMIN.md steps 1–2)

npm install
npm run db:migrate
npm run admin:create
npm run dev
```

- Site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>

The public site builds and runs without a database, it falls back to the
hardcoded content in `lib/content.ts`.

## Roles

**Super admin**: everything, including managing who has access.
**Admin**: all content, no user management.

Enforced server-side in `lib/auth.ts` (`requireUser` / `requireSuperadmin`).
Details in **[ADMIN.md](./ADMIN.md)**.

## Checks

```bash
npx tsc --noEmit    # types
npm run db:verify   # schema + every query, against in-process Postgres
npm run build       # production build
```

## Deploy

Vercel. Set `DATABASE_URL` and `AUTH_SECRET` (and optionally
`BLOB_READ_WRITE_TOKEN` for photo uploads) in the project's environment
variables, and run the migration once against the production database. Full
walkthrough in **[ADMIN.md](./ADMIN.md)**.

## Stack

- Next.js 14.2 (App Router, React 18, TypeScript)
- Tailwind CSS 3.4
- Postgres via `pg`, works with Neon, Supabase, Vercel Postgres, or your own
- bcrypt password hashing, JWT session cookie (`jose`)
- Vercel Blob for optional photo uploads

## License

Proprietary, internal use by the WILA board and Berkeley Haas Alumni Network.
