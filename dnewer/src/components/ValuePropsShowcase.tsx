// components/ValuePropsShowcase.tsx (client)
import React from "react";

/**
 * ValuePropsShowcase
 *
 * Responsive hero/value-props section inspired by the provided mock.
 * Palette: black (#000) + yellow.
 * Images: eyewear imagery (placeholders by default).
 *
 * Drop-in for Next.js (App Router) with TailwindCSS.
 */

export type Card = {
  title: string;
  subtitle?: string;
  body?: string;
  cta?: { label: string; href: string };
  image?: { src: string; alt: string };
};

export default function ValuePropsShowcase({
  heading = "Unrivalled Excellence",
  subheading = "Dedicated to craft and the practical style of lenses, custom-fit to your needs.",
  left = {
    title: "Purchasing with insurance, made easy.",
    body:
      "Use your benefits online or in-store. We accept most vision insurance plans, submit on your behalf, and keep it simple.",
    cta: { label: "Shop with benefits", href: "/deals" },
    image: { src: "/images/eyewear-1.jpg", alt: "Sunglasses with blue lenses" },
  },
  right = {
    title: "Shop Online, Thrive In-Store!",
    body:
      "Order online or book a fitting at any location. Enjoy expert adjustments and after-care whenever you need it.",
    image: { src: "/images/eyewear-hand.jpg", alt: "Hand holding glasses" },
  },
  bottom = {
    title: "Our lenses",
    subtitle: "The right optics, precisely cut to your prescription.",
    body: "Choose from premium options with blue-light filters, transitions, and ultra-thin materials.",
    image: { src: "/images/eyewear-plate.jpg", alt: "Three pairs of eyeglasses on a dish" },
  },
}: {
  heading?: string;
  subheading?: string;
  left?: Card;
  right?: Card;
  bottom?: Card & { features?: string[] };
}) {
  return (
    <section className="container">
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="subtitle text-black">{heading}</h2>
        {subheading && (
          <p className="mt-2 maintext text-black/70 max-w-3xl mx-auto">{subheading}</p>
        )}
      </div>

      {/* Grid: top two cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left card */}
        <article className="rounded-2xl border border-black/10 bg-white overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            <div className="p-6 sm:p-7 flex flex-col justify-center">
              <h3 className="maintext font-semibold text-black">{left.title}</h3>
              {left.body && (
                <p className="mt-2 subtext text-black/70 leading-relaxed">{left.body}</p>
              )}
              {left.cta && (
                <a
                  href={left.cta.href}
                  className="btn-primary mt-4 inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-white subtext font-medium hover:opacity-90"
                >
                  {left.cta.label}
                </a>
              )}
            </div>
            <div className="relative min-h-[180px] bg-gradient-to-br from-gold-200 to-gold-400">
              <img
                src={left.image?.src}
                alt={left.image?.alt || "eyewear"}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </article>

        {/* Right card */}
        <article className="rounded-2xl border border-black/10 overflow-hidden shadow-sm bg-gradient-to-br from-gold-200 to-gold-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 h-full">
            <div className="p-6 sm:p-7 order-2 sm:order-1 flex flex-col justify-center">
              <h3 className="maintext font-semibold text-black">{right.title}</h3>
              {right.body && (
                <p className="mt-2 subtext text-black/80 leading-relaxed">{right.body}</p>
              )}
            </div>
            <div className="relative order-1 sm:order-2 min-h-[180px]">
              <img
                src={right.image?.src}
                alt={right.image?.alt || "eyewear"}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </article>
      </div>

      {/* Bottom wide card */}
      <article className="mt-6 rounded-2xl border border-black/10 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 sm:p-8 bg-white">
            <h3 className="maintext font-semibold text-black">{bottom.title}</h3>
            {bottom.subtitle && <p className="mt-2 subtext text-black/70">{bottom.subtitle}</p>}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <FeaturePill title="Transitions®" desc="Light-adaptive lenses with 100% UV protection." />
              <FeaturePill title="Blue-violet light" desc="Filter options for extended screen time." />
              <FeaturePill title="Prescription sun" desc="Polarized options for outdoor clarity." />
              <FeaturePill title="Ultra-thin" desc="High-index for strong prescriptions." />
            </div>
          </div>
          <div className="relative bg-gold-300 min-h-[220px]">
            <img
              src={bottom.image?.src}
              alt={bottom.image?.alt || "eyewear"}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </article>
    </section>
  );
}

function FeaturePill({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="subtext font-medium text-black">{title}</div>
      <p className="mt-1 subtext text-black/70">{desc}</p>
    </div>
  );
}
