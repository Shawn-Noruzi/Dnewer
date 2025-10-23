// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter, Montserrat } from "next/font/google";
import { ContactModalProvider } from "@/components/ContactUsModal";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["500", "600", "700", "800"],
});


function getBaseUrl() {
  // Prefer your public site URL in prod; fall back to localhost in dev
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (fromEnv) return fromEnv;
  return process.env.NODE_ENV === "production"
    ? "https://example.com"
    : "http://localhost:3000";
}

export const metadata: Metadata = {
  // 👇 The important bit
  metadataBase: new URL(getBaseUrl()),

  // Optional sensible defaults
  title: {
    default: "Factory Optical",
    template: "%s · Factory Optical",
  },
  description:
    "Quality eyewear, advanced exams, and friendly experts.",
  alternates: {
    canonical: "/", // resolves to absolute using metadataBase
  },
  openGraph: {
    siteName: "Factory Optical",
    type: "website",
    url: "/", // relative is fine; will resolve
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body min-h-screen flex flex-col">
        <ContactModalProvider>
          {children}
        </ContactModalProvider>
      </body>
    </html>
  );
}
