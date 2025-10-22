import {defineType, defineField} from "sanity";

export default defineType({
  name: "teamMember",
  title: "AboutPage - Team Member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: r => r.required() }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "quote", type: "text", rows: 3 }),
    defineField({
      name: "photo",
      type: "image",
      title: "Photo",
      options: { hotspot: true },
      validation: r => r.required(),
    }),
    defineField({
      name: "order",
      type: "number",
      description: "Lower = earlier in carousel",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
