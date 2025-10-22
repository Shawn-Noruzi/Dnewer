import {defineType, defineField} from "sanity";

export default defineType({
  name: "dealCard",
  title: "Dealspage - Promotional Card",
  type: "object",
  fields: [
    defineField({ name: "headline", type: "string", validation: r => r.required() }),
    defineField({ name: "subhead",  type: "string" }),
    defineField({ name: "code",     type: "string", description: "Promo code to show (optional)" }),
    defineField({ name: "footnote", type: "string", description: "Small disclaimer/footnote" }),
    defineField({ name: "cta", type: "object", fields: [
      defineField({ name: "label", type: "string" }),
      defineField({ name: "href",  type: "string" }),
    ]}),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageAlt", type: "string" }),
  ],
  preview: {
    select: { title: "headline", media: "image", subtitle: "code" }
  }
});
