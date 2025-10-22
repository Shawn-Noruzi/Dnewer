import Image from "next/image";
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage";
import { CTAButton } from "@/components/CTAButton";

const query = /* groq */ `
*[_type=="heroSection"][0]{
  title, description,
  mainImage{..., "alt": coalesce(alt, "")},  // pull alt
  ctaPrimary{label, href},
  ctaSecondary{label, href},
  metaTitle, 
  metaDescription
}
`;

const isInternal = (h?: string) => !!h && h.startsWith("/");

export default async function HeroServer() {
  const data = await sanity.fetch<any>(query, {}, { next: { revalidate: 0 } });

  const primary = data?.ctaPrimary ?? { label: "Book Exam", href: "/book" };
  const secondary = data?.ctaSecondary ?? { label: "View Deals", href: "/deals" };

  // Sensible alt fallback: explicit alt → title → generic
  const heroAlt =
    (data?.mainImage && (data.mainImage.alt as string)) ||
    (data?.title as string) ||
    "Homepage hero image";

  return (
    <section className="section bg-gold-300">
      <div className="container">
        <div
          className={[
            "grid items-stretch gap-8 md:grid-cols-2",
            "min-h-[420px] sm:min-h-[520px] lg:min-h-[680px]",
          ].join(" ")}
        >
          {/* Left: copy */}
          <div className="max-w-2xl h-full flex flex-col justify-center">
            <h1
              className={[
                "font-display text-black",
                "title",
                "max-[899px]:subtitle",
                "mt-3",
                "max-[899px]:mt-[50px]",
              ].join(" ")}
            >
              {data?.title || "Advanced Eye Exams, Frames You’ll Love."}
            </h1>

            <p className="mt-4 maintext text-black">
              {data?.description ||
                "Book a comprehensive exam and shop curated brands at Factory Optical."}
            </p>

            <div className="mt-6 flex gap-3">
              {isInternal(primary.href) ? (
                <CTAButton href={primary.href!} variant="secondary">
                  {primary.label}
                </CTAButton>
              ) : (
                <a
                  href={primary.href || "#"}
                  target={primary.href?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  {primary.label}
                </a>
              )}

              {isInternal(secondary.href) ? (
                <CTAButton href={secondary.href!} variant="secondary">
                  {secondary.label}
                </CTAButton>
              ) : (
                <a
                  href={secondary.href || "#"}
                  target={secondary.href?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  {secondary.label}
                </a>
              )}
            </div>
          </div>

          {/* Right: image block — fills most of its column */}
          <div className="flex items-stretch md:justify-end">
            {/* small breathing room around the image */}
            <div className="relative w-full md:w-[95%] lg:w-full py-2 sm:py-12">
              {/* image container fills available height & width */}
              <div
                className={[
                  "relative h-[320px] sm:h-[420px] md:h-full w-full mb-12 lg:mb-0",
                  "rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5",
                ].join(" ")}
              >
                <Image
                  src={
                    data?.mainImage
                      ? urlFor(data.mainImage).auto("format").quality(70).url()
                      : "/headerImages/HeaderGirl.png"
                  }
                  alt={heroAlt}
                  fill
                  priority
                  fetchPriority="high"
                  className="object-cover object-center"
                  sizes="(min-width:1280px) 40vw, (min-width:1024px) 48vw, 92vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
