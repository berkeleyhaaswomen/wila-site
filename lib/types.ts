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
  /** IANA zone the event's times are shown in. Absent means Pacific. */
  timeZone?: string;
};

/** Zones offered in the admin. Pacific first, since it is the default. */
export const EVENT_TIME_ZONES = [
  { id: "America/Los_Angeles", label: "Pacific (default)" },
  { id: "America/Denver", label: "Mountain" },
  { id: "America/Chicago", label: "Central" },
  { id: "America/New_York", label: "Eastern" },
  { id: "Europe/London", label: "London" },
  { id: "Europe/Paris", label: "Central Europe" },
  { id: "Asia/Kolkata", label: "India" },
  { id: "Asia/Singapore", label: "Singapore" },
  { id: "Asia/Tokyo", label: "Tokyo" }
] as const;

export const PILLARS = [
  "Question the Status Quo",
  "Confidence Without Attitude",
  "Student Always",
  "Beyond Yourself"
] as const;

/**
 * A spotlight, following the questions in the 2026 spotlight template:
 * name, photo, class and program, title and company, WILA involvement, a
 * third-person bio, and a way to connect with an optional call to action.
 */
export type SpotlightItem = {
  id?: string;
  name: string;
  /** "MBA, Class of 2015" */
  gradYear?: string;
  spotlightLabel?: string;
  /** "VP of Marketing, ABC Corp" */
  title?: string;
  /** One line: "Organizer, SF Chapter Fall Mixer" */
  involvement?: string;
  bio?: string;
  linkedin?: string;
  /** "Connect with me on LinkedIn." */
  cta?: string;
  photoUrl?: string;
  featuredFrom?: string; // YYYY-MM-DD
  /** Kept for older spotlights; the template no longer asks for one. */
  quote?: string;
};

export type BoardMember = {
  id?: string;
  name: string;
  role: string;
  linkedin?: string;
  photoUrl?: string;
  isDraft?: boolean;
};

/** Berkeley Haas degree programs, for the membership form. */
export const HAAS_PROGRAMS = [
  "Full-time MBA",
  "Evening & Weekend MBA (EWMBA)",
  "MBA for Executives (EMBA)",
  "Master of Financial Engineering (MFE)",
  "Undergraduate (BS)",
  "PhD",
  "Berkeley MBA for Executives / dual degree",
  "Other Berkeley program"
] as const;

/** Every exportable member field, and how to label it in a spreadsheet. */
export const MEMBER_FIELDS = [
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "email", label: "Email" },
  { key: "program", label: "Degree program" },
  { key: "gradYear", label: "Grad year" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "createdAt", label: "Joined" }
] as const;

/**
 * The column layout of the WILA attendee tracking sheet, in its exact order
 * and wording. Exporting in this shape lets rows be pasted straight into a
 * copy of that sheet. The event columns and status are per-event facts the
 * join form does not collect, so they export blank for the host to fill in.
 */
export const ATTENDEE_SHEET_COLUMNS: { label: string; field?: MemberField }[] = [
  { label: "Event Date" },
  { label: "Event Name" },
  { label: "Event Location" },
  { label: "Attendee First Name", field: "firstName" },
  { label: "Attendee Last Name", field: "lastName" },
  { label: "Email Address", field: "email" },
  { label: "Degree Program", field: "program" },
  { label: "Grad Year", field: "gradYear" },
  { label: "Attendee Status (Attended, Registered, speaker, etc)" }
];

export type MemberField = (typeof MEMBER_FIELDS)[number]["key"];
