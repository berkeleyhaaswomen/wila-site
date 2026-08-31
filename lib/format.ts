/**
 * Pure formatting helpers — no database, no server-only imports, so client
 * components can use them too.
 */
import type { EventItem } from "./types";

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
    timeZoneName: "short"
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
