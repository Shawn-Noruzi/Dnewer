import AboutHeroServer from "@/components/about/AboutHeroServer";
import Spacer from "@/components/Spacer";
import ContactCtaBannerServer from "@/components/contact/ContactCtaBannerServer";
import TeamShowcaseServer from "@/components/team/TeamShowcaseServer";
import ManualReviewsServer from "@/components/reviews/ManualReviewsServer";
import type { Metadata } from "next";
import { sanity } from "@/lib/sanity";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";



type AboutDoc = {
    metaTitle?: string;
    metaDescription?: string;
};

const seoQuery = /* groq */ `
*[_type=="aboutHeroSection"][0]{
  metaTitle,
  metaDescription
}
`;


export async function generateMetadata(): Promise<Metadata> {
    const d = await sanity.fetch<AboutDoc | null>(seoQuery, {}, { next: { revalidate: 0 } });

    const title = d?.metaTitle || "About Factory Optical";
    const description =
        d?.metaDescription ||
        "Committed to your vision. Learn more about our story, team, and values.";

    return {
        title,
        description,
        alternates: { canonical: "/about" }, // resolves using metadataBase in layout
        openGraph: {
            title,
            description,
            url: "/about",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}
export default function AboutPage() {
    return (
        <>
            <div className={"pt-[100px] "} />
            <AboutHeroServer />
            <Spacer />
            <TeamShowcaseServer />
            <Spacer />
            <ManualReviewsServer />
            <Spacer />
            <ContactCtaBannerServer />
        </>
    );
}