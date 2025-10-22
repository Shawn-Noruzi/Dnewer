import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage";
import OurProcessClient from "./OurProcessClient";

type Step = {
    title?: string;
    description?: string;
    image?: any;
};

type OurProcessDoc = {
    title?: string;
    cta?: { label?: string; href?: string };
    steps?: Step[];
};

const query = /* groq */ `
*[_type=="ourProcessSection"][0]{
  title,
  cta{label, href},
  steps[]{title, description, image}
}
`;

export default async function OurProcessServer() {
    const d = await sanity.fetch<OurProcessDoc>(query, {}, { next: { revalidate: 0 } });

    const title = d?.title ?? "Our Trusted Process";
    const cta = d?.cta ?? { label: "Get Your Free Consultation", href: "/contact" };

    // Build URLs server-side so the client stays dumb
    const steps = (d?.steps ?? []).map((s) => ({
        title: s.title ?? "",
        description: s.description ?? "",
        imageUrl: s.image ? urlFor(s.image).width(96).height(96).fit("crop").url() : "/icons/OurProcess/discovery.png",
    }));

    // Fallback: if no steps in CMS yet, show 5 placeholders
    const finalSteps =
        steps.length > 0
            ? steps
            : [
                { imageUrl: "/icons/OurProcess/discovery.png", title: "Discovery & Strategy", description: "We dive deep into your goals and audience to create a strategic roadmap." },
                { imageUrl: "/icons/OurProcess/planning.png", title: "Technical Planning", description: "Architecture, SEO, analytics, and performance plan tailored to you." },
                { imageUrl: "/icons/OurProcess/design.png", title: "UX/UI Design", description: "Conversion-focused design that feels on-brand and effortless." },
                { imageUrl: "/icons/OurProcess/code.png", title: "Development", description: "Modern, secure, scalable build with integrations you need." },
                { imageUrl: "/icons/OurProcess/deploy.png", title: "Launch & Optimization", description: "Deploy, monitor, and continuously optimize for growth." },
            ];

    return (
        <OurProcessClient
            title={title}
            ctaLabel={cta?.label}
            ctaHref={cta?.href}
            steps={finalSteps}
        />
    );
}
