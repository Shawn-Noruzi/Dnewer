// components/services/ServicesHeroServer.tsx
import Image from "next/image";
import type { Route } from "next";
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage";
import { CTAButton } from "@/components/CTAButton";

type ServicesHeroDoc = {
  title?: string;
  description?: string;
  image?: any;
  ctaPrimary?: { label?: string; href?: string };
  ctaSecondary?: { label?: string; href?: string };
};

const query = /* groq */ `
*[_type=="servicesHeroSection"][0]{
  title, description, image, ctaPrimary{label, href}, ctaSecondary{label, href}
}
`;

const isInternal = (h?: string): h is Route => !!h && h.startsWith("/");
const isHash = (h?: string) => !!h && h.startsWith("#");

export default async function ServicesHeroServer() {
  const d = await sanity.fetch<ServicesHeroDoc>(query, {}, { next: { revalidate: 0 } });

  const img =
    d?.image ? urlFor(d.image).width(3000).height(750).fit("crop").url() : "/images/eye-closeup.jpg";

  const title = d?.title ?? "Your eye health starts here";
  const description =
    d?.description ??
    "Experience the next level of eye care with our advanced diagnostic technology. Every exam includes OCT imaging for a clearer picture of your eye health.";

  const ctaPrimary = d?.ctaPrimary ?? { label: "Book Remote Exam", href: "/book" };
  const ctaSecondary = d?.ctaSecondary ?? { label: "See Contact Lenses", href: "/contact-lenses" };

  return (
    <section className="section relative overflow-hidden">
      {/* Full-bleed background layer */}
      <div className="absolute inset-0 -z-10 bg-black/30">
        <Image src={img} alt={title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/20" />
      </div>

      {/* Match Home: same container + min height */}
      <div className="container">
        <div className="flex items-center min-h-[420px] sm:min-h-[520px] lg:min-h-[640px]">
          {/* Left: copy (vertically centered) */}
          <div className="max-w-4xl h-full flex flex-col justify-center">
            <h1 className="text-white title">{title}</h1>
            <p className="mt-4 text-white/85 maintext leading-relaxed max-w-2xl">{description}</p>


            <div className="mt-6 flex flex-wrap gap-3 justify-center sm:justify-start">
              {/* Primary CTA (same as before) */}
              {isInternal(ctaPrimary.href) ? (
                <CTAButton
                  href={ctaPrimary.href}
                  variant="secondary"
                  className="transition-colors duration-200 ease-out hover:bg-gold-400 hover:text-black"
                >
                  {ctaPrimary.label}
                </CTAButton>
              ) : (
                <a
                  href={ctaPrimary.href || "#"}
                  target={ctaPrimary.href?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="btn btn-secondary transition-colors duration-200 ease-out hover:bg-gold-400 hover:text-black"
                >
                  {ctaPrimary.label}
                </a>
              )}

              {/* Secondary CTA — if hash, just anchor; otherwise same behavior as before */}
              {isHash(ctaSecondary.href) ? (
                <a
                  href={ctaSecondary.href}
                  className="btn btn-ghost ring-1 ring-white/30 bg-white/10 text-white transition-colors duration-200 ease-out hover:text-gold-400 hover:ring-gold-400 hover:bg-white/10"
                >
                  {ctaSecondary.label}
                </a>
              ) : isInternal(ctaSecondary.href) ? (
                <CTAButton
                  href={ctaSecondary.href}
                  variant="ghost"
                  className="ring-1 ring-white/30 bg-white/10 text-white transition-colors duration-200 ease-out hover:text-gold-400 hover:ring-gold-400 hover:bg-white/10"
                >
                  {ctaSecondary.label}
                </CTAButton>
              ) : (
                <a
                  href={ctaSecondary.href || "#"}
                  target={ctaSecondary.href?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="btn btn-ghost ring-1 ring-white/30 bg-white/10 text-white transition-colors duration-200 ease-out hover:text-gold-400 hover:ring-gold-400 hover:bg-white/10"
                >
                  {ctaSecondary.label}
                </a>
              )}
            </div>
          </div>
          <div />
        </div>
      </div>
    </section>
  );
}
