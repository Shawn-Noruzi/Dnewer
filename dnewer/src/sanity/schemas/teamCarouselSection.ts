import {defineType, defineField} from "sanity";

export default defineType({
  name: "teamCarouselSection",
  title: "AboutPage — Our Team Carousel",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Get Inspired by our employees",
      validation: r => r.required(),
    }),
    defineField({
      name: "members",
      type: "array",
      of: [{ type: "reference", to: [{ type: "teamMember" }] }],
      validation: r => r.min(1),
    }),
    defineField({
      name: "autoplayMs",
      type: "number",
      description: "0 to disable",
      initialValue: 5000,
    }),
  ],
});
