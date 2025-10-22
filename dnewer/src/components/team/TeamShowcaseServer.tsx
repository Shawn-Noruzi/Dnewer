import Image from "next/image";
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage";

type Member = {
  _id: string;
  name: string;
  role?: string;
  photo?: { alt?: string } | any; // alt supported if present
};

type SectionDoc = {
  title?: string;
  members?: Member[];
};

const query = /* groq */ `
*[_type=="teamCarouselSection"][0]{
  title,
  members[]->{
    _id,
    name,
    role,
    // pull authored alt if available on teamMember.photo
    photo{..., "alt": coalesce(alt, "")}
  }
}
`;

export default async function TeamShowcaseServer({ limit = 10 }: { limit?: number }) {
  const d = await sanity.fetch<SectionDoc>(query, {}, { next: { revalidate: 0 } });
  const title = d?.title ?? "Our Team";
  const items = (d?.members ?? []).filter(Boolean).slice(0, limit);

  if (items.length === 0) return null;

  return (
    <section id="team" className="section">
      <div className="container">
        {/* Section title from CMS */}
        <header className="mb-6">
          <h2 className="font-display subtitle text-black">{title}</h2>
        </header>

        {/* Uniform grid: 2 / 3 / 5 per row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {items.map((m, i) => {
            const img = m.photo
              ? urlFor(m.photo)
                  .width(900)      // good balance for 1/5 width desktop
                  .height(1125)    // 4:5 portrait
                  .fit("crop")
                  .auto("format")
                  .url()
              : undefined;

            const alt =
              (m.photo?.alt as string) ||
              (m.role ? `${m.name}, ${m.role}` : `${m.name} headshot`);

            return (
              <article
                key={m._id}
                className="overflow-hidden rounded-2xl border border-black/10 bg-white"
              >
                {/* Image on top */}
                <div className="relative aspect-[4/5] w-full bg-neutral-100">
                  {img ? (
                    <Image
                      src={img}
                      alt={alt}
                      fill
                      className="object-cover"
                      sizes="(min-width:1024px) 20vw, (min-width:768px) 30vw, 45vw"
                      // prioritize first row a bit for snappier paint
                      priority={i < 5}
                    />
                  ) : null}
                </div>

                {/* Name + role below */}
                <div className="p-3">
                  <div className="maintext font-semibold text-black line-clamp-1">
                    {m.name}
                  </div>
                  {m.role ? (
                    <div className="text-sm text-black/70 line-clamp-1">
                      {m.role}
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
