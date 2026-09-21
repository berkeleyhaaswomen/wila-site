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
export const EVENT_TIME_ZONE = "America/Los_Angeles";

/** The zone to show an event in: its own if set, otherwise Pacific. */
export function zoneOf(e: { timeZone?: string | null }): string {
  return e.timeZone || EVENT_TIME_ZONE;
}

export function formatEventDate(e: EventItem): string {
  if (e.date) return e.date;
  if (!e.startsAt) return "TBD";
  const d = new Date(e.startsAt);
  const timeZone = zoneOf(e);

  // All-day events are stored at local midnight. Showing "12:00 AM" for those
  // reads as a real start time, so a midnight start prints as a date alone.
  const clock = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone
  }).format(d);
  const allDay = clock === "00:00" || clock === "24:00";

  return d.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...(allDay
      ? {}
      : { hour: "numeric", minute: "2-digit", timeZoneName: "short" }),
    timeZone
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
  const at = (e: EventItem) => (e.startsAt ? new Date(e.startsAt).getTime() : 0);
  // Soonest upcoming first; most recent past first.
  upcoming.sort((a, b) => at(a) - at(b));
  past.sort((a, b) => at(b) - at(a));
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
 * ISO string, reading it in the given zone (Pacific unless told otherwise).
 *
 * `new Date("2027-06-18T09:30")` would read it in whatever zone the machine
 * happens to be in: Pacific on a Bay Area laptop, UTC on Vercel. That
 * silently shifts every event by 7-8 hours once deployed.
 *
 * Two passes so the offset is looked up at the right instant across a DST
 * boundary; the second pass is a no-op the rest of the year.
 */
export function zonedInputToISO(
  naive: string,
  timeZone: string = EVENT_TIME_ZONE
): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(naive)) return null;
  const asUtc = new Date(`${naive.slice(0, 16)}:00Z`);
  if (Number.isNaN(asUtc.getTime())) return null;
  let utc = new Date(asUtc.getTime() - tzOffsetMs(asUtc, timeZone));
  utc = new Date(asUtc.getTime() - tzOffsetMs(utc, timeZone));
  return utc.toISOString();
}

/** Pacific shorthand, kept for existing callers. */
export const pacificInputToISO = (naive: string) => zonedInputToISO(naive);

/** The inverse: a UTC ISO string as the wall-clock value the input wants. */
export function isoToZonedInput(
  iso?: string | null,
  timeZone: string = EVENT_TIME_ZONE
): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone,
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

/** Pacific shorthand, kept for existing callers. */
export const isoToPacificInput = (iso?: string | null) => isoToZonedInput(iso);
