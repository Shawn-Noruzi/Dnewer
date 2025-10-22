import GuideHeaderServer from "@/components/guides/GuideHeaderServer";
import DealsSectionServer from "@/components/deals/dealsSectionServer";
import Spacer from "@/components/Spacer";
import ContactCtaBannerServer from "@/components/contact/ContactCtaBannerServer";
import DealsVideoFeatureServer from "@/components/deals/DealsVideoFeatureServer";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import type { Metadata } from "next";
import { sanity } from "@/lib/sanity";

const seoQuery = /* groq */ `
*[_type=="guideHeaderSection"][0]{
  metaTitle, 
  metaDescription
}
`;

type Doc = {
    metaTitle?: string;
    metaDescription?: string;
};


export async function generateMetadata(): Promise<Metadata> {
    const d = await sanity.fetch<Doc | null>(seoQuery, {}, { next: { revalidate: 0 } });

    const title = d?.metaTitle || "Deals Factory Optical";
    const description =
        d?.metaDescription ||
        "Committed to your vision. ";

    return {
        title,
        description,
        alternates: { canonical: "/" }, // resolves using metadataBase in layout
        openGraph: {
            title,
            description,
            url: "/",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}
export default function DealsPage() {
    return (
        <>
            <div className={"pt-[100px]"} />
            <GuideHeaderServer />
            <Spacer />
            <DealsSectionServer />
            <Spacer />
            <DealsVideoFeatureServer />
            <Spacer />
            <ContactCtaBannerServer />
        </>
    );
}