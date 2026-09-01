/** Shared content types, used by both the public site and the admin site. */

export type EventFormat = "In person" | "Virtual" | "Hybrid";

export const EVENT_FORMATS: EventFormat[] = ["In person", "Virtual", "Hybrid"];

export type EventItem = {
  id?: string;
  title: string;
  slug?: string;
  startsAt?: string; // ISO
  endsAt?: string;
  /** Pre-formatted date, only used by the hardcoded fallbacks. */
  date?: string;
  location: string;
  format: EventFormat;
  price?: string;
  blurb: string;
  rsvpUrl?: string;
};

export const PILLARS = [
  "Question the Status Quo",
  "Confidence Without Attitude",
  "Student Always",
  "Beyond Yourself"
] as const;

export type SpotlightItem = {
  id?: string;
  name: string;
  gradYear?: string;
  spotlightLabel?: string;
  title?: string;
  quote: string;
  bio?: string;
  linkedin?: string;
  photoUrl?: string;
  pillar?: string;
  chapter?: string;
  mentorCohort?: string;
  nominateUrl?: string;
  featuredFrom?: string; // YYYY-MM-DD
};

export type BoardMember = {
  id?: string;
  name: string;
  role: string;
  linkedin?: string;
  photoUrl?: string;
  isDraft?: boolean;
};
