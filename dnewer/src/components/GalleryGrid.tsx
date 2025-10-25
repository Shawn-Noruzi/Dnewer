// src/components/GalleryGrid.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  /** Height of your fixed navbar in px (to keep the close button visible) */
  navOffset?: number; // default 72
};

/** Detect mobile via matchMedia to swap mobile/desktop variants */
function useIsMobile(breakpointPx = 640) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile("matches" in e ? e.matches : (e as MediaQueryList).matches);
    handler(mq);
    if ("addEventListener" in mq) mq.addEventListener("change", handler as any);
    else (mq as any).addListener(handler);
    return () => {
      if ("removeEventListener" in mq) mq.removeEventListener("change", handler as any);
      else (mq as any).removeListener(handler);
    };
  }, [breakpointPx]);
  return isMobile;
}

/** Parse a filename path into base + variant */
function splitVariant(src: string) {
  const name = src.split("/").pop() || src;
  const lower = name.toLowerCase();
  // handle -desktop.webp / -mobile.webp
  if (/-desktop\.webp$/i.test(lower)) {
    const base = name.replace(/-desktop\.webp$/i, "");
    return { base, variant: "desktop" as const, src };
  }
  if (/-mobile\.webp$/i.test(lower)) {
    const base = name.replace(/-mobile\.webp$/i, "");
    return { base, variant: "mobile" as const, src };
  }
  // no variant suffix → treat as "original"
  const base = name.replace(/\.[^.]+$/i, "");
  return { base, variant: "original" as const, src };
}

export default function GalleryGrid({ images, navOffset = 72 }: Props) {
  // Build unique entries by base name; attach desktop/mobile/original when available
  const items = useMemo(() => {
    const map = new Map<
      string,
      { id: string; base: string; desktop?: string; mobile?: string; original?: string }
    >();

    images.forEach((fullPath, i) => {
      const { base, variant, src } = splitVariant(fullPath);
      const key = base.toLowerCase();

      if (!map.has(key)) {
        map.set(key, { id: `${i}-${key}`, base, [variant]: src } as any);
      } else {
        const prev = map.get(key)!;
        (prev as any)[variant] = src;
      }
    });

    return Array.from(map.values());
  }, [images]);

  // Lightbox state
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Touch tracking for swipe on mobile
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  // Offsets/sizes for UI elements
  const closeTop = `calc(env(safe-area-inset-top, 0px) + ${navOffset}px + 8px)`;
  const closeHitHeight = 56; // px (mobile close button area)
  const mobileBarHeight = 64; // px (bottom controls bar height)

  const openAt = (i: number) => {
    setIdx(i);
    setOpen(true);
  };
  const close = () => setOpen(false);
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);

  // Keyboard controls + scroll lock
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [open]);

  if (!items.length) {
    return (
      <div className="rounded-xl border border-neutral-200 p-6 text-center text-neutral-600">
        No images found. Add files to <code>/public/gallery</code>.
      </div>
    );
  }

  const isMobile = useIsMobile(640);

  return (
    <>
      {/* Uniform-size responsive grid — max 4 columns, 2 on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
        {items.map((it, i) => (
          <GalleryCard
            key={it.id}
            onClick={() => openAt(i)}
            // Prefer mobile on small screens, desktop on larger; fallback gracefully
            src={isMobile ? it.mobile || it.desktop || it.original! : it.desktop || it.mobile || it.original!}
          />
        ))}
      </div>

      {/* Lightbox */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          ref={backdropRef}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === backdropRef.current) close();
          }}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
            touchDeltaX.current = 0;
          }}
          onTouchMove={(e) => {
            if (touchStartX.current == null) return;
            touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
          }}
          onTouchEnd={() => {
            const threshold = 48; // px
            if (touchDeltaX.current > threshold) prev();
            else if (touchDeltaX.current < -threshold) next();
            touchStartX.current = null;
            touchDeltaX.current = 0;
          }}
        >
          {/* Close (X) — above everything */}
          <button
            aria-label="Close"
            onClick={close}
            className="cursor-pointer group absolute right-4 sm:right-6 z-[130] rounded-lg border border-white/15 bg-white/10 p-3 sm:p-2 text-white transition hover:bg-white/20"
            style={{ top: closeTop }}
          >
            <X className="h-6 w-6 sm:h-5 sm:w-5" />
            <span className="pointer-events-none absolute inset-x-2 -bottom-1 h-0.5 scale-x-0 rounded bg-[#F97316] transition group-hover:scale-x-100" />
          </button>

          {/* Desktop arrow buttons (middle left/right) */}
          <button
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="hidden sm:flex cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 rounded-lg border border-white/15 bg-white/10 p-2 text-white transition hover:bg-white/20 z-[90]"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="hidden sm:flex cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 rounded-lg border border-white/15 bg-white/10 p-2 text-white transition hover:bg-white/20 z-[90]"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Mobile edge tap zones (reduced height so they don't cover the bottom controls) */}
          <button
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="sm:hidden absolute left-0 w-1/3 z-[80]"
            style={{
              top: `calc(${closeTop} + ${closeHitHeight}px)`,
              height: `calc(100% - (${closeTop} + ${closeHitHeight + mobileBarHeight}px))`,
            }}
          />
          <button
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="sm:hidden absolute right-0 w-1/3 z-[80]"
            style={{
              top: `calc(${closeTop} + ${closeHitHeight}px)`,
              height: `calc(100% - (${closeTop} + ${closeHitHeight + mobileBarHeight}px))`,
            }}
          />

          {/* Image area — full width on mobile */}
          <div className="flex h-full items-center justify-center p-0 sm:p-6 md:p-10 mt-16">
            <div className="relative w-screen max-w-none sm:w-full sm:max-w-6xl">
              <div className="pointer-events-none absolute inset-0 rounded-none sm:rounded-xl ring-0 sm:ring-1 sm:ring-[#F97316]/20" />
              <div className="relative aspect-[9/16] sm:aspect-[16/10]">
                <Image
                  src={
                    isMobile
                      ? items[idx].mobile || items[idx].desktop || items[idx].original!
                      : items[idx].desktop || items[idx].mobile || items[idx].original!
                  }
                  alt={`Gallery image ${idx + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Mobile bottom control bar */}
          <div
            className="sm:hidden fixed inset-x-0 z-[120] flex items-center justify-between px-4 py-3"
            style={{ bottom: `max(env(safe-area-inset-bottom,0px), 0px)` }}
          >
            <div className="pointer-events-none absolute inset-x-0 -z-10 h-full bg-black/40 backdrop-blur-sm" />
            <button
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white active:scale-[0.98]"
            >
              <ChevronLeft className="h-5 w-5" />
              Prev
            </button>
            <span className="text-white/90 text-sm">
              {idx + 1} / {items.length}
            </span>
            <button
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white active:scale-[0.98]"
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* --- Card (uniform size + brand accents) --- */
function GalleryCard({ src, onClick }: { src: string; onClick: () => void }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      className="
        group relative block overflow-hidden rounded-2xl border
        border-neutral-200 bg-white shadow-sm transition
        hover:border-[#F97316] hover:shadow-lg
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]
        cursor-pointer
      "
      aria-label="Open image"
    >
      {/* Skeleton */}
      <div
        className={`absolute inset-0 rounded-2xl bg-neutral-100 transition-opacity duration-300 ${
          loaded ? "opacity-0" : "opacity-100 animate-pulse"
        }`}
      />

      {/* Image: square on mobile, 4:3 on larger screens */}
      <div className="relative aspect-[1/1] sm:aspect-[4/3]">
        <Image
          src={src}
          alt="Gallery image"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03] cursor-pointer"
          onLoadingComplete={() => setLoaded(true)}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
        />
      </div>

      {/* Brand ribbon on hover */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-[#F97316] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </button>
  );
}
