import "server-only";

import { getPool, query, queryOne, dbConfigured } from "./db";
import type { EventItem, SpotlightItem } from "./types";
import type { Role } from "./auth";

export { dbConfigured };

// ---- row mapping -------------------------------------------------------
// The database uses snake_case; the UI uses camelCase. Map in one place.

function toEvent(r: any): EventItem {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    startsAt: r.starts_at instanceof Date ? r.starts_at.toISOString() : r.starts_at,
    endsAt: r.ends_at instanceof Date ? r.ends_at.toISOString() : r.ends_at,
    location: r.location,
    format: r.format,
    price: r.price ?? undefined,
    blurb: r.blurb,
    rsvpUrl: r.rsvp_url ?? undefined
  };
}

function toSpotlight(r: any): SpotlightItem {
  return {
    id: r.id,
    name: r.name,
    gradYear: r.grad_year ?? undefined,
    spotlightLabel: r.spotlight_label ?? undefined,
    title: r.title ?? undefined,
    quote: r.quote,
    bio: r.bio ?? undefined,
    linkedin: r.linkedin ?? undefined,
    photoUrl: r.photo_url ?? undefined,
    pillar: r.pillar ?? undefined,
    chapter: r.chapter ?? undefined,
    mentorCohort: r.mentor_cohort ?? undefined,
    nominateUrl: r.nominate_url ?? undefined,
    featuredFrom:
      r.featured_from instanceof Date
        ? r.featured_from.toISOString().slice(0, 10)
        : r.featured_from ?? undefined
  };
}

// ---- events ------------------------------------------------------------

export async function listEvents(): Promise<EventItem[]> {
  const rows = await query(`SELECT * FROM events ORDER BY starts_at DESC`);
  return rows.map(toEvent);
}

export async function getEvent(id: string): Promise<EventItem | null> {
  const row = await queryOne(`SELECT * FROM events WHERE id = $1`, [id]);
  return row ? toEvent(row) : null;
}

export type EventInput = {
  title: string;
  slug: string;
  startsAt: string;
  endsAt?: string | null;
  location: string;
  format: EventItem["format"];
  price?: string | null;
  blurb: string;
  rsvpUrl?: string | null;
};

export async function createEvent(input: EventInput): Promise<EventItem> {
  const row = await queryOne(
    `INSERT INTO events (title, slug, starts_at, ends_at, location, format, price, blurb, rsvp_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      input.title,
      input.slug,
      input.startsAt,
      input.endsAt || null,
      input.location,
      input.format,
      input.price || null,
      input.blurb,
      input.rsvpUrl || null
    ]
  );
  return toEvent(row);
}

export async function updateEvent(
  id: string,
  input: EventInput
): Promise<EventItem | null> {
  const row = await queryOne(
    `UPDATE events SET
       title = $2, slug = $3, starts_at = $4, ends_at = $5, location = $6,
       format = $7, price = $8, blurb = $9, rsvp_url = $10
     WHERE id = $1
     RETURNING *`,
    [
      id,
      input.title,
      input.slug,
      input.startsAt,
      input.endsAt || null,
      input.location,
      input.format,
      input.price || null,
      input.blurb,
      input.rsvpUrl || null
    ]
  );
  return row ? toEvent(row) : null;
}

export async function deleteEvent(id: string): Promise<void> {
  await query(`DELETE FROM events WHERE id = $1`, [id]);
}

/** True when some *other* event already uses this slug. */
export async function eventSlugTaken(
  slug: string,
  exceptId?: string
): Promise<boolean> {
  const row = await queryOne(
    `SELECT id FROM events WHERE slug = $1 AND ($2::uuid IS NULL OR id <> $2)`,
    [slug, exceptId ?? null]
  );
  return Boolean(row);
}

// ---- spotlights --------------------------------------------------------

export async function listSpotlights(): Promise<SpotlightItem[]> {
  const rows = await query(
    `SELECT * FROM spotlights ORDER BY featured_from DESC NULLS LAST, created_at DESC`
  );
  return rows.map(toSpotlight);
}

export async function getSpotlightById(
  id: string
): Promise<SpotlightItem | null> {
  const row = await queryOne(`SELECT * FROM spotlights WHERE id = $1`, [id]);
  return row ? toSpotlight(row) : null;
}

/** The one the homepage shows: most recent featured_from. */
export async function getCurrentSpotlight(): Promise<SpotlightItem | null> {
  const row = await queryOne(
    `SELECT * FROM spotlights
     ORDER BY featured_from DESC NULLS LAST, created_at DESC
     LIMIT 1`
  );
  return row ? toSpotlight(row) : null;
}

export type SpotlightInput = {
  name: string;
  gradYear?: string | null;
  spotlightLabel?: string | null;
  title?: string | null;
  quote: string;
  bio?: string | null;
  linkedin?: string | null;
  photoUrl?: string | null;
  pillar?: string | null;
  chapter?: string | null;
  mentorCohort?: string | null;
  nominateUrl?: string | null;
  featuredFrom?: string | null;
};

const SPOTLIGHT_VALUES = (i: SpotlightInput) => [
  i.name,
  i.gradYear || null,
  i.spotlightLabel || null,
  i.title || null,
  i.quote,
  i.bio || null,
  i.linkedin || null,
  i.photoUrl || null,
  i.pillar || null,
  i.chapter || null,
  i.mentorCohort || null,
  i.nominateUrl || null,
  i.featuredFrom || null
];

export async function createSpotlight(
  input: SpotlightInput
): Promise<SpotlightItem> {
  const row = await queryOne(
    `INSERT INTO spotlights
       (name, grad_year, spotlight_label, title, quote, bio, linkedin,
        photo_url, pillar, chapter, mentor_cohort, nominate_url, featured_from)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING *`,
    SPOTLIGHT_VALUES(input)
  );
  return toSpotlight(row);
}

export async function updateSpotlight(
  id: string,
  input: SpotlightInput
): Promise<SpotlightItem | null> {
  const row = await queryOne(
    `UPDATE spotlights SET
       name = $2, grad_year = $3, spotlight_label = $4, title = $5, quote = $6,
       bio = $7, linkedin = $8, photo_url = $9, pillar = $10, chapter = $11,
       mentor_cohort = $12, nominate_url = $13, featured_from = $14
     WHERE id = $1
     RETURNING *`,
    [id, ...SPOTLIGHT_VALUES(input)]
  );
  return row ? toSpotlight(row) : null;
}

export async function deleteSpotlight(id: string): Promise<void> {
  await query(`DELETE FROM spotlights WHERE id = $1`, [id]);
}

// ---- users -------------------------------------------------------------

export type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  isOwner: boolean;
  createdAt: string;
};

function toUser(r: any): UserRow {
  return {
    id: r.id,
    email: r.email,
    name: r.name ?? null,
    role: r.role,
    isOwner: Boolean(r.is_owner),
    createdAt:
      r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at
  };
}

export async function listUsers(): Promise<UserRow[]> {
  const rows = await query(
    `SELECT id, email, name, role, is_owner, created_at
     FROM users ORDER BY created_at ASC`
  );
  return rows.map(toUser);
}

export async function findUserByEmail(email: string) {
  return queryOne<{
    id: string;
    email: string;
    name: string | null;
    role: Role;
    is_owner: boolean;
    password_hash: string;
  }>(
    `SELECT id, email, name, role, is_owner, password_hash
     FROM users WHERE lower(email) = lower($1)`,
    [email]
  );
}

export async function createUser(input: {
  email: string;
  name?: string | null;
  role: Role;
  passwordHash: string;
}): Promise<UserRow> {
  const row = await queryOne(
    `INSERT INTO users (email, name, role, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, name, role, is_owner, created_at`,
    [input.email, input.name || null, input.role, input.passwordHash]
  );
  return toUser(row);
}

export async function updateUserRole(id: string, role: Role): Promise<void> {
  await query(`UPDATE users SET role = $2 WHERE id = $1`, [id, role]);
}

export async function updateUserPassword(
  id: string,
  passwordHash: string
): Promise<void> {
  await query(`UPDATE users SET password_hash = $2 WHERE id = $1`, [
    id,
    passwordHash
  ]);
}

export async function deleteUser(id: string): Promise<void> {
  await query(`DELETE FROM users WHERE id = $1`, [id]);
}

/**
 * Moves ownership to another user in one transaction, so the single-owner
 * index is never briefly violated and we can't end up with zero owners.
 * The new owner is promoted to superadmin if they weren't already.
 */
export async function transferOwnership(toUserId: string): Promise<void> {
  const pool = getPool();
  if (!pool) throw new Error("DATABASE_URL is not set");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`UPDATE users SET is_owner = false WHERE is_owner`);
    await client.query(
      `UPDATE users SET is_owner = true, role = 'superadmin' WHERE id = $1`,
      [toUserId]
    );
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Guards the "don't lock everyone out" rule: the last superadmin cannot be
 * deleted or demoted.
 */
export async function countSuperadmins(): Promise<number> {
  const row = await queryOne<{ n: string }>(
    `SELECT count(*)::text AS n FROM users WHERE role = 'superadmin'`
  );
  return Number(row?.n ?? 0);
}

// ---- members -----------------------------------------------------------

export type MemberRow = {
  id: string;
  name: string;
  email: string;
  gradYear: string | null;
  program: string | null;
  linkedin: string | null;
  createdAt: string;
};

function toMember(r: any): MemberRow {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    gradYear: r.grad_year ?? null,
    program: r.program ?? null,
    linkedin: r.linkedin ?? null,
    createdAt:
      r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at
  };
}

export async function listMembers(): Promise<MemberRow[]> {
  const rows = await query(
    `SELECT id, name, email, grad_year, program, linkedin, created_at
     FROM members ORDER BY created_at DESC`
  );
  return rows.map(toMember);
}

export type MemberInput = {
  name: string;
  email: string;
  gradYear?: string | null;
  program?: string | null;
  linkedin?: string | null;
};

/**
 * Records a signup. Re-submitting the same address updates the details rather
 * than failing, so someone correcting a typo in their own entry is not told
 * they are already a member.
 */
export async function upsertMember(input: MemberInput): Promise<MemberRow> {
  const row = await queryOne(
    `INSERT INTO members (name, email, grad_year, program, linkedin)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (lower(email)) DO UPDATE
       SET name = EXCLUDED.name,
           grad_year = COALESCE(EXCLUDED.grad_year, members.grad_year),
           program = COALESCE(EXCLUDED.program, members.program),
           linkedin = COALESCE(EXCLUDED.linkedin, members.linkedin)
     RETURNING id, name, email, grad_year, program, linkedin, created_at`,
    [
      input.name,
      input.email,
      input.gradYear || null,
      input.program || null,
      input.linkedin || null
    ]
  );
  return toMember(row);
}

export async function deleteMember(id: string): Promise<void> {
  await query(`DELETE FROM members WHERE id = $1`, [id]);
}

export async function countMembers(): Promise<number> {
  const row = await queryOne<{ n: string }>(
    `SELECT count(*)::text AS n FROM members`
  );
  return Number(row?.n ?? 0);
}
