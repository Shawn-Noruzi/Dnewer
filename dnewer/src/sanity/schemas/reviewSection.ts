import { defineType, defineField } from "sanity";

export default defineType({
  name: "reviewsSection",
  title: "AboutPage - Reviews Section",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", initialValue: "What our patients say" }),
    defineField({ name: "overallRating", type: "number", description: "e.g. 4.7" }),
    defineField({ name: "totalCount", type: "number", description: "e.g. 16784" }),
    defineField({
      name: "ctaGoogleUrl",
      title: "“Review us on Google” URL",
      type: "url",
      description: "Use your Google Place write-review link (optional).",
    }),
    defineField({
      name: "reviews",
      type: "array",
      of: [{ type: "reference", to: [{ type: "review" }] }],
      validation: r => r.min(1),
    }),
  ],
});
