import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { Phone, Mail } from "lucide-react";
import clsx from "clsx";

/* ----------------------------- Types ----------------------------- */
type FooterDoc = {
  brandName?: string;
  tagline?: string;
  quickLinks?: { label?: string; href?: string }[];
  locations?: {
    name?: string;
    phone?: string;
    email?: string;
    href?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      province?: string;
      postalCode?: string;
      country?: string;
    };
  }[];
  social?: { label?: string; href?: string }[];
  legal?: { label?: string; href?: string }[];
};

/* -------------------------- Static Content -------------------------- */
const STATIC_FOOTER: FooterDoc = {
  brandName: "Dnewer Services Ltd.",
  tagline: "Renovations, Construction, and Home Improvements.",

  quickLinks: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Our Work", href: "/our-work" },
  ],

  locations: [
    {
      phone: "(604) 446-9332",
      email: "Dnewer@hotmail.com",
      href: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        province: "",
        postalCode: "",
        country: "",
      },
    },
  ],

  social: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Facebook", href: "https://facebook.com/" },
    { label: "TikTok", href: "https://tiktok.com/" },
  ],

  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

/* -------------------------- Helper -------------------------- */
function isInternal(href?: string): href is `/${string}` {
  return !!href && href.startsWith("/");
}

/* -------------------------- Assets -------------------------- */
const FOOTER_LOGO_SRC = "/footerlogo.png"; // public/footerlogo.png

/* -------------------------- Component -------------------------- */
export default function SiteFooter() {
  const d = STATIC_FOOTER;

  const brandName = d.brandName ?? "";
  const tagline = d.tagline ?? "";
  const quick = d.quickLinks ?? [];
  const locs = (d.locations ?? []).filter(Boolean);
  const social = d.social ?? [];
  const legal = d.legal ?? [];

  const locationsListClass = clsx(
    "mt-3",
    locs.length >= 3 ? "grid grid-cols-2 gap-4" : "space-y-3"
  );

  return (
    <footer className="relative bg-black text-white -mt-60 -z-1 pt-60">
      <div className="container py-12 grid gap-10 md:grid-cols-4">
        {/* ---------- Brand ---------- */}
        <div>
          <div className="font-display text-lg text-white">{brandName}</div>
          <p className="mt-2 text-sm text-white/70">{tagline}</p>
        </div>

        {/* ---------- Quick Links ---------- */}
        <div>
          <div className="font-medium text-white">Quick Links</div>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {quick.map((q, i) => (
              <li key={i}>
                {isInternal(q.href) ? (
                  <Link href={q.href as Route<string>} className="hover:underline">
                    {q.label}
                  </Link>
                ) : (
                  <a
                    href={q.href || "#"}
                    className="hover:underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {q.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- Locations / Contact ---------- */}
        <div className="min-w-0">
          <div className="font-medium text-white">Contact</div>

          {locs.length === 0 ? (
            <div className="mt-3 text-sm text-white/60">No locations yet.</div>
          ) : (
            <ul className={locationsListClass}>
              {locs.map((l, i) => {
                const addr = l.address || {};
                const addressLines = [
                  addr.line1,
                  addr.line2,
                  [addr.city, addr.province].filter(Boolean).join(", "),
                  addr.postalCode,
                  addr.country,
                ].filter(Boolean);

                const content = (
                  <div>
                    <div className="text-sm font-medium text-white">{l.name}</div>

                    <div className="mt-1 text-[13px] leading-snug text-white/80">
                      {addressLines.map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))}

                      {l.phone && (
                        <div className="mt-1 flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{l.phone}</span>
                        </div>
                      )}

                      {l.email && (
                        <div className="mt-1 flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5" />
                          <a href={`mailto:${l.email}`} className="underline">
                            {l.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );

                return (
                  <li key={i} className="text-white/80">
                    {isInternal(l.href) ? (
                      <Link href={l.href as Route<string>} className="hover:underline">
                        {content}
                      </Link>
                    ) : l.href ? (
                      <a
                        href={l.href}
                        className="hover:underline"
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ---------- Right Logo ---------- */}
        <div className="flex items-start justify-center md:justify-end">
          <Link href="/" aria-label="Dnewer home">
            <Image
              src={FOOTER_LOGO_SRC}
              alt="Dnewer logo"
              width={220}
              height={80}
              sizes="(max-width: 768px) 160px, 220px"
              className="h-auto w-[160px] md:w-[220px] opacity-90 hover:opacity-100 transition-opacity duration-200"
              priority={false}
            />
          </Link>
        </div>
      </div>

      {/* ---------- Bottom Bar ---------- */}
      <div className="border-t border-white/10 py-4 text-center text-sm text-white/60">
        © {new Date().getFullYear()} {brandName}. All rights reserved.
      </div>
    </footer>
  );
}
