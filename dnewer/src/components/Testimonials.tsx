"use client";

import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, A11y } from "swiper/modules";
import { UserRound } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

type ReviewVM = {
  id: string;
  author: string;
  rating: number;
  text: string;
  when: string;
  sourceUrl?: string;
  avatarUrl?: string; // ignored now
};

const DEMO_REVIEWS: ReviewVM[] = [
  { id: "r1", author: "Maria S.", rating: 5, text: "Dnewer handled our condo bathroom remodel end-to-end — new shower glass, tiling, and fixtures. Clean work, zero mess, and they finished on schedule.", when: "2 weeks ago", sourceUrl: "#" },
  { id: "r2", author: "Gurpreet B. (Cafe Owner)", rating: 5, text: "Commercial renovation pros. They kept our cafe open while updating the bar, cabinets, and paint. Great communication and after-hours installation.", when: "1 month ago", sourceUrl: "#" },
  { id: "r3", author: "Ethan K.", rating: 4.8, text: "Called for a deck repair that turned into a full refresh. New boards, railings, and stain — looks brand new. Fair pricing and solid craftsmanship.", when: "3 weeks ago", sourceUrl: "#" },
  { id: "r4", author: "Lina R.", rating: 5, text: "Kitchen renovation with custom cabinets and backsplash tiling. Dnewer’s team helped with design choices and the installation is flawless.", when: "5 days ago", sourceUrl: "#" },
  { id: "r5", author: "Office Strata Council", rating: 5, text: "Reliable maintenance partner for our commercial building — fast repairs, scheduled servicing, and clear reports after each visit.", when: "2 months ago", sourceUrl: "#" },
  { id: "r6", author: "Noah & Aisha", rating: 4.9, text: "Full home painting + trim and door installation. Edges are crisp, color match is perfect, and they protected floors and furniture carefully.", when: "3 weeks ago", sourceUrl: "#" },
  { id: "r7", author: "Kara D.", rating: 5, text: "Landscaping and new patio steps completely changed our backyard. Dnewer coordinated the stonework and drainage — super professional.", when: "1 month ago", sourceUrl: "#" },
  { id: "r8", author: "Victor P.", rating: 4.7, text: "Emergency repair after a leak — quick drywall patch, repaint, and cabinet toe-kick replacement. You’d never know there was damage.", when: "3 months ago", sourceUrl: "#" },
];

export default function ReviewsCarouselClient({
  title = "Customer Testimonials",
  reviews,
  autoplayMs = 9000,
}: {
  title?: string;
  reviews?: ReviewVM[];
  autoplayMs?: number;
}) {
  const data = reviews?.length ? reviews : DEMO_REVIEWS;

  // triple for smooth looping
  const tripledReviews = useMemo(
    () =>
      Array.from({ length: 3 }).flatMap((_, i) =>
        data.map((r, idx) => ({ ...r, __key: `${r.id || idx}-copy${i}` })),
      ),
    [data],
  );

  const initialSlide = data.length;

  return (
    <section className="relative overflow-hidden py-20">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-[var(--color-brand-dark)]">
            {title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-gold-600">{title.split(" ").slice(-1)[0]}</span>
          </h2>
        </div>
      </div>

      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-x-clip">
        {/* Edge mask */}
        <style jsx global>{`
          .reviews-lane {
            -webkit-mask-image: linear-gradient(
              to right,
              transparent 0,
              black 48px,
              black calc(100% - 48px),
              transparent 100%
            );
            mask-image: linear-gradient(
              to right,
              transparent 0,
              black 48px,
              black calc(100% - 48px),
              transparent 100%
            );
          }
          @media (max-width: 639px) {
            .reviews-lane {
              -webkit-mask-image: linear-gradient(
                to right,
                transparent 0,
                black 24px,
                black calc(100% - 24px),
                transparent 100%
              );
              mask-image: linear-gradient(
                to right,
                transparent 0,
                black 24px,
                black calc(100% - 24px),
                transparent 100%
              );
            }
          }
        `}</style>

        <div className="mx-auto max-w-7xl reviews-lane relative">
          <Swiper
            modules={[Pagination, Autoplay, A11y]}
            slidesPerView="auto"
            centeredSlides
            centeredSlidesBounds
            initialSlide={initialSlide}
            spaceBetween={16}
            loop
            loopAdditionalSlides={2}
            autoplay={{
              delay: autoplayMs,
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
            }}
            autoHeight={false}
            a11y={{
              prevSlideMessage: "Previous reviews",
              nextSlideMessage: "Next reviews",
            }}
            className="reviews-swiper"
          >
            {tripledReviews.map((r) => (
              <SwiperSlide key={r.__key} className="review-slide cursor-pointer">
                <article className="review-card h-full rounded-2xl border bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#F97316]">
                  <div className="flex h-full flex-col p-4">
                    <div className="flex items-center gap-3">
                      {/* Always use icon (no avatar) */}
                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.28)" }}
                      >
                        <UserRound className="h-5 w-5 text-[#F97316]" aria-hidden="true" />
                      </div>

                      <div>
                        <div className="text-sm font-medium">{r.author}</div>
                        {r.when ? <div className="text-xs text-black/50">{r.when}</div> : null}
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-black/80 line-clamp-6">{r.text}</p>

                    <div className="mt-auto" />
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Edge scrims for non-mask browsers */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-16 bg-gradient-to-r from-white to-transparent"
            style={{ zIndex: 5 }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-16 bg-gradient-to-l from-white to-transparent"
            style={{ zIndex: 5 }}
          />
        </div>

        {/* Equal-height slides & brandy hovers */}
        <style jsx global>{`
          /* Equal heights across all slides; tweak these to your taste */
          .reviews-swiper .review-slide {
            width: 88%;
            max-width: 560px;
            height: 200px;
            padding-top: 6px;
            padding-bottom: 6px;
            box-sizing: border-box;
          }
          @media (min-width: 640px) {
            .reviews-swiper .review-slide {
              width: 68%;
              height: 200px;
            }
          }
          @media (min-width: 1024px) {
            .reviews-swiper .review-slide {
              width: 48%;
              height: 200px;
            }
          }

          .reviews-swiper,
          .reviews-swiper .swiper,
          .reviews-swiper .swiper-wrapper,
          .reviews-swiper .swiper-slide {
            overflow: visible;
          }
          .reviews-swiper {
            padding-top: 8px;
            padding-bottom: 8px;
          }

          /* Brand hover state */
          .reviews-swiper .review-card {
            border-color: rgba(0, 0, 0, 0.12);
            transition: border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease;
          }
          .reviews-swiper .review-card:hover {
            border-color: #F97316;

            transform: translateY(-2px);
          }

          .reviews-swiper .swiper-pagination {
            position: static;
            margin-top: 28px;
          }
          .reviews-swiper .swiper-pagination-bullet {
            background: rgba(0, 0, 0, 0.35);
            opacity: 1;
          }
          .reviews-swiper .swiper-pagination-bullet-active {
            background: #F97316;
          }
        `}</style>
      </div>
    </section>
  );
}
