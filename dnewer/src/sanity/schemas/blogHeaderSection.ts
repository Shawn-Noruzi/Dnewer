import { defineType, defineField } from "sanity";

export default defineType({
  name: "blogHeaderSection",
  title: "BlogPage — Header",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Stories",
      validation: (r) => r.required(),
    }),
    defineField({ name: "metaTitle", type: "string" }),
    defineField({ name: "metaDescription", type: "text" }),
  ],
});
