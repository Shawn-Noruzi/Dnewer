import { NextResponse } from "next/server";
import { readClient, writeClient, groq } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    if (!slug) return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });

    // Support either "post" or "blogPost" type
    const doc = await readClient.fetch<{ _id: string } | null>(
      groq`*[_type in ["post","blogPost"] && slug.current == $slug][0]{ _id }`,
      { slug }
    );

    if (!doc?._id) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    // Requires SANITY_API_WRITE_TOKEN
    await writeClient
      .patch(doc._id)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit({ autoGenerateArrayKeys: true });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error" }, { status: 500 });
  }
}
