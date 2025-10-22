// components/BlogStories.tsx (SERVER)
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage";
import MoreStoriesClient from "./blog/MoreStoriesClient";

type PostCard = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  excerpt?: string;
  coverImage?: any;
  tags?: string[];
};

const query = /* groq */ `
*[_type=="post" && defined(slug.current)]
| order(publishedAt desc)[0...2]{
  _id, title, slug, publishedAt, excerpt, coverImage, tags
}
`;

export default async function BlogStories() {
  const posts = await sanity.fetch<PostCard[]>(
    query,
    {},
    { next: { revalidate: 0, tags: ["blog"] } }
  );
  if (!posts?.length) return null;

  return (
    <section className="container py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="subtitle font-semibold text-black">Stories</h2>
        {/* Static route literal — cast to Route to satisfy typed routes */}
        <Link href={"/blog" as Route} className="maintext text-black/70 hover:text-black">
          View all →
        </Link>
      </div>

      <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((p) => (
          <Card key={p._id} p={p} />
        ))}

        {/* On wide screens, progressively enhance by adding 2 more */}
        <MoreStoriesClient offset={2} limit={2} />
      </div>
    </section>
  );
}

function Card({ p }: { p: PostCard }) {
  // Guard against missing/bad slug values that look like a dynamic pattern
  const s = p?.slug?.current;
  if (!s || s.startsWith("[")) return null;

  const href = (`/blog/${s}`) as import("next").Route<`/blog/${string}`>;

  const img = p.coverImage
    ? urlFor(p.coverImage).width(800).height(600).fit("crop").auto("format").url()
    : null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      <Link href={href} className="block">
        <div className="relative aspect-[4/3]">
          {img ? (
            <Image
              src={img}
              alt={p.title}
              fill
              sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="h-full w-full bg-neutral-100" />
          )}

          {p.tags?.length ? (
            <div className="absolute left-2 top-2 flex flex-wrap gap-1">
              {p.tags.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-black/70 px-2 py-0.5 text-sm text-stone-100"
                >
                  {t.toUpperCase()}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <time className="block text-[12px] text-black/60">{formatDate(p.publishedAt)}</time>
        <Link
          href={href}
          className="mt-1 block subtext font-semibold leading-snug text-black hover:underline line-clamp-2 min-h-[2.75rem]"
        >
          {p.title}
        </Link>
        {p.excerpt ? (
          <p className="mt-2 line-clamp-3 text-sm text-black/70">{p.excerpt}</p>
        ) : null}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <Link href={href} className="subtext text-black/70 hover:text-black">
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}

function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}
