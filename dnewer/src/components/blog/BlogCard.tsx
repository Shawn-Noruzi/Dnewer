// components/blog/BlogCard.tsx
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { urlFor } from "@/sanity/lib/sanityImage";

export type PostVM = {
  _id: string;
  title: string;
  slug?: { current?: string };
  excerpt?: string;
  coverImage?: any;
  publishedAt?: string;
  views?: number;
  tags?: string[];
};

export default function BlogCard({ post }: { post: PostVM }) {
  // Guard so a single bad row never crashes the page
  if (!post || !post.slug?.current) return null;

  // Next 15 typed route helper
  type BlogRoute = Route<`/blog/${string}`>;
  const href = (`/blog/${post.slug.current}` as BlogRoute);

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString()
    : "";

  const img = post.coverImage
    ? urlFor(post.coverImage).width(800).height(450).fit("crop").url()
    : null;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[16/9] bg-neutral-50">
        {img ? (
          <Image
            src={img}
            alt={post.title}
            fill
            className="object-cover transition will-change-transform group-hover:scale-[1.02]"
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          />
        ) : null}
      </div>

      <div className="p-4">
        <div className="text-xs text-black/60 flex items-center gap-2">
          {date ? <time>{date}</time> : null}
          {typeof post.views === "number" ? (
            <>
              <span>•</span>
              <span>{post.views} views</span>
            </>
          ) : null}
        </div>

        <h3 className="mt-1 line-clamp-2 font-medium text-black">
          {post.title}
        </h3>

        {post.excerpt ? (
          <p className="mt-2 line-clamp-3 text-sm text-black/70">
            {post.excerpt}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
