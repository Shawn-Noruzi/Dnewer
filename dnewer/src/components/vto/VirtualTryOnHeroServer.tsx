// components/vto/VirtualTryOnHeroServer.tsx (server)
import VirtualTryOnHero from "@/components/VirtualTryOnHero";
import { sanity } from "@/lib/sanity";
import { urlFor } from "../../sanity/lib/sanityImage";

const query = /* groq */ `
*[_type=="virtualTryOnSection"][0]{
  title, bullets, ctaLabel, ctaHref, image
}
`;

export default async function VirtualTryOnHeroServer() {
  const d = await sanity.fetch<any>(query, {}, { next: { revalidate: 0 } });
  return (
    <VirtualTryOnHero
      title={d?.title}
      bullets={d?.bullets || []}
      ctaLabel={d?.ctaLabel || "Try it Now"}
      ctaHref={d?.ctaHref || "/try-on"}
      imageSrc={d?.image ? urlFor(d.image).width(1200).url() : "/images/placeholder-face.jpg"}
      imageAlt={d?.title || "Virtual try-on preview"}
    />
  );
}
