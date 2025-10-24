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

export default function GalleryGrid({ images, navOffset = 72 }: Props) {
  const items = useMemo(() => images.map((src, i) => ({ id: `${i}-${src}`, src })), [images]);

  // Lightbox state
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Touch tracking for swipe on mobile
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

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

  return (
    <>
      {/* Uniform-size responsive grid — max 4 columns, 2 on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
        {items.map((it, i) => (
          <GalleryCard key={it.id} src={it.src} onClick={() => openAt(i)} />
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
          {/* Close (X) — offset below navbar; bigger hit-area on mobile */}
          <button
            aria-label="Close"
            onClick={close}
            className="cursor-pointer group absolute right-4 sm:right-6 rounded-lg border border-white/15 bg-white/10 p-3 sm:p-2 text-white transition hover:bg-white/20"
            style={{
              top: `calc(env(safe-area-inset-top, 0px) + ${navOffset}px + 8px)`,
            }}
          >
            <X className="h-6 w-6 sm:h-5 sm:w-5" />
            <span className="pointer-events-none absolute inset-x-2 -bottom-1 h-0.5 scale-x-0 rounded bg-[#F97316] transition group-hover:scale-x-100" />
          </button>

          {/* Desktop arrow buttons */}
          <button
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="hidden sm:flex cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 rounded-lg border border-white/15 bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="hidden sm:flex cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 rounded-lg border border-white/15 bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Mobile edge tap zones (full-height, invisible) */}
          <button
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="sm:hidden absolute left-0 top-0 h-full w-1/3"
          />
          <button
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="sm:hidden absolute right-0 top-0 h-full w-1/3"
          />

          {/* Centered image with brand frame */}
          <div className="flex h-full items-center justify-center p-3 sm:p-6 md:p-10 mt-16">
            <div className="relative w-full max-w-6xl">
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-[#F97316]/20" />
              <div className="relative aspect-[16/10]">
                <Image
                  src={items[idx].src}
                  alt={`Gallery image ${idx + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Index badge (mobile visible) */}
          <div className="sm:hidden pointer-events-none absolute inset-x-0 bottom-[max(env(safe-area-inset-bottom,0px),12px)] flex justify-center">
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white ring-1 ring-white/20">
              {idx + 1} / {items.length}
            </span>
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
