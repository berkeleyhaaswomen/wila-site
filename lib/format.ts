/**
 * Pure formatting helpers. No database, no server-only imports, so client
 * components can use them too.
 */
import type { EventItem } from "./types";

/**
 * All event times are shown in Pacific.
 *
 * Without pinning this, the same timestamp renders in UTC on the server and in
 * the visitor's zone in the browser, which is a hydration mismatch on the
 * public site, and makes the admin list (server-rendered) disagree with the
 * event cards (client-rendered) about what time an event starts.
 *
 * Pacific rather than the viewer's own zone because WILA is a Berkeley
 * organisation whose events are scheduled in local time, and the site has
 * always quoted them that way ("6:00 – 7:00 PM PDT").
 */
const EVENT_TIME_ZONE = "America/Los_Angeles";

export function formatEventDate(e: EventItem): string {
  if (e.date) return e.date;
  if (!e.startsAt) return "TBD";
  const d = new Date(e.startsAt);
  return d.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: EVENT_TIME_ZONE
  });
}

export function partitionEvents(items: EventItem[]) {
  const now = Date.now();
  const upcoming: EventItem[] = [];
  const past: EventItem[] = [];
  for (const e of items) {
    const ts = e.startsAt ? new Date(e.startsAt).getTime() : NaN;
    // If no timestamp (only a pre-formatted date), assume past.
    if (isFinite(ts) && ts >= now) upcoming.push(e);
    else past.push(e);
  }
  return { upcoming, past };
}

/** Offset of `tz` from UTC, in ms, at the given instant. */
function tzOffsetMs(at: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  })
    .formatToParts(at)
    .reduce<Record<string, string>>((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {});
  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour === "24" ? "0" : parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return asIfUtc - at.getTime();
}

/**
 * Turns a <input type="datetime-local"> value ("2027-06-18T09:30") into a UTC
 * ISO string, reading it as Pacific.
 *
 * `new Date("2027-06-18T09:30")` would read it in whatever zone the machine
 * happens to be in: Pacific on a Bay Area laptop, UTC on Vercel. That
 * silently shifts every event by 7-8 hours once deployed.
 *
 * Two passes so the offset is looked up at the right instant across a DST
 * boundary; the second pass is a no-op the rest of the year.
 */
export function pacificInputToISO(naive: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(naive)) return null;
  const asUtc = new Date(`${naive.slice(0, 16)}:00Z`);
  if (Number.isNaN(asUtc.getTime())) return null;
  let utc = new Date(asUtc.getTime() - tzOffsetMs(asUtc, EVENT_TIME_ZONE));
  utc = new Date(asUtc.getTime() - tzOffsetMs(utc, EVENT_TIME_ZONE));
  return utc.toISOString();
}

/** The inverse: a UTC ISO string as the Pacific wall-clock value the input wants. */
export function isoToPacificInput(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: EVENT_TIME_ZONE,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  })
    .formatToParts(d)
    .reduce<Record<string, string>>((acc, x) => {
      if (x.type !== "literal") acc[x.type] = x.value;
      return acc;
    }, {});
  const hour = p.hour === "24" ? "00" : p.hour;
  return `${p.year}-${p.month}-${p.day}T${hour}:${p.minute}`;
}
