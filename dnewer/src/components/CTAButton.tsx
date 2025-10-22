// components/CTAButton.tsx
import Link from "next/link";
import type { Route } from "next";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "ghost";

type InternalHref = Route<string>;
type ExternalHref = `http${string}` | `mailto:${string}` | `tel:${string}` | `#${string}`;

type Props = {
  href: InternalHref | ExternalHref | string; // accept string, we’ll narrow at runtime
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

export function CTAButton({ href, variant = "primary", className, children }: Props) {
  const classes = clsx("btn", variantClass[variant], className);
  const isInternal = typeof href === "string" && href.startsWith("/");

  // Internal → Next.js <Link> with Route typing
  if (isInternal) {
    return (
      <Link href={href as InternalHref} className={classes}>
        {children}
      </Link>
    );
  }

  // External / hash / mailto / tel → <a>
  return (
    <a
      href={href}
      // open http(s) in new tab; keep mailto/tel/hash same tab
      target={typeof href === "string" && href.startsWith("http") ? "_blank" : undefined}
      rel={typeof href === "string" && href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={classes}
    >
      {children}
    </a>
  );
}
