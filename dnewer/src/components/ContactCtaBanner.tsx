// components/ContactCtaBanner.tsx
"use client";

import { useContactModal } from "@/components/ContactUsModal";
import Image from "next/image";
import { Phone, Mail } from "lucide-react";

export default function ContactCtaBanner() {
    const { openContactModal } = useContactModal();

    return (
        <section className="mx-auto container px-4 sm:px-6 lg:px-8 py-12">
            {/* Gradient banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold-200 to-gold-400 text-black ring-1 ring-black/10 shadow-lg">
                <div className="grid md:grid-cols-2 items-center gap-6 p-6 sm:p-10">
                    {/* Left content */}
                    <div className="space-y-4">
                        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
                            Let’s Build Your Dream Space
                        </h2>

                        <p className="text-black/80 text-base md:text-lg leading-relaxed max-w-lg">
                            From kitchen remodels to full home renovations, Dnewer Services Ltd. is here to
                            bring your vision to life with quality craftsmanship and trusted expertise.
                        </p>

                        <div className="flex flex-wrap gap-3 mt-6">
                            {/* CTA 1: Contact Us */}
                            <button
                                onClick={() => openContactModal({ message: "I'd like to request a quote for my project." })}
                                className="btn inline-flex items-center gap-2 rounded-full bg-black text-white px-5 py-2.5 text-sm font-medium hover:opacity-90 transition cursor-pointer"
                            >
                                <Mail className="h-4 w-4" />
                                Get a Quote
                            </button>

                            {/* CTA 2: Get a Quote */}
                            <a
                                href="tel:6044469332"
                                className="inline-flex items-center gap-2 rounded-full border border-black/30 bg-black/5 px-5 py-2.5 text-sm font-medium text-black hover:bg-black/10 transition cursor-pointer"
                            >
                                <Phone className="h-4 w-4" />
                                Contact Us
                            </a>
                        </div>
                    </div>

                    {/* Right image */}
                    <div className="relative w-full h-[280px] md:h-[320px]">
                        <Image
                            src="/headerImages/headerKitchen-desktop.webp"
                            alt="Renovated modern kitchen"
                            fill
                            sizes="(min-width:1024px) 440px, (min-width:768px) 50vw, 90vw"
                            className="object-cover rounded-2xl"
                            priority
                        />
                    </div>
                </div>

                {/* Soft shadow accent */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
            </div>
        </section>
    );
}
