import { defineType, defineField } from "sanity";

export default defineType({
    name: "guideHeaderSection",
    title: "Dealspage - Hero Section",
    type: "document",
    fields: [
        defineField({ name: "title", type: "string" }),
        defineField({ name: "metaTitle", type: "string" }),
        defineField({ name: "metaDescription", type: "text" }),
    ],
});
