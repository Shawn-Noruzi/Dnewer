// app/blog/[slug]/head.tsx (or use generateMetadata in page if you're on App Router metadata API)
import type { Metadata } from "next";
import { sanity } from "@/lib/sanity";

type Doc = { title?: string; excerpt?: string; slug: { current: string } };

export async function generateMetadata({
    params: { slug },
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const d = await sanity.fetch<Doc | null>(
        `*[_type=="post" && slug.current==$s][0]{title, excerpt, slug}`,
        { s: slug },
        { next: { revalidate: 0 } }
    );

    const title = d?.title ?? "Blog post";
    const description = d?.excerpt ?? "Read more on our blog.";

    return {
        title,
        description,
        openGraph: { title, description },
        twitter: { card: "summary_large_image", title, description },
    };
}
