import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage";
import ReviewsCarouselClient from "../team/ReviewsCarouselClient";

type Review = {
  _id: string;
  author: string;
  rating: number;
  text: string;
  avatar?: any;
  when?: string;
  sourceUrl?: string;
};

type Doc = {
  title?: string;
  overallRating?: number | null;
  totalCount?: number | null;
  ctaGoogleUrl?: string | null;
  reviews: Review[];
};

const query = /* groq */ `
*[_type=="reviewsSection"][0]{
  title,
  overallRating,
  totalCount,
  ctaGoogleUrl,
  reviews[]->{
    _id, author, rating, text, avatar, when, sourceUrl
  }
}
`;

export const dynamic = "force-dynamic"; // always fresh

export default async function ManualReviewsCarouselServer() {
  const d = await sanity.fetch<Doc>(query, {}, { next: { revalidate: 0 } });

  const title = d?.title ?? "What our patients say";
  const reviews = (d?.reviews ?? []).map((r) => ({
    id: r._id,
    author: r.author,
    rating: r.rating,
    text: r.text,
    when: r.when ?? "",
    sourceUrl: r.sourceUrl ?? "",
    avatarUrl: r.avatar ? urlFor(r.avatar).width(96).height(96).fit("crop").url() : "",
  }));

  const computedAvg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
      : 0;

  const overall = d?.overallRating ?? computedAvg;
  const total = d?.totalCount ?? reviews.length;

  return (
    <section className="section">
      <div className="container">
        <ReviewsCarouselClient
          title={title}
          overall={Number.isFinite(overall) ? Number(overall.toFixed(1)) : 0}
          totalCount={total}
          reviews={reviews}
          googleCtaUrl={d?.ctaGoogleUrl || ""}
        />
      </div>
    </section>
  );
}
