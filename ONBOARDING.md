# Welcome to the WILA Admin Site

You've been given access to help maintain **wila.haasalumni.org**. This guide
gets you from zero to publishing your first update in under 10 minutes.

You don't need to know code. Everything happens in a web form.

---

## 1. Sign in

Go to the site and scroll to the very bottom. Click
**"Administrator? Sign in here."** — or go straight to
**wila.haasalumni.org/admin**.

Sign in with the email address and the temporary password a super admin gave
you.

### Change your password right away

Click **Account** in the top nav → **Change your password**. Your temporary
password was shared with you by another person, so treat it as compromised
from day one. Pick something at least 12 characters that you don't use
anywhere else.

---

## 2. Your role

| Your role | What you can do |
|---|---|
| **Admin** (most people) | Add, edit, and delete events and spotlights. |
| **Super admin** | All of the above, plus adding and removing the people who manage the site. |

If you see a **Users** tab in the top nav, you're a super admin. If you don't,
you're an Admin — and if you need someone added or removed, ask a
Co-President.

---

## 3. Make your first edit (practice run)

Let's post a fake event, then delete it. This gives you the feel of the tool
without touching real content.

1. Click **Events** → **New event**
2. Fill in:
   - **Event title:** `Test event — please ignore`
   - **Blurb:** `This is a test.`
   - **Starts at:** any date next year
   - **Location:** `Test location`
   - **Format:** any
3. Leave Slug blank — it fills itself in from the title
4. Click **Save event**
5. Open the public site in another tab; your test event appears under
   "Upcoming" within seconds
6. Come back, click the test event, scroll down, click **Delete event**

You now know how to publish anything.

---

## 4. Common tasks

**Post a real event**
Events → **New event** → fill in the fields → **Save event**.
Events sort themselves into "Upcoming" and "Past" based on their start date,
so you never move them by hand. The link at the bottom of the card is labelled
"RSVP" while the event is upcoming and "View recap" once it's passed — same
field, so put the recap URL there after the event.

**Rotate the alumnae spotlight**
Spotlights → **New spotlight** → fill in name, quote, bio, photo, and links →
set **Featured from** to today → **Save spotlight**.
The homepage always shows whichever spotlight has the most recent "Featured
from" date. The one currently live is tagged **On the homepage** in the list.
Older ones stay for reference.

**Add a spotlight photo**
On the spotlight form, either click **Upload a photo** and pick a file from
your computer, or paste a link into the box next to it. Portrait orientation
works best — roughly 800×1000, under 5 MB. If you skip it, the card falls back
to the illustrated placeholder, which looks fine.

---

## 5. Good habits

- **Blurbs stay short.** One to three sentences. The card design falls apart
  with a wall of text.
- **Write "Free" rather than leaving Price blank** when an event is free —
  blank hides the row entirely.
- **Check the start time's AM/PM** before saving. It decides whether the event
  shows as Upcoming or Past.
- **Leave a field blank rather than filling it with a placeholder.** Empty
  fields are left out of the card; "TBD" is not.
- **There is no undo on delete.** Deleting is immediate and permanent.

---

## 6. When something goes wrong

**"I can't sign in."**
Ask a super admin to reset your password from the Users page. There's no
self-service password reset yet.

**"My change isn't showing on the site."**
Hard-refresh the public page (Cmd/Ctrl + Shift + R). If it's still missing,
check the event's start date — it may have sorted into Past.

**"I deleted something by accident."**
There's no revision history. Re-create it, and tell a Co-President so they
know. If it was recent, the database provider may have a point-in-time backup
— worth asking quickly.

**"The admin site shows a database error."**
That's for a Co-President or the technical maintainer — send them a
screenshot.

---

## 7. Who to ask

| Question | Who |
|---|---|
| How does a specific field work? | Any Admin or super admin on the board |
| Can I have access? / Please reset my password | A Co-President |
| Something on the public site looks wrong | Post in the board Slack channel |
| The admin site won't load, or a real bug | Co-Presidents → technical maintainer |

---

**That's it — welcome aboard!** The fastest way to get comfortable is to
publish a real event. Everything else in the admin site works the same way.
