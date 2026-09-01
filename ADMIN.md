# WILA Site, Admin Guide

The public site is a Next.js app on **Vercel**. Content is managed from an
**admin site built into the same app at `/admin`**, reachable from the
**"Administrator? Sign in here."** link in the site footer.

Board members sign in with an email and password to add events and rotate the
alumnae spotlight. No code required.

---

## Roles & Permissions

| Role | What they can do |
|---|---|
| **Super admin** | Everything. Adds and removes the people who manage the website, changes their roles, resets their passwords, edits all content. |
| **Admin** | Every content page, events and spotlights: create, edit, delete. **Cannot** add or remove users or change roles. |

The Users page is hidden from the nav for Admins, and the server rejects the
request even if they navigate to `/admin/users` directly, the check is on the
server, not just in the UI.

### The owner

One super admin is the **owner**: by default whoever runs `npm run admin:create`
first. No other super admin can demote them, remove them, or reset their
password, so a co-president (or a compromised account) can't lock them out.

The owner's row shows an **OWNER** badge, and their Role / Password / Access
controls are inert for everybody else.

The only way this changes is the owner handing it over: on another super
admin's row, the owner clicks **Make owner**. That promotes them to super
admin if needed and drops the old owner's protection, in a single transaction
so there's never zero owners or two.

If you're the owner and you're leaving the board, transfer ownership before
your access is removed, otherwise the account can only be cleared with direct
database access.

### Other lockout guards

- The **last super admin cannot be demoted** to Admin.
- **Nobody can remove their own access**: ask another super admin.
- The **owner must stay a super admin**.

---

## First-time setup (do this once)

You need a GitHub account, a Vercel account, and a Postgres database. All have
free tiers.

### 1. Create a Postgres database

Any provider works. [Neon](https://neon.tech) is the easiest free option:

1. Sign up, create a project
2. Copy the **connection string** (it looks like
   `postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require`)

Supabase, Vercel Postgres, or your own server work identically, the app only
needs the connection string.

### 2. Configure the app locally

```bash
cp .env.example .env.local
```

Fill in:

- `DATABASE_URL`, the connection string from step 1
- `AUTH_SECRET`, generate one with `openssl rand -base64 32`

`AUTH_SECRET` signs the login cookie. **Keep it secret**, and use a different
value in production than in local development. If it ever leaks, change it 
that immediately signs everybody out.

### 3. Create the tables

```bash
npm run db:migrate
```

Safe to run repeatedly; it only creates what's missing.

### 4. Create the first super admin

```bash
npm run admin:create
```

It asks for an email, a display name, a role, and a password. **The password
prompt is hidden**: nothing is echoed to your terminal, written to your shell
history, or stored in this repo. Use a strong one; the minimum is 8 characters.

After this, super admins add everyone else from `/admin/users`, you shouldn't
need this script again except to recover a locked-out account.

### 5. Deploy to Vercel

```bash
npm install -g vercel
vercel link
vercel --prod
```

In the Vercel dashboard → your project → **Settings → Environment Variables**,
add the same two variables (`DATABASE_URL`, `AUTH_SECRET`), then redeploy.

Run the migration once against the production database too, either set
`DATABASE_URL` locally to the production string and run `npm run db:migrate`,
or run it from the provider's SQL console by pasting in `db/schema.sql`.

### 6. Photo uploads

Nothing to do. Uploads work as soon as the database is connected: the photo is
rotated upright, capped at 1600px on its long edge, re-encoded as JPEG, and
stored in the `images` table. A 12MP phone photo lands at roughly 200KB. It is
served back from `/api/images/<id>` with a one-year immutable cache, so each
photo is fetched once per visitor.

Admins can still paste a URL instead if the photo is already hosted somewhere.

**If you would rather use a CDN**, create a Vercel Blob store (Vercel dashboard
→ Storage → Create → Blob), copy its Read/Write Token, and add it as
`BLOB_READ_WRITE_TOKEN`. The upload route prefers Blob whenever that variable
is set, and the `images` table simply stops growing. Photos already in the
database keep working.

### 7. Point the domain

Vercel → **Settings → Domains** → add `wila.haasalumni.org`, then add the
CNAME record Vercel gives you to the DNS for `haasalumni.org`.

---

## Managing who has access (super admins)

Go to **`/admin/users`**.

**To add someone:** fill in the "Add someone" form at the bottom, email,
optional name, role, and a temporary password. There is no invitation email,
so share the temporary password with them privately (in person or over
Signal/Slack, not email if you can avoid it) and ask them to change it from
the **Account** page as soon as they sign in.

**To change a role:** pick the new role from the dropdown in their row and
click Save.

**To reset a locked-out person's password:** click "Reset password" in their
row, set a new one, and share it privately.

**To remove someone:** click Remove in their row. This is immediate, any
session they have open stops working on their next click, because every
request re-checks the account against the database.

Recommended for WILA: 2–3 super admins (Co-Presidents plus the technical
maintainer), everyone else Admin.

---

## Everyday content tasks

Sign in at **`/admin`**.

### Add or edit an event

**Events → New event** (or click an existing one).

| Field | Where it shows on the public site |
|---|---|
| Event title | The card headline |
| Slug | The URL-safe id. Leave blank to generate from the title |
| Blurb | The paragraph on the card |
| Starts at | The date line, and whether it counts as Upcoming or Past |
| Ends at | Optional, joins the date line |
| Location | The pin row |
| Format | The **In person / Virtual / Hybrid** badge |
| Price | The dollar row, write "Free" or "$75" |
| RSVP / recap link | The link at the bottom of the card |

Events move between **Upcoming** and **Past** automatically based on the start
time, you never move them by hand. The bottom link is labelled "RSVP" for
upcoming events and "View recap" for past ones.

### Rotate the alumnae spotlight

**Spotlights → New spotlight**.

| Field | Where it shows |
|---|---|
| Alumna name + Class year | The small-caps byline |
| Spotlight label | The badge over the photo, e.g. "Q2 2026 Spotlight" |
| Current title | The large serif headline |
| Quote | The gold-rule pull quote |
| Short bio | The paragraph under the quote |
| Photo | The portrait, upload a file or paste a URL |
| LinkedIn URL | The "View LinkedIn profile" button |
| 'Nominate an alumna' link | That button. Defaults to `#contact` |
| Pillar / Chapter / Mentor cohort | The three-column strip at the bottom |
| Featured from | Which spotlight wins the homepage |

The homepage shows the spotlight with the **most recent "Featured from"**
date. Older ones stay in the list for reference, the one currently live is
tagged "On the homepage".

Any field you leave blank is omitted from the card rather than rendering an
empty row, so a half-filled spotlight still looks intentional.

### Change your own password

**Account → Change your password.** Requires your current password.

---

## Making changes appear live

Saving in the admin site calls `revalidatePath("/")`, so the public homepage
picks up changes on the next request, usually within seconds. No redeploy
needed.

---

## Local development

```bash
cp .env.example .env.local   # fill in DATABASE_URL and AUTH_SECRET
npm install
npm run db:migrate
npm run admin:create
npm run dev                  # site at localhost:3000, admin at /admin
```

Without `DATABASE_URL` the public site still runs, it shows the hardcoded
fallback content in `lib/content.ts`, and `/admin` explains what's missing.

To check the SQL without a database server:

```bash
npm run db:verify
```

This runs `db/schema.sql` and every query the app issues against an in-process
Postgres (PGlite), and reports any failures.

---

## Troubleshooting

**"AUTH_SECRET must be set to a random string of at least 32 characters."**
Generate one with `openssl rand -base64 32` and add it to `.env.local` (and to
Vercel for production).

**"The database isn't configured yet."**
`DATABASE_URL` is missing or empty. Add it, then `npm run db:migrate`.

**"relation 'users' does not exist"**
The connection works but the tables aren't there. Run `npm run db:migrate`
against that database.

**Everyone is locked out.**
Run `npm run admin:create` with the production `DATABASE_URL` set. Using an
existing email resets that account's password and role rather than failing.

**A published change isn't on the public site.**
Hard-refresh (Cmd/Ctrl + Shift + R). If it's still missing, check the event's
start time, it may have sorted into Past rather than Upcoming.

**Uploads say they aren't configured.**
`BLOB_READ_WRITE_TOKEN` isn't set. Either add it (step 6) or paste an image
URL instead.

---

## Security notes

- Passwords are hashed with **bcrypt** (cost 12). Plain passwords are never
  stored or logged.
- The session is a signed JWT in an **httpOnly, SameSite=Lax** cookie, marked
  Secure in production, expiring after **8 hours**.
- Every request re-reads the account from the database, so a removed user or a
  changed role takes effect immediately rather than when the token expires.
- The login form gives the **same error** for an unknown email and a wrong
  password, so it can't be used to discover which emails have accounts.
- The upload endpoint requires a signed-in admin and limits files to 5 MB of
  image types only.
- Role checks live in server actions and page guards, not just in the UI.

What this setup does **not** have yet, and is worth adding if the board grows:
rate limiting on the login form, two-factor authentication, an audit log of
who changed what, and self-service password reset by email.
