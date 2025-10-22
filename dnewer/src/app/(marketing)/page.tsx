import HeroServer from "@/components/hero/HeroServer";
import ValuePropsServer from "@/components/value-props/ValuePropsServer";
import VirtualTryOnHeroServer from "@/components/vto/VirtualTryOnHeroServer";
import BlogStories from "@/components/BlogStories";
import ContactCtaBannerServer from "@/components/contact/ContactCtaBannerServer";
import Spacer from "@/components/Spacer";
import type { Metadata } from "next";
import { sanity } from "@/lib/sanity";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const seoQuery = /* groq */ `
*[_type=="heroSection"][0]{
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

  const title = d?.metaTitle || "Home Factory Optical";
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


export default function HomePage() {
  return (
    <div className={"pt-[100px]"} >
      <HeroServer />
      <Spacer />
      <ValuePropsServer />
      <Spacer />
      {/* <VirtualTryOnHeroServer /> */}
      {/* <Spacer /> */}
      <BlogStories />
      <Spacer />
      <ContactCtaBannerServer />
    </div>
  );
}
