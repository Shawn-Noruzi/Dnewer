// /app/locations/page.tsx
import Link from "next/link";
import type { Route } from "next";
import Image from "next/image";
import { sanity } from "@/lib/sanity";
import Spacer from "@/components/Spacer";
import { urlFor } from "@/sanity/lib/sanityImage";
import ContactCtaBannerServer from "@/components/contact/ContactCtaBannerServer";
import type { Metadata } from "next";


export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Our Locations · Factory Optical",
  description:
    "Find a Factory Optical location near you. See addresses, hours, services, and get directions to our clinics.",
  alternates: { canonical: "/locations" }, // resolves via metadataBase
  openGraph: {
    title: "Our Locations · Factory Optical",
    description:
      "Find a Factory Optical location near you. See addresses, hours, services, and get directions to our clinics.",
    url: "/locations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Locations · Factory Optical",
    description:
      "Find a Factory Optical location near you. See addresses, hours, services, and get directions to our clinics.",
  },
};

type LocationCard = {
    _id: string;
    title: string;
    slug: { current: string };
    address?: { city?: string; province?: string };
    heroImage?: any;
};

const query = /* groq */ `
*[_type=="location" && defined(slug.current)]
| order(title asc){
  _id, title, slug, address{city,province}, heroImage
}
`;

export default async function LocationsIndexPage() {
    const items = await sanity.fetch<LocationCard[]>(query, {}, { next: { revalidate: 0 } });
    if (!items?.length) {
        return (
            <section className="section pt-[100px]">
                <div className="container">
                    <h1 className="title">Locations</h1>
                    <p className="mt-3 text-black/70">No locations yet.</p>
                </div>
            </section>
        );
    }

    return (
<>
        <section className="section pt-[100px]">
            <section className="section">
                <div className="relative overflow-hidden bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-200 ring-1 ring-black/5">
                    <div className="container max-w-6xl py-8">
                        <h1 className="font-display text-3xl md:text-4xl leading-tight text-black">
                            Our Locations
                        </h1>
                    </div>
                </div>
            </section>
            <div className="container max-w-6xl">

                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                    {items.map((l) => {
                        const href = (`/locations/${l.slug.current}`) as Route<`/locations/${string}`>;
                        const img = l.heroImage ? urlFor(l.heroImage).width(900).height(600).fit("crop").auto("format").url() : null;
                        return (
                            <Link
                                key={l._id}
                                href={href}
                                className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:shadow-md"
                            >
                                <div className="relative aspect-[4/3] bg-neutral-100">
                                    {img ? (
                                        <Image src={img} alt={l.title} fill className="object-cover transition group-hover:scale-[1.02]" />
                                    ) : null}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium">{l.title}</h3>
                                    <div className="text-sm text-black/60">
                                        {[l.address?.city, l.address?.province].filter(Boolean).join(", ")}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
        <Spacer/>
        <ContactCtaBannerServer/>
</>
    );
}
