import Link from "next/link";
import type { Route } from "next";
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage";

type Doc = {
    stepLabel?: string;
    title?: string;
    description?: string;
    poster?: any;
    cta?: { label?: string; href?: string };
    videoFile?: { asset?: { url?: string; mimeType?: string } };
    externalUrl?: string;
};

const query = /* groq */ `
*[_type=="dealsVideoFeatureSection"][0]{
  stepLabel,
  title,
  description,
  poster,
  cta{label, href},
  videoFile{asset->{url, mimeType}},
  externalUrl
}
`;

const isInternal = (h?: string): h is Route => !!h && h.startsWith("/");

export default async function DealsVideoFeatureServer() {
    const d = await sanity.fetch<Doc>(query, {}, { next: { revalidate: 0 } });

    const title = d?.title ?? "Complete your purchase";
    const eyebrow = d?.stepLabel ?? "STEP 1";
    const description = d?.description ?? "Finish checkout securely and get fast shipping.";

    const cta = d?.cta ?? { label: "Shop glasses", href: "/shop" };

    const posterUrl =
        d?.poster ? urlFor(d.poster).width(1200).height(675).fit("crop").url() : undefined;

    const videoSrc = d?.externalUrl || d?.videoFile?.asset?.url;

    return (
        <section className="section">
            <div className="container gap-8 flex flex-col sm:flex-row items-center">
                {/* Left: Video */}
                <div className="w-full ">
                    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black/5 ring-1 ring-black/5">
                        {videoSrc ? (
                            <video
                                className="h-full w-full object-cover"
                                src={videoSrc}
                                controls
                                playsInline
                                poster={posterUrl}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm text-black/50">
                                Upload a video or set an External URL in Sanity.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Copy + CTA */}
                <div className="w-full md:max-w-xl">
                    {eyebrow && (
                        <div className="text-xs tracking-wide uppercase text-black/50 mb-2">
                            {eyebrow}
                        </div>
                    )}
                    <h2 className="font-display subtitle text-black">{title}</h2>
                    <p className="mt-3 maintext text-black/70">{description}</p>

                    <div className="mt-5">
                        {isInternal(cta?.href) ? (
                            <Link
                                href={cta!.href}
                                className="w-full sm:w-auto btn btn-primary inline-flex items-center rounded-full px-5 py-2.5 transition-colors"
                            >
                                {cta!.label}
                            </Link>
                        ) : (
                            <a
                                href={cta?.href || "#"}
                                target={cta?.href?.startsWith("http") ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto btn btn-primary inline-flex items-center rounded-full px-5 py-2.5 transition-colors"
                            >
                                {cta?.label}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
