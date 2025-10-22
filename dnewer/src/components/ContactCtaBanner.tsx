// components/ContactCtaBanner.tsx
"use client";

import Image from "next/image";
import { Mail, MapPin } from "lucide-react";

type Props = {
  title?: string;
  description?: string;

  /** Legacy (kept for back-compat). If `buttonHref` is provided, it wins. */
  contactHref?: string;

  /** NEW: primary CTA button text + URL */
  buttonLabel?: string;
  buttonHref?: string;

  /** NEW: small icon image for the CTA button (e.g., phone/chat). */
  iconSrc?: string;

  /** Optional: element id to scroll to for locations */
  locationsAnchorId?: string;

  /** Background/side image */
  imageSrc?: string;
  imageAlt?: string;
};

export default function ContactCtaBanner({
  title = "Get in Touch With Factory Opticals",
  description = "Our team is here to help with eye exam bookings, eyewear questions, and insurance inquiries. Reach out today — we’d love to hear from you.",

  // NEW: prefer buttonHref/Label; fall back to legacy contactHref + default label
  buttonLabel = "Contact Us",
  buttonHref,
  contactHref = "/contact",

  iconSrc,

  locationsAnchorId = "locations",
  imageSrc = "/images/eyewear-model.jpg",
  imageAlt = "Eyewear model",
}: Props) {
  const primaryHref = buttonHref || contactHref;

  const scrollToLocations = () => {
    const el = document.getElementById(locationsAnchorId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="mx-auto container px-4 sm:px-6 lg:px-8 py-8">
      {/* Yellow banner with black accents */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold-200 to-gold-300 text-black ring-1 ring-black/10">
        <div className="grid md:gap-6 md:grid-cols-2 items-center p-6 sm:p-10">
          {/* Left copy */}
          <div>
            <h2 className="subtitle max-w-[450px] font-semibold tracking-tight">
              {title}
            </h2>
            <p className="mt-3 text-black/80 maintext max-w-xl">{description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              {/* Primary: black pill (uses new button props if provided) */}
              <a
                href={primaryHref}
                className="btn btn-secondary inline-flex items-center gap-2 rounded-full bg-black text-white px-5 py-2.5 text-sm font-medium hover:opacity-90 max-[899px]:w-full"
              >
                {iconSrc ? (
                  <Image
                    src={iconSrc}
                    alt=""
                    width={16}
                    height={16}
                    className="h-4 w-4 object-contain"
                    priority
                  />
                ) : (
                  ""
                )}
                {buttonLabel}
              </a>

              {/* Secondary: subtle black outline on yellow */}
              <a
                href={`/n ${locationsAnchorId}`}
                className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-black/5 px-5 py-2.5 text-sm font-medium hover:bg-black/10 max-[899px]:w-full max-[899px]:justify-center cursor-pointer"
              >
                <MapPin className="h-4 w-4" />
                Our Locations
              </a>
            </div>
          </div>

          {/* Right image */}
          <div className="relative">
            <div className="relative ml-auto w-full h-[300px]">
              <Image
                src={imageSrc}
                alt={imageAlt || ""}
                fill
                sizes="(min-width:1024px) 440px, (min-width:768px) 50vw, 90vw"
                className="object-contain md:object-cover rounded-2xl"
                priority
              />
            </div>
          </div>
        </div>

        {/* Subtle corner shadow accent (black, very light) */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
      </div>
    </section>
  );
}
