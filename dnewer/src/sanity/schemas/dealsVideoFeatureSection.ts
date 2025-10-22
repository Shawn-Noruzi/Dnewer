import {defineType, defineField} from "sanity";

export default defineType({
  name: "dealsVideoFeatureSection",
  title: "Dealspage - Video Feature Section",
  type: "document",
  fields: [
    defineField({ name: "stepLabel", title: "subtitle", type: "string" }),
    defineField({ name: "title",     type: "string", validation: r => r.required() }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "poster",
      title: "Poster Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "videoFile",
      title: "Video File (optional)",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "externalUrl",
      title: "External Video URL (MP4/HLS/MPEG-DASH)",
      type: "url",
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "href",  type: "string" }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", media: "poster", subtitle: "stepLabel" },
  },
});
