// /sanity/schemas/guidePage.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'brandPage',
  title: 'Brandpage- Hero Section + 2 Body Sections',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // Header (same styling as your previous GuideHeaderServer)
    defineField({
      name: 'header',
      title: 'Header',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
      ],
    }),

    // Two body sections below the header
    defineField({
      name: 'sections',
      title: 'Body Sections',
      type: 'array',
      validation: (Rule) => Rule.min(1).max(1), // exactly two per your request
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] }),
          ],
          preview: {
            select: { title: 'heading' },
          },
        },
      ],
    }),
    defineField({ name: "metaTitle", type: "string" }),
    defineField({ name: "metaDescription", type: "text" }),
  ],

})
