"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { useContactModal } from "@/components/ContactUsModal";

const MAP_SRC = "/headerImages/map.png";

const places = [
  "Vancouver",
  "West Vancouver",
  "North Vancouver",
  "Burnaby",
  "New Westminster",
  "Coquitlam",
  "Port Moody",
  "Port Coquitlam",
  "Richmond",
  "Delta",
  "Surrey",
  "White Rock",
  "Langley",
  "Maple Ridge",
  "Pitt Meadows",
  "Mission",
  "Abbotsford",
];

export default function ServiceArea() {
  const { openContactModal } = useContactModal();

  return (
    <section className="relative overflow-hidden py-20">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-10 text-center"
        >
          <h2 className="font-display text-3xl md:text-5xl text-[var(--color-brand-dark)]">
            Where We <span className="text-gold-600">Work</span>
          </h2>
          <p className="mt-3 text-black/70 max-w-2xl mx-auto">
            Lower Mainland & Fraser Valley — covered. If you don’t see your city, reach
            out and we’ll do our best to accommodate.
          </p>
        </motion.div>

        {/* Map Card */}
        <div className="relative grid gap-6 lg:grid-cols-[1.1fr,0.9fr] items-stretch">
          {/* Map image with overlay panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow"
          >
            {/* Image wrapper:
                - Mobile: explicit height so content + buttons fit (no cutoff)
                - sm+: use aspect ratios */}
            <div
              className="
                relative w-full
                h-[60vh] min-h-[420px]
                sm:h-auto sm:aspect-[16/10]
                lg:aspect-[16/7]
              "
            >
              <Image
                src={MAP_SRC}
                alt="Dnewer service area — Lower Mainland & Fraser Valley"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
                priority
              />
            </div>

            {/* Left-to-right dark gradient for legibility */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

            {/* Overlay copy */}
            <div className="absolute inset-0 z-10 flex items-end md:items-center">
              <div className="p-4 sm:p-6 md:p-8 max-w-md">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-white/90 backdrop-blur ring-1 ring-white/20">
                  <MapPin className="h-4 w-4" />
                  Lower Mainland, BC
                </div>

                <h3 className="mt-2 md:mt-3 font-display text-2xl md:text-4xl text-white drop-shadow">
                  Service Area
                </h3>
                <p className="mt-2 text-white/85 text-sm md:text-base">
                  From Vancouver to Abbotsford — renovations, remodeling, and general
                  contracting built to last.
                </p>

                {/* CTA buttons */}
                <div className="mt-4 md:mt-5 flex flex-wrap gap-3">
                  <button onClick={() => openContactModal()} className="cursor-pointer btn btn-secondary">
                    Get a Quote
                  </button>
                  <a
                    href="https://www.google.com/maps/search/Lower+Mainland+BC/@49.1839089,-122.8952035,11.29z?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/70 bg-white/10 px-4 py-2 font-medium text-white backdrop-blur hover:bg-white/20 transition"
                  >
                    <Navigation className="h-4 w-4" />
                    View on Maps
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* City chips list */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow"
          >
            <h4 className="font-display text-xl text-[var(--color-brand-dark)]">
              Built by <span className="text-gold-600">Dnewer</span> across:
            </h4>

            {/* Scrollable pill list */}
            <div className="mt-4">
              <ul className="flex flex-wrap gap-2">
                {places.map((p, i) => (
                  <motion.li
                    key={p}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.02 * i, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    className="rounded-full border border-neutral-200 bg-gold-50 text-[var(--color-brand-dark)] px-3 py-1 text-sm hover:border-gold-400 hover:bg-gold-100 transition"
                  >
                    {p}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Note */}
            <p className="mt-4 text-sm text-black/60">
              Need service outside this area?{" "}
              <a href="tel:6044469332" className="underline">
                Contact us
              </a>
              .
            </p>
          </motion.div>
        </div>
      </div>

      {/* Decorative bottom accent */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24" />
    </section>
  );
}
