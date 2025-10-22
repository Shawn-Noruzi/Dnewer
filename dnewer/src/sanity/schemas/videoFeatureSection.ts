import {defineType, defineField} from "sanity";

export default defineType({
  name: "videoFeatureSection",
  title: "Servicespage - Video Feature",
  type: "document",
  fields: [
    defineField({ name: "stepLabel", title: "label", type: "string" }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({
      name: "videoFile",
      title: "Video (upload)",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "externalUrl",
      title: "Video URL (optional)",
      type: "url",
      description: "If provided, this will be used instead of the uploaded file.",
    }),
    defineField({ name: "poster", title: "Poster image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "object",
      fields: [
        { name: "label", type: "string" },
        { name: "href", type: "string", description: "Internal path (/contact) or full URL" },
      ],
    }),
  ],
});
