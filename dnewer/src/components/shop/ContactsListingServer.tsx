import ContactsGridClient from "./ContactsGridClient";
import { sanity } from "@/lib/sanity";

type Product = {
  _id: string;
  title: string;
  slug?: { current: string };
  brand?: string;
  price?: number;
  compareAtPrice?: number;
  packSize?: number;         // NEW
  // we pass a prebuilt image url + alt from GROQ for speed
  thumbUrl?: string | null;
  thumbAlt?: string | null;  // NEW
};

const query = /* groq */ `
{
  // unique brands for filter
  "brands": array::unique(*[_type=="product" && category=="contacts" && defined(brand)].brand) | order(@ asc),

  // minimal product card data
  "products": *[_type=="product" && category=="contacts"] | order(title asc){
    _id,
    title,
    slug,
    brand,
    price,
    compareAtPrice,
    packSize,                                   // NEW
    "thumbUrl": coalesce(thumbnail.asset->url, null),
    "thumbAlt": coalesce(thumbnail.alt, null)   // NEW
  }
}
`;

export default async function ContactsListingServer() {
  const { products, brands } = await sanity.fetch<{ products: Product[]; brands: string[] }>(
    query,
    {},
    { next: { revalidate: 0 } }
  );

  return (
    <section className="section">
      <div className="container">
        <div className="grid md:grid-cols-[240px_1fr] gap-8 mt-10 md:mt-30">
          <ContactsGridClient initialProducts={products} allBrands={brands} />
        </div>
      </div>
    </section>
  );
}
