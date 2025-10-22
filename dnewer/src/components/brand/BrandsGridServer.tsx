import { sanity } from '@/lib/sanity'
import { urlFor } from '@/sanity/lib/sanityImage'
import BrandsGridClient from './BrandsGridClient'

type Brand = {
  _id: string
  title: string
  slug?: { current: string }
  logo?: { alt?: string } | any
  category: 'frames' | 'lenses' | 'contacts' | 'other' | 'brands' // legacy 'brands' supported
  website?: string
  description?: string
  // NEW: simple value toggle for lenses
  lensIsValue?: boolean
}

type Product = {
  _id: string
  title: string
  slug?: { current: string }
  brand?: string
  price?: number
  compareAtPrice?: number
  packSize?: number
  thumbnail?: any
}

const brandsQuery = /* groq */ `
*[_type=="brand"] | order(title asc){
  _id, title, slug,
  logo{..., "alt": coalesce(alt, "")},
  category, website, description,
  lensIsValue
}
`

const contactsQuery = /* groq */ `
*[_type=="product" && category=="contacts"] | order(title asc){
  _id, title, slug, brand, price, compareAtPrice, packSize,
  thumbnail{asset->{"url": url}, "alt": coalesce(alt, "")}
}
`

export const dynamic = 'force-dynamic'

export default async function BrandsGridServer() {
  const [brands, contacts] = await Promise.all([
    sanity.fetch<Brand[]>(brandsQuery, {}, { next: { revalidate: 0 } }),
    sanity.fetch<Product[]>(contactsQuery, {}, { next: { revalidate: 0 } }),
  ])

  const withMappedMedia = (b: Brand) => ({
    ...b,
    // merge legacy "brands" into "frames"
    category: (b.category === 'brands' ? 'frames' : b.category) as Brand['category'],
    logoUrl: b.logo
      ? urlFor(b.logo)
          .ignoreImageParams()
          .width(320)
          .height(160)
          .fit('max')
          .auto('format')
          .url()
      : null,
    logoAlt: (b.logo?.alt as string) || `${b.title} logo`,
  })

  const mappedBrands = (brands || []).map(withMappedMedia)

  // Frames (non-clickable logos)
  const frameBrands = mappedBrands.filter(b => b.category === 'frames')

  // Lenses split: value vs other
  const lensBrands = mappedBrands.filter(b => b.category === 'lenses')
  const valueLensBrands = lensBrands.filter(b => b.lensIsValue)
  const otherLensBrands = lensBrands.filter(b => !b.lensIsValue)

  const contactItems = (contacts || []).map(p => ({
    ...p,
    thumbUrl: p.thumbnail?.asset?.url ?? null,
    thumbAlt: p.thumbnail?.alt || `${p.title} product image`,
  }))

  return (
    <section className="section">
      <div className="container">
        <BrandsGridClient
          frameBrands={frameBrands}
          lensValueBrands={valueLensBrands}
          lensOtherBrands={otherLensBrands}
          contacts={contactItems}
        />
      </div>
    </section>
  )
}
