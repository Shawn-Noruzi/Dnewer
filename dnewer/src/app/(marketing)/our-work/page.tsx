// app/gallery/page.tsx
import fs from "node:fs";
import path from "node:path";
import GalleryGrid from "@/components/GalleryGrid";
import ContactCtaBanner from "@/components/ContactCTABanner";

export const metadata = {
  title: "Gallery | Dnewer",
  description:
    "A showcase of Dnewer’s commercial and residential renovations: kitchens, bathrooms, decks, tiling, painting, landscaping, and more.",
};

export default function GalleryPage() {
  const galleryDir = path.join(process.cwd(), "public", "gallery");
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(galleryDir, { withFileTypes: true })
      .filter((d) => d.isFile() && /\.(png|jpe?g|webp|gif|avif)$/i.test(d.name))
      .map((d) => `/gallery/${d.name}`);
  } catch {
    files = [];
  }

  return (
    <main className="relative">
      {/* ===== Brand Banner (matched styling) ===== */}
      <section className="relative overflow-hidden mt-20">
        <div
          className="relative"
          style={{
            background:
              "linear-gradient(140deg, #F97316 0%, #fb8b3c 40%, #ffb27d 100%)",
          }}
        >
          {/* subtle pattern */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(white 1px, transparent 1px), radial-gradient(white 1px, transparent 1px)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0, 8px 8px",
              mixBlendMode: "overlay",
            }}
          />

          {/* angled sheen */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-0 h-[200%] w-[60%] rotate-12 bg-white/10 blur-2xl"
          />

          <div className="container relative py-20 md:py-28 text-center text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-semibold backdrop-blur">
              Our Work
            </span>
            <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
              Renovations That <span className="font-semibold">Elevate Your Space</span>
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-white/90">
              Commercial & residential projects across the Lower Mainland and Fraser Valley —
              kitchens, bathrooms, decks, tiling, painting, landscaping, and more.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Grid ===== */}
      <section className="container py-10 md:py-14">
        <GalleryGrid images={files} navOffset={120} />
      </section>

      <ContactCtaBanner />
    </main>
  );
}
