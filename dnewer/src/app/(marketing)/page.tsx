import { Metadata } from "next";
import HeroHeader from "@/components/HeroHeader";
import Services from "@/components/Services";
import ServiceArea from "@/components/ServiceArea";
import ContactCTABanner from "@/components/ContactCTABanner";
import Testimonials from "@/components/Testimonials";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Dnewer — Home renovation & remodeling services";
  const description =
    "Dnewer delivers commercial & residential renovations: remodeling, installations, tiling, cabinets, painting, decks, and landscaping. Get a free quote today.";

  return {
    title,
    description,
    alternates: { canonical: "/" },
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
    <div className="pt-[100px]">
      <HeroHeader />
      <Services />
      <ServiceArea />
      <Testimonials />
      <ContactCTABanner />
    </div>
  );
}
