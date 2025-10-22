import { defineType, defineField } from "sanity";

export default defineType({
    name: "ourProcessSection",
    title: "ServicesPage - Our Process",
    type: "document",
    fields: [
        defineField({ name: "title", type: "string", initialValue: "Our Trusted Process" }),
        defineField({
            name: "cta",
            title: "CTA (optional)",
            type: "object",
            fields: [
                { name: "label", type: "string" },
                { name: "href", type: "string", description: "Internal path like /contact (or full URL)" },
            ],
        }),
        defineField({
            name: "steps",
            type: "array",
            of: [{
                type: "object",
                fields: [
                    { name: "title", type: "string" },
                    { name: "description", type: "text" },
                    { name: "image", type: "image", options: { hotspot: true } }, // icon
                ],
                preview: {
                    select: { title: "title", media: "image" },
                },
            }],
            validation: (Rule) => Rule.min(1).max(12),
        }),
    ],
});
