/**
 * Central content layer.
 *
 * If Sanity is configured, data comes from the CMS. Otherwise, the site
 * renders the hardcoded fallbacks below — so a fresh clone always builds and
 * the site never goes dark waiting on a CMS.
 */

import { sanityClient } from "./sanity.client";
import {
  eventsQuery,
  boardQuery,
  spotlightQuery,
  settingsQuery
} from "./sanity.queries";

export type EventItem = {
  _id?: string;
  title: string;
  startsAt?: string; // ISO
  endsAt?: string;
  date?: string; // pre-formatted fallback
  location: string;
  format: "In person" | "Virtual" | "Hybrid";
  price?: string;
  blurb: string;
  rsvpUrl?: string;
};

export type BoardMember = {
  _id?: string;
  name: string;
  role: string;
  linkedin?: string;
  photo?: any;
  isDraft?: boolean;
};

// ---- Fallbacks ---------------------------------------------------------

const FALLBACK_EVENTS: EventItem[] = [
  {
    title: "From Interest to Impact: Serving on Boards",
    date: "October 6, 2025 · 6:00 – 7:00 PM PDT",
    location: "Online",
    format: "Virtual",
    price: "Free",
    blurb:
      "Exclusive 1-hour session where seasoned professionals shared practical tips and insider advice on how to serve — and succeed — on boards.",
    rsvpUrl:
      "https://wila.haasalumni.org/event/from-interest-to-impact-serving-on-boards/"
  },
  {
    title: "Reclaim Your Ambitions: A Sustainable Approach to Thriving",
    date: "September 21, 2025 · 10:00 AM – 12:30 PM PDT",
    location: "Pleasanton, CA",
    format: "In person",
    price: "$75",
    blurb:
      "A transformative workshop with Haas alum and life-work strategist Kathy Oneto, inspired by her book Sustainable Ambition.",
    rsvpUrl:
      "https://wila.haasalumni.org/event/reclaim-your-ambitions-a-sustainable-approach-to-thriving/"
  },
  {
    title: "WILA Mentorship Day",
    date: "August 29, 2025",
    location: "Virtual",
    format: "Virtual",
    price: "Free",
    blurb:
      "The inaugural Mentorship Day. 20+ experienced mentors offered 1:1 virtual sessions with distinguished women leaders in their fields.",
    rsvpUrl: "https://wila.haasalumni.org/event/wila-mentorship-day/"
  }
];

const FALLBACK_BOARD: BoardMember[] = [
  { name: "Tricia Tran", role: "Founding Co-President & Advisor", linkedin: "https://www.linkedin.com/in/triciatranbayarea/" },
  { name: "Abha Bhagat", role: "Founding Co-President", linkedin: "https://www.linkedin.com/in/abhabhagat/" },
  { name: "Deepti Patibandla", role: "Co-President", linkedin: "https://www.linkedin.com/in/deeptipatibandla/" },
  { name: "Dimple Malkani", role: "Founding Advisor", linkedin: "https://www.linkedin.com/in/dimplemalkani" },
  { name: "Amy Chou", role: "VP Marketing", linkedin: "https://www.linkedin.com/in/amychou", isDraft: true },
  { name: "Neha Dubey", role: "Treasurer", linkedin: "https://www.linkedin.com/in/neha-dubey99/" },
  { name: "Berna Geylani", role: "Board Member", linkedin: "https://www.linkedin.com/in/demandgenerationleader/" },
  { name: "Katie Li", role: "Board Member", linkedin: "https://www.linkedin.com/in/katienli" },
  { name: "Michelle Ma", role: "Board Member", linkedin: "https://www.linkedin.com/in/xmichellema/" },
  { name: "Sheila", role: "Board Member", isDraft: true }
];

// ---- Formatting helpers ------------------------------------------------

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
    // If no timestamp (only pre-formatted date), assume past.
    if (isFinite(ts) && ts >= now) upcoming.push(e);
    else past.push(e);
  }
  return { upcoming, past };
}

// ---- Public getters ----------------------------------------------------

export async function getEvents(): Promise<EventItem[]> {
  if (!sanityClient) return FALLBACK_EVENTS;
  try {
    const data = await sanityClient.fetch<EventItem[]>(eventsQuery);
    return data?.length ? data : FALLBACK_EVENTS;
  } catch (err) {
    console.warn("[content] events fetch failed, using fallback:", err);
    return FALLBACK_EVENTS;
  }
}

export async function getBoard(): Promise<BoardMember[]> {
  if (!sanityClient) return FALLBACK_BOARD;
  try {
    const data = await sanityClient.fetch<BoardMember[]>(boardQuery);
    return data?.length ? data : FALLBACK_BOARD;
  } catch (err) {
    console.warn("[content] board fetch failed, using fallback:", err);
    return FALLBACK_BOARD;
  }
}

export async function getSpotlight() {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch(spotlightQuery);
  } catch {
    return null;
  }
}

export async function getSettings() {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch(settingsQuery);
  } catch {
    return null;
  }
}
