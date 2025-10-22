import BrandPageServer from "@/components/brand/BrandPageServer";
import ContactCtaBannerServer from "@/components/contact/ContactCtaBannerServer";
import Spacer from "@/components/Spacer";
import BrandsGridServer from '@/components/brand/BrandsGridServer'
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import type { Metadata } from "next";
import { sanity } from "@/lib/sanity";


const seoQuery = /* groq */ `
*[_type=="brandPage"][0]{
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

    const title = d?.metaTitle || "Brands Factory Optical";
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


export default function BrandsPage() {
    return (
        <>
            <div className={"pt-[100px]"} />
            <BrandPageServer />
            <Spacer />
            <BrandsGridServer />
            <Spacer />
            <ContactCtaBannerServer />
        </>
    );
}