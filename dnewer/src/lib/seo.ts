import type { Metadata } from 'next';
export const defaultMetadata: Metadata = {
  title: {
    default: 'Factory Optical — Advanced Eye Exams & Eyewear',
    template: '%s · Factory Optical',
  },
  description: 'Trusted locally for personalized eye care, contact lenses, and great deals on glasses.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  robots: { index: true, follow: true },
  openGraph: { type: 'website', title: 'Factory Optical', url: '/', siteName: 'Factory Optical' },
};
