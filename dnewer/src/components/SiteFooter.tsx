import Link from "next/link";
import type { Route } from "next";
import { Phone, Mail } from "lucide-react";
import { sanity } from "@/lib/sanity";
import clsx from "clsx";

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
      line1?: string; line2?: string;
      city?: string; province?: string;
      postalCode?: string; country?: string;
    };
  }[];
  social?: { label?: string; href?: string }[];
  legal?: { label?: string; href?: string }[];
};

const query = /* groq */ `
*[_type=="footerSettings"][0]{
  brandName, tagline,
  quickLinks[]{label,href},
  locations[]{name,phone,email,href, address{line1,line2,city,province,postalCode,country}},
  social[]{label,href},
  legal[]{label,href}
}
`;

function isInternal(href?: string): href is `/${string}` {
  return !!href && href.startsWith("/");
}

export default async function SiteFooter() {
  const d = await sanity.fetch<FooterDoc>(query, {}, { next: { revalidate: 0 } });

  const brandName = d?.brandName ?? "Factory Optical (1980) Ltd.";
  const tagline   = d?.tagline   ?? "Quality eyewear, advanced exams, and friendly experts.";
  const quick     = d?.quickLinks ?? [];
  const locs      = (d?.locations ?? []).filter(Boolean);
  const social    = d?.social ?? [];
  const legal     = d?.legal  ?? [];

  // 2-col layout for locations if many items
  const locationsListClass = clsx(
    "mt-3",
    locs.length >= 3 ? "grid grid-cols-2 gap-4" : "space-y-3"
  );

  return (
    <footer className="relative bg-black text-white -mt-[210px] -z-[1] pt-[240px]">
      <div className="container py-12 grid gap-10 md:grid-cols-4">
        {/* Brand + tagline ONLY (address removed) */}
        <div>
          <div className="font-display text-lg text-white">{brandName}</div>
          <p className="mt-2 text-sm text-white/70">{tagline}</p>
        </div>

        {/* Quick Links */}
        <div>
          <div className="font-medium text-white">Quick links</div>
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

        {/* Locations — each shows name, address, phone (and email if provided) */}
        <div className="min-w-0">
          <div className="font-medium text-white">Locations</div>
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
                      {l.phone ? (
                        <div className="mt-1 flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{l.phone}</span>
                        </div>
                      ) : null}
                      {l.email ? (
                        <div className="mt-1 flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5" />
                          <a href={`mailto:${l.email}`} className="underline">{l.email}</a>
                        </div>
                      ) : null}
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

        {/* Social / Legal */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="font-medium text-white">Social</div>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {social.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.href || "#"}
                    className="hover:underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-medium text-white">Legal</div>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {legal.map((l, i) => (
                <li key={i}>
                  {isInternal(l.href) ? (
                    <Link href={l.href as Route<string>} className="hover:underline">
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      href={l.href || "#"}
                      className="hover:underline"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-white/60">
        © {new Date().getFullYear()} {brandName}. All rights reserved.
      </div>
    </footer>
  );
}
