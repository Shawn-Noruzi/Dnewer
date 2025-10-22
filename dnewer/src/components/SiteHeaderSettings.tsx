// components/SiteHeaderServer.tsx
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage";
import SiteHeaderClient from "./SiteHeaderClient";

type Doc = {
  brandName?: string;
  phoneNumber?: string;
  phoneNumber2?: string;
  logo?: { asset?: { url?: string; mimeType?: string; extension?: string } };
  cta?: { label?: string; href?: string };
  navLinks?: { label?: string; href?: string }[];
  promos?: { _key?: string; text?: string; href?: string }[];
};

// Fetch asset mimeType/url so we can special-case SVG
const query = /* groq */ `
*[_id=="settings.header" || _type=="headerSettings"][0]{
  brandName,
  phoneNumber,
  phoneNumber2,
  logo{asset->{url, mimeType, extension}},
  cta{label, href},
  navLinks[]{label, href},
  promos[]{_key, text, href}
}
`;

export default async function SiteHeaderServer() {
  const d = await sanity.fetch<Doc>(query, {}, { next: { revalidate: 0 } });

  // --- Build a safe logo URL ---
  const mime = d?.logo?.asset?.mimeType || "";
  const isSvg = mime === "image/svg+xml";

  let logoUrl: string | undefined;
  if (isSvg && d?.logo?.asset?.url) {
    // Use original SVG (no transforms)
    logoUrl = d.logo.asset.url;
  } else if (d?.logo) {
    // Raster: use builder for crisp results on HiDPI screens
    logoUrl = urlFor(d.logo).width(260).fit("max").auto("format").url();
  } else {
    // Fallback: local asset
    logoUrl = "/logo-1.jpg";
  }

  // --- Sanitize nav links to satisfy strict types (href/label must be strings) ---
  const sanitizedNavLinks =
    (d?.navLinks || [])
      .filter((n): n is { label: string; href: string } => !!n?.href && !!n?.label)
      .map((n) => ({ href: String(n.href), label: String(n.label) })) ||
    [];

  const defaultNavLinks = [
    { href: "/services", label: "Services" },
    { href: "/deals", label: "Deals" },
    { href: "/brands", label: "Brands" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
  ];

  const navLinks = sanitizedNavLinks.length ? sanitizedNavLinks : defaultNavLinks;

  // --- Sanitize promos (text shown; href optional) ---
  const promos =
    (d?.promos || [])
      .filter((p) => !!p?.text)
      .map((p) => ({ text: String(p.text), href: p?.href ? String(p.href) : undefined })) ||
    [
      { text: "BOGO 50% on frames — this week only!", href: "/deals" },
      { text: "Free anti-glare upgrade with exam", href: "/deals" },
    ];

  // --- CTA with strong defaults ---
  const cta = {
    label: d?.cta?.label ?? "Book Exam",
    href: d?.cta?.href ?? "https://factoryoptical.seeyasoon.cc/",
  };

  // Debug (optional)
  // console.log("[Header] logo", { mimeType: mime || null, url: logoUrl });

  return (
    <SiteHeaderClient
      brandName={d?.brandName ?? "Factory Optical"}
      phoneNumber={d?.phoneNumber ?? "1-800-201-1919"}
      phoneNumber2={d?.phoneNumber2 ?? "1-800-201-1919"}
      logoUrl={logoUrl}
      cta={cta}
      navLinks={navLinks}
      promos={promos}
    />
  );
}
