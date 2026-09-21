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
    rsvpUrl: r.rsvp_url ?? undefined,
    timeZone: r.time_zone ?? undefined
  };
}

function toSpotlight(r: any): SpotlightItem {
  return {
    id: r.id,
    name: r.name,
    gradYear: r.grad_year ?? undefined,
    spotlightLabel: r.spotlight_label ?? undefined,
    involvement: r.involvement ?? undefined,
    cta: r.cta ?? undefined,
    title: r.title ?? undefined,
    quote: r.quote ?? undefined,
    bio: r.bio ?? undefined,
    linkedin: r.linkedin ?? undefined,
    photoUrl: r.photo_url ?? undefined,
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
  timeZone?: string | null;
};

export async function createEvent(input: EventInput): Promise<EventItem> {
  const row = await queryOne(
    `INSERT INTO events (title, slug, starts_at, ends_at, location, format, price, blurb, rsvp_url, time_zone)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
      input.rsvpUrl || null,
      input.timeZone || null
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
       format = $7, price = $8, blurb = $9, rsvp_url = $10, time_zone = $11
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
      input.rsvpUrl || null,
      input.timeZone || null
    ]
  );
  return row ? toEvent(row) : null;
}

/**
 * Deletes an event. Its photo rows go with it by cascade, but the image bytes
 * they point at live in a separate table and would otherwise be stranded, so
 * those are removed first.
 */
export async function deleteEvent(id: string): Promise<void> {
  await query(
    `DELETE FROM images
     WHERE id::text IN (
       SELECT substring(url from '^/api/images/([0-9a-f-]{36})$')
       FROM event_photos WHERE event_id = $1
     )`,
    [id]
  );
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
  involvement?: string | null;
  bio?: string | null;
  linkedin?: string | null;
  cta?: string | null;
  photoUrl?: string | null;
  featuredFrom?: string | null;
};

const SPOTLIGHT_VALUES = (i: SpotlightInput) => [
  i.name,
  i.gradYear || null,
  i.spotlightLabel || null,
  i.title || null,
  i.involvement || null,
  i.bio || null,
  i.linkedin || null,
  i.cta || null,
  i.photoUrl || null,
  i.featuredFrom || null
];

export async function createSpotlight(
  input: SpotlightInput
): Promise<SpotlightItem> {
  const row = await queryOne(
    `INSERT INTO spotlights
       (name, grad_year, spotlight_label, title, involvement, bio, linkedin,
        cta, photo_url, featured_from)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    SPOTLIGHT_VALUES(input)
  );
  return toSpotlight(row);
}

/**
 * Updates the template fields. Columns the template dropped (quote, pillar,
 * chapter, mentor cohort) are left as they were rather than cleared.
 */
export async function updateSpotlight(
  id: string,
  input: SpotlightInput
): Promise<SpotlightItem | null> {
  const row = await queryOne(
    `UPDATE spotlights SET
       name = $2, grad_year = $3, spotlight_label = $4, title = $5,
       involvement = $6, bio = $7, linkedin = $8, cta = $9, photo_url = $10,
       featured_from = $11
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
  firstName: string;
  lastName: string;
  /** First and last together, for display. */
  name: string;
  email: string;
  gradYear: string | null;
  program: string | null;
  linkedin: string | null;
  createdAt: string;
};

function toMember(r: any): MemberRow {
  // Rows from before first/last were split only have the combined name.
  let first = r.first_name ?? "";
  let last = r.last_name ?? "";
  if (!first && !last && r.name) {
    const parts = String(r.name).trim().split(/\s+/);
    first = parts.shift() ?? "";
    last = parts.join(" ");
  }
  return {
    id: r.id,
    firstName: first,
    lastName: last,
    name: [first, last].filter(Boolean).join(" ") || r.name || "",
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
    `SELECT id, name, first_name, last_name, email, grad_year, program, linkedin, created_at
     FROM members ORDER BY created_at DESC`
  );
  return rows.map(toMember);
}

export type MemberInput = {
  firstName: string;
  lastName: string;
  email: string;
  gradYear?: string | null;
  program?: string | null;
  linkedin?: string | null;
};

/**
 * Records a signup. Re-submitting the same address updates the details rather
 * than failing, so someone correcting a typo in their own entry is not told
 * they are already a member. A blank in the resubmission never wipes a value
 * that was already there.
 */
export async function upsertMember(input: MemberInput): Promise<MemberRow> {
  const full = `${input.firstName} ${input.lastName}`.trim();
  const row = await queryOne(
    `INSERT INTO members (name, first_name, last_name, email, grad_year, program, linkedin)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (lower(email)) DO UPDATE
       SET name = EXCLUDED.name,
           first_name = EXCLUDED.first_name,
           last_name = EXCLUDED.last_name,
           grad_year = COALESCE(EXCLUDED.grad_year, members.grad_year),
           program = COALESCE(EXCLUDED.program, members.program),
           linkedin = COALESCE(EXCLUDED.linkedin, members.linkedin)
     RETURNING id, name, first_name, last_name, email, grad_year, program, linkedin, created_at`,
    [
      full,
      input.firstName,
      input.lastName,
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

// ---- event photos ------------------------------------------------------

export type EventPhoto = {
  id: string;
  eventId: string;
  url: string;
  width: number | null;
  height: number | null;
};

function toPhoto(r: any): EventPhoto {
  return {
    id: r.id,
    eventId: r.event_id,
    url: r.url,
    width: r.width ?? null,
    height: r.height ?? null
  };
}

export async function listEventPhotos(eventId: string): Promise<EventPhoto[]> {
  const rows = await query(
    `SELECT * FROM event_photos WHERE event_id = $1 ORDER BY created_at ASC`,
    [eventId]
  );
  return rows.map(toPhoto);
}

export async function addEventPhoto(
  eventId: string,
  url: string,
  width: number | null,
  height: number | null
): Promise<EventPhoto> {
  const row = await queryOne(
    `INSERT INTO event_photos (event_id, url, width, height)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [eventId, url, width, height]
  );
  return toPhoto(row);
}

/** Removes a photo, and its stored bytes when they live in our database. */
export async function deleteEventPhoto(id: string): Promise<EventPhoto | null> {
  const row = await queryOne(`DELETE FROM event_photos WHERE id = $1 RETURNING *`, [id]);
  if (!row) return null;
  const imageId = String(row.url).match(/^\/api\/images\/([0-9a-f-]{36})$/)?.[1];
  if (imageId) await query(`DELETE FROM images WHERE id = $1`, [imageId]);
  return toPhoto(row);
}

export type EventWithPhotos = { event: EventItem; photos: EventPhoto[] };

/**
 * Every event that has photos, newest event first, each with its photos in
 * upload order. One query, grouped here, rather than one query per event.
 */
export async function listEventsWithPhotos(): Promise<EventWithPhotos[]> {
  const rows = await query(
    `SELECT e.*, p.id AS photo_id, p.url AS photo_url,
            p.width AS photo_width, p.height AS photo_height
     FROM events e
     JOIN event_photos p ON p.event_id = e.id
     ORDER BY e.starts_at DESC, p.created_at ASC`
  );
  const groups: EventWithPhotos[] = [];
  const byId = new Map<string, EventWithPhotos>();
  for (const r of rows) {
    let g = byId.get(r.id);
    if (!g) {
      g = { event: toEvent(r), photos: [] };
      byId.set(r.id, g);
      groups.push(g);
    }
    g.photos.push({
      id: r.photo_id,
      eventId: r.id,
      url: r.photo_url,
      width: r.photo_width ?? null,
      height: r.photo_height ?? null
    });
  }
  return groups;
}
