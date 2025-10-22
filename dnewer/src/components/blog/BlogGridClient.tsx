"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { clsx } from "clsx";

type Item = {
  id: string;
  title: string;
  slug: string;            // slug only, e.g. "my-post"
  excerpt: string;
  coverUrl: string | null;
  publishedAt: string;     // ISO
  views: number;
  tags: string[];
};

type SortKey = "new" | "views" | "trending";

export default function BlogGridClient({
  initialItems,
  allTags,
  initialSort = "new",
}: {
  initialItems: Item[];
  allTags: string[];
  initialSort?: SortKey;
}) {
  const [sortBy, setSortBy] = useState<SortKey>(initialSort);
  const [query, setQuery] = useState("");
  const [openFilters, setOpenFilters] = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const toggleTag = (t: string) =>
    setActiveTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialItems.filter((p) => {
      const matchesText =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));

      const matchesTags =
        activeTags.length === 0 || activeTags.every((t) => p.tags.includes(t));

      return matchesText && matchesTags;
    });
  }, [initialItems, query, activeTags]);

  const sorted = useMemo(() => {
    const now = Date.now();

    const scoreTrending = (p: Item) => {
      const ageDays = Math.max(
        0,
        (now - new Date(p.publishedAt).getTime()) / 86_400_000
      );
      const recencyBoost = Math.max(0, 45 - ageDays) * 5;
      const popularity = p.views;
      return popularity + recencyBoost;
    };

    const arr = [...filtered];
    if (sortBy === "new") {
      arr.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } else if (sortBy === "views") {
      arr.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    } else {
      arr.sort((a, b) => scoreTrending(b) - scoreTrending(a));
    }
    return arr;
  }, [filtered, sortBy]);

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-black/60">
          {sorted.length} Insight Pages
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-black/60">Sort</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className=" cursor-pointer h-9 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-gold-400/70"
          >
            <option value="new">Most Recent</option>
            <option value="views">Most Viewed</option>
            <option value="trending">Trending</option>
          </select>

          <button
            className="cursor-pointer h-9 rounded-md border border-neutral-300 bg-white px-3 text-sm hover:border-gold-400 transition"
            onClick={() => setOpenFilters((o) => !o)}
          >
            Filters
          </button>
        </div>
      </div>

      {/* Filters drawer */}
      {openFilters && (
        <div className="mb-4 rounded-xl border border-neutral-200 bg-white p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {allTags.length ? (
                allTags.map((t) => (
                  <label
                    key={t}
                    className={clsx(
                      "cursor-pointer select-none rounded-full border px-3 py-1 text-sm",
                      activeTags.includes(t)
                        ? "border-gold-400 bg-gold-400/10"
                        : "border-neutral-300 hover:border-gold-400"
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={activeTags.includes(t)}
                      onChange={() => toggleTag(t)}
                    />
                    {t}
                  </label>
                ))
              ) : (
                <div className="text-sm text-black/50">No tags yet.</div>
              )}
            </div>

            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts…"
                className="h-9 rounded-full border border-neutral-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-gold-400/70"
              />
            </div>
          </div>

          {(activeTags.length > 0 || query) && (
            <div className="mt-3">
              <button
                className="text-sm text-black/60 underline underline-offset-2 hover:text-gold-400"
                onClick={() => {
                  setActiveTags([]);
                  setQuery("");
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Grid */}
      {sorted.length === 0 ? (
        <div className="mt-10 text-sm text-black/60">
          No posts match your filters.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p) => (
            <Card key={p.id} item={p} />
          ))}
        </div>
      )}
    </div>
  );
}

/* Card */
function Card({ item }: { item: Item }) {
  // typed-route helper for Next 15
  type BlogRoute = Route<`/blog/${string}`>;
  const toBlog = (slug: string) => (`/blog/${slug}` as BlogRoute);

  const href = toBlog(item.slug);
  const date = new Date(item.publishedAt).toLocaleDateString();

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[16/9] bg-neutral-50">
        {item.coverUrl ? (
          <Image
            src={item.coverUrl}
            alt={item.title}
            fill
            className="object-cover transition will-change-transform group-hover:scale-[1.02]"
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          />
        ) : null}

        {!!item.tags.length && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-2">
            {item.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full bg-black/70 px-2 py-0.5 text-[11px] text-white"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-xs text-black/60">{date}</div>
        <h3 className="mt-1 line-clamp-2 font-medium text-black">
          {item.title}
        </h3>
        {item.excerpt ? (
          <p className="mt-2 line-clamp-3 text-sm text-black/70">
            {item.excerpt}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
