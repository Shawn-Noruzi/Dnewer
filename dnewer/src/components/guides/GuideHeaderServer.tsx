// Server component: GuideHeaderServer
import Image from "next/image";
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage"; // keep this path consistent with your project

type GuideHeaderDoc = {
  title?: string;
  description?: string;
  image?: any;          // Sanity image field
  imageAlt?: string;
  // Optional CTA (leave null in Studio if you don’t want buttons)
  cta?: { label?: string; href?: string } | null;
};

const query = /* groq */ `
*[_type=="guideHeaderSection"][0]{
  title
}
`;

export default async function GuideHeaderServer() {
  const d = await sanity.fetch<GuideHeaderDoc>(query, {}, { next: { revalidate: 0 } });

  const img =
    d?.image ? urlFor(d.image).width(1600).height(1000).fit("max").url()
      : "/images/frames-mix.png"; // fallback

  const title =
    d?.title ?? "Your complete guide to buying glasses online";

  const description =
    d?.description ??
    "Shop prescription glasses online confidently with our step-by-step guide. Get expert support, a perfect fit guarantee, and enjoy free shipping.";

  return (
    <section className="section ">
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-200 ring-1 ring-black/5">
        <div className="container max-w-6xl py-8">
          <h1 className="font-display text-3xl md:text-4xl leading-tight text-black">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
