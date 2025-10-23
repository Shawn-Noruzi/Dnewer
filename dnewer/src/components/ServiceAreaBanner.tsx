"use client";

import { MapPin, ShieldCheck, Clock, Hammer, ThumbsUp, Sparkles } from "lucide-react";

type Pill = { label: string; icon?: React.ComponentType<{ className?: string }> };

const PILLS: Pill[] = [
  { label: "Licensed & Insured", icon: ShieldCheck },
  { label: "30+ Years Experience", icon: Hammer },
  { label: "Residential & Commercial", icon: ThumbsUp },
  { label: "Transparent Estimates", icon: Sparkles },
  { label: "Clean & On-Time", icon: Clock },
];

export default function ServiceAreaMini() {
  return (
    <section className="container py-10 md:py-14">
      {/* Card (fills the container width) */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {/* Brand top strip + header */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div
            className="h-2 w-full"
            style={{
              background:
                "linear-gradient(140deg, #F97316 0%, #fb8b3c 45%, #ffb27d 100%)",
            }}
            aria-hidden
          />
          <div className="p-6 sm:p-7 lg:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-3 py-1 text-xs font-semibold text-[var(--color-brand-dark,#111)]">
              <MapPin className="h-4 w-4 text-[#F97316]" />
              Lower Mainland, BC
            </div>

            <h3 className="mt-3 font-display text-2xl md:text-3xl text-[var(--color-brand-dark,#111)]">
              Servicing the Lower Mainland of BC for{" "}
              <span className="text-[#F97316]">Over 30 Years</span>
            </h3>

            <p className="mt-2 max-w-prose text-sm text-neutral-700">
              Renovations built to last — kitchens, bathrooms, decks, tiling, painting, and more.
              Trusted by homeowners and businesses across Vancouver and the Fraser Valley.
            </p>
          </div>

          {/* subtle dotted wash in the corner */}
          <div
            className="pointer-events-none absolute right-0 top-0 h-24 w-40 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(#F97316 1px, transparent 1px), radial-gradient(#F97316 1px, transparent 1px)",
              backgroundSize: "14px 14px",
              backgroundPosition: "0 0, 7px 7px",
              WebkitMaskImage: "linear-gradient(to left, black 0%, transparent 90%)",
              maskImage: "linear-gradient(to left, black 0%, transparent 90%)",
            }}
            aria-hidden
          />
        </div>

        {/* Pills row */}
        <div className="px-6 pb-6 sm:px-7 sm:pb-7 lg:px-8 lg:pb-8">
          <ul className="flex flex-wrap gap-2.5">
            {PILLS.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-[var(--color-brand-dark,#111)] hover:border-[#F97316]/40 hover:bg-[#F97316]/10 transition"
              >
                {Icon ? <Icon className="h-4 w-4 text-[#F97316]" /> : null}
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
