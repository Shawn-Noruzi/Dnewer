import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage";
import ContactCtaBanner from "@/components/ContactCtaBanner";

export const dynamic = "force-dynamic";

type ContactDoc = {
  title?: string;
  description?: string;
  contactHref?: string;            // legacy
  locationsAnchorId?: string;
  image?: { alt?: string } | any;
  imageAlt?: string;               // legacy alt (fallback)
  icon?: { alt?: string } | any;
  button?: { label?: string; href?: string };
};

const query = /* groq */ `
*[_type=="contactCtaSection"][0]{
  title,
  description,
  contactHref,
  locationsAnchorId,
  image{..., "alt": coalesce(alt, "")},
  imageAlt, // legacy fallback
  icon{..., "alt": coalesce(alt, "")},
  button{label, href}
}
`;

export default async function ContactCtaServer() {
  const data = await sanity.fetch<ContactDoc>(query, {}, { next: { revalidate: 0 } });

  const imageSrc = data?.image
    ? urlFor(data.image).width(1000).height(700).fit("max").auto("format").url()
    : "/images/eyewear-model.jpg";

  const iconSrc = data?.icon
    ? urlFor(data.icon).width(96).height(96).fit("max").auto("format").url()
    : undefined;

  // Prefer new button fields; fall back to legacy contactHref if needed
  const buttonLabel = data?.button?.label ?? "Contact us";
  const buttonHref = data?.button?.href ?? data?.contactHref ?? "/contact";

  // Alt fallbacks: explicit -> legacy -> generic
  const bgAlt = (data?.image?.alt as string) || data?.imageAlt || "Contact CTA background";

  return (
    <ContactCtaBanner
      title={data?.title}
      description={data?.description}
      // legacy, if your component still uses it
      contactHref={data?.contactHref}
      locationsAnchorId={data?.locationsAnchorId || "locations"}

      // Primary button props
      buttonLabel={buttonLabel}
      buttonHref={buttonHref}

      // Icon + image with alts
      iconSrc={iconSrc}
      imageSrc={imageSrc}
      imageAlt={bgAlt}
    />
  );
}
