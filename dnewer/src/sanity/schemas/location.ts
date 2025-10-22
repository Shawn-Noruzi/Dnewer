import { defineType, defineField } from "sanity";

export default defineType({
  name: "location",
  title: "Location",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({
      name: "address",
      type: "object",
      fields: [
        { name: "line1", type: "string" },
        { name: "line2", type: "string" },
        { name: "city", type: "string" },
        { name: "province", type: "string" },
        { name: "postalCode", type: "string" },
        { name: "country", type: "string", initialValue: "Canada" },
      ],
    }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({
      name: "hours",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "day", type: "string" },        // Mon, Tue, ...
          { name: "open", type: "string" },       // 09:00
          { name: "close", type: "string" },      // 17:00
          { name: "closed", type: "boolean" },
        ],
      }],
    }),
    defineField({ name: "services", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "bookingUrl", type: "url" }),
    defineField({
      name: "maps",
      title: "Google Maps",
      type: "object",
      fields: [
        { name: "placeUrl", type: "url", description: "Paste the Google Maps share link (maps.app.goo.gl…)" },
        { name: "directionsUrl", type: "url", description: "Optional: a prebuilt Directions link" },
      ],
    }),

    // ✅ ALT support on heroImage
    defineField({
      name: "heroImage",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe this location image for accessibility/SEO.",
        }),
      ],
    }),

    defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "metaTitle", type: "string" }),
    defineField({ name: "metaDescription", type: "text" }),
  ],
});
