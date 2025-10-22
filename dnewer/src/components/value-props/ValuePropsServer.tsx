// components/value-props/ValuePropsServer.tsx (server)
import ValuePropsShowcase from "@/components/ValuePropsShowcase";
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage";

const query = /* groq */ `
*[_type=="valuePropsSection"][0]{
  heading,
  subheading,
  left{
    title, body, ctaLabel, ctaHref,
    image{..., "alt": coalesce(alt, "")}
  },
  right{
    title, body,
    image{..., "alt": coalesce(alt, "")}
  },
  bottom{
    title, subtitle, features,
    image{..., "alt": coalesce(alt, "")}
  }
}
`;

export default async function ValuePropsServer() {
  const d = await sanity.fetch<any>(query, {}, { next: { revalidate: 0 } });

  return (
    <ValuePropsShowcase
      heading={d?.heading}
      subheading={d?.subheading}
      left={{
        title: d?.left?.title,
        body: d?.left?.body,
        cta:
          d?.left?.ctaHref && d?.left?.ctaLabel
            ? { href: d.left.ctaHref, label: d.left.ctaLabel }
            : undefined,
        image: d?.left?.image
          ? {
              src: urlFor(d.left.image).width(900).auto("format").url(),
              alt: d.left.image.alt || d?.left?.title || "eyewear",
            }
          : undefined,
      }}
      right={{
        title: d?.right?.title,
        body: d?.right?.body,
        image: d?.right?.image
          ? {
              src: urlFor(d.right.image).width(900).auto("format").url(),
              alt: d.right.image.alt || d?.right?.title || "eyewear",
            }
          : undefined,
      }}
      bottom={{
        title: d?.bottom?.title,
        subtitle: d?.bottom?.subtitle,
        image: d?.bottom?.image
          ? {
              src: urlFor(d.bottom.image).width(1200).auto("format").url(),
              alt: d.bottom.image.alt || d?.bottom?.title || "eyewear",
            }
          : undefined,
        features: d?.bottom?.features,
      }}
    />
  );
}
