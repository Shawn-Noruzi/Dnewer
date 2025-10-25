// app/about/page.tsx
import { Hammer, Ruler, Paintbrush, Trees, ShieldCheck, ThumbsUp } from "lucide-react";
import ContactCTABanner from "@/components/ContactCTABanner";
import ServiceAreaBanner from "@/components/ServiceAreaBanner";
export const metadata = {
    title: "About Us | Dnewer",
    description:
        "Learn about Dnewer — a renovation and general contracting team serving the Lower Mainland & Fraser Valley. Built to last, done right, and on schedule.",
};

export default function AboutPage() {
    return (
        <main className="relative">
            {/* ========= HERO / BANNER ========= */}
            <section className="relative overflow-hidden mt-[118px]">
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

                    <div className="container relative py-10 md:py-20 text-center text-white">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-semibold backdrop-blur">
                            Dnewer Services Ltd.
                        </span>
                        <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl max-w-6xl mx-auto">
                            Passionate Builders.<br/>  Trusted Partners. <br/> <span className="font-semibold">Proven Results.</span>
                        </h1>
                        <p className="mx-auto mt-5 max-w-3xl text-white/90">
                            Dnewer Services was founded on a simple idea — every renovation deserves honesty, craftsmanship, and lasting quality. We take pride in treating your space like it’s our own, earning trust project by project across the Lower Mainland.
                        </p>


                    </div>
                </div>
            </section>

            {/* ========= MISSION ========= */}
            <section className="container py-10 md:py-20">
                <div className="grid items-start gap-10 md:grid-cols-2">
                    <div>
                        <h2 className="font-display text-3xl md:text-4xl text-[var(--color-brand-dark,#111)]">
                            Built to Last. Done Right. On Schedule.
                        </h2>
                        <p className="mt-4 text-black/70">
                            We’re a hands-on renovation team focused on craftsmanship, communication, and
                            accountability. From planning to punch list, we keep timelines clear, protect your
                            space like it’s our own, and deliver finishes that feel great every day.
                        </p>
                        <ul className="mt-6 space-y-3 text-black/80">
                            <li className="flex items-start gap-3">
                                <span className="mt-1 block h-2 w-2 rounded-full bg-[#F97316]" />
                                Transparent pricing, clear scheduling, and tidy work sites.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 block h-2 w-2 rounded-full bg-[#F97316]" />
                                Renovations across residential and commercial spaces.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 block h-2 w-2 rounded-full bg-[#F97316]" />
                                A single partner for repairs, maintenance, and remodels.
                            </li>
                        </ul>
                    </div>

                    {/* quick highlights */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Highlight
                            icon={<Hammer className="h-5 w-5" />}
                            title="General Contracting"
                            text="Full-service coordination — trades, permits, and timelines managed end-to-end."
                        />
                        <Highlight
                            icon={<Ruler className="h-5 w-5" />}
                            title="Remodels & Installation"
                            text="Kitchens, bathrooms, cabinetry, shower glass, doors, trim and more."
                        />
                        <Highlight
                            icon={<Paintbrush className="h-5 w-5" />}
                            title="Finishing & Painting"
                            text="Clean lines, crisp edges, durable finish systems for high-traffic areas."
                        />
                        <Highlight
                            icon={<Trees className="h-5 w-5" />}
                            title="Decks & Landscaping"
                            text="From structural repairs to new outdoor spaces that extend your living."
                        />
                    </div>
                </div>
            </section>

            {/* ========= SERVICE AREA BANNER ========= */}
            <ServiceAreaBanner />   


            <ContactCTABanner />

            {/* Spacer for safety */}
            <div className="h-10" />
        </main>
    );
}

/* ================== SMALL COMPONENTS ================== */

function Highlight({
    icon,
    title,
    text,
}: {
    icon: React.ReactNode;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-[#F97316]/30 bg-[#F97316]/10 text-[#F97316]">
                    {icon}
                </span>
                <div className="font-medium">{title}</div>
            </div>
            <p className="mt-3 text-sm text-black/70">{text}</p>
        </div>
    );
}


