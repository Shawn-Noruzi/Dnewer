// components/blog/MoreStoriesClient.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";

type PostCard = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  excerpt?: string;
  tags?: string[];
  coverUrl?: string | null;
};

export default function MoreStoriesClient({
  offset = 2,
  limit = 2,
}: {
  offset?: number;
  limit?: number;
}) {
  const [posts, setPosts] = useState<PostCard[] | null>(null);
  const [shouldRender, setShouldRender] = useState(false); // desktop-only gate

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 900) return; // don’t render on mobile
    setShouldRender(true);

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/blog/stories?offset=${offset}&limit=${limit}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (!cancelled) setPosts(data.posts || []);
      } catch {
        if (!cancelled) setPosts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [offset, limit]);

  if (!shouldRender) return null;

  const isLoading = posts === null;
  const list = isLoading ? Array.from({ length: limit }) : posts || [];

  return (
    <>
      {/* shimmer styles */}
      <style jsx global>{`
        @keyframes blog-skeleton {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        .skeleton {
          position: relative;
          overflow: hidden;
          background-color: #e5e7eb; /* neutral-200 */
        }
        .skeleton::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-repeat: no-repeat;
          background-size: 200px 100%;
          animation: blog-skeleton 1.2s ease-in-out infinite;
        }
      `}</style>

      {list.map((p: any, i: number) => {
        if (isLoading) {
          // Skeleton card
          return (
            <article
              key={`skeleton-${i}`}
              aria-busy="true"
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                <div className="h-full w-full skeleton rounded-none" />
                <div className="absolute left-2 top-2 flex gap-1">
                  <span className="h-[20px] w-[60px] rounded-full skeleton" />
                  <span className="h-[20px] w-[50px] rounded-full skeleton" />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="h-3 w-24 skeleton rounded" />
                <div className="mt-2 h-[22px] w-4/5 skeleton rounded" />
                <div className="mt-1 h-[22px] w-2/3 skeleton rounded" />
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <div className="h-4 w-24 skeleton rounded" />
                  <div className="h-8 w-8 rounded-full skeleton" />
                </div>
              </div>
            </article>
          );
        }

        // Real card
        type BlogRoute = Route<`/blog/${string}`>;
        const toBlog = (slug: string) => (`/blog/${slug}` as BlogRoute);
        const href = toBlog(p.slug.current);

        return (
          <article
            key={p._id}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"
          >
            <Link href={href} className="block">
              <div className="relative aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.coverUrl || "/images/eyewear-placeholder.jpg"}
                  alt={p.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {p.tags?.length ? (
                  <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                    {p.tags.slice(0, 2).map((t: string) => (
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
              <time className="block text-[12px] text-black/60">
                {formatDate(p.publishedAt)}
              </time>
              <Link
                href={href}
                className="mt-1 block subtext font-semibold leading-snug text-black hover:underline line-clamp-2 min-h-[2.75rem]"
              >
                {p.title}
              </Link>
              {p.excerpt ? (
                <p className="mt-2 line-clamp-3 text-sm text-black/70">
                  {p.excerpt}
                </p>
              ) : null}
              <div className="mt-auto pt-3 flex items-center justify-between">
                <Link href={href} className="subtext text-black/70 hover:text-black">
                  Read more →
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </>
  );
}

function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
