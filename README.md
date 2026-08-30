# WILA — Women in Leadership Alumnae

Refreshed site for the Berkeley Haas Women in Leadership Alumnae network.
Next.js 14 + Tailwind CSS + Sanity CMS.

Board members manage all content — events, alumnae spotlight, board list, hero
copy — through an embedded Studio at **`/studio`**. No code required.

## What's in this repo

- `app/` — Next.js App Router pages (site + `/studio` route)
- `components/` — React components for each section
- `sanity/` — CMS schemas and Studio structure
- `sanity.config.ts` — Studio configuration
- `lib/content.ts` — content fetch layer with hardcoded fallbacks
- `ADMIN.md` — **step-by-step admin + roles guide (start here)**

## Quick start (developer)

```bash
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SANITY_PROJECT_ID (see ADMIN.md step 2)

npm install
npm run dev
```

- Site: <http://localhost:3000>
- Studio: <http://localhost:3000/studio>

The site builds and runs even without a Sanity project — it falls back to the
hardcoded content in `lib/content.ts`.

## Deploy (production)

Vercel is the recommended host — see **ADMIN.md** for the walkthrough. TL;DR:

```bash
vercel --prod
```

Add the three `NEXT_PUBLIC_SANITY_*` env vars in the Vercel dashboard, point
`wila.haasalumni.org` at Vercel, done.

## Roles & permissions

Managed in Sanity (Administrator / Editor / Viewer). Full details in
**[ADMIN.md](./ADMIN.md)** → "Roles & Permissions".

## Editing content

See **[ADMIN.md](./ADMIN.md)** → "Everyday content tasks" for the full guide
to adding events, rotating the spotlight, updating the board, and editing
hero copy.

## Stack

- Next.js 14.2 (App Router, React 18, TypeScript)
- Tailwind CSS 3.4
- Sanity 3.57 (embedded Studio via `next-sanity`)
- Zero external image dependencies — inline SVG art

## License

Proprietary — internal use by the WILA board and Berkeley Haas Alumni Network.
