#!/usr/bin/env node
/**
 * Runs db/schema.sql and every query the app issues against a real Postgres
 * (PGlite — Postgres compiled to WASM, in-process). Catches SQL typos,
 * constraint mistakes, and bad column names without needing a database server.
 *
 *   node scripts/verify-sql.mjs
 */
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();
let failures = 0;

async function step(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failures++;
    console.log(`  ✗ ${name}\n      ${err.message}`);
  }
}

console.log("\nschema");
await step("schema.sql applies", async () => {
  await db.exec(readFileSync("db/schema.sql", "utf8"));
});
await step("schema.sql is idempotent (second run)", async () => {
  await db.exec(readFileSync("db/schema.sql", "utf8"));
});

console.log("\nusers");
let userId;
await step("insert superadmin", async () => {
  const r = await db.query(
    `INSERT INTO users (email, name, role, password_hash)
     VALUES ($1,$2,$3,$4) RETURNING id, email, name, role, created_at`,
    ["Pdeepti@Gmail.com", "Deepti", "superadmin", "$2a$12$fakehashfakehashfake"]
  );
  userId = r.rows[0].id;
  if (!userId) throw new Error("no id returned");
});
await step("email uniqueness is case-insensitive", async () => {
  try {
    await db.query(
      `INSERT INTO users (email, role, password_hash) VALUES ($1,$2,$3)`,
      ["pdeepti@gmail.com", "admin", "x"]
    );
  } catch {
    return; // expected
  }
  throw new Error("duplicate email was allowed");
});
await step("findUserByEmail matches different casing", async () => {
  const r = await db.query(
    `SELECT id, email, name, role, password_hash FROM users WHERE lower(email) = lower($1)`,
    ["PDEEPTI@gmail.com"]
  );
  if (r.rows.length !== 1) throw new Error(`got ${r.rows.length} rows`);
});
await step("invalid role is rejected", async () => {
  try {
    await db.query(
      `INSERT INTO users (email, role, password_hash) VALUES ($1,$2,$3)`,
      ["x@y.com", "owner", "x"]
    );
  } catch {
    return;
  }
  throw new Error("bad role was allowed");
});
await step("countSuperadmins", async () => {
  const r = await db.query(
    `SELECT count(*)::text AS n FROM users WHERE role = 'superadmin'`
  );
  if (r.rows[0].n !== "1") throw new Error(`expected 1, got ${r.rows[0].n}`);
});
await step("listUsers", async () => {
  await db.query(
    `SELECT id, email, name, role, created_at FROM users ORDER BY created_at ASC`
  );
});
await step("updateUserRole / updateUserPassword", async () => {
  await db.query(`UPDATE users SET role = $2 WHERE id = $1`, [userId, "admin"]);
  await db.query(`UPDATE users SET password_hash = $2 WHERE id = $1`, [
    userId,
    "newhash"
  ]);
  await db.query(`UPDATE users SET role = $2 WHERE id = $1`, [
    userId,
    "superadmin"
  ]);
});
// PGlite freezes now() and clock_timestamp(), so we can't assert that the
// timestamp *advances*. Instead, back-date the row and check the trigger
// overwrites it — which proves the trigger is attached and firing.
await step("updated_at trigger fires on UPDATE", async () => {
  await db.query(
    `UPDATE users SET updated_at = '2000-01-01T00:00:00Z' WHERE id = $1`,
    [userId]
  );
  const stale = await db.query(`SELECT updated_at FROM users WHERE id = $1`, [
    userId
  ]);
  if (new Date(stale.rows[0].updated_at).getFullYear() !== 2000) {
    // The trigger already replaced it during the back-dating UPDATE — also fine.
    return;
  }
  throw new Error("trigger did not overwrite a manually-set updated_at");
});

console.log("\nowner");
let peerId;
await step("first superadmin claims ownership", async () => {
  const r = await db.query(
    `UPDATE users SET is_owner = true
     WHERE id = $1 AND NOT EXISTS (SELECT 1 FROM users WHERE is_owner)
     RETURNING id`,
    [userId]
  );
  if (r.rows.length !== 1) throw new Error("owner not set");
});
await step("a second claim is a no-op (owner already exists)", async () => {
  const r = await db.query(
    `INSERT INTO users (email, role, password_hash) VALUES ($1,$2,$3) RETURNING id`,
    ["peer@example.com", "superadmin", "x"]
  );
  peerId = r.rows[0].id;
  const claim = await db.query(
    `UPDATE users SET is_owner = true
     WHERE id = $1 AND NOT EXISTS (SELECT 1 FROM users WHERE is_owner)
     RETURNING id`,
    [peerId]
  );
  if (claim.rows.length !== 0) throw new Error("second user also became owner");
});
await step("two owners are rejected by the unique index", async () => {
  try {
    await db.query(`UPDATE users SET is_owner = true WHERE id = $1`, [peerId]);
  } catch {
    return; // expected
  }
  throw new Error("a second owner was allowed");
});
await step("transferOwnership moves it atomically", async () => {
  await db.query("BEGIN");
  await db.query(`UPDATE users SET is_owner = false WHERE is_owner`);
  await db.query(
    `UPDATE users SET is_owner = true, role = 'superadmin' WHERE id = $1`,
    [peerId]
  );
  await db.query("COMMIT");
  const r = await db.query(`SELECT id FROM users WHERE is_owner`);
  if (r.rows.length !== 1 || r.rows[0].id !== peerId) {
    throw new Error(`expected exactly the peer to own; got ${r.rows.length} owner(s)`);
  }
});
await step("hand ownership back", async () => {
  await db.query("BEGIN");
  await db.query(`UPDATE users SET is_owner = false WHERE is_owner`);
  await db.query(`UPDATE users SET is_owner = true WHERE id = $1`, [userId]);
  await db.query("COMMIT");
  await db.query(`DELETE FROM users WHERE id = $1`, [peerId]);
});

console.log("\nevents");
let eventId;
const eventCols = [
  "Reclaim Your Ambitions",
  "reclaim-your-ambitions",
  "2025-09-21T10:00:00Z",
  "2025-09-21T12:30:00Z",
  "Pleasanton, CA",
  "In person",
  "$75",
  "A transformative workshop.",
  "https://example.com/e"
];
await step("createEvent", async () => {
  const r = await db.query(
    `INSERT INTO events (title, slug, starts_at, ends_at, location, format, price, blurb, rsvp_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    eventCols
  );
  eventId = r.rows[0].id;
});
await step("invalid format is rejected", async () => {
  try {
    await db.query(
      `INSERT INTO events (title, slug, starts_at, location, format, blurb)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      ["x", "x-slug", "2025-01-01T00:00:00Z", "here", "Onsite", "b"]
    );
  } catch {
    return;
  }
  throw new Error("bad format was allowed");
});
await step("listEvents", async () => {
  await db.query(`SELECT * FROM events ORDER BY starts_at DESC`);
});
await step("getEvent", async () => {
  const r = await db.query(`SELECT * FROM events WHERE id = $1`, [eventId]);
  if (r.rows.length !== 1) throw new Error("not found");
});
await step("eventSlugTaken excludes self", async () => {
  const same = await db.query(
    `SELECT id FROM events WHERE slug = $1 AND ($2::uuid IS NULL OR id <> $2)`,
    ["reclaim-your-ambitions", eventId]
  );
  if (same.rows.length !== 0) throw new Error("own slug reported as taken");
  const other = await db.query(
    `SELECT id FROM events WHERE slug = $1 AND ($2::uuid IS NULL OR id <> $2)`,
    ["reclaim-your-ambitions", null]
  );
  if (other.rows.length !== 1) throw new Error("slug not reported as taken");
});
await step("updateEvent", async () => {
  const r = await db.query(
    `UPDATE events SET
       title = $2, slug = $3, starts_at = $4, ends_at = $5, location = $6,
       format = $7, price = $8, blurb = $9, rsvp_url = $10
     WHERE id = $1 RETURNING *`,
    [eventId, ...eventCols]
  );
  if (r.rows.length !== 1) throw new Error("update returned no row");
});

console.log("\nspotlights");
let spotId;
const spotCols = [
  "Priya Ramanathan",
  "MBA ’14",
  "Q2 2026 Spotlight",
  "VP of Product, Lumen Health",
  "“…permission.”",
  "Priya leads the product org…",
  "https://linkedin.com/in/x",
  "https://example.com/p.jpg",
  "Student Always",
  "Bay Area",
  "2024 – present",
  "#contact",
  "2026-04-01"
];
await step("createSpotlight", async () => {
  const r = await db.query(
    `INSERT INTO spotlights
       (name, grad_year, spotlight_label, title, quote, bio, linkedin,
        photo_url, pillar, chapter, mentor_cohort, nominate_url, featured_from)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
    spotCols
  );
  spotId = r.rows[0].id;
});
await step("updateSpotlight", async () => {
  const r = await db.query(
    `UPDATE spotlights SET
       name = $2, grad_year = $3, spotlight_label = $4, title = $5, quote = $6,
       bio = $7, linkedin = $8, photo_url = $9, pillar = $10, chapter = $11,
       mentor_cohort = $12, nominate_url = $13, featured_from = $14
     WHERE id = $1 RETURNING *`,
    [spotId, ...spotCols]
  );
  if (r.rows.length !== 1) throw new Error("update returned no row");
});
await step("getCurrentSpotlight picks the newest featured_from", async () => {
  await db.query(
    `INSERT INTO spotlights (name, quote, featured_from) VALUES ($1,$2,$3)`,
    ["Older Alumna", "q", "2020-01-01"]
  );
  await db.query(
    `INSERT INTO spotlights (name, quote, featured_from) VALUES ($1,$2,$3)`,
    ["Newest Alumna", "q", "2026-12-01"]
  );
  const r = await db.query(
    `SELECT * FROM spotlights
     ORDER BY featured_from DESC NULLS LAST, created_at DESC LIMIT 1`
  );
  if (r.rows[0].name !== "Newest Alumna") {
    throw new Error(`got "${r.rows[0].name}"`);
  }
});
await step("listSpotlights orders newest first", async () => {
  const r = await db.query(
    `SELECT * FROM spotlights ORDER BY featured_from DESC NULLS LAST, created_at DESC`
  );
  if (r.rows[0].name !== "Newest Alumna") throw new Error("wrong order");
});
await step("a spotlight with no featured_from sorts last, not first", async () => {
  await db.query(`INSERT INTO spotlights (name, quote) VALUES ($1,$2)`, [
    "No Date Alumna",
    "q"
  ]);
  const r = await db.query(
    `SELECT name FROM spotlights ORDER BY featured_from DESC NULLS LAST, created_at DESC LIMIT 1`
  );
  if (r.rows[0].name !== "Newest Alumna") {
    throw new Error(`NULLS LAST broken — homepage would show "${r.rows[0].name}"`);
  }
});

console.log("\ndeletes");
await step("deleteEvent", async () => {
  await db.query(`DELETE FROM events WHERE id = $1`, [eventId]);
});
await step("deleteSpotlight", async () => {
  await db.query(`DELETE FROM spotlights WHERE id = $1`, [spotId]);
});
await step("deleteUser", async () => {
  await db.query(`UPDATE users SET is_owner = false WHERE id = $1`, [userId]);
  await db.query(`DELETE FROM users WHERE id = $1`, [userId]);
});

console.log(
  failures === 0
    ? "\nAll SQL checks passed.\n"
    : `\n${failures} check(s) FAILED.\n`
);
process.exit(failures === 0 ? 0 : 1);
