import {defineType, defineField} from "sanity";

export default defineType({
  name: "categoryHero",
  title: "Servicespage-categoryHero",
  type: "document",
  fields: [
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: r => r.required() }),
    defineField({ name: "title", type: "string", validation: r => r.required() }),
    defineField({ name: "subtitle", type: "string" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageAlt", type: "string" }),
  ],
});
