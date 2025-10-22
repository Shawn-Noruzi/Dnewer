// components/guide/brandPageServer.tsx
import Image from "next/image";
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage";
import type { PortableTextBlock } from "sanity";
import { PortableText } from "@portabletext/react";

type brandPageDoc = {
  header?: {
    title?: string;
    description?: string;
    image?: any;
    imageAlt?: string;
    cta?: { label?: string; href?: string } | null;
  };
  sections?: { heading?: string; body?: PortableTextBlock[] }[];
};

const query = /* groq */ `
*[_type=="brandPage"][0]{
  header{
    title
  },
  sections[]{
    heading, body
  }
}
`;

export const dynamic = "force-dynamic";

export default async function BrandPageServer() {
  const d = await sanity.fetch<brandPageDoc>(query, {}, { next: { revalidate: 0 } });

  // Header fallbacks
  const title =
    d?.header?.title ?? "Your complete guide to buying glasses online";
  const description =
    d?.header?.description ??
    "Shop prescription glasses online confidently with our step-by-step guide. Get expert support, a perfect fit guarantee, and enjoy free shipping.";
  const img = d?.header?.image
    ? urlFor(d.header.image).width(1600).height(1000).fit("max").url()
    : "/images/frames-mix.png";
  const imageAlt = d?.header?.imageAlt || "Assorted eyeglass frames";
  const cta = d?.header?.cta;

  // Two section fallbacks
  const s1 = d?.sections?.[0];
  const s2 = d?.sections?.[1];

  return (
    <div>
      <section className="section">
        <div className="relative overflow-hidden bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-200 ring-1 ring-black/5">
          <div className="container max-w-6xl py-8">
            <h1 className="font-display text-3xl md:text-4xl leading-tight text-black">
              {title}
            </h1>
          </div>
        </div>
      </section>


    </div>
  );
}
