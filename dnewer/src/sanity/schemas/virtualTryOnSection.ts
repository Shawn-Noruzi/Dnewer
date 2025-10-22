// sanity/schemas/virtualTryOnSection.ts
import { defineType, defineField } from "sanity";
export default defineType({
  name: "virtualTryOnSection",
  title: "Homepage - Virtual Try-On Section",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "bullets", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "ctaLabel", type: "string" }),
    defineField({ name: "ctaHref", type: "url" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageAlt", type: "string" }),
  ],
});
