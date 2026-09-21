#!/usr/bin/env node
/**
 * Imports WILA's event history from the old WordPress site.
 *
 *   npm run events:import               # local database, dry run
 *   npm run events:import -- --write    # local database, for real
 *   npm run events:import -- --prod --write
 *
 * Reads the site's public events API, so it pulls whatever is published
 * there today. Events are matched on slug and existing rows are never
 * overwritten: anything the board has already edited in /admin wins.
 *
 * Locations come only from evidence in the event itself: its venue, or words
 * like "webinar" or "Zoom" in its own description. Where there is none, the
 * location says so rather than guessing, and the event is listed at the end
 * so someone can fill it in from /admin.
 */
import pg from "pg";

import { loadEnvForTarget } from "./load-env.mjs";

const { prod, file } = loadEnvForTarget();
const write = process.argv.includes("--write");
const url = process.env.DATABASE_URL;
if (!url) {
  console.error(`DATABASE_URL is not set in ${file}.`);
  process.exit(1);
}

const API =
  "https://wila.haasalumni.org/wp-json/tribe/events/v1/events" +
  "?start_date=2018-01-01&end_date=2030-12-31&per_page=100&status=publish";

const UNKNOWN_LOCATION = "See event details";

const decode = (s = "") =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

const text = (html = "") =>
  decode(html.replace(/<[^>]+>/g, " "))
    // A spaced en or em dash used as a separator reads as the dash this site
    // avoids; a colon does the same job.
    .replace(/\s+[–—]\s+/g, ": ")
    .replace(/\s+/g, " ")
    .trim();

/** One or two sentences, trimmed to a sentence boundary, never mid-word. */
function blurbFrom(html, title) {
  // Headings inside descriptions ("Workshop Description", a repeated title)
  // are labels, not prose; drop them before picking sentences.
  const body = html.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, " ");
  let t = text(body)
    .replace(/\bAbout this event\b/gi, "")
    .replace(/^(Workshop|Event) Description\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
  const t0 = text(title);
  if (t0 && t.toLowerCase().startsWith(t0.toLowerCase())) t = t.slice(t0.length).trim();
  if (!t) return "Details on the event page.";
  const sentences = t.match(/[^.!?]+[.!?]+/g) ?? [t];
  let out = "";
  for (const s of sentences) {
    if ((out + s).length > 320) break;
    out += s;
    if (out.length > 140) break;
  }
  out = (out || t.slice(0, 300)).trim();
  if (out.length > 320) out = out.slice(0, out.lastIndexOf(" ", 317)) + "…";
  // No em dashes on this site.
  return out.replace(/\s*—\s*/g, ", ").replace(/,\s*,/g, ",");
}

function whereAndHow(e) {
  const v = e.venue && !Array.isArray(e.venue) ? e.venue : null;
  const body = `${e.title} ${text(e.description)}`.toLowerCase();
  const online = /\b(webinar|virtual|online|zoom)\b/.test(body);

  if (v?.venue) {
    const venue = text(v.venue);
    const isOnline = /^online$/i.test(venue);
    const city = v.city ? text(v.city) : "";
    const location = isOnline
      ? "Online"
      : city && !venue.toLowerCase().includes(city.toLowerCase())
      ? `${venue}, ${city}`
      : venue;
    return { location, format: isOnline ? "Virtual" : "In person", known: true };
  }
  if (online) return { location: "Online", format: "Virtual", known: true };
  const inTitle = e.title.match(/\bin ([A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+)?)\b/);
  if (inTitle) return { location: text(inTitle[1]), format: "In person", known: true };
  if (/bank of america forum|haas school of business/.test(body)) {
    return { location: "Haas School of Business, Berkeley", format: "In person", known: true };
  }
  return { location: UNKNOWN_LOCATION, format: "In person", known: false };
}

function price(e) {
  const c = text(e.cost ?? "");
  if (!c) return null;
  return /^\$?0(\.00)?$/.test(c) ? "Free" : c;
}

function utc(s) {
  return s ? new Date(s.replace(" ", "T") + "Z").toISOString() : null;
}

const res = await fetch(API);
if (!res.ok) {
  console.error(`Could not read the old site's events API (HTTP ${res.status}).`);
  process.exit(1);
}
const { events = [] } = await res.json();

const rows = events.map((e) => {
  const { location, format, known } = whereAndHow(e);
  return {
    title: text(e.title),
    slug: e.slug,
    starts_at: utc(e.utc_start_date),
    ends_at: e.all_day ? null : utc(e.utc_end_date),
    location,
    format,
    price: price(e),
    blurb: blurbFrom(e.description, e.title),
    // Prefer the ticketing page, which outlives the old WordPress site.
    rsvp_url: e.website || e.url || null,
    // Pacific is the default and stored as null; record anything else.
    time_zone: e.timezone && e.timezone !== "America/Los_Angeles" ? e.timezone : null,
    known
  };
});

if (prod) {
  const host = url.replace(/^.*@/, "").replace(/\/.*$/, "");
  console.log(`Target: PRODUCTION (${host})`);
}
console.log(`${rows.length} events on the old site. ${write ? "Writing." : "Dry run, nothing written. Add --write to import."}\n`);

const client = new pg.Client({
  connectionString: url,
  ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false }
});
await client.connect();

let added = 0;
let kept = 0;
try {
  for (const r of rows.sort((a, b) => a.starts_at.localeCompare(b.starts_at))) {
    const exists = await client.query(`SELECT 1 FROM events WHERE slug = $1`, [r.slug]);
    const tag = exists.rows.length ? "kept " : write ? "added" : "new  ";
    console.log(`  ${tag}  ${r.starts_at.slice(0, 10)}  ${r.title}`);
    if (exists.rows.length) {
      kept++;
      continue;
    }
    if (write) {
      await client.query(
        `INSERT INTO events (title, slug, starts_at, ends_at, location, format, price, blurb, rsvp_url, time_zone)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (slug) DO NOTHING`,
        [r.title, r.slug, r.starts_at, r.ends_at, r.location, r.format, r.price, r.blurb, r.rsvp_url, r.time_zone]
      );
    }
    added++;
  }
} finally {
  await client.end();
}

console.log(`\n${write ? "Added" : "Would add"} ${added}, kept ${kept} that already existed.`);
const unknown = rows.filter((r) => !r.known);
if (unknown.length) {
  console.log(`\nNo location in the source for these. Fill them in from /admin:`);
  for (const r of unknown) console.log(`  ${r.starts_at.slice(0, 10)}  ${r.title}`);
}
