// src/app/services/page.tsx
import type { Metadata } from "next";
import { Hammer, Wrench, Paintbrush, Bath, PanelsTopLeft, Trees, Ruler, AlarmClock } from "lucide-react";
import ContactCTABanner from "@/components/ContactCTABanner";
import ServiceArea from "@/components/ServiceArea";

export const metadata: Metadata = {
    title: "Services | Dnewer",
    description:
        "Commercial & residential renovations in the Lower Mainland and Fraser Valley — remodeling, installations, tiling, cabinets, painting, decks, landscaping, maintenance, and 24/7 emergency service.",
    openGraph: {
        title: "Dnewer Services",
        description:
            "Renovations that elevate your space — kitchens, bathrooms, decks, tiling, painting, landscaping, and more.",
    },
};

const services = [
    {
        icon: Hammer,
        title: "Renovations & Remodeling",
        desc:
            "Full-service renovations for kitchens, bathrooms, basements and commercial interiors — planning to final walkthrough.",
        bullets: ["Kitchens & Baths", "Basements", "Commercial TI"],
    },
    {
        icon: Bath,
        title: "Installations",
        desc:
            "Fixtures, shower glass, vanities, doors, trim, millwork, hardware — installed cleanly and correctly.",
        bullets: ["Shower Glass", "Doors & Trim", "Fixtures"],
    },
    {
        icon: PanelsTopLeft,
        title: "Tiling & Surfaces",
        desc:
            "Floors, walls, backsplashes, showers — precise layout, durable setting, and clean finishes.",
        bullets: ["Porcelain & Ceramic", "Backsplashes", "Shower Waterproofing"],
    },
    {
        icon: Paintbrush,
        title: "Painting & Finishing",
        desc:
            "Interior & exterior painting including surface prep, patching, caulking, and trim details.",
        bullets: ["Walls & Ceilings", "Trim & Doors", "Exterior Refresh"],
    },
    {
        icon: Trees,
        title: "Decks & Landscaping",
        desc:
            "Outdoor upgrades to extend your living space — decks, steps, planters, stonework and drainage.",
        bullets: ["Deck Builds", "Pavers & Stone", "Drainage"],
    },
    {
        icon: Wrench,
        title: "Repairs & Maintenance",
        desc:
            "Proactive and on-demand repairs for residential and commercial properties with clear reporting.",
        bullets: ["Drywall & Trim", "Small Repairs", "Preventative Service"],
    },
    {
        icon: Ruler,
        title: "Cabinetry & Custom",
        desc:
            "Cabinet upgrades, refacing, hardware, and custom carpentry to tighten function and style.",
        bullets: ["Cabinet Installs", "Hardware", "Custom Carpentry"],
    },
    {
        icon: AlarmClock,
        title: "24/7 Emergency Calls",
        desc:
            "After-hours response for leaks, damage, and urgent make-safe actions with follow-up repairs.",
        bullets: ["Make-Safe", "Leak Response", "Board-Ups"],
    },
];

const areas = [
    "Vancouver",
    "North Shore",
    "Burnaby",
    "New West",
    "Tri-Cities",
    "Richmond",
    "Delta",
    "Surrey",
    "Langley",
    "White Rock",
    "Maple Ridge",
    "Abbotsford",
];

export default function ServicesPage() {
    return (
        <main className="relative">
            {/* ========= HERO / BANNER (brand-matched) ========= */}
            <section className="relative overflow-hidden mt-20">
                <div
                    className="relative"
                    style={{
                        background:
                            "linear-gradient(140deg, #F97316 0%, #fb8b3c 50%, #ffb27d 100%)",
                    }}
                >
                    {/* subtle pattern */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-20"
                        style={{
                            backgroundImage:
                                "radial-gradient(white 1px, transparent 1px), radial-gradient(white 1px, transparent 1px)",
                            backgroundSize: "16px 16px",
                            backgroundPosition: "0 0, 8px 8px",
                            mixBlendMode: "overlay",
                        }}
                    />
                    {/* angled sheen */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -left-24 top-0 h-[200%] w-[60%] rotate-12 bg-white/10 blur-2xl"
                    />

                    <div className="container relative py-20 md:py-28 text-center text-white">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-semibold backdrop-blur">
                            What We Do
                        </span>
                        <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
                            Renovations That <br/> <span className="font-semibold">Elevate Your Space</span>
                        </h1>
                        <p className="mx-auto mt-5 max-w-3xl text-white/90">
                            Commercial & residential work across the Lower Mainland and Fraser Valley — from
                            planning to completion, done right and built to last.
                        </p>
                    </div>
                </div>
            </section>

            {/* ========= SERVICES GRID ========= */}
            <section className="container pb-20 pt-10 ">
                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map(({ icon: Icon, title, desc, bullets }) => (
                        <article
                            key={title}
                            className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-[#F97316] hover:shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#F97316]/30 bg-[#F97316]/10 text-[#F97316]">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <h3 className="font-medium text-[var(--color-brand-dark,#111)]">{title}</h3>
                            </div>
                            <p className="mt-3 text-sm text-black/70">{desc}</p>
                            <ul className="mt-3 flex flex-wrap gap-2">
                                {bullets.map((b) => (
                                    <li
                                        key={b}
                                        className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-black/70 group-hover:border-[#F97316]/40"
                                    >
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>


            {/* ========= MINI PROCESS (Brand backdrop + rounded card section) ========= */}
            <section className="relative overflow-hidden py-20">
                <div className="relative">
                    <div className="container relative ">
                        {/* Rounded card wrapper for the whole section */}
                        <div
                            className="relative overflow-hidden rounded-3xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur"
                            style={{
                                // Brand gradient (same as header)
                                background:
                                    "linear-gradient(140deg, #F97316 0%, #fb8b3c 40%, #ffb27d 100%)",
                            }}
                        >
                            {/* subtle dot pattern (masked so it doesn't overpower content) */}
                            <div
                                aria-hidden
                                className="pointer-events-none absolute inset-0 opacity-25"
                                style={{
                                    backgroundImage:
                                        "radial-gradient(white 1px, transparent 1px), radial-gradient(white 1px, transparent 1px)",
                                    backgroundSize: "16px 16px",
                                    backgroundPosition: "0 0, 8px 8px",
                                    mixBlendMode: "overlay",
                                    WebkitMaskImage:
                                        "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                                    maskImage:
                                        "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                                }}
                            />

                            {/* angled sheen for depth (matches header vibe) */}
                            <div
                                aria-hidden
                                className="pointer-events-none absolute -left-24 top-0 h-[200%] w-[60%] rotate-12 bg-white/10 blur-2xl"
                            />

                            {/* top bar / title area */}
                            <div className="relative px-6 py-8 sm:px-10 sm:py-10">
                                <div className="mx-auto max-w-2xl text-center">
                                    <h2 className="font-display text-3xl md:text-5xl text-white drop-shadow-sm">
                                        How It Works
                                    </h2>
                                   
                                </div>
                            </div>

                            {/* steps grid (white tiles for high readability) */}
                            <div className="relative px-6 pb-8 sm:px-10 sm:pb-10">
                                <ol className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                    {[
                                        { n: 1, t: "Consult", d: "Walk-through, scope, and priorities." },
                                        { n: 2, t: "Plan", d: "Clear estimate, options, and schedule." },
                                        { n: 3, t: "Build", d: "Protected site, tidy work, quality checks." },
                                        { n: 4, t: "Deliver", d: "Final walkthrough & maintenance tips." },
                                    ].map((s) => (
                                        <li
                                            key={s.n}
                                            className="
                  group relative rounded-2xl border bg-white p-5 shadow-sm
                  transition
                  border-neutral-200 
                  focus-within:ring-2 focus-within:ring-[#F97316]/60
                "
                                        >
                                            {/* Step badge — white with orange outline/text (doesn't blend into card bg) */}
                                            <span
                                                className="
                    absolute -top-3 left-5 inline-flex h-8 min-w-8 items-center justify-center
                    rounded-full border border-[#F97316] bg-white px-2 text-sm font-bold text-[#F97316] shadow
                  "
                                            >
                                                {s.n}
                                            </span>

                                            <div className="mt-2 font-medium text-neutral-900">{s.t}</div>
                                            <p className="mt-1 text-sm text-neutral-700">{s.d}</p>

                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </section>




            <ServiceArea />

            {/* ========= FAQ ========= */}
            <section className="container pb-8 md:pb-12">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="font-display text-2xl md:text-3xl text-[var(--color-brand-dark,#111)]">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="mx-auto mt-6 max-w-3xl space-y-3">
                    {[
                        {
                            q: "Do you provide free estimates?",
                            a: "Yes — we’ll visit, review scope and constraints, then deliver a clear estimate and schedule.",
                        },
                        {
                            q: "Are permits or strata approvals handled?",
                            a: "We support permitting and strata documentation as needed and build timelines around approvals.",
                        },
                        {
                            q: "How do you keep the site clean?",
                            a: "Surface protection, dust control, tidy daily wrap-ups, and clear communication throughout.",
                        },
                        {
                            q: "Do you do small repairs?",
                            a: "Absolutely — from drywall patches to hardware fixes and paint touch-ups, we’re happy to help.",
                        },
                    ].map((f) => (
                        <details
                            key={f.q}
                            className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition open:border-[#F97316]/40 open:ring-1 open:ring-[#F97316]/30"
                        >
                            <summary className="cursor-pointer select-none p-4 font-medium text-[var(--color-brand-dark,#111)]">
                                {f.q}
                            </summary>
                            <div className="border-t border-neutral-200 p-4 text-sm text-black/70">{f.a}</div>
                        </details>
                    ))}
                </div>
            </section>

            <ContactCTABanner />

            {/* ========= JSON-LD (SEO) ========= */}
            <script
                type="application/ld+json"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "HomeAndConstructionBusiness",
                        name: "Dnewer Service Ltd.",
                        areaServed: "Lower Mainland & Fraser Valley, BC",
                        url: "https://www.dnewer.com/services",
                        brand: "Dnewer",
                        serviceType: services.map((s) => s.title),
                    }),
                }}
            />
        </main>
    );
}
