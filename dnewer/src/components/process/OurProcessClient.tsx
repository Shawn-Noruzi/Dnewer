"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type StepVM = { imageUrl: string; title: string; description: string };

export default function hOurProcessClient({
    title = "Our Trusted Process",
    ctaLabel = "Get Your Free Consultation",
    ctaHref = "/contact",
    steps,
}: {
    title?: string;
    ctaLabel?: string;
    ctaHref?: string;
    steps: StepVM[];
}) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [active, setActive] = useState<number | null>(0);

    useEffect(() => {
        const handle = () => {
            let closest = { idx: 0, dist: Number.POSITIVE_INFINITY };
            steps.forEach((_, idx) => {
                const el = document.getElementById(`process-step-${idx}`);
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const center = window.innerHeight / 2;
                const stepCenter = rect.top + rect.height / 2;
                const dist = Math.abs(center - stepCenter);
                if (dist < closest.dist) closest = { idx, dist };
            });
            setActive(closest.idx);
        };
        handle();
        window.addEventListener("scroll", handle, { passive: true });
        window.addEventListener("resize", handle);
        return () => {
            window.removeEventListener("scroll", handle);
            window.removeEventListener("resize", handle);
        };
    }, [steps.length]);

    return (
        <>
            <style jsx>{`
        @keyframes drawCircle {
          0% { opacity: 0; }
          10% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes fadeIn { from {opacity: 0;} to {opacity: 1;} }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(0,0,0,0.35)); }
          50% { filter: drop-shadow(0 0 16px rgba(0,0,0,0.45)) drop-shadow(0 0 24px rgba(0,0,0,0.25)); }
        }
        .circle-draw { animation: drawCircle 0.5s ease-in-out forwards; }
        .circle-container { animation: fadeIn 0.3s ease-out forwards, glow 2s ease-in-out infinite; }
      `}</style>

            <section
                id="process"
                ref={sectionRef}
                className="section w-full bg-white text-black font-body "
            >
                <div className="container flex flex-col md:flex-row gap-12">
                    {/* Left column (centered, max-w 480) */}
                    <div className="flex-1 flex justify-center md:justify-start">
                        <div
                            className="flex flex-col items-center md:items-start justify-center md:sticky md:top-72 md:self-start max-w-[480px]  md:text-left"
                            style={{ zIndex: 10 }}
                        >
                            <h2 className="font-display subtitle text-black mb-6 max-w-[450px]">
                                {title}
                            </h2>

                            {/* {ctaLabel && (
                                <div className="mt-2 w-full flex justify-center md:justify-start">
                                    {ctaHref?.startsWith("/") ? (
                                        <Link
                                            href={ctaHref as any}
                                            className="btn btn-primary text-white font-bold px-6 py-3 rounded-full shadow transition-colors duration-200"
                                        >
                                            {ctaLabel}
                                        </Link>
                                    ) : (
                                        <a
                                            href={ctaHref || "#"}
                                            className="btn btn-primary text-white font-bold px-6 py-3 rounded-full shadow transition-colors duration-200"
                                        >
                                            {ctaLabel}
                                        </a>
                                    )}
                                </div>
                            )} */}
                        </div>
                    </div>

                    {/* Right column: steps */}
                    <div className="flex-1 flex flex-col gap-10">
                        {steps.map((step, idx) => {
                            const isActive = active === idx;
                            return (
                                <div
                                    key={idx}
                                    id={`process-step-${idx}`}
                                    className="flex flex-col md:flex-row items-center gap-6 transition-all duration-300 p-4"
                                    style={{
                                        minHeight: 300,
                                        opacity: isActive ? 1 : 0.6,
                                        transform: `scale(${isActive ? 1.04 : 1})`,
                                    }}
                                >
                                    {/* Icon + animated ring */}
                                    <div className="w-full relative flex items-center justify-center py-10">
                                        {isActive && (
                                            <div className="absolute circle-container" style={{ zIndex: 1 }}>
                                                <svg
                                                    width="140"
                                                    height="140"
                                                    className="absolute"
                                                    style={{ left: "50%", top: "50%", transform: "translate(-57%, -50%)" }}
                                                >
                                                    <circle
                                                        cx="70"
                                                        cy="70"
                                                        r="60"
                                                        fill="none"
                                                        stroke="rgba(0,0,0,0.9)"
                                                        strokeWidth="2"
                                                        strokeDasharray="377"
                                                        strokeDashoffset="377"
                                                        className="circle-draw"
                                                        style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                        <img
                                            src={step.imageUrl}
                                            alt={step.title}
                                            className="w-12 h-12 object-contain mr-6 relative z-10"
                                        />
                                    </div>

                                    {/* Text */}
                                    <div className="md:ml-6 w-full">
                                        <div className="flex justify-between">
                                            <h3 className="font-display subtitle">{step.title}</h3>
         
                                        </div>
                                        <p className="font-body text-black/70 maintext">{step.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
