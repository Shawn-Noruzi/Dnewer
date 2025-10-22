import {defineType, defineField} from "sanity";

export default defineType({
  name: "dealsSection",
  title: "Dealspage - Section",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", initialValue: "Current Deals" }),
    defineField({
      name: "items",
      title: "Deal Cards",
      type: "array",
      of: [{ type: "dealCard" }],
      validation: r => r.min(1)
    }),
  ],
});
