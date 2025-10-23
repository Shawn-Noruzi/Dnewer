"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Route } from "next";
import { Divide as Hamburger } from "hamburger-react";
import { Phone, Mail, ShieldCheck } from "lucide-react";
import { useContactModal } from "@/components/ContactUsModal";

// ----------------------
// Static data for Dnewer
// ----------------------
type NavLink = { href: string; label: string };
type Promo = { text?: string; href?: string };

const BRAND_NAME = "Dnewer Service Ltd.";
const PHONE = "604-446-9332";
const LOGO_URL: string | undefined = "/logo-1.png"; // replace with your logo path

// Desktop/General nav (you can add more later if needed)
const NAV_LINKS: NavLink[] = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/our-work", label: "Our Work" },
];

// Mobile should only show these pages (same as above by request)
const MOBILE_LINKS: NavLink[] = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/our-work", label: "Our Work" },
];

// Promotions updated to your renovation services list
const PROMOS: Promo[] = [
  { text: "Commercial / Residential" },
  { text: "Repairs • Services • Maintenance" },
  { text: "Remodelling • Renovation • Installation" },
  { text: "Shower Glass • Tiling • Cabinets" },
  { text: "Painting • Decks • Landscaping" },
];

const CTA_LABEL = "Get a Quote";
const SUPPORT_EMAIL = "Dnewer@hotmail.com";

// TS type guard: Next.js Route when string starts with "/"
const isInternal = (href?: string): href is Route => !!href && href.startsWith("/");

export default function SiteHeaderClient() {
  const { openContactModal } = useContactModal();
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  // Rotate promos every 4s
  useEffect(() => {
    if (!PROMOS.length) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % PROMOS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const hasPromos = PROMOS.length > 0;

  // Normalized tel link
  const tel = PHONE.replace(/[^+\d]/g, "");

  return (
    <header className="fixed inset-x-0 top-0 z-[1200] w-full">
      {/* Promo strip */}
      {hasPromos && (
        <div className="bg-black text-white">
          <div className="container h-9 flex items-center justify-center overflow-hidden">
            <div className="relative h-5 w-full max-w-3xl text-center" aria-live="polite">
              {PROMOS.map((p, i) => {
                const Comp = isInternal(p.href) ? Link : "a";
                const compProps: any = isInternal(p.href)
                  ? { href: p.href as Route }
                  : { href: p.href || "#", target: p.href?.startsWith("http") ? "_blank" : undefined, rel: "noopener noreferrer" };

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
        <div className="container grid h-20 grid-cols-2 md:grid-cols-3 items-center gap-4">
          {/* Left: Logo / Brand */}
          <div className="flex md:justify-start">
            <Link href={"/" as Route} className="flex items-center gap-3" aria-label="Home">
              {LOGO_URL ? (
                <Image
                  src={LOGO_URL}
                  alt={BRAND_NAME}
                  width={240}
                  height={72}
                  className="h-12 w-auto md:h-14"
                  priority
                  sizes="(min-width: 768px) 240px, 180px"
                />
              ) : (
                <span className="font-display text-2xl md:text-3xl">{BRAND_NAME}</span>
              )}
            </Link>
          </div>

          {/* Center: Nav (desktop) */}
          <nav className="hidden md:flex items-center justify-center gap-6 subtext">
            {NAV_LINKS.map((n) =>
              isInternal(n.href) ? (
                <Link key={n.href} href={n.href as Route} className="subtext tracking-[1px]">
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

          {/* Right: Call (single number) + CTA (desktop) + Hamburger (mobile) */}
          <div className="flex justify-end items-center gap-3">
            {/* Call button (no modal) */}
            <a
              href={`tel:${tel}`}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-2 subtext hover:border-black/40 transition"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden md:inline">{PHONE}</span>
              <span className="md:hidden">Call</span>
            </a>

            {/* CTA — opens contact modal */}
            <button
              type="button"
              onClick={() => openContactModal()}
              className="hidden md:inline-flex btn btn-primary cursor-pointer"
            >
              {CTA_LABEL}
            </button>

            {/* Hamburger (mobile) */}
            <div className="md:hidden p-1 -mr-2" aria-controls="mobile-menu" aria-expanded={open}>
              <Hamburger toggled={open} toggle={setOpen} size={22} rounded distance="sm" label="Toggle menu" />
            </div>
          </div>
        </div>

        {/* Mobile menu (only page1, page2, contact) */}
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
              {MOBILE_LINKS.map((n) => {
                const item = (
                  <div className="px-4 py-3">
                    <span className="text-[13px] tracking-[2px] uppercase text-black/80">{n.label}</span>
                  </div>
                );
                return (
                  <li key={n.href}>
                    {isInternal(n.href) ? (
                      <Link href={n.href as Route} className="block w-full" onClick={() => setOpen(false)}>
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

            {/* Primary action — opens contact modal */}
            <div className="px-4 pt-4 ">
              <button
                type="button"
                className="btn btn-primary w-full cursor-pointer"
                onClick={() => {
                  setOpen(false); // close menu
                  openContactModal();
                }}
              >
                {CTA_LABEL}
              </button>
            </div>

            {/* Trust & contact card (centered) */}
            <div className="px-4 mt-4">
              <div className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur-sm p-4 ring-1 ring-black/5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-black/70" />
                  <div className="text-[13px] text-black/70">Trusted local renovations</div>
                </div>
                <ul className="mt-3 grid gap-1.5 text-[13px] text-black/70">
                  <li>Licensed & insured</li>
                  <li>Fair, upfront pricing</li>
                  <li>Quality workmanship</li>
                </ul>
                <div className="mt-4 grid gap-2">
                  <a
                    href={`tel:${tel}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm hover:border-black/40 transition"
                  >
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">{PHONE}</span>
                  </a>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm hover:border-black/40 transition"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="font-medium">{SUPPORT_EMAIL}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div className="px-4 pt-4">
              <div className="rounded-2xl border border-black/5 bg-black/[0.03] p-4 text-center">
                <p className="text-[13px] text-black/70 leading-relaxed">
                  Renovation • Repair • Maintenance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
