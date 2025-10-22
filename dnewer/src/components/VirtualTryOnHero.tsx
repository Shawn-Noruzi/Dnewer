// components/VirtualTryOnHero.tsx
import Image from "next/image";

type Props = {
  title?: string;
  bullets?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export default function VirtualTryOnHero({
  title = "Try your favourite frames virtually",
  bullets = [
    "Activate your camera or upload a photo",
    "Select your favorite frames",
    "See them in real time",
  ],
  ctaLabel = "Try it Now",
  ctaHref = "/try-on",
  imageSrc = "/images/placeholder-face.jpg",
  imageAlt = "Virtual try-on preview",
}: Props) {
  return (
    <section className="container">
      <div className="grid gap-8 md:grid-cols-2 items-center">
        {/* Left copy */}
        <div>
          <h2 className="subtitle font-semibold tracking-tight text-black">
            {title}
          </h2>

          <ul className="mt-6 space-y-3 text-black/80">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0" />
                <span className="subtext leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>

          <a
            href={ctaHref}
            className="btn-primary mt-8 inline-flex h-11 items-center rounded-full bg-black px-5 text-white text-sm font-medium hover:opacity-90"
          >
            {ctaLabel}
          </a>
        </div>

        {/* Right image card */}
        <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm border border-black/10">
          <div className="relative aspect-[4/3] md:aspect-[5/4]">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              className="object-cover"
              sizes="(min-width:1024px) 560px, (min-width:768px) 50vw, 90vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 12l2.5 2.5L16 9" />
    </svg>
  );
}
