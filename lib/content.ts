/**
 * Central content layer for the PUBLIC site.
 *
 * Content is edited in the admin site at /admin and stored in Postgres. If
 * DATABASE_URL isn't set, the site renders the hardcoded fallbacks below, so
 * a fresh clone always builds and the site never goes dark waiting on a
 * database.
 */

import { dbConfigured } from "./db";
import { listEvents, getCurrentSpotlight } from "./repo";
import type { EventItem, SpotlightItem, BoardMember } from "./types";

export type { EventItem, SpotlightItem, BoardMember } from "./types";
export { EVENT_FORMATS, PILLARS } from "./types";
export { formatEventDate, partitionEvents } from "./format";

// ---- Fallbacks ---------------------------------------------------------

const FALLBACK_EVENTS: EventItem[] = [
  {
    title: "From Interest to Impact: Serving on Boards",
    date: "October 6, 2025 · 6:00 – 7:00 PM PDT",
    location: "Online",
    format: "Virtual",
    price: "Free",
    blurb:
      "Exclusive 1-hour session where seasoned professionals shared practical tips and insider advice on how to serve, and succeed, on boards.",
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

// ---- Public getters ----------------------------------------------------

export async function getEvents(): Promise<EventItem[]> {
  if (!dbConfigured()) return FALLBACK_EVENTS;
  try {
    const data = await listEvents();
    return data.length ? data : FALLBACK_EVENTS;
  } catch (err) {
    console.warn("[content] events query failed, using fallback:", err);
    return FALLBACK_EVENTS;
  }
}

/**
 * Returns null when no spotlight has been published. There is deliberately no
 * placeholder person: inventing an alumna and presenting her as a real member
 * of this network would be a lie on a public site, so the section shows an
 * invitation to nominate instead.
 */
export async function getSpotlight(): Promise<SpotlightItem | null> {
  if (!dbConfigured()) return null;
  try {
    return await getCurrentSpotlight();
  } catch (err) {
    console.warn("[content] spotlight query failed:", err);
    return null;
  }
}

export async function getBoard(): Promise<BoardMember[]> {
  // The board list is not editable in the admin site yet, so it stays in code.
  return FALLBACK_BOARD;
}
