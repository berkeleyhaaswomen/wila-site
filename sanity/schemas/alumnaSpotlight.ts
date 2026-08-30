import { defineField, defineType } from "sanity";

export const alumnaSpotlight = defineType({
  name: "alumnaSpotlight",
  title: "Alumna spotlight",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Alumna name",
      type: "string",
      validation: (r) => r.required()
    }),
    defineField({
      name: "gradYear",
      title: "Class year",
      type: "string",
      description: "e.g. 'MBA ’14'"
    }),
    defineField({
      name: "title",
      title: "Current title",
      type: "string",
      description: "e.g. 'VP of Product, Lumen Health'"
    }),
    defineField({
      name: "quote",
      title: "Blurb in her voice",
      type: "text",
      rows: 6,
      validation: (r) => r.required().max(800)
    }),
    defineField({
      name: "bio",
      title: "Short bio",
      type: "text",
      rows: 4
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn URL",
      type: "url",
      validation: (r) => r.required()
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "pillar",
      title: "Pillar",
      type: "string",
      options: {
        list: [
          "Question the Status Quo",
          "Confidence Without Attitude",
          "Student Always",
          "Beyond Yourself"
        ]
      }
    }),
    defineField({
      name: "chapter",
      title: "Chapter",
      type: "string",
      description: "e.g. 'Bay Area', 'NYC'"
    }),
    defineField({
      name: "featuredFrom",
      title: "Featured from",
      type: "date",
      description: "The most recently created spotlight (max featuredFrom) is shown on the homepage."
    })
  ],
  preview: {
    select: { title: "name", subtitle: "title", media: "photo" }
  },
  orderings: [
    {
      title: "Most recent",
      name: "featuredDesc",
      by: [{ field: "featuredFrom", direction: "desc" }]
    }
  ]
});
