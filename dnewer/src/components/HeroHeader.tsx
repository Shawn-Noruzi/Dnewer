"use client";

import { Phone } from "lucide-react";
import { motion, Variants, Transition } from "framer-motion";
import { useEffect, useState } from "react";
import { useContactModal } from "@/components/ContactUsModal";

const chips = ["Remodeling", "Installations", "Tiling", "Cabinets", "Landscaping", "And More..."];

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

  const chipVariant: Variants = {
    hidden: (i: number) => ({ opacity: 0, x: -24, marginLeft: i === 0 ? 0 : -16, scale: 0.95 }),
    show: (i: number) => ({
      opacity: 1,
      x: 0,
      marginLeft: 0,
      scale: 1,
      transition: { delay: 0.6 + i * 0.08, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    }),
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
          {/* Title */}
          <motion.h1 className="font-display leading-[1.1] text-white drop-shadow-xl" {...animationProps}>
            <motion.span className="block text-[15px] sm:text-[17px] md:text-4xl opacity-90" variants={slowFade}>
              Managing • Maintenance • Services
            </motion.span>

            <motion.span className="mt-2 block text-4xl sm:text-5xl md:text-7xl" variants={fadeUp} custom={0}>
              Thinking beyond{" "}
              <span className="bg-linear-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">limits</span>
            </motion.span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="mt-3 sm:mt-4 max-w-2xl text-white/90 subtext drop-shadow"
            variants={fadeUp}
            custom={1}
            {...animationProps}
          >
            Commercial & residential renovations: repairs, remodeling, installations, tiling, cabinets, painting, decks,
            landscaping, 24/7 emergency service calls and more.
          </motion.p>

          {/* CTAs */}
          <motion.div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3" variants={fadeUp} custom={2} {...animationProps}>
            <button onClick={() => openContactModal()} className="btn btn-secondary text-base">
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

          {/* Service chips */}
          <motion.ul className="mt-6 flex flex-wrap gap-2" {...animationProps}>
            {chips.map((t, i) => (
              <motion.li
                key={t}
                className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm text-white/90 backdrop-blur"
                variants={chipVariant}
                custom={i}
              >
                {t}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
