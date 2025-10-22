import { defineType, defineField } from "sanity";

export default defineType({
  name: "heroSection",
  title: "Homepage - Hero Section",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text" }),

    // Add ALT text support on main image
    defineField({
      name: "mainImage",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the image for accessibility and SEO.",
        }),
      ],
    }),

    // NEW — Primary CTA
    defineField({
      name: "ctaPrimary",
      title: "Primary CTA",
      type: "object",
      fields: [
        { name: "label", type: "string", initialValue: "Book Exam" },
        { name: "href", type: "string", initialValue: "/book" },
      ],
    }),
    // NEW — Secondary CTA
    defineField({
      name: "ctaSecondary",
      title: "Secondary CTA",
      type: "object",
      fields: [
        { name: "label", type: "string", initialValue: "View Deals" },
        { name: "href", type: "string", initialValue: "/deals" },
      ],
    }),

    defineField({ name: "metaTitle", type: "string" }),
    defineField({ name: "metaDescription", type: "text" }),
  ],
});
