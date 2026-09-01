-- WILA site schema.
-- Idempotent: safe to run repeatedly. Applied by `npm run db:migrate`.

-- gen_random_uuid() is core Postgres since 13. On older servers it lives in
-- pgcrypto, so try to enable it — but don't fail the migration if the
-- extension isn't installable, since we almost certainly don't need it.
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pgcrypto;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pgcrypto unavailable (%). Continuing — gen_random_uuid() is built in on Postgres 13+.', SQLERRM;
END $$;

-- ---------------------------------------------------------------- users ----
-- Two roles, matching how the board actually works:
--   superadmin — everything, including adding/removing website managers
--   admin      — all content (events, spotlights), but cannot manage users
CREATE TABLE IF NOT EXISTS users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL,
  password_hash text NOT NULL,
  name          text,
  role          text NOT NULL CHECK (role IN ('superadmin', 'admin')),
  -- The owner is a super admin no other super admin can remove or demote.
  -- Guards against a co-president (or a compromised account) locking out the
  -- person who actually runs the site. At most one, enforced below.
  is_owner      boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Added after the initial release, so existing databases need the column too.
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_owner boolean NOT NULL DEFAULT false;

-- At most one owner. A partial index only constrains the rows where it's true.
CREATE UNIQUE INDEX IF NOT EXISTS users_single_owner_idx
  ON users ((is_owner)) WHERE is_owner;

-- Emails are case-insensitive for login purposes.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (lower(email));

-- Backfill: if there are super admins but nobody owns the site yet (a database
-- created before is_owner existed), the longest-standing super admin becomes
-- the owner. Without this, an upgraded database would have no protected
-- account at all.
UPDATE users SET is_owner = true
WHERE id = (
  SELECT id FROM users WHERE role = 'superadmin'
  ORDER BY created_at ASC LIMIT 1
)
AND NOT EXISTS (SELECT 1 FROM users WHERE is_owner);

-- --------------------------------------------------------------- events ----
CREATE TABLE IF NOT EXISTS events (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  slug       text NOT NULL UNIQUE,
  starts_at  timestamptz NOT NULL,
  ends_at    timestamptz,
  location   text NOT NULL,
  format     text NOT NULL CHECK (format IN ('In person', 'Virtual', 'Hybrid')),
  price      text,
  blurb      text NOT NULL,
  rsvp_url   text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_starts_at_idx ON events (starts_at DESC);

-- ----------------------------------------------------------- spotlights ----
CREATE TABLE IF NOT EXISTS spotlights (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  grad_year       text,
  spotlight_label text,
  title           text,
  quote           text NOT NULL,
  bio             text,
  linkedin        text,
  photo_url       text,
  pillar          text,
  chapter         text,
  mentor_cohort   text,
  nominate_url    text,
  featured_from   date,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- The homepage shows the spotlight with the most recent featured_from.
CREATE INDEX IF NOT EXISTS spotlights_featured_from_idx
  ON spotlights (featured_from DESC NULLS LAST);

-- ------------------------------------------------------------ updated_at ---
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['users', 'events', 'spotlights'] LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS %I ON %I', t || '_set_updated_at', t
    );
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON %I
         FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      t || '_set_updated_at', t
    );
  END LOOP;
END $$;
