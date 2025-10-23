// src/components/ProcessTimeline.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function ProcessTimeline({
  steps,
  imageSrc,
  imageAlt = "Dnewer process preview",
  stickyOffset = 24, // px from top when sticky
}: {
  steps: { title: string; body: string }[];
  imageSrc: string;
  imageAlt?: string;
  stickyOffset?: number;
}) {
  // Right-column (timeline) refs so fill is based on this column only
  const timelineColRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // The highest step index the user has reached (never decreases)
  const [maxReached, setMaxReached] = useState(0);
  // Current visibly active card (can move up/down), used only for emphasis
  const [activeIdx, setActiveIdx] = useState(0);
  // Keep line progress monotonic too
  const lastPctRef = useRef(0);

  // Observe which step is most visible to style as "active" and mark maxReached
  useEffect(() => {
    const el = timelineColRef.current;
    if (!el) return;

    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-step-card]"));
    if (!cards.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = Number((visible.target as HTMLElement).dataset.idx || 0);
        setActiveIdx(idx);
        setMaxReached((prev) => Math.max(prev, idx)); // <- never go backward
      },
      { root: null, rootMargin: "-20% 0px -50% 0px", threshold: [0.1, 0.25, 0.5, 0.75, 1] }
    );

    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  // Smooth fill of the vertical line as the user scrolls the timeline column (monotonic)
  useEffect(() => {
    const col = timelineColRef.current;
    const fill = progressRef.current;
    if (!col || !fill) return;

    let ticking = false;

    const measure = () => {
      const rect = col.getBoundingClientRect();
      const vh = window.innerHeight;

      // So the fill starts a bit after the column enters view and finishes a bit before leaving
      const startZone = Math.min(vh * 0.15, rect.height);
      const endZone = rect.height - Math.min(vh * 0.2, rect.height);

      const scrolled = Math.min(Math.max(-rect.top + startZone, 0), Math.max(endZone - startZone, 1));
      const pct = scrolled / Math.max(endZone - startZone, 1);

      // Monotonic (never shrink)
      const monotonicPct = Math.max(lastPctRef.current, pct);
      lastPctRef.current = monotonicPct;

      // If last step is reached, force 100%
      const isDone = maxReached >= steps.length - 1;
      const finalPct = isDone ? 1 : monotonicPct;

      // GPU-friendly scaleY fill (feels more fluid than height)
      fill.style.transform = `scaleY(${finalPct})`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(measure);
        ticking = true;
      }
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [steps.length, maxReached]);

  const items = useMemo(() => steps.map((s, i) => ({ ...s, n: i + 1 })), [steps]);

  return (
    <div className="flex flex-col gap-10 lg:flex-row container py-14 md:py-20">
      {/* LEFT: Sticky image panel (uses imageSrc) */}
      <div className="lg:w-[44%] lg:flex-none">
        <div
          className="lg:sticky overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
          style={{ top: stickyOffset }}
        >
          <div className="relative aspect-[4/3] sm:aspect-[16/10]">
            <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover" />
            {/* brand frame */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-[#F97316]/20" />
          </div>
        </div>
      </div>

      {/* RIGHT: Vertical timeline column */}
      <div className="relative lg:w-[56%] lg:flex-1" ref={timelineColRef}>
        {/* static track */}
        <div className="pointer-events-none absolute left-4 top-0 h-full w-1.5 -translate-x-1/2 rounded bg-neutral-200 sm:left-5" />

        {/* animated brand fill (scaleY for smoothness) */}
        <div
          ref={progressRef}
          className="pointer-events-none absolute left-4 top-0 w-1.5 -translate-x-1/2 origin-top rounded bg-[#F97316] sm:left-5 will-change-transform"
          style={{ transform: "scaleY(0)" }}
          aria-hidden
        />

        <ol className="relative ml-9 space-y-5 sm:ml-12">
          {items.map((it, i) => {
            const isActive = i === activeIdx;
            const isComplete = i <= maxReached;

            return (
              <li
                key={i}
                data-step-card
                data-idx={i}
                className={[
                  "relative rounded-2xl border bg-white p-5 shadow-sm transition",
                  isActive || isComplete
                    ? "border-[#F97316]/40 ring-1 ring-[#F97316]/30"
                    : "border-neutral-200",
                ].join(" ")}
              >
                {/* Node badge */}
                <span
                  className={[
                    "absolute left-[7px] xl:left-0 top-5 -translate-x-[calc(100%+12px)] grid h-8 w-8 place-items-center rounded-full text-sm font-bold",
                    isComplete
                      ? "bg-[#F97316] text-white"
                      : "bg-white text-[#F97316] border border-[#F97316]/40",
                  ].join(" ")}
                >
                  {it.n}
                </span>

                <div className="font-medium text-[var(--color-brand-dark,#111)]">{it.title}</div>
                <p className="mt-1 text-sm text-black/70">{it.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
