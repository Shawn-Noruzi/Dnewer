import {defineType, defineField} from "sanity";

export default defineType({
  name: "product",
  title: "Servicespage-product",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: r => r.required() }),
    defineField({ name: "slug",  type: "slug", options: { source: "title" }, validation: r => r.required() }),
    defineField({ name: "brand", type: "string", validation: r => r.required() }),
    defineField({ name: "price", type: "number", validation: r => r.min(0) }),
    defineField({ name: "compareAtPrice", type: "number" }),

    // Primary image with ALT text
    defineField({
      name: "thumbnail",
      title: "Primary Image",
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

    // NEW: variable pack size (e.g., 90, 180)
    defineField({
      name: "packSize",
      title: "Pack size",
      type: "number",
      initialValue: 90,
      validation: (r) => r.min(1).warning("Pack size should be a positive integer"),
    }),

    defineField({ name: "category", type: "string", initialValue: "contacts" }),
    defineField({ name: "tags", type: "array", of: [{type: "string"}] }),
  ],
});
