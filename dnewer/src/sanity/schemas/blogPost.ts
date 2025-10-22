// sanity/schemas/post.ts
import { defineType, defineField } from "sanity"

export default defineType({
  name: "post",
  title: "BlogPage - Blog Post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: r => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: r => r.required(),
    }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({
      name: "coverImage",
      type: "image",
      options: { hotspot: true },
      // (optional) add alt on cover image as well
      fields: [
        defineField({
          name: "alt",
          title: "Cover image alt text",
          type: "string",
          description: "Describe the cover image for accessibility and SEO."
        })
      ]
    }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }],
      validation: r => r.required()
    }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: r => r.required(),
    }),
    // used for “Most viewed” and “Trending”
    defineField({
      name: "views",
      type: "number",
      readOnly: true,
      initialValue: 0,
    }),
    defineField({ name: "metaTitle", type: "string" }),
    defineField({ name: "metaDescription", type: "text" }),

    // NEW: Ending media — choose to add up to 3 images and/or a video
    defineField({
      name: "endGallery",
      title: "Ending gallery (1–3 images)",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Describe the image for accessibility and SEO."
            })
          ]
        }
      ],
      validation: r => r.max(3)
    }),

    defineField({
      name: "endVideo",
      title: "Ending video (URL or upload)",
      type: "object",
      fields: [
        defineField({
          name: "url",
          title: "Video URL",
          type: "url",
          description: "YouTube/Vimeo/MP4 URL"
        }),
        defineField({
          name: "file",
          title: "Upload video",
          type: "file",
          options: { accept: "video/*" }
        }),
        defineField({
          name: "caption",
          title: "Caption (optional)",
          type: "string"
        })
      ],
      // Require at least a URL or a file when this object is used
      validation: r =>
        r.custom((val) => {
          if (!val) return true; // optional field
          if (val.url || val.file) return true;
          return "Provide a URL or upload a file";
        })
    })
  ],
})
