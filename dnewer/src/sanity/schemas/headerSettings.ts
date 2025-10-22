import { defineType, defineField } from "sanity";

export default defineType({
  name: "headerSettings",
  title: "Navigation Settings",
  type: "document",
  fields: [
    defineField({ name: "brandName", type: "string", initialValue: "Factory Optical" }),
    defineField({ name: "phoneNumber", type: "string", initialValue: "18002011919" }),
    defineField({ name: "phoneNumber2", type: "string", initialValue: "18002011919" }),
    defineField({ name: "logo", type: "image", options: { hotspot: true }, description: "Optional site logo" }),
    defineField({
      name: "cta",
      title: "Right-side CTA",
      type: "object",
      fields: [
        { name: "label", type: "string", initialValue: "Book Exam" },
        { name: "href", type: "string", initialValue: "/book" },
      ],
    }),
    defineField({
      name: "navLinks",
      title: "Main Nav Links",
      type: "array",
      of: [{
        type: "object", fields: [
          { name: "label", type: "string" },
          { name: "href", type: "string" }, // internal (/services) or full URL
        ]
      }],
      initialValue: [
        { href: "/services", label: "Services" },
        { href: "/deals", label: "Deals" },
        { href: "/brands", label: "Brands" },
        { href: "/about", label: "About" },
        { href: "/blog", label: "Blog" },
      ],
    }),
    defineField({
      name: "promos",
      title: "Promo Messages (rotating)",
      type: "array",
      of: [{
        type: "object", fields: [
          { name: "text", type: "string" },
          { name: "href", type: "string", description: "Optional link to deal or page" },
        ]
      }],
      initialValue: [
        { text: "BOGO 50% on frames — this week only!", href: "/deals" },
        { text: "Free anti-glare upgrade with exam", href: "/deals" },
        { text: "Students save 15% — ID required", href: "/deals" },
        { text: "Blue-light lenses 20% off today", href: "/deals" },
      ],
    }),
  ],
});
