// app/locations/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from "next";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage";
import { PortableText } from "@portabletext/react";
import { MapPin, Phone, Mail, CalendarCheck, Map } from "lucide-react";
import Spacer from "@/components/Spacer";
import ContactCtaServer from "@/components/contact/ContactCtaBannerServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type LocDoc = {
  _id: string;
  title: string;
  slug: { current: string };
  address?: {
    line1?: string; line2?: string;
    city?: string; province?: string;
    postalCode?: string; country?: string;
  };
  phone?: string;
  email?: string;
  hours?: { day: string; open?: string; close?: string; closed?: boolean }[];
  services?: string[];
  bookingUrl?: string;
  maps?: {
    placeUrl?: string;       // e.g. https://maps.app.goo.gl/...
    directionsUrl?: string;  // e.g. https://www.google.com/maps/dir/.../Business+Name
  };
  geo?: { mapUrl?: string }; // legacy fallback
  heroImage?: any;
  body?: any;
  metaTitle?: string;
  metaDescription?: string;
};

const bySlugQuery = /* groq */ `
*[_type=="location" && slug.current==$slug][0]{
  _id, title, slug, address, phone, email, hours, services, bookingUrl,
  maps{placeUrl, directionsUrl}, geo{mapUrl}, heroImage, body, metaTitle, metaDescription
}
`;

const allSlugsQuery = /* groq */ `
*[_type=="location" && defined(slug.current)]{ "slug": slug.current }
`;

export async function generateStaticParams() {
  const rows = await sanity.fetch<{ slug: string }[]>(
    allSlugsQuery,
    {},
    { next: { revalidate: 0 } }
  );
  return (rows || []).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  const d = await sanity.fetch<LocDoc | null>(
    bySlugQuery,
    { slug },
    { next: { revalidate: 0 } }
  );

  const title = d?.metaTitle || d?.title || "Location";
  const description =
    d?.metaDescription ||
    [d?.address?.line1, d?.address?.city, d?.address?.province].filter(Boolean).join(", ") ||
    "Visit our clinic.";

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/locations/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    twitter: { card: "summary_large_image", title, description },
  };
}

function humanAddress(a?: LocDoc["address"]) {
  if (!a) return "";
  const line = [a.line1, a.line2].filter(Boolean).join(", ");
  const city = [a.city, a.province, a.postalCode].filter(Boolean).join(" ");
  return [line, city, a.country].filter(Boolean).join(" • ");
}

function openingHoursSpec(hours?: LocDoc["hours"]) {
  return (hours || []).map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.day ? `https://schema.org/${dayNameToSchema(h.day)}` : undefined,
    opens: h.closed ? undefined : (h.open || undefined),
    closes: h.closed ? undefined : (h.close || undefined),
  }));
}
function dayNameToSchema(day: string) {
  const map: Record<string, string> = {
    Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday",
    Fri: "Friday", Sat: "Saturday", Sun: "Sunday",
  };
  return map[day] || day;
}

// NOTE: params is a Promise here to satisfy Next's sync-dynamic-APIs typing.
export default async function LocationPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  const d = await sanity.fetch<LocDoc | null>(
    bySlugQuery,
    { slug },
    { next: { revalidate: 0 } }
  );
  if (!d) return null;

  const hero = d.heroImage
    ? urlFor(d.heroImage).width(1600).height(900).fit("crop").auto("format").url()
    : null;

  const backHref = "/locations" as Route<"/locations">;

  // Prefer new maps fields; fallback to legacy geo.mapUrl if needed
  const placeUrl = d.maps?.placeUrl || d.geo?.mapUrl || "";
  const directionsUrl = d.maps?.directionsUrl || "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: d.title,
    address: d.address && {
      "@type": "PostalAddress",
      streetAddress: [d.address.line1, d.address.line2].filter(Boolean).join(", "),
      addressLocality: d.address.city,
      addressRegion: d.address.province,
      postalCode: d.address.postalCode,
      addressCountry: d.address.country || "CA",
    },
    telephone: d.phone,
    email: d.email,
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/locations/${slug}`,
    openingHoursSpecification: openingHoursSpec(d.hours),
    image: hero ? [hero] : undefined,
    hasMap: placeUrl || undefined,
  };

  const pageTitle = `Factory Optical — ${d.title}`;

  return (
    <article className="section pt-[100px]">
      {/* HERO */}
      <section className="section p-0">
        <div className="relative overflow-hidden bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-200 ring-1 ring-black/5">
          <div className="container max-w-6xl py-8">
            <h1 className="font-display text-3xl md:text-4xl leading-tight text-black">
              {pageTitle}
            </h1>
          </div>
        </div>
      </section>

      <div className="container max-w-6xl mt-8">
        {/* 2 columns: left = address/contact/hours; right = image + services */}
        <div className="grid grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)] gap-8">
          {/* LEFT: Address / Contact / Hours (+ Map buttons here, full width) */}
          <aside className="space-y-6">
            {/* Address & Contact */}
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1" />
                <div className="text-sm">
                  {d.address?.line1 && <div>{d.address.line1}</div>}
                  {d.address?.line2 && <div>{d.address.line2}</div>}
                  <div>
                    {[d.address?.city, d.address?.province].filter(Boolean).join(", ")}{" "}
                    {d.address?.postalCode}
                  </div>
                  {d.address?.country && <div>{d.address.country}</div>}
                </div>
              </div>

              {d.phone && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${d.phone.replace(/\s+/g, "")}`} className="underline">
                    {d.phone}
                  </a>
                </div>
              )}

              {d.email && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${d.email}`} className="underline">
                    {d.email}
                  </a>
                </div>
              )}

              {d.bookingUrl ? (
                <div className="mt-4">
                  <a
                    href={d.bookingUrl}
                    className="btn btn-primary inline-flex items-center gap-2 w-full"
                    target={d.bookingUrl.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    <CalendarCheck className="h-4 w-4" />
                    Book an exam
                  </a>
                </div>
              ) : null}

              {(placeUrl || directionsUrl) && (
                <div className="mt-3 flex flex-col gap-2">
                  {placeUrl ? (
                    <a
                      href={placeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary inline-flex items-center gap-2 w-full"
                    >
                      <Map className="h-4 w-4" />
                      View on Google Maps
                    </a>
                  ) : null}
                  {directionsUrl ? (
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary w-full"
                    >
                      Get Directions
                    </a>
                  ) : null}
                </div>
              )}
            </div>

            {/* Hours */}
            {d.hours?.length ? (
              <div className="rounded-xl border border-black/10 bg-white p-4">
                <div className="font-medium">Hours</div>
                <ul className="mt-2 space-y-1 text-sm">
                  {d.hours.map((h, i) => (
                    <li key={`${h.day}-${i}`} className="flex justify-between gap-4">
                      <span className="text-black/70 w-12">{h.day}</span>
                      <span className="text-black">
                        {h.closed ? "Closed" : `${h.open || "—"} – ${h.close || "—"}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>

          {/* RIGHT: Header image + Services (only) */}
          <div className="min-w-0 space-y-6">
            {/* Header Image */}
            {hero ? (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl ring-1 ring-black/5 bg-neutral-100">
                <Image src={hero} alt={`${d.title} photo`} fill className="object-cover" priority />
              </div>
            ) : null}

            {/* Services */}
            {d.services?.length ? (
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="font-medium">Services</div>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {d.services.map((s, i) => (
                    <li
                      key={i}
                      className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-sm"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Body / Rich content */}
            {d.body ? (
              <div className="maintext prose prose-zinc max-w-none">
                <PortableText value={d.body} />
              </div>
            ) : null}

            {/* Back link */}
            <div>
              <Link href={backHref} className="subtext text-black/60 underline underline-offset-2">
                ← Back to locations
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: d.title,
          address: d.address && {
            "@type": "PostalAddress",
            streetAddress: [d.address.line1, d.address.line2].filter(Boolean).join(", "),
            addressLocality: d.address.city,
            addressRegion: d.address.province,
            postalCode: d.address.postalCode,
            addressCountry: d.address.country || "CA",
          },
          telephone: d.phone,
          email: d.email,
          url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/locations/${slug}`,
          openingHoursSpecification: openingHoursSpec(d.hours),
          image: hero ? [hero] : undefined,
          hasMap: placeUrl || undefined,
        }) }}
      />
      <Spacer />
      <ContactCtaServer />
    </article>
  );
}
