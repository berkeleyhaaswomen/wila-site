import { groq } from "next-sanity";

export const eventsQuery = groq`*[_type == "event"] | order(startsAt desc) {
  _id,
  title,
  "slug": slug.current,
  startsAt,
  endsAt,
  location,
  format,
  price,
  blurb,
  rsvpUrl
}`;

export const boardQuery = groq`*[_type == "boardMember"] | order(order asc, name asc) {
  _id,
  name,
  role,
  linkedin,
  photo,
  isDraft
}`;

export const spotlightQuery = groq`*[_type == "alumnaSpotlight"] | order(featuredFrom desc)[0] {
  _id,
  name,
  gradYear,
  title,
  quote,
  bio,
  linkedin,
  photo,
  pillar,
  chapter
}`;

export const settingsQuery = groq`*[_type == "siteSettings"][0] {
  eyebrow,
  heroHeadline,
  heroSub,
  aboutHeadline,
  aboutBody,
  stats,
  contactEmail
}`;
