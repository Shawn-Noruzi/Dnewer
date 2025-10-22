import { defineType, defineField } from 'sanity';
export default defineType({
    name: 'promotion',
    type: 'document',
    title: 'Promotion',
    fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'description', type: 'text' }),
        defineField({ name: 'startsAt', type: 'date' }),
        defineField({ name: 'endsAt', type: 'date' }),
    ],
});