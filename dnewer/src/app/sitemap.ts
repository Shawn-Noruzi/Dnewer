// /app/sitemap.ts
import type { MetadataRoute } from "next";
import { sanity } from "@/lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");

  const locs = await sanity.fetch<{ slug: { current: string } }[]>(
    `*[_type=="location" && defined(slug.current)]{ slug }`,
    {},
    { next: { revalidate: 60 } }
  );

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog`, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/brands`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/deals`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/locations`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const locationPages: MetadataRoute.Sitemap = (locs || []).map((l) => ({
    url: `${base}/locations/${l.slug.current}`,
    changeFrequency: "weekly" as const,
    
    priority: 0.8,
  }));

  return [...staticPages, ...locationPages];
}
