"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Route } from "next";
import { Divide as Hamburger } from "hamburger-react";
import { Phone, Mail, ShieldCheck, X } from "lucide-react";

type NavLink = { href: string; label: string };
type Promo = { text?: string; href?: string };

export default function SiteHeaderClient({
  brandName,
  phoneNumber,
  phoneNumber2,
  logoUrl,
  navLinks,
  promos,
  cta,
}: {
  brandName: string;
  phoneNumber: string;
  phoneNumber2: string;
  logoUrl?: string;
  navLinks: NavLink[];
  promos: Promo[];
  cta: { label: string; href: string };
}) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  // Call popover state
  const [callOpen, setCallOpen] = useState(false);
  const callRef = useRef<HTMLDivElement | null>(null);
  const callBtnRef = useRef<HTMLButtonElement | null>(null);

  // rotate promos every 4s
  useEffect(() => {
    if (!promos?.length) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % promos.length), 4000);
    return () => clearInterval(t);
  }, [promos?.length]);

  // TS type guard: narrows to Next.js Route when the string starts with "/"
  const isInternal = (href?: string): href is Route => !!href && href.startsWith("/");

  const hasPromos = Array.isArray(promos) && promos.length > 0;

  // Normalize numbers for tel:
  const tel1 = (phoneNumber || "").replace(/[^+\d]/g, "");
  const tel2 = (phoneNumber2 || "").replace(/[^+\d]/g, "");
  const hasBoth = Boolean(phoneNumber && phoneNumber2);

  // Close popover on outside click / Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!callOpen) return;
      const target = e.target as Node;
      if (
        callRef.current &&
        !callRef.current.contains(target) &&
        callBtnRef.current &&
        !callBtnRef.current.contains(target)
      ) {
        setCallOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setCallOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [callOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-[1200] w-full">
      {/* Deals strip */}
      {hasPromos && (
        <div className="bg-black text-white">
          <div className="container h-9 flex items-center justify-center overflow-hidden">
            <div className="relative h-5 w-full max-w-3xl text-center" aria-live="polite">
              {promos.map((p, i) => {
                const Comp = isInternal(p.href) ? Link : "a";
                const compProps: any = isInternal(p.href)
                  ? { href: p.href as Route }
                  : {
                    href: p.href || "/deals",
                    target: p.href?.startsWith("http") ? "_blank" : undefined,
                    rel: "noopener noreferrer",
                  };

                return (
                  <Comp
                    key={`${p.text ?? "promo"}-${i}`}
                    {...compProps}
                    className={[
                      "absolute inset-0 flex items-center justify-center subtext text-white",
                      "transition-all duration-500 ease-in-out",
                      i === idx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
                    ].join(" ")}
                  >
                    {p.text}
                  </Comp>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Nav bar */}
      <div className="border-b border-neutral-200 bg-white shadow-sm">
        <div className="container grid h-16 grid-cols-2 md:grid-cols-3 items-center gap-4">
          {/* Left: Logo / Brand */}
          <div className="flex md:justify-start">
            <Link href={"/" as Route} className="flex items-center gap-2" aria-label="Home">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={brandName}
                  width={140}
                  height={40}
                  className="h-8 w-auto"
                  priority
                  sizes="(min-width: 768px) 140px, 110px"
                />
              ) : (
                <span className="font-display text-xl">{brandName}</span>
              )}
            </Link>
          </div>

          {/* Center: Nav (desktop) */}
          <nav className="hidden md:flex items-center justify-center gap-6 subtext">
            {navLinks.map((n) =>
              isInternal(n.href) ? (
                <Link key={n.href} href={n.href} className="subtext tracking-[1px]">
                  {n.label}
                </Link>
              ) : (
                <a
                  key={n.href}
                  href={n.href}
                  target={n.href?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="subtext tracking-[3px]"
                >
                  {n.label}
                </a>
              )
            )}
          </nav>

          {/* Right: Call Us (popover) + CTA (desktop), and Menu (mobile) */}
          <div className="flex justify-end items-center gap-3 relative">
            {/* Call Us trigger (always shown; label hidden on md if you prefer) */}
            {(phoneNumber || phoneNumber2) && (
              <button
                ref={callBtnRef}
                type="button"
                onClick={() => setCallOpen((v) => !v)}
                className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-2 subtext hover:border-gold-400 transition"
                aria-haspopup="dialog"
                aria-expanded={callOpen}
                aria-controls="call-popover"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden md:inline">Call Us</span>
              </button>
            )}

            {/* CTA */}
            {isInternal(cta.href) ? (
              <Link href={cta.href} className="hidden md:inline-flex btn btn-primary">
                {cta.label}
              </Link>
            ) : (
              <a
                href={cta.href}
                target={cta.href?.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="hidden md:inline-flex btn btn-primary"
              >
                {cta.label}
              </a>
            )}

            {/* Hamburger (mobile) */}
            <div className="md:hidden p-1 -mr-2" aria-controls="mobile-menu" aria-expanded={open}>
              <Hamburger toggled={open} toggle={setOpen} size={22} rounded distance="sm" label="Toggle menu" />
            </div>

            {/* Call popover */}
            {callOpen && (phoneNumber || phoneNumber2) && (
              <div
                id="call-popover"
                ref={callRef}
                role="dialog"
                aria-label="Call options"
                className="absolute right-0 top-12 w-[300px] rounded-2xl border border-black/10 bg-white/90 backdrop-blur-md p-3 shadow-2xl ring-1 ring-black/5"
              >
                <div className="space-y-2">
                  {phoneNumber && (
                    <a
                      href={`tel:${phoneNumber.replace(/[^+\d]/g, "")}`}
                      className="block rounded-xl border border-neutral-200 bg-white px-4 py-3 transition hover:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
                    >
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium">Vancouver</span>
                        <span className="text-sm tabular-nums text-black/80">{phoneNumber}</span>
                      </div>
                    </a>
                  )}

                  {phoneNumber2 && (
                    <a
                      href={`tel:${phoneNumber2.replace(/[^+\d]/g, "")}`}
                      className="block rounded-xl border border-neutral-200 bg-white px-4 py-3 transition hover:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
                    >
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium">East Vancouver</span>
                        <span className="text-sm tabular-nums text-black/80">{phoneNumber2}</span>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu (unchanged styling aside from above improvements) */}
        <div
          id="mobile-menu"
          className={[
            "md:hidden border-t border-neutral-200 bg-white transition-all duration-300 ease-in-out overflow-hidden",
            open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
          ].join(" ")}
          aria-hidden={!open}
        >
          <div className="container pt-1 pb-6 !px-0 flex flex-col">
            {/* Links */}
            <ul className="w-full divide-y divide-neutral-200 bg-white">
              {navLinks.map((n) => {
                const item = (
                  <div className="px-4 py-3">
                    <span className="text-[13px] tracking-[2px] uppercase text-black/80">{n.label}</span>
                  </div>
                );
                return (
                  <li key={n.href}>
                    {isInternal(n.href) ? (
                      <Link href={n.href} className="block w-full" onClick={() => setOpen(false)}>
                        {item}
                      </Link>
                    ) : (
                      <a
                        href={n.href}
                        target={n.href?.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="block w-full"
                        onClick={() => setOpen(false)}
                      >
                        {item}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Primary action */}
            <div className="px-4 pt-4">
              {isInternal(cta.href) ? (
                <Link
                  href={cta.href}
                  className="btn btn-primary w-full"
                  onClick={() => setOpen(false)}
                >
                  {cta.label}
                </Link>
              ) : (
                <a
                  href={cta.href}
                  target={cta.href?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full"
                  onClick={() => setOpen(false)}
                >
                  {cta.label}
                </a>
              )}
            </div>

            {/* Trust & contact card (centered) */}
            <div className="px-4 mt-4">
              <div className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur-sm p-4 ring-1 ring-black/5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-black/70" />
                  <div className="text-[13px] text-black/70">
                    Trusted local care since <span className="font-medium">1980</span>
                  </div>
                </div>
                <ul className="mt-3 grid gap-1.5 text-[13px] text-black/70">
                  <li>Licensed optometrists & opticians</li>
                  <li>Direct billing available</li>
                  <li>Advanced eye exams</li>
                </ul>
                <div className="mt-4 grid gap-2">
                  {phoneNumber && (
                    <a
                      href={`tel:${tel1}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm hover:border-gold-400 transition"
                    >
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">{phoneNumber}</span>
                    </a>
                  )}
                  {phoneNumber2 && (
                    <a
                      href={`tel:${tel2}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm hover:border-gold-400 transition"
                    >
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">{phoneNumber2}</span>
                    </a>
                  )}
                  <a
                    href="mailto:support@factoryoptical.com"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm hover:border-gold-400 transition"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="font-medium">support@factoryoptical.com</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div className="px-4 pt-4">
              <div className="rounded-2xl border border-black/5 bg-black/[0.03] p-4 text-center">
                <p className="text-[13px] text-black/70 leading-relaxed">
                  Quality Eyewear<br />
                  Advanced Exams<br />
                  Friendly Experts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
