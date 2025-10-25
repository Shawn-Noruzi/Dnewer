"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Wrench,
  Cog,
  Hammer,
  Ruler,
  Home,
  HammerIcon,
  ShowerHead,
  Paintbrush,
  Palette,
  Trees,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";

const services = [
  { icon: Building2, label: "Commercial / Residential", desc: "Expert renovations for homes, offices, and commercial spaces." },
  { icon: Wrench, label: "Repairs", desc: "Quick and reliable repairs to keep your property in top shape." },
  { icon: ClipboardList, label: "General Contracting", desc: "Coordinated full-service project management for renovations of any scale." },
  { icon: Hammer, label: "Maintenance", desc: "Ongoing support and upkeep for your property’s needs." },
  { icon: Ruler, label: "Remodelling", desc: "Reimagine your interiors with modern layouts and finishes." },
  { icon: Home, label: "Renovation", desc: "Transform your entire space from design to completion." },
  { icon: HammerIcon, label: "Installation", desc: "Professional installation for fixtures, cabinetry, and more." },
  { icon: ShowerHead, label: "Shower Glass", desc: "Custom shower enclosures with seamless fit and clarity." },
  { icon: Ruler, label: "Tiling", desc: "Perfectly aligned tiling for floors, kitchens, and bathrooms." },
  { icon: Paintbrush, label: "Cabinets", desc: "Beautiful, durable cabinetry crafted for function and style." },
  { icon: Palette, label: "Painting", desc: "High-quality finishes that bring your vision to life." },
  { icon: Trees, label: "Landscaping", desc: "Outdoor designs built to enhance your curb appeal." },
];

export default function Services() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative bg-gradient-to-b from-white to-neutral-50 py-10 md:py-20">
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-4xl md:text-5xl text-[var(--color-brand-dark)]">
            Built by <span className="text-gold-600">Dnewer</span>
          </h2>
          <p className="mt-3 text-black/70 max-w-2xl mx-auto">
            From design to detail — our craftsmanship defines spaces built to
            last. Explore our range of professional renovation and construction
            services.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {services.map((s, i) => {
            const Icon = s.icon;
            const isHovered = hovered === i;

            return (
              <motion.div
                key={s.label}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Card */}
                <motion.div
                  layout
                  className="
                    relative rounded-xl bg-white border border-neutral-200 shadow-sm
                    transition-all duration-300
                    flex flex-col items-center justify-center text-center
                    /* equal heights */
                    h-28 sm:h-32 lg:h-36 p-4 sm:p-6
                  "
                  animate={{
                    scale: isHovered ? 1.06 : 1,
                    boxShadow: isHovered ? "0 12px 24px rgba(0,0,0,0.12)" : "0 2px 6px rgba(0,0,0,0.06)",
                    borderColor: isHovered ? "#FDD61E" : "rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    className={`flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-300 ${
                      isHovered ? "bg-gold-600 text-white" : "bg-gold-600/10 text-gold-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Reserve space for up to 2 lines so wrapping doesn't change height */}
                  <div
                    className={`
                      mt-2 sm:mt-3 font-medium text-[13px] sm:text-[15px] transition-colors
                      ${isHovered ? "text-gold-700" : "text-black/80"}
                      line-clamp-2 leading-snug
                      min-h-[2.25rem] sm:min-h-[2.5rem]
                    `}
                  >
                    {s.label}
                  </div>
                </motion.div>

                {/* Tooltip (desktop/hover only; mobile won't trigger) */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      key="tooltip"
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: -10, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute left-1/2 -top-3 -translate-x-1/2 -translate-y-full z-20 w-56 bg-black text-white text-sm px-4 py-3 rounded-xl shadow-lg border border-white/10"
                    >
                      {s.desc}
                      <div className="absolute left-1/2 bottom-[-6px] -translate-x-1/2 w-3 h-3 bg-black rotate-45 border-r border-b border-white/10" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Fade bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gold-50/60 to-transparent" />
    </section>
  );
}
