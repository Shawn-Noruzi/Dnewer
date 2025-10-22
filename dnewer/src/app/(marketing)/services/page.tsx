import ServicesHeroServer from "@/components/services/ServicesHeroServer";
import OurProcessServer from "@/components/process/OurProcessServer";
import VideoFeatureServer from "@/components/media/VideoFeatureServer";
import ContactCtaBannerServer from "@/components/contact/ContactCtaBannerServer";
import CategoryHeroServer from "@/components/shop/CategoryHeroServer";
import ContactsListingServer from "@/components/shop/ContactsListingServer";
import Spacer from "@/components/Spacer";
import type { Metadata } from "next";
import { sanity } from "@/lib/sanity";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const seoQuery = /* groq */ `
*[_type=="servicesHeroSection"][0]{
  metatitle, metadescription
}
`;

type ServicesDoc = {
    metaTitle?: string;
    metaDescription?: string;
};


export async function generateMetadata(): Promise<Metadata> {
    const d = await sanity.fetch<ServicesDoc | null>(seoQuery, {}, { next: { revalidate: 0 } });

    const title = d?.metaTitle || "Services Factory Optical";
    const description =
        d?.metaDescription ||
        "Committed to your vision.";

    return {
        title,
        description,
        alternates: { canonical: "/services" }, // resolves using metadataBase in layout
        openGraph: {
            title,
            description,
            url: "/services",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}
export default function ServicesPage() {
    return (
        <>
            <div className={"pt-[100px]"} />
            <ServicesHeroServer />
            <Spacer />
            <VideoFeatureServer />
            <Spacer />
            <OurProcessServer />
            <Spacer />
            <CategoryHeroServer slug="contact-lenses" />
            <ContactsListingServer />
            <Spacer />
            <ContactCtaBannerServer />
        </>
    );
}