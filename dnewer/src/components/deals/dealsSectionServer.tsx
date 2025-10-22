import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage"; // keep path consistent with your project

type DealCard = {
  _key?: string;
  headline?: string;
  subhead?: string;
  code?: string;
  footnote?: string;
  cta?: { label?: string; href?: string } | null;
  image?: any;
  imageAlt?: string;
};

type DealsDoc = { title?: string; items?: DealCard[] };

const query = /* groq */ `
*[_type=="dealsSection"][0]{
  title,
  items[]{
    _key,
    headline,
    subhead,
    code,
    footnote,
    cta{label, href},
    image,
    imageAlt
  }
}
`;

// Typed-routes helper: only treat app-internal hrefs as <Link>
const isInternal = (h?: string): h is Route => !!h && h.startsWith("/");

export default async function DealsSectionServer() {
  const d = await sanity.fetch<DealsDoc>(query, {}, { next: { revalidate: 0 } });

  const sectionTitle = d?.title ?? "Current Deals";
  const items = d?.items ?? [];

  if (items.length === 0) return null;

  return (
    <section id="deals" className="scroll-mt-28 section">
      <div className="container">
        {/* Optional section title */}
        <h2 className="sr-only">{sectionTitle}</h2>

        <div className="grid gap-6">
          {items.map((item, idx) => {
            const img = item.image
              ? urlFor(item.image).width(1200).height(700).fit("max").auto("format").url()
              : "/images/deal-placeholder.jpg";

            return (
              <article
                key={item._key ?? idx}
                className="grid md:grid-cols-2 overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200"
              >
                {/* Left: copy */}
                <div className="p-6 sm:p-8 md:p-10 relative">
                  {/* thin black top bar like the reference */}
                  <div className="absolute left-0 right-0 top-0 h-[3px] bg-black" />

                  <h3 className="font-display text-xl md:text-2xl text-black">
                    {item.headline ?? "Special Offer"}
                  </h3>

                  {item.subhead && <p className="mt-3 text-black/70">{item.subhead}</p>}

                  {/* promo code pill */}
                  {item.code && (
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1.5">
                      <span className="text-xs uppercase tracking-wide text-black/60">Use code:</span>
                      <span className="rounded-full bg-black text-white text-xs font-semibold px-2 py-0.5">
                        {item.code}
                      </span>
                    </div>
                  )}

                  {/* footnote */}
                  {item.footnote && <div className="mt-2 text-xs text-black/50">{item.footnote}</div>}

                  {/* CTA */}
                  {item.cta?.label && item.cta?.href && (
                    <div className="mt-6">
                      {isInternal(item.cta.href) ? (
                        <Link
                          href={item.cta.href}
                          className="inline-flex items-center justify-center rounded-full bg-black text-white px-5 py-2.5 text-sm font-medium transition-colors duration-200 ease-out hover:bg-gold-400 hover:text-black"
                        >
                          {item.cta.label}
                        </Link>
                      ) : (
                        <a
                          href={item.cta.href}
                          target={item.cta.href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full bg-black text-white px-5 py-2.5 text-sm font-medium transition-colors duration-200 ease-out hover:bg-gold-400 hover:text-black"
                        >
                          {item.cta.label}
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: image */}
                <div className="relative min-h-[180px] sm:minh-[220px] md:min-h-[260px] bg-neutral-50">
                  <Image
                    src={img}
                    alt={item.imageAlt || item.headline || "Deal image"}
                    fill
                    className="object-cover md:object-contain"
                    sizes="(min-width:1024px) 50vw, 100vw"
                    priority={idx === 0}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
