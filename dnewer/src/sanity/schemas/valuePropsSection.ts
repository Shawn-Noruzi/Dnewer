// sanity/schemas/valuePropsSection.ts
import { defineType, defineField } from "sanity";

const card = (name: string, title: string) => ({
  name,
  title,
  type: "object",
  fields: [
    { name: "title", type: "string" },
    { name: "body", type: "text" },
    { name: "ctaLabel", type: "string" },
    { name: "ctaHref", type: "url" },
    {
      name: "image",
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
    },
  ],
});

export default defineType({
  name: "valuePropsSection",
  title: "Homepage - Value Props Section",
  type: "document",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "subheading", type: "text" }),
    defineField(card("left", "Left Card")),
    defineField(card("right", "Right Card")),
    defineField({
      name: "bottom",
      title: "Bottom Card",
      type: "object",
      fields: [
        { name: "title", type: "string" },
        { name: "subtitle", type: "text" },
        {
          name: "image",
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
        },
        { name: "features", type: "array", of: [{ type: "string" }] },
      ],
    }),
  ],
});
