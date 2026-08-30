import { defineField, defineType } from "sanity";

export const boardMember = defineType({
  name: "boardMember",
  title: "Board member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full name",
      type: "string",
      validation: (r) => r.required()
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "e.g. 'Co-President', 'Treasurer', 'Board Member'",
      validation: (r) => r.required()
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn URL",
      type: "url"
    }),
    defineField({
      name: "photo",
      title: "Photo (optional)",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers show first. Leadership (president, VPs) should be < 10.",
      initialValue: 100
    }),
    defineField({
      name: "isDraft",
      title: "Mark as draft?",
      type: "boolean",
      description: "Shows a 'Draft' pill next to the name until confirmed.",
      initialValue: false
    })
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" }
  },
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }]
    }
  ]
});
