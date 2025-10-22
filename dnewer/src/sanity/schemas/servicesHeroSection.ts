// sanity/schemas/servicesHeroSection.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "servicesHeroSection",
  title: "Servicespage - Hero Section",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageAlt", type: "string" }),
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
