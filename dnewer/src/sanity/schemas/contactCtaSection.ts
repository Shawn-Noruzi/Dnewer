import { defineType, defineField } from "sanity";

export default defineType({
  name: "contactCtaSection",
  title: "Contact CTA Section",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: r => r.required() }),
    defineField({ name: "description", type: "text" }),
    // keep this if you still deep-link to a locations anchor on the page
    defineField({ name: "locationsAnchorId", type: "string", description: "Optional anchor id for Locations button" }),

    // Background image (with ALT)
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the background image for accessibility and SEO.",
        }),
      ],
    }),

    // Legacy alt (kept for backward compat); prefer image.alt
    defineField({ name: "imageAlt", type: "string" }),

    // Small icon (with ALT)
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      options: { hotspot: true },
      description: "Optional small icon displayed in the CTA",
      fields: [
        defineField({
          name: "alt",
          title: "Icon alt text",
          type: "string",
          description: "Describe the icon for accessibility.",
        }),
      ],
    }),

    // Primary CTA button (text + URL)
    defineField({
      name: "button",
      title: "Primary Button",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string", validation: r => r.required() }),
        defineField({ name: "href", type: "url", validation: r => r.required() }),
      ],
    }),

    // (Optional legacy) keep if some pages still rely on it
    defineField({
      name: "contactHref",
      title: "Legacy Contact URL",
      type: "url",
      description: "Kept for backward compatibility; prefer Button.href above.",
    }),
  ],
});
