import { defineType, defineField } from "sanity";

export default defineType({
  name: "aboutHeroSection",
  title: "AboutPage — Hero",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
      initialValue: "Committed to Your Vision",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 4,
      initialValue:
        "For over four decades, our optometrists and opticians have focused on one thing—your eye health. Learn more about our story, our team, and the values behind Factory Optical.",
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imageAlt",
      type: "string",
      title: "Background Image Alt",
    }),
    defineField({
      name: "ctaPrimary",
      title: "Primary CTA",
      type: "object",
      fields: [
        { name: "label", type: "string" },
        { name: "href", type: "string" },
      ],
    }),
    defineField({
      name: "ctaSecondary",
      title: "Secondary CTA",
      type: "object",
      fields: [
        { name: "label", type: "string" },
        { name: "href", type: "string" },
      ],
    }),
    defineField({ name: "metaTitle", type: "string" }),
    defineField({ name: "metaDescription", type: "text" }),
  ],
});
