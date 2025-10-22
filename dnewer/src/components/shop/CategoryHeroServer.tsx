import Image from "next/image";
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/sanityImage";

type Doc = {
  title?: string;
  subtitle?: string;
  image?: any;
};

const query = /* groq */ `
*[_type=="categoryHero" && slug.current == $slug][0]{title, subtitle, image}
`;

export default async function CategoryHeroServer({ slug = "contact-lenses" }: { slug?: string }) {
  const d = await sanity.fetch<Doc>(query, { slug }, { next: { revalidate: 0 } });

  const imgSrc =
    d?.image
      ? urlFor(d.image).width(2000).height(1400).url()
      : "/images/category-contacts.jpg";

  return (
    <section
      id="contactLenses"
      className="
        scroll-mt-24 relative w-full overflow-hidden
        bg-gradient-to-br from-gold-200 to-gold-300
      "
    >
      {/* Mobile: 2 rows (text / image) in a fixed 460px box.
          Desktop: 2 cols (text | image) with the same min height. */}
      <div
        className="
          grid
          h-[460px] grid-rows-2
          md:h-auto md:min-h-[460px] md:grid-rows-1 md:grid-cols-2
        "
      >
        {/* Text */}
        <div className="flex items-center justify-center px-6 py-6 md:py-0">
          <div className="w-full max-w-2xl">
            <h1 className="font-display title text-black text-center">
              {d?.title ?? "Contact Lenses"}
            </h1>
            {d?.subtitle ? (
              <p className="mt-3 text-black/70 text-center md:text-left">{d.subtitle}</p>
            ) : null}
          </div>
        </div>

        {/* Image */}
        <div className="relative h-full md:h-auto">
          <Image
            src={imgSrc}
            alt={d?.title ?? "Category image"}
            fill
            priority
            className="object-cover"
            sizes="(min-width:1024px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
