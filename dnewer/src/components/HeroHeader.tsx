"use client";

import { Phone, Zap } from "lucide-react";
import { motion, Variants, Transition } from "framer-motion";
import { useEffect, useState } from "react";
import { useContactModal } from "@/components/ContactUsModal";
// put this near the top of the file (outside the component)
const CAPABILITIES = [
  "Design",
  "Build",
  "Repairs",
  "Managing",
  "Maintenance",
  "Services",
];

export default function HeroHeader() {
  const { openContactModal } = useContactModal();
  const [animateOnLoad, setAnimateOnLoad] = useState(true);

  useEffect(() => {
    const key = "heroHasAnimated";
    if (sessionStorage.getItem(key)) {
      setAnimateOnLoad(false);
    } else {
      sessionStorage.setItem(key, "true");
    }
  }, []);

  const transition: Transition = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { ...transition, delay: 0.2 + i * 0.15 } }),
  };

  const slowFade: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 1.2 } },
  };

  const animationProps = animateOnLoad ? { initial: "hidden", animate: "show" } : { initial: "show", animate: "show" };

  return (
    <section className="relative isolate h-[70vh] md:h-[78vh] w-full overflow-hidden rounded-none">
      {/* Background image */}
      <picture>
        <source media="(min-width: 768px)" srcSet="/headerImages/headerKitchen-desktop.webp" />
        <img
          src="/headerImages/headerKitchen-mobile.webp"
          alt="Renovated modern kitchen by Dnewer"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
      </picture>

      {/* Mobile-only short black gradient for readability */}
      <div className="absolute inset-0 md:hidden pointer-events-none bg-gradient-to-b from-black/70 via-black/40 to-transparent" />

      <div className="relative z-10 h-full">
        <div className="container flex h-full flex-col justify-center">
          {/* MERGED CAPABILITIES — mobile-friendly wrapped pill */}
          <motion.div
            className="
    w-fit mx-auto sm:mx-0
    inline-flex justify-center sm:justify-start flex-wrap items-center
    gap-x-2 gap-y-1 rounded-full
    border border-[#F97316]/50 bg-[#F97316]/10
    px-3 py-2 sm:py-1.5
    text-[11px] sm:text-[13px] font-semibold text-white
    backdrop-blur
    shadow-[0_0_0_1px_rgba(249,115,22,0.06)]
    
  "
            variants={fadeUp}
            custom={0}
            {...animationProps}
          >
            {CAPABILITIES.map((label, i) => (
              <span key={label} className="inline-flex items-center whitespace-nowrap">

                <span
                  aria-hidden
                  className="mx-1 inline-block h-1 w-1 rounded-full bg-[#F97316]/80"
                />

                {label}
              </span>
            ))}
          </motion.div>


          {/* Title */}
          <motion.h1 className="mt-2 font-display leading-[1.1] text-white drop-shadow-xl" {...animationProps}>
            {/* Keep small on mobile for balance */}
            <motion.span className="sr-only" variants={slowFade}>
              {/* Hidden: the merged pill above now covers this line’s content */}
              Capabilities
            </motion.span>

            <motion.span className="block text-4xl sm:text-5xl md:text-7xl" variants={fadeUp} custom={1}>
              Thinking beyond{" "}
              <span className="bg-linear-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">limits</span>
            </motion.span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="mt-3 sm:mt-4 max-w-2xl text-white/90 subtext drop-shadow"
            variants={fadeUp}
            custom={2}
            {...animationProps}
          >
            Commercial & residential renovations: repairs, remodeling, installations, tiling,
            cabinets, painting, decks, landscaping — built to last.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3"
            variants={fadeUp}
            custom={3}
            {...animationProps}
          >
            <button onClick={() => openContactModal()} className="btn btn-secondary text-base cursor-pointer">
              Get a Free Quote
            </button>

            <a
              href="tel:604-446-9332"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/70 bg-white/10 px-4 py-2 font-medium text-white backdrop-blur transition hover:bg-white/20"
            >
              <Phone className="h-4 w-4" />
              Call 604-446-9332
            </a>
          </motion.div>

          {/* 24/7 EMERGENCY REPAIRS — urgent text (no pill) */}
          <motion.div
            className="mt-4 inline-flex items-center gap-2 text-red-500 font-semibold tracking-wide drop-shadow-sm"
            variants={fadeUp}
            custom={4}
            {...animationProps}
          >
            {/* attention ping dot */}
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-gold-600 opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold-600" />
            </span>


            <span className="uppercase text-white">24/7 Service Call</span>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
