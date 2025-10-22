import {defineType, defineField} from "sanity";

export default defineType({
  name: "footerSettings",
  title: "Footer Settings",
  type: "document",
  fields: [
    defineField({ name: "brandName", type: "string", initialValue: "Factory Optical (1980) Ltd." }),
    defineField({
      name: "tagline",
      type: "string",
      initialValue: "Quality eyewear, advanced exams, and friendly experts.",
    }),

    // Removed the old top-level address/phone/email block.
    // Footer locations now carry their own address + phone per item:
    defineField({
      name: "locations",
      title: "Footer Locations",
      type: "array",
      description: "Add one row per location to show in the footer.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", type: "string", title: "Location name", validation: r => r.required() }),
            defineField({
              name: "address",
              title: "Address",
              type: "object",
              fields: [
                { name: "line1", type: "string", title: "Line 1" },
                { name: "line2", type: "string", title: "Line 2" },
                { name: "city", type: "string" },
                { name: "province", type: "string" },
                { name: "postalCode", type: "string" },
                { name: "country", type: "string", initialValue: "Canada" },
              ],
            }),
            defineField({ name: "phone", type: "string", title: "Phone" }),
            defineField({ name: "email", type: "string", title: "Email (optional)" }),
            defineField({
              name: "href",
              type: "string",
              title: "Link to location page",
              description: "Internal (/locations/slug) or full URL",
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "phone" },
          },
        },
      ],
      validation: r => r.min(1),
      initialValue: [
        {
          name: "Vancouver",
          address: { line1: "595 W 7th Ave.", city: "Vancouver", province: "BC", postalCode: "V5Z 1B4", country: "Canada" },
          phone: "(604) 873-5288",
          href: "/locations/vancouver",
        },
        {
          name: "Eastvan",
          address: { line1: "1234 Example St.", city: "Vancouver", province: "BC", postalCode: "V5Z 2Z2", country: "Canada" },
          phone: "(604) 555-0456",
          href: "/locations/eastvan",
        },
      ],
    }),

    defineField({
      name: "quickLinks",
      type: "array",
      of: [{ type: "object", fields: [
        { name: "label", type: "string" },
        { name: "href",  type: "string" }, // internal or full URL
      ]}],
      initialValue: [
        {label: "Services", href: "/services"},
        {label: "Deals", href: "/deals"},
        {label: "Brands", href: "/brands"},
        {label: "About", href: "/about"},
        {label: "Blog", href: "/blog"},
      ],
    }),

    defineField({
      name: "social",
      title: "Social Links",
      type: "array",
      of: [{ type: "object", fields: [
        { name: "label", type: "string" },
        { name: "href",  type: "url" },
      ]}],
      initialValue: [
        {label: "Instagram", href: "https://instagram.com/"},
        {label: "Facebook",  href: "https://facebook.com/"},
        {label: "LinkedIn",  href: "https://linkedin.com/"},
        {label: "YouTube",   href: "https://youtube.com/"},
      ],
    }),

    defineField({
      name: "legal",
      title: "Legal Links",
      type: "array",
      of: [{ type: "object", fields: [
        { name: "label", type: "string" },
        { name: "href",  type: "string" },
      ]}],
      initialValue: [
        {label: "Terms of service", href: "/terms"},
        {label: "Privacy policy",   href: "/privacy"},
        {label: "Cookie policy",    href: "/cookies"},
      ],
    }),
  ],
});
