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

const FALLBACK_SPOTLIGHT: SpotlightItem = {
  name: "Priya Ramanathan",
  gradYear: "MBA ’14",
  title: "VP of Product, Lumen Health",
  spotlightLabel: "Q2 2026 Spotlight",
  quote:
    "“The most useful thing Haas gave me wasn’t a framework. It was permission. Permission to ask the uncomfortable question in the room, to change my mind in public, to build a career that looks nothing like the one I drew up at 24. WILA is where I keep practicing that permission. Every time I show up, someone nudges me to go bigger than I planned to.”",
  bio:
    "Priya leads the product org at Lumen Health, a Series C startup rethinking maternal and family care. Before Lumen she spent seven years at a major health system, where she launched one of the first telehealth programs on the West Coast. She mentors two WILA members each year and co-chairs our Bay Area chapter.",
  linkedin: "https://www.linkedin.com/",
  pillar: "Student Always",
  chapter: "Bay Area",
  mentorCohort: "2024 – present",
  nominateUrl: "#contact"
};

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

export async function getSpotlight(): Promise<SpotlightItem> {
  if (!dbConfigured()) return FALLBACK_SPOTLIGHT;
  try {
    const data = await getCurrentSpotlight();
    return data ?? FALLBACK_SPOTLIGHT;
  } catch (err) {
    console.warn("[content] spotlight query failed, using fallback:", err);
    return FALLBACK_SPOTLIGHT;
  }
}

export async function getBoard(): Promise<BoardMember[]> {
  // The board list is not editable in the admin site yet, so it stays in code.
  return FALLBACK_BOARD;
}
