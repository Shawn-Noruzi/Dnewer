"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
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
  sourceUrl: string;
  avatarUrl: string;
};

export default function ReviewsCarouselClient({
  title = "Overall rating",
  overall,
  totalCount,
  reviews,
  googleCtaUrl,
  autoplayMs = 9000,
}: {
  title?: string;
  overall: number;
  totalCount: number;
  reviews: ReviewVM[];
  googleCtaUrl?: string;
  autoplayMs?: number;
}) {
  const isInternal = (h?: string): h is Route => !!h && h.startsWith("/");

  // triple the list so there are plenty of physical slides
  const tripledReviews = useMemo(() => {
    if (!reviews?.length) return [];
    return Array.from({ length: 3 }).flatMap((_, i) =>
      reviews.map((r, idx) => ({
        ...r,
        __key: `${r.id || idx}-copy${i}`, // unique key per clone
      })),
    );
  }, [reviews]);

  return (
    <div>
      {/* Header row */}
      <div className="mt-10 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div>
            <div className="subtitle text-black/60">{title}</div>
            <div className="mt-1 flex items-center gap-2">
              <div className="title font-semibold">{overall.toFixed(1)}</div>
              <div>
                <Stars n={overall} />
                <div className="flex gap-2">
                  <span className="subtext text-black/60">
                    {totalCount?.toLocaleString()} reviews
                  </span>
                  <Image
                    src="/GoogleLogo.png"
                    alt="Google"
                    width={150}
                    height={50}
                    className="h-[25px] w-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {googleCtaUrl ? (
          isInternal(googleCtaUrl) ? (
            <Link href={googleCtaUrl} className="btn btn-secondary">
              Review us on Google
            </Link>
          ) : (
            <a
              href={googleCtaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Review us on Google
            </a>
          )
        ) : null}
      </div>

      {/* Carousel (wrapped to prevent horizontal bleed) */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-x-clip">
        {/* Progressive enhancement: soft mask on the whole swiper lane */}
        <style jsx global>{`
          /* Mask the lane so edges fade out gently (supported browsers) */
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
            initialSlide={3}
            spaceBetween={16}
            loop
            loopAdditionalSlides={2}
            autoplay={{
              delay: autoplayMs,
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
            }}
            a11y={{
              prevSlideMessage: "Previous reviews",
              nextSlideMessage: "Next reviews",
            }}
            className="reviews-swiper"
          >
            {tripledReviews.map((r) => (
              <SwiperSlide key={r.__key} className="review-slide">
                <article className="review-card rounded-2xl border bg-white shadow-sm">
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      {r.avatarUrl ? (
                        <Image
                          src={r.avatarUrl}
                          alt={r.author}
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        // Lucide icon fallback when no avatar is provided
                        <div className="h-9 w-9 rounded-full bg-neutral-200 flex items-center justify-center">
                          <UserRound className="h-5 w-5 text-black/50" aria-hidden="true" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium">{r.author}</div>
                        {r.when ? (
                          <div className="text-xs text-black/50">{r.when}</div>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-3">
                      <Stars n={r.rating} />
                    </div>

                    <p className="mt-3 text-sm text-black/80 line-clamp-8">{r.text}</p>

                    {r.sourceUrl ? (
                      <div className="mt-3">
                        <a
                          href={r.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-black/60 underline underline-offset-2 hover:text-gold-400 transition-colors"
                        >
                          View original
                        </a>
                      </div>
                    ) : null}
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Fallback scrims (for non-mask browsers); also deepen the fade */}
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

        {/* Style tweaks */}
        <style jsx global>{`
          /* Card widths & centering (stay within viewport) */
          .reviews-swiper .review-slide {
            width: 88%;
            max-width: 560px;
            min-height: 290px; /* reserve height so scale doesn't shift layout */
            padding-top: 6px;
            padding-bottom: 6px;
            box-sizing: border-box;
          }
          @media (min-width: 640px) {
            .reviews-swiper .review-slide {
              width: 68%;
            }
          }
          @media (min-width: 1024px) {
            .reviews-swiper .review-slide {
              width: 48%;
            }
          }

          /* Allow vertical shadow; horizontal is clipped by outer wrapper */
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

          /* Smooth highlight without reflow: keep border static, use outline + scale */
          .reviews-swiper .review-card {
            border-color: rgba(0, 0, 0, 0.12);
            transform: scale(0.98);
            transform-origin: center;
            transition: transform 300ms ease, box-shadow 300ms ease,
              outline-color 300ms ease;
            outline: 0 solid transparent; /* doesn't affect layout */
            will-change: transform;
          }
          .reviews-swiper .swiper-slide-active {
            z-index: 3;
          }
          .reviews-swiper .swiper-slide-active .review-card {
            transform: scale(1.05);
            box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
            outline: 2px solid #f4c24f; /* yellow highlight */
          }

          /* Pagination below carousel */
          .reviews-swiper .swiper-pagination {
            position: static;
            margin-top: 28px;
          }
          .reviews-swiper .swiper-pagination-bullet {
            background: rgba(0, 0, 0, 0.35);
            opacity: 1;
          }
          .reviews-swiper .swiper-pagination-bullet-active {
            background: #f4c24f;
          }
        `}</style>
      </div>
    </div>
  );
}

/* Fractional stars (0–5), supports halves/any decimal) */
function Stars({ n = 0 }: { n?: number }) {
  const safe = Math.max(0, Math.min(5, n));
  return (
    <div aria-label={`${safe.toFixed(1)} out of 5 stars`} className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const frac = Math.max(0, Math.min(1, safe - i)); // 0..1 fill for this star
        const clipId = `starClip-${i}-${Math.round(frac * 100)}`;

        return (
          <svg key={i} width="16" height="16" viewBox="0 0 20 20" aria-hidden>
            <defs>
              {/* Clip by width percentage for the gold overlay */}
              <clipPath id={clipId}>
                <rect x="0" y="0" width={20 * frac} height="20" />
              </clipPath>
            </defs>

            {/* Background (empty) star */}
            <path
              d="M10 15.27l-5.18 3.04 1.48-5.88L1 7.64l6.02-.49L10 1.5l2.98 5.65 6.02.49-5.3 4.79 1.48 5.88L10 15.27z"
              fill="#E5E7EB"
            />

            {/* Foreground (filled) star clipped to frac */}
            <path
              d="M10 15.27l-5.18 3.04 1.48-5.88L1 7.64l6.02-.49L10 1.5l2.98 5.65 6.02.49-5.3 4.79 1.48 5.88L10 15.27z"
              fill="#F4C24F"
              clipPath={`url(#${clipId})`}
            />
          </svg>
        );
      })}
    </div>
  );
}
