import { defineType, defineField } from "sanity";

export default defineType({
  name: "review",
  title: "AboutPage - Review",
  type: "document",
  fields: [
    defineField({ name: "author", type: "string", validation: r => r.required() }),
    defineField({ name: "rating", type: "number", validation: r => r.min(1).max(5).required() }),
    defineField({ name: "text", type: "text", rows: 5, validation: r => r.required() }),
    defineField({ name: "avatar", type: "image", options: { hotspot: true } }),
    defineField({ name: "when", title: "When (e.g., '2 weeks ago')", type: "string" }),
    defineField({ name: "sourceUrl", title: "Source Link (optional)", type: "url" }),
  ],
  preview: {
    select: { title: "author", subtitle: "text", media: "avatar" },
  },
});
