import { defineField, defineType } from 'sanity'

type ParentWithCategory = { category?: string }

export default defineType({
  name: 'brand',
  title: 'Brandspage - Brands',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      validation: (r) => r.required(),
    }),

    // Logo + ALT
    defineField({
      name: 'logo',
      title: 'Logo (transparent PNG/SVG preferred)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description:
            'Describe the logo for accessibility (e.g., "Ray-Ban logo").',
        }),
      ],
    }),

    // Category (Brands merged into Frames)
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Frames', value: 'frames' },
          { title: 'Lenses', value: 'lenses' },
          { title: 'Contact Lenses', value: 'contacts' },
          { title: 'Other Products', value: 'other' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'website',
      title: 'Official Website (optional)',
      type: 'url',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'description',
      title: 'Short description (optional)',
      type: 'text',
      rows: 3,
    }),

    // NEW: Simple toggle to mark lens brands as "Value" (vs. non-value)
    defineField({
      name: 'lensIsValue',
      title: 'Valued product (Lenses)',
      type: 'boolean',
      initialValue: false,
      description:
        'Enable to treat this lens brand as the Value option on the Lenses tab.',
      hidden: ({ parent }: { parent?: ParentWithCategory }) =>
        parent?.category !== 'lenses',
    }),
  ],
})
