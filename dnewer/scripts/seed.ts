/** Seed two demo blog posts into Sanity */
import 'dotenv/config';
import { createClient } from '@sanity/client';


const client = createClient({
    projectId: "q0j0q5ux",
    dataset: "production",
    apiVersion: "2025-09-01",
    token: "skVys3yp1xnYcYGUVhu7H1BWbH1bFQvnM62YllNxnjj1OP4m5e1OJfRwfL3AaQDaBwvKZ7ElWFk3HcrtcwGR7lxONhKTUwm1q0KHCsFvOZ7WgYxOPXRhJ9vUkki0fDHPX7vRZhMtUhSpb5OzTVL84oN9PQCe2XCj1RsxY67s0STSm4SxYDi5",
    useCdn: false,
});


async function run() {
    const now = new Date().toISOString();
    const docs = [
        {
            _type: 'blogPost',
            title: 'How to Clean Your Glasses (Properly)',
            slug: { _type: 'slug', current: 'how-to-clean-your-glasses' },
            excerpt: 'Quick, safe steps to keep your lenses smudge-free without scratches.',
            body: [
                { _type: 'block', children: [{ _type: 'span', text: 'Start with lukewarm water and a drop of lotion-free soap.' }] },
            ],
            publishedAt: now,
        },
        {
            _type: 'blogPost',
            title: 'Blue Light Lenses: Do You Need Them?',
            slug: { _type: 'slug', current: 'blue-light-lenses-do-you-need-them' },
            excerpt: 'What blue light is, where it comes from, and when filters help.',
            body: [
                { _type: 'block', children: [{ _type: 'span', text: 'Blue light is part of the visible spectrum — here’s what matters.' }] },
            ],
            publishedAt: now,
        },
    ];


    for (const d of docs) {
        await client.createIfNotExists({ ...d, _id: `seed.${d.slug.current}` });
    }
    console.log('Seeded blog posts.');
}


run().catch((e) => {
    console.error(e);
    process.exit(1);
});