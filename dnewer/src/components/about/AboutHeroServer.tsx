// components/about/AboutHeroServer.tsx
import Image from "next/image";
import type { Route } from "next";
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage";
import { CTAButton } from "@/components/CTAButton";

export const dynamic = "force-dynamic";

type AboutHeroDoc = {
  title?: string;
  description?: string;
  image?: any;
  imageAlt?: string;
  ctaPrimary?: { label?: string; href?: string };
  ctaSecondary?: { label?: string; href?: string };
};

const query = /* groq */ `
*[_type=="aboutHeroSection"][0]{
  title, description, image, imageAlt,
  ctaPrimary{label, href},
  ctaSecondary{label, href}
}
`;

const isInternal = (h?: string): h is Route => !!h && h.startsWith("/");
const isHash = (h?: string) => !!h && h.startsWith("#");

export default async function AboutHeroServer() {
  const d = await sanity.fetch<AboutHeroDoc>(query, {}, { next: { revalidate: 0 } });

  const img =
    d?.image
      ? urlFor(d.image).width(3000).height(750).fit("crop").url()
      : "/images/eye-closeup.jpg";

  const title = d?.title ?? "Meet the Team Behind Factory Optical";
  const description =
    d?.description ??
    "From clinical excellence to community care, get to know the people and principles guiding our work every day.";

  const ctaPrimary = d?.ctaPrimary ?? { label: "Our Story", href: "/about/story" };
  const ctaSecondary = d?.ctaSecondary ?? { label: "Meet the Team", href: "#team" };

  return (
    <section className="section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-black/30">
        <Image src={img} alt={d?.imageAlt || title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/20" />
      </div>

      {/* Same container + height as Services */}
      <div className="container">
        <div className="grid items-stretch gap-8 md:grid-cols-2 min-h-[420px] sm:min-h-[520px] lg:min-h-[640px]">
          {/* Left (vertically centered) */}
          <div className="max-w-4xl h-full flex flex-col justify-center">
            <h1 className="text-white title">{title}</h1>
            <p className="mt-4 text-white/85 maintext leading-relaxed max-w-2xl">{description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              {/* Primary CTA — same style/hover as your Services hero */}
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

              {/* Secondary CTA — hash = anchor, else internal/external */}
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

          {/* Right spacer to mirror the home/services two-column layout */}
          <div />
        </div>
      </div>
    </section>
  );
}
