import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  // Singleton: only one document of this type.
  fields: [
    defineField({
      name: "eyebrow",
      title: "Hero eyebrow",
      type: "string",
      description: "The small label above the hero headline.",
      initialValue: "Berkeley Haas · Alumnae Network"
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero headline",
      type: "string",
      description: "The big title on the home page."
    }),
    defineField({
      name: "heroSub",
      title: "Hero subhead",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "aboutHeadline",
      title: "About section headline",
      type: "string"
    }),
    defineField({
      name: "aboutBody",
      title: "About body",
      type: "array",
      of: [{ type: "block" }],
      description: "Rich text: paragraphs, links, bold, italics."
    }),
    defineField({
      name: "stats",
      title: "Hero stats",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "value", type: "string", title: "Value" }
          ]
        }
      ],
      validation: (r) => r.max(4)
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      initialValue: "wila@haas.berkeley.edu"
    })
  ],
  preview: {
    prepare: () => ({ title: "Site settings" })
  }
});
