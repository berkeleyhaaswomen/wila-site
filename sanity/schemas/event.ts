import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Event title",
      type: "string",
      validation: (r) => r.required().max(120)
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required()
    }),
    defineField({
      name: "startsAt",
      title: "Starts at",
      type: "datetime",
      description: "Local start time. The site will show the human-readable version.",
      validation: (r) => r.required()
    }),
    defineField({
      name: "endsAt",
      title: "Ends at",
      type: "datetime"
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. 'Chou Hall, Berkeley Haas' or 'Zoom'",
      validation: (r) => r.required()
    }),
    defineField({
      name: "format",
      title: "Format",
      type: "string",
      options: {
        list: [
          { title: "In person", value: "In person" },
          { title: "Virtual", value: "Virtual" },
          { title: "Hybrid", value: "Hybrid" }
        ],
        layout: "radio"
      },
      validation: (r) => r.required()
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      description: "e.g. 'Free', '$75'"
    }),
    defineField({
      name: "blurb",
      title: "Blurb",
      type: "text",
      rows: 4,
      validation: (r) => r.required().max(500)
    }),
    defineField({
      name: "rsvpUrl",
      title: "RSVP or recap URL",
      type: "url"
    })
  ],
  preview: {
    select: { title: "title", subtitle: "startsAt", location: "location" },
    prepare({ title, subtitle, location }) {
      const when = subtitle
        ? new Date(subtitle).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          })
        : "No date";
      return { title, subtitle: `${when} · ${location ?? ""}` };
    }
  },
  orderings: [
    {
      title: "Date, newest first",
      name: "startsAtDesc",
      by: [{ field: "startsAt", direction: "desc" }]
    },
    {
      title: "Date, oldest first",
      name: "startsAtAsc",
      by: [{ field: "startsAt", direction: "asc" }]
    }
  ]
});
