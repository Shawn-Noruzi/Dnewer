// app/blog/page.tsx
import BlogGridClient from "@/components/blog/BlogGridClient";
import Spacer from "@/components/Spacer";
import ContactCtaServer from "@/components/contact/ContactCtaBannerServer";
import { urlFor } from "@/sanity/lib/sanityImage";
import { sanity } from "@/lib/sanity";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";



export const metadata: Metadata = {
  title: "Our blogs · Factory Optical",
  description:
    "Factory Optical blog. Read articles on eye care, eyewear trends, vision health, and more.",
  alternates: { canonical: "/blogs" }, 
  openGraph: {
    title: "Our blogs · Factory Optical",
    description:
         "Factory Optical blog. Read articles on eye care, eyewear trends, vision health, and more.",
    url: "/blogs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our blogs · Factory Optical",
    description:
         "Factory Optical blog. Read articles on eye care, eyewear trends, vision health, and more.",
  },
};
type PostDoc = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  coverImage?: any;
  publishedAt?: string;
  views?: number;
  tags?: string[];
};

type HeaderDoc = {
  title?: string;
};

const postsQuery = /* groq */ `
*[_type=="post" && defined(slug.current)]
| order(publishedAt desc) {
  _id, title, slug, excerpt, coverImage, publishedAt, views, tags
}
`;

const headerQuery = /* groq */ `
*[_type=="blogHeaderSection"][0]{ title }
`;

// ⬇️ Next 15+: searchParams is a Promise. Await it before using.
export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: "trending" | "views" | "new" }>;
}) {
  const sp = await searchParams;

  const [posts, header] = await Promise.all([
    sanity.fetch<PostDoc[]>(postsQuery, {}, { next: { revalidate: 0 } }),
    sanity.fetch<HeaderDoc | null>(headerQuery, {}, { next: { revalidate: 0 } }),
  ]);

  const items = (posts || [])
    .filter(Boolean)
    .map((p) => ({
      id: p._id,
      title: p.title,
      slug: p.slug.current,
      excerpt: p.excerpt ?? "",
      coverUrl: p.coverImage
        ? urlFor(p.coverImage).width(900).height(600).fit("crop").url()
        : null,
      publishedAt: p.publishedAt || new Date().toISOString(),
      views: p.views ?? 0,
      tags: p.tags ?? [],
    }));

  const allTags = Array.from(
    new Set(items.flatMap((p) => p.tags).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const sortVal = sp?.sort;
  const initialSort: "new" | "views" | "trending" =
    sortVal === "new" || sortVal === "views" || sortVal === "trending"
      ? sortVal
      : "new";

  const title = header?.title ?? "Stories";

  return (
    <section className="section pt-[100px]">
      {/* Short gradient header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-200 ring-1 ring-black/5">
        <div className="container max-w-6xl py-8">
          <h1 className="font-display text-3xl md:text-4xl leading-tight text-black">
            {title}
          </h1>
        </div>
      </div>

      {/* Grid + filters */}
      <div className="container max-w-6xl mt-18">
        <BlogGridClient
          initialItems={items}
          allTags={allTags}
          initialSort={initialSort}
        />
      </div>

      <Spacer />
      <ContactCtaServer />
    </section>
  );
}
