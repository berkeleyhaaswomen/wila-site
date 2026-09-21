/**
 * Static site content taken from wila.haasalumni.org, so the copy, the board
 * and the photography are the real thing rather than placeholders.
 *
 * Events and the alumnae spotlight live in the database and are edited at
 * /admin. Everything here changes rarely enough to belong in code.
 */

export const SITE = {
  founded: 2021,
  email: "wila@haas.berkeley.edu",
  instagram: "https://www.instagram.com/haas_wila/",
  linkedin: "https://www.linkedin.com/groups/3814431/",
  address: ["Haas School of Business", "2220 Piedmont Ave, Berkeley, CA 94720"],
  mission:
    "Founded in 2021, Berkeley Haas Women in Leadership Alumnae turns the Haas leadership principles into practice by building a community who uplift and amplify each other, at work and beyond.",
  missionLong:
    "Our mission is to create space for alumnae to connect, support, and inspire one another in both professional and personal journeys. Grounded in the belief that strength comes from shared experiences, we focus on the whole self, guided by four key pillars."
};

export type Pillar = {
  n: string;
  title: string;
  label: string;
  body: string;
  photo: string;
};

/** The four Haas Defining Leadership Principles, in WILA's words. */
export const PILLARS: Pillar[] = [
  {
    n: "01",
    title: "Question the Status Quo",
    label: "Diversity and Inclusion",
    body: "We challenge norms and build more equitable paths for women in leadership, across industries, life stages, and geographies.",
    photo: "/photos/wila-04.jpg"
  },
  {
    n: "02",
    title: "Confidence Without Attitude",
    label: "Positive Engagement and Well-Being",
    body: "We lead with conviction and humility, making room for others to thrive alongside us.",
    photo: "/photos/wila-24.jpg"
  },
  {
    n: "03",
    title: "Student Always",
    label: "Professional Development",
    body: "We keep learning through mentorship, programming, and the generous exchange of hard-earned wisdom.",
    photo: "/photos/wila-03.jpg"
  },
  {
    n: "04",
    title: "Beyond Yourself",
    label: "Community Support and Impact",
    body: "We invest in the women coming next, and in the communities our work touches.",
    photo: "/photos/wila-29.jpg"
  }
];

export type BoardPerson = {
  name: string;
  role: string;
  /** Omitted when we do not have a headshot yet; the card shows initials. */
  photo?: string;
  linkedin?: string;
};

export type BoardGroup = { label: string; people: BoardPerson[] };

/**
 * The board in its three groups, one row each on the board page, so the
 * structure reads at a glance rather than as nine interchangeable cards.
 */
export const BOARD_GROUPS: BoardGroup[] = [
  {
    label: "Executive board",
    people: [
      {
        name: "Abha Bhagat",
        role: "Founding Co-President",
        photo: "/board/abha-bhagat.jpg",
        linkedin: "https://www.linkedin.com/in/abhabhagat/"
      },
      {
        name: "Deepti Patibandla",
        role: "Co-President",
        photo: "/board/deepti-patibandla.jpg",
        linkedin: "https://www.linkedin.com/in/deeptipatibandla/"
      },
      {
        name: "Amy Chou",
        role: "VP Marketing",
        photo: "/board/amy-chou.jpg",
        linkedin: "https://www.linkedin.com/in/amychou"
      },
      {
        name: "Neha Dubey",
        role: "Treasurer",
        photo: "/board/neha-dubey.jpg",
        linkedin: "https://www.linkedin.com/in/neha-dubey99/"
      }
    ]
  },
  {
    label: "Board members",
    people: [
      {
        name: "Berna Geylani",
        role: "Board Member",
        photo: "/board/berna-geylani.jpg",
        linkedin: "https://www.linkedin.com/in/demandgenerationleader/"
      },
      {
        name: "Katie Li",
        role: "Board Member",
        photo: "/board/katie-li.jpg",
        linkedin: "https://www.linkedin.com/in/katienli"
      },
      {
        name: "Michelle Ma",
        role: "Board Member",
        photo: "/board/michelle-ma.jpg",
        linkedin: "https://www.linkedin.com/in/xmichellema/"
      },
      // Last name, headshot and LinkedIn still to come.
      { name: "Sheila", role: "Board Member" }
    ]
  },
  {
    label: "Founders and advisors",
    people: [
      {
        name: "Tricia Tran",
        role: "Founder, Ex Co-President",
        photo: "/board/tricia-tran.jpg",
        linkedin: "https://www.linkedin.com/in/triciatranbayarea/"
      },
      {
        name: "Dimple Malkani",
        role: "Founding Advisor",
        photo: "/board/dimple-malkani.jpg",
        linkedin: "https://www.linkedin.com/in/dimplemalkani"
      }
    ]
  }
];

/** Everyone, flattened, in board-page order. */
export const BOARD: BoardPerson[] = BOARD_GROUPS.flatMap((g) => g.people);

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** Every gallery frame, widest and most usable first. */
export const GALLERY: string[] = Array.from(
  { length: 34 },
  (_, i) => `/photos/wila-${String(i + 1).padStart(2, "0")}.jpg`
);

/** Hand-picked frames with enough energy to carry a full-bleed section. */
export const FEATURE_PHOTOS = [
  "/photos/wila-32.jpg",
  "/photos/wila-29.jpg",
  "/photos/wila-21.jpg",
  "/photos/wila-07.jpg",
  "/photos/wila-23.jpg",
  "/photos/wila-22.jpg",
  "/photos/wila-15.jpg",
  "/photos/wila-16.jpg",
  "/photos/wila-28.jpg",
  "/photos/wila-27.jpg",
  "/photos/wila-26.jpg",
  "/photos/wila-25.jpg"
];
