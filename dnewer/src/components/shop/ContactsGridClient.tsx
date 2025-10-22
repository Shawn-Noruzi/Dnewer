"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";

type Product = {
  _id: string;
  title: string;
  slug?: { current: string };
  brand?: string;
  price?: number;
  compareAtPrice?: number;
  packSize?: number;         // NEW: / 90 pack, / 180 pack, etc.
  thumbUrl?: string | null;
  thumbAlt?: string | null;  // NEW: alt text for thumbnail
};

export default function ContactsGridClient({
  initialProducts,
  allBrands,
}: {
  initialProducts: Product[];
  allBrands: string[];
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleBrand = (b: string) =>
    setSelected((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));

  // Keep everything visible: selected brands first, then the rest (dimmed)
  const products = useMemo(() => {
    if (!selected.length) return initialProducts;
    const isSel = (p: Product) => !!p.brand && selected.includes(p.brand);
    const selectedFirst = initialProducts.filter(isSel);
    const others = initialProducts.filter((p) => !isSel(p));
    return [...selectedFirst, ...others];
  }, [initialProducts, selected]);

  return (
    <>
      {/* Filters */}
      <aside className="space-y-4">
        <div className="text-xs font-medium tracking-wide text-black/60">BRAND</div>
        <ul className="space-y-2">
          {allBrands.map((b) => (
            <li key={b} className="flex items-center gap-2">
              <input
                id={`brand-${b}`}
                type="checkbox"
                className="size-4 rounded border-neutral-300 text-gold-400 focus:ring-gold-400"
                checked={selected.includes(b)}
                onChange={() => toggleBrand(b)}
              />
              <label htmlFor={`brand-${b}`} className="text-sm text-black/80 cursor-pointer">
                {b}
              </label>
            </li>
          ))}
        </ul>
        {selected.length > 0 && (
          <button
            className="mt-2 text-xs text-black/60 underline underline-offset-2 hover:text-gold-400 transition-colors"
            onClick={() => setSelected([])}
          >
            Clear filters
          </button>
        )}
      </aside>

      {/* Grid */}
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => {
            const hasCompare = p.compareAtPrice && p.compareAtPrice > (p.price ?? 0);
            const isDim = selected.length > 0 && (!p.brand || !selected.includes(p.brand));
            const pack = p.packSize ?? 90;

            // Only create a Route when slug exists
            const href: Route | null = p.slug?.current ? (`/product/${p.slug.current}` as Route) : null;

            const Card = (
              <div
                className={[
                  "group block rounded-xl border bg-white p-3 shadow-sm transition-all",
                  "hover:border-gold-400 hover:shadow-lg",
                  isDim ? "border-neutral-200/70 opacity-60 grayscale" : "border-neutral-200",
                ].join(" ")}
                {...(!href && { "aria-disabled": true })}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-50">
                  {p.thumbUrl ? (
                    <Image
                      src={p.thumbUrl}
                      alt={p.thumbAlt || p.title}
                      fill
                      sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                      className={[
                        "object-contain p-3 transition-transform duration-200",
                        "group-hover:scale-[1.03]",
                        isDim ? "opacity-70" : "",
                      ].join(" ")}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-black/40">No image</div>
                  )}
                </div>

                <div className="mt-3">
                  <div className={["text-[11px] uppercase tracking-wide", isDim ? "text-black/40" : "text-black/50"].join(" ")}>
                    {p.brand}
                  </div>
                  <div className={["mt-0.5 text-sm leading-snug font-medium break-words", isDim ? "text-black/60" : "text-black"].join(" ")}>
                    {p.title}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {hasCompare && <span className="text-xs text-black/40 line-through">${p.compareAtPrice!.toFixed(2)}</span>}
                    <span className={["text-sm font-semibold", isDim ? "text-black/70" : "text-black"].join(" ")}>
                      ${Number(p.price ?? 0).toFixed(2)} / {pack} pack
                    </span>
                  </div>
                </div>
              </div>
            );

            // Wrap with Link only when href exists
            return href ? (
              <Link key={p._id} href={href} className="block">
                {Card}
              </Link>
            ) : (
              <div key={p._id} className="block cursor-default">
                {Card}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
