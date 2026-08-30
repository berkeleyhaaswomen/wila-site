# WILA Site — Admin Guide

This site is a Next.js app on **Vercel**, with content managed through an
embedded **Sanity Studio** available at `/studio`. Board members log in with
email or Google to add events, rotate the alumnae spotlight, and update the
board list — no code required.

---

## Roles & Permissions (at a glance)

Sanity provides three built-in roles. Assign them at
[sanity.io/manage](https://sanity.io/manage) → your project → **Members**.

| Role | What they can do | Who gets it |
|---|---|---|
| **Administrator** | Everything: invite/remove users, change roles, delete content, manage the project | Co-Presidents, and the person maintaining the site |
| **Editor** | Create and edit any content (events, spotlights, board members, site settings). Cannot manage users or the project itself | Most board members and any WILA volunteer publishing content |
| **Viewer** | Read-only access to the Studio and drafts | Board members who only need to review before publishing |

Sanity's free tier includes **3 users** on the paid plans it's 20+. If you need
finer-grained permissions (e.g. "Can edit events but not board members"),
Sanity's [Custom Roles](https://www.sanity.io/docs/access-control) are on the
Growth plan ($99/mo).

---

## First-time setup (do this once)

You need: a GitHub account, a Sanity account (free), and a Vercel account
(free).

### 1. Push this repo to GitHub

```bash
cd wila-site
git init
git add .
git commit -m "Initial WILA site"
gh repo create wila-site --public --source=. --push
# or: create a repo on github.com and follow the "push existing" instructions
```

### 2. Create a Sanity project

```bash
npx sanity@latest init --env
```

- Choose **Create new project** → name it "WILA Content"
- Dataset: `production` (the default)
- Output path: leave the current directory
- When prompted for the config, **decline** the sample data
- This writes `.env.local` with your `NEXT_PUBLIC_SANITY_PROJECT_ID`

### 3. Configure CORS so the Studio can log in

Go to [sanity.io/manage](https://sanity.io/manage) → your project →
**API** → **CORS origins** → **Add CORS origin**:

- `http://localhost:3000` (allow credentials: ✓)
- `https://wila.haasalumni.org` (allow credentials: ✓)
- Any Vercel preview domain you use, e.g. `https://wila-site-*.vercel.app`

### 4. Deploy to Vercel

```bash
npm install -g vercel
vercel link       # follow prompts
vercel env pull   # (only if you already added env vars in the dashboard)
vercel --prod
```

In the Vercel dashboard → your project → **Settings → Environment Variables**,
add these (they're already in `.env.local` locally):

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` = `production`
- `NEXT_PUBLIC_SANITY_API_VERSION` = `2025-01-01`

Then redeploy: `vercel --prod`.

### 5. Point the domain

In Vercel → **Settings → Domains** add `wila.haasalumni.org`. Vercel gives
you a CNAME record (`cname.vercel-dns.com`). Add it to the DNS for
`haasalumni.org` and wait ~5 minutes.

---

## Inviting board members (super admin view)

1. Log in to [sanity.io/manage](https://sanity.io/manage)
2. Pick your project → **Members** tab
3. Click **Invite members**
4. Enter their email address
5. Choose their role: **Administrator**, **Editor**, or **Viewer**
6. Click **Send invite** — they get an email with a signup link

Recommended assignments for WILA:

- **Administrators (2–3 people, max):** Co-Presidents + technical maintainer
- **Editors (rest of the board):** everyone who needs to add events or update
  the spotlight
- **Viewers (optional):** external reviewers or advisors

To **remove someone**: same page → click their name → **Remove from project**.
To **change a role**: click their name → change the role dropdown → **Save**.

---

## Everyday content tasks

The Studio lives at **`https://wila.haasalumni.org/studio`**. Log in with the
email you invited. You'll see three sections in the sidebar:

### Add an event

1. Click **Events** → **+ Create**
2. Fill in title, start time, location, format (In person / Virtual / Hybrid),
   price, and blurb
3. Add an RSVP or recap URL
4. Click **Publish** (top right)

Events auto-partition to "Upcoming" vs "Past" on the site based on `startsAt`.
No need to move them manually.

### Rotate the alumnae spotlight

1. Click **Alumna spotlights** → **+ Create**
2. Fill in name, class year, current title, quote, bio, LinkedIn, and photo
3. Set **Featured from** to today's date
4. Click **Publish**

The site shows the spotlight with the most recent `Featured from` date. Past
spotlights stay in the CMS for reference.

### Update the board

1. Click **Board members** → pick a person, or **+ Create** for a new one
2. Update name, role, LinkedIn, photo
3. Set **Display order** — lower numbers show first (e.g. Co-Presidents = 1–3)
4. Toggle **Mark as draft** off once details are confirmed
5. Click **Publish**

### Edit the hero / about copy

1. Click **Site settings** (pinned at the top)
2. Update the hero eyebrow, headline, subhead, or About section
3. Click **Publish**

---

## Making changes appear live

The site uses Vercel's static generation. After you **Publish** in the Studio:

- Content updates roll out on the next build (default: within an hour)
- To force an immediate refresh, either trigger a Vercel redeploy from the
  dashboard (Deployments → **⋯** → Redeploy) or wire up a
  [Sanity webhook](https://www.sanity.io/docs/webhooks) → Vercel Deploy Hook
  for instant updates

---

## Local development

```bash
cp .env.example .env.local   # fill in your project ID
npm install
npm run dev                  # site at localhost:3000, studio at localhost:3000/studio
```

If you skip the `.env.local` step, the site still runs — it just shows the
hardcoded fallback content in `lib/content.ts` and `/studio` shows a
"setup required" screen.

---

## Troubleshooting

**"CORS error" when logging into the Studio.**
Add your domain (and localhost:3000) in sanity.io/manage → API → CORS origins,
with "Allow credentials" checked.

**Content published but not showing on the site.**
Vercel builds are cached. Trigger a redeploy from the Vercel dashboard, or
set up a Sanity → Vercel webhook so publishes deploy automatically.

**Editor can't see the Studio.**
Verify they accepted the invite email and that they're logged into Sanity with
the same email address. Ask them to visit
`https://wila.haasalumni.org/studio` in an incognito window.

**Need to reset a member's password.**
Sanity uses SSO (Google, GitHub, email magic link). Ask them to use the "Log
in with email" option, which sends a magic link every time — no password.

---

## Escalation / support

- Sanity account, roles, permissions → [sanity.io/manage](https://sanity.io/manage)
- Hosting, custom domain, deploy failures → [vercel.com/dashboard](https://vercel.com/dashboard)
- Site code, schemas, layout → this GitHub repo (open an issue)
