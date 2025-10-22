import 'dotenv/config';
import { createClient } from '@sanity/client';

const projectId = "q0j0q5ux"
const dataset   = "production"
const token     = "skVys3yp1xnYcYGUVhu7H1BWbH1bFQvnM62YllNxnjj1OP4m5e1OJfRwfL3AaQDaBwvKZ7ElWFk3HcrtcwGR7lxONhKTUwm1q0KHCsFvOZ7WgYxOPXRhJ9vUkki0fDHPX7vRZhMtUhSpb5OzTVL84oN9PQCe2XCj1RsxY67s0STSm4SxYDi5"

if (!projectId || !dataset || !token) {
  throw new Error('Missing env: SANITY_PROJECT_ID / SANITY_DATASET / SANITY_WRITE_TOKEN (or NEXT_PUBLIC_ variants).');
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-09-01",
  token,
  useCdn: false,
});


// Upload a single JPEG once and reuse it everywhere
async function uploadPlaceholder() {
  const url = 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1600&auto=format&fit=crop';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch placeholder image: ${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload('image', buf, { filename: 'placeholder.jpg', contentType: 'image/jpeg' });
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
}

async function upsert(id, doc) {
  return client.createIfNotExists({ _id: id, ...doc });
}

async function run() {
  console.log('Seeding section documents…');

  // one image for all slots
  const placeholderImg = await uploadPlaceholder();

  // 1) heroSection
  await upsert('settings.hero', {
    _type: 'heroSection',
    title: 'Advanced Eye Exams, Frames You’ll Love.',
    description: 'Book a comprehensive exam and shop curated brands at Factory Optical.',
    mainImage: placeholderImg,
  });

  // 2) valuePropsSection
  await upsert('settings.valueProps', {
    _type: 'valuePropsSection',
    heading: 'Unrivalled Excellence',
    subheading: 'Dedicated to craft and practical style—made for everyday wear and all-day comfort.',
    left: {
      title: 'Purchasing with insurance, made easy.',
      body: 'Use your benefits online or in-store. We accept most vision insurance and submit on your behalf.',
      ctaLabel: 'Shop with benefits',
      ctaHref: 'https://example.com/deals',
      image: placeholderImg,
    },
    right: {
      title: 'Shop online, thrive in-store.',
      body: 'Order online, then visit any location for personalized fitting, adjustments, and after-care.',
      image: placeholderImg,
    },
    bottom: {
      title: 'Our lenses',
      subtitle: 'The right optics, precisely cut to your prescription.',
      image: placeholderImg,
      features: ['Transitions®', 'Blue-violet light', 'Prescription sun', 'Ultra-thin'],
    },
  });

  // 3) virtualTryOnSection
  await upsert('settings.vto', {
    _type: 'virtualTryOnSection',
    title: 'Try your favourite frames virtually',
    bullets: [
      'Activate your camera or upload a photo',
      'Select your favorite frames',
      'See them in real time',
    ],
    ctaLabel: 'Try it Now',
    ctaHref: '/try-on',
    image: placeholderImg,
  });

  // 4) contactCtaSection
  await upsert('settings.contactCta', {
    _type: 'contactCtaSection',
    title: 'Get in Touch With Factory Optical',
    description:
      'Our team is here to help with eye exam bookings, eyewear questions, and insurance inquiries. Reach out today — we’d love to hear from you.',
    contactHref: '/contact',
    image: placeholderImg,
  });

  console.log('✅ Seed complete.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});