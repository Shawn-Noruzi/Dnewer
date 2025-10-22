// app/(marketing)/blog/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import Spacer from "@/components/Spacer";
import ContactCtaServer from "@/components/contact/ContactCtaBannerServer";
import { SiX, SiFacebook, SiLinkedin } from "react-icons/si";
import { FiClock } from "react-icons/fi";
import { MdOutlineDateRange } from "react-icons/md";
import CopyLinkButton from "@/components/CopyLinkButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type MetaDoc = {
  metaTitle?: string;
  metaDescription?: string;
};

type EndGalleryImage = {
  _type: "image";
  asset: any;
  alt?: string | null;
};

type EndVideo = {
  url?: string | null;
  fileUrl?: string | null; // derived in GROQ from file.asset->url
  caption?: string | null;
};

type PostDoc = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  coverImage?: {
    asset: any;
    alt?: string | null;
  } | any;
  publishedAt: string;
  views?: number;
  tags?: string[];
  body: PortableTextBlock[];
  endGallery?: EndGalleryImage[];
  endVideo?: EndVideo | null;
};

type MiniPost = {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: any;
  publishedAt?: string;
};

const metaQuery = /* groq */ `
*[_type=="post" && slug.current==$slug][0]{
  metaTitle, metaDescription
}
`;

const postQuery = /* groq */ `
*[_type=="post" && slug.current==$slug][0]{
  _id, title, slug, excerpt, coverImage{..., "alt": coalesce(alt, "")}, publishedAt, views, tags, body,
  endGallery[]{ ..., "alt": coalesce(alt, "") },
  "endVideo": select(
    defined(endVideo) => {
      "url": endVideo.url,
      "fileUrl": endVideo.file.asset->url,
      "caption": endVideo.caption
    },
    null
  )
}
`;

const othersQuery = /* groq */ `
*[_type=="post" && defined(slug.current) && slug.current != $slug]
| order(publishedAt desc)[0...3]{
  _id, title, slug, coverImage, publishedAt
}
`;

// Use the "await params" pattern so Next doesn't warn about sync dynamic APIs.
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  const d = await sanity.fetch<MetaDoc | null>(
    metaQuery,
    { slug },
    { next: { revalidate: 0 } }
  );

  const title = d?.metaTitle || "Blog — Factory Optical";
  const description =
    d?.metaDescription || "Insights and updates from Factory Optical.";

  // Canonical resolves against metadataBase in your root layout
  const canonical = `/blog/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function blocksToPlainText(blocks: PortableTextBlock[] = []): string {
  return blocks
    .map((b: any) =>
      b?._type === "block" && Array.isArray(b.children)
        ? b.children.map((c: any) => c.text).join("")
        : ""
    )
    .join("\n");
}
function estimateReadMins(blocks: PortableTextBlock[] = []): number {
  const words = blocksToPlainText(blocks).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function isYouTubeOrVimeo(u?: string | null): boolean {
  if (!u) return false;
  try {
    const host = new URL(u).host.replace(/^www\./, "");
    return ["youtube.com", "youtu.be", "vimeo.com"].some(h => host.endsWith(h));
  } catch {
    return false;
  }
}

export default async function PostPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  const post = await sanity.fetch<PostDoc | null>(
    postQuery,
    { slug },
    { next: { revalidate: 0 } }
  );
  if (!post) return notFound();

  const others = await sanity.fetch<MiniPost[]>(
    othersQuery,
    { slug },
    { next: { revalidate: 0 } }
  );

  const coverUrl = post.coverImage
    ? urlFor(post.coverImage).width(1600).height(900).fit("max").auto("format").url()
    : null;

  const date = new Date(post.publishedAt).toLocaleDateString();
  const mins = estimateReadMins(post.body);
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/blog/${post.slug.current}`.replace(/\/+$/, "");

  const backHref = "/blog" as Route<"/blog">;

  // Ending media
  const gallery = post.endGallery ?? [];
  const video = post.endVideo;

  return (
    <article className="section p-0 mt-[130px]">
      <div className="container max-w-6xl px-4 sm:px-6">
        {/* Two columns on desktop: LEFT = other insights, RIGHT = article */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {/* RIGHT (mobile first): Title, meta, image, body */}
          <div className="md:col-span-2 order-1 md:order-2 min-w-0">
            {/* Title */}
            <header>
              <h1 className="title text-black font-semibold">
                {post.title}
              </h1>

              {/* Meta row */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-black/80 subtext">
                <span className="inline-flex items-center gap-1.5 bg-black/5 text-black px-2.5 py-1.5 rounded-full">
                  <FiClock className="h-4 w-4" />
                  {mins} min read
                </span>
                <span className="opacity-60">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <MdOutlineDateRange className="h-4 w-4" />
                  <time dateTime={post.publishedAt}>Published on {date}</time>
                </span>

                {/* Share inline on desktop */}
                <span className="hidden md:inline-flex items-center gap-2 ml-auto">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      shareUrl
                    )}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 hover:bg-black/5"
                    aria-label="Share on X (Twitter)"
                  >
                    <SiX className="h-4 w-4" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex cursor-pointer h-8 w-8 items-center justify-center rounded-full border border-neutral-300 hover:bg-black/5"
                    aria-label="Share on Facebook"
                  >
                    <SiFacebook className="h-4 w-4" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                      shareUrl
                    )}&title=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex cursor-pointer h-8 w-8 items-center justify-center rounded-full border border-neutral-300 hover:bg-black/5"
                    aria-label="Share on LinkedIn"
                  >
                    <SiLinkedin className="h-4 w-4" />
                  </a>
                  <CopyLinkButton url={shareUrl} />
                </span>
              </div>
            </header>

            {/* Image — object-contain to avoid crop, friendly ratio box */}
            <div className="mt-5">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-100 ring-1 ring-black/5">
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt={post.coverImage?.alt || post.title}
                    fill
                    className="object-contain"
                    sizes="(min-width:1024px) 66vw, 100vw"
                  />
                ) : (
                  <div className="h-full w-full bg-neutral-200" />
                )}
              </div>
            </div>

            {/* Body */}
            <div className="mt-8 md:mt-10 maintext prose prose-zinc max-w-none">
              <PortableText value={post.body} />
            </div>

            {/* NEW: Ending media (gallery stacked vertically, then video) */}
            {(gallery.length > 0 || (video?.url || video?.fileUrl)) && (
              <section className="mt-10">
                {/* Stacked images: full width, one after another */}
                {gallery.length > 0 && (
                  <div className="space-y-4">
                    {gallery.map((img, idx) => {
                      const u = urlFor(img).width(1600).height(1067).fit("max").auto("format").url();
                      const alt = img.alt || `Gallery image ${idx + 1} for ${post.title}`;
                      return (
                        <figure
                          key={idx}
                          className="relative w-full aspect-[16/10] md:aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-black/5"
                        >
                          <Image
                            src={u}
                            alt={alt}
                            fill
                            className="object-cover"
                            sizes="(min-width:1024px) 66vw, 100vw"
                          />
                        </figure>
                      );
                    })}
                  </div>
                )}

                {/* Video below images (if present) */}
                {(video?.url || video?.fileUrl) && (
                  <div className={gallery.length ? "mt-6" : ""}>
                    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-black/5">
                      {isYouTubeOrVimeo(video?.url) ? (
                        <iframe
                          src={video!.url!}
                          title={post.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full"
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      ) : (
                        <video
                          className="absolute inset-0 h-full w-full"
                          controls
                          playsInline
                          src={video?.fileUrl || video?.url || undefined}
                        />
                      )}
                    </div>
                    {video?.caption ? (
                      <div className="mt-2 text-sm text-black/70">{video.caption}</div>
                    ) : null}
                  </div>
                )}
              </section>
            )}

            {/* Mobile share row */}
            <div className="mt-8 md:hidden">
              <div className="subtext text-black/60 mb-2">Share</div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    shareUrl
                  )}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 hover:bg-black/5"
                  aria-label="Share on X (Twitter)"
                >
                  <SiX className="h-4 w-4" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer h-8 w-8 items-center justify-center rounded-full border border-neutral-300 hover:bg-black/5"
                  aria-label="Share on Facebook"
                >
                  <SiFacebook className="h-4 w-4" />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                    shareUrl
                  )}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer h-8 w-8 items-center justify-center rounded-full border border-neutral-300 hover:bg-black/5"
                  aria-label="Share on LinkedIn"
                >
                  <SiLinkedin className="h-4 w-4" />
                </a>
                <CopyLinkButton url={shareUrl} />
              </div>
            </div>
          </div>

          {/* LEFT: Other insights */}
          <aside className="md:col-span-1 order-2 md:order-1 md:mt-20">
            <h2 className="subtitle font-semibold text-black">Trending</h2>
            <div className="mt-4 grid gap-4">
              {others?.map((o) => {
                const href = `/blog/${o.slug.current}` as Route<`/blog/${string}`>;
                const thumb = o.coverImage
                  ? urlFor(o.coverImage).width(600).height(400).fit("crop").auto("format").url()
                  : null;
                const d = o.publishedAt ? new Date(o.publishedAt).toLocaleDateString() : "";

                return (
                  <Link
                    key={o._id}
                    href={href}
                    className="group flex gap-3 rounded-xl border border-neutral-200 bg-white p-2 hover:shadow-sm transition-shadow"
                  >
                    <div className="relative h-[72px] w-[96px] flex-none overflow-hidden rounded-lg bg-neutral-100">
                      {thumb ? (
                        <Image src={thumb} alt={o.title} fill className="object-cover" sizes="96px" />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="line-clamp-2 text-sm font-medium text-black group-hover:underline">
                        {o.title}
                      </div>
                      {d ? <div className="mt-1 text-[11px] text-black/60">{d}</div> : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <Link href={backHref} className="subtext text-black/60 underline underline-offset-2">
            ← Back to list
          </Link>
        </div>
      </div>

      <Spacer />
      <ContactCtaServer />
    </article>
  );
}
