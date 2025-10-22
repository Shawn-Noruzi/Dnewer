// app/api/blog/stories/route.ts
import { NextResponse } from "next/server";
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = Number(searchParams.get("offset") || 0);
  const limit = Math.min(Number(searchParams.get("limit") || 2), 8);

  const query = `
*[_type=="post" && defined(slug.current)]
| order(publishedAt desc)[${offset}...${offset + limit}]{
  _id, title, slug, publishedAt, excerpt, coverImage, tags
}
`;

  try {
    const raw = await sanity.fetch<any[]>(query, {}, { next: { revalidate: 0 } });
    const posts = (raw || []).map((p) => ({
      _id: p._id,
      title: p.title,
      slug: p.slug,
      publishedAt: p.publishedAt,
      excerpt: p.excerpt,
      tags: p.tags ?? [],
      // build a nice, sized URL here:
      coverUrl: p.coverImage
        ? urlFor(p.coverImage).width(800).height(600).fit("crop").auto("format").url()
        : null,
    }));
    return NextResponse.json({ posts });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Fetch failed" }, { status: 500 });
  }
}
