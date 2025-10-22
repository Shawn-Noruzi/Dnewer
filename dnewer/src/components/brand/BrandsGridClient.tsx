// components/brands/BrandsGridClient.tsx
'use client'

import Image from 'next/image'
import type { Route } from 'next'
import { useMemo, useState } from 'react'
import { clsx } from 'clsx'

type BrandItem = {
  _id: string
  title: string
  slug?: { current: string }
  category: 'frames' | 'lenses' | 'contacts' | 'other' | 'brands'
  website?: string
  description?: string
  logoUrl: string | null
  logoAlt?: string | null
  lensIsValue?: boolean
}

type ProductItem = {
  _id: string
  title: string
  slug?: { current: string }
  brand?: string
  price?: number
  compareAtPrice?: number
  packSize?: number
  thumbUrl: string | null
  thumbAlt?: string | null
}

const tabs = [
  { key: 'frames',   label: 'Frames' },
  { key: 'lenses',   label: 'Lenses' },
  { key: 'contacts', label: 'Contact Lenses' },
  { key: 'other',    label: 'Other Products' },
] as const

export default function BrandsGridClient({
  frameBrands,
  lensValueBrands,
  lensOtherBrands,
  contacts,
}: {
  frameBrands: BrandItem[]
  lensValueBrands: BrandItem[]
  lensOtherBrands: BrandItem[]
  contacts: ProductItem[]
}) {
  const [active, setActive] =
    useState<(typeof tabs)[number]['key']>('frames')

  const otherProducts = useMemo(
    () => frameBrands.filter(i => i.category === 'other'),
    [frameBrands]
  )

  // Lenses: pick a featured value brand for the split (left text / right image)
  const valueFeatured = lensValueBrands?.[0]
  const valueRest = lensValueBrands?.slice(1) ?? []

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-t-xl bg-black px-3 py-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={clsx(
              'px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors cursor-pointer',
              active === t.key
                ? 'bg-white text-black'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            )}
            aria-pressed={active === t.key}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-b-xl border border-neutral-200 overflow-hidden">
        {/* FRAMES (no descriptions) */}
        {active === 'frames' && (
          <LogoGrid items={frameBrands} />
        )}

        {/* LENSES — featured value split, then remaining value logos (with descriptions), then premium options (with descriptions) */}
        {active === 'lenses' && (
          <div className="p-4 sm:p-6 space-y-6">
            {/* Featured Value split */}
            {valueFeatured ? (
              <ValueSplit
                title={valueFeatured.title}
                description={valueFeatured.description}
                imageUrl={valueFeatured.logoUrl}
                imageAlt={valueFeatured.logoAlt || `${valueFeatured.title} logo`}
              />
            ) : null}

            {/* Remaining Value logos (if any) */}
            {valueRest?.length ? (
              <section className="rounded-2xl ">
                <div className="text-sm font-medium text-black mb-3">More value options</div>
                <LogoGrid items={valueRest} showDescriptions />
              </section>
            ) : null}

            {/* Premium options */}
            <section className="rounded-2xl ">
              <div className="text-sm font-medium text-black mb-3">Other premium options</div>
              <LogoGrid items={lensOtherBrands} showDescriptions />
            </section>
          </div>
        )}

        {/* CONTACT LENSES */}
        {active === 'contacts' && (
          <div className="p-4 sm:p-6">
            <ContactsShowcase items={contacts} />
          </div>
        )}

        {/* OTHER PRODUCTS (no descriptions) */}
        {active === 'other' && (
          <LogoGrid items={otherProducts} />
        )}
      </div>
    </div>
  )
}

/* ---------- Featured Value split: LEFT description (maintext), RIGHT image ---------- */
function ValueSplit({
  title,
  description,
  imageUrl,
  imageAlt,
}: {
  title?: string
  description?: string
  imageUrl?: string | null
  imageAlt?: string | null
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* LEFT: larger description */}
        <div className="p-5 sm:p-7">
          {title ? <h3 className="maintext font-semibold text-black">{title}</h3> : null}
          {description ? (
            <p className="mt-3 maintext text-black/80">{description}</p>
          ) : null}
        </div>

        {/* RIGHT: image/logo */}
        <div className="relative min-h-[220px] bg-neutral-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt || (title ? `${title} image` : 'Lenses')}
              fill
              className="object-contain p-6"
              sizes="(min-width:1024px) 50vw, 100vw"
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}

/* ---------- Shared: Non-clickable Logo grid --------- */
function LogoGrid({ items, showDescriptions = false }: { items: BrandItem[]; showDescriptions?: boolean }) {
  if (!items?.length) {
    return <div className="p-4 text-sm text-black/60">No items to display.</div>
  }

  const lgCols = Math.min(6, Math.max(1, items.length))
  return (
    <div
      className={clsx(
        'grid',
        'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
        'lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]'
      )}
      style={{ ['--cols' as any]: lgCols }}
    >
      {items.map((b) => (
        <div
          key={b._id}
          className={clsx(
            'flex flex-col items-center justify-center bg-white',
            'border border-neutral-200/80 -m-px',
            'transition hover:shadow-md hover:border-gold-400',
            'py-3 min-h-28'
          )}
          title={b.title}
        >
          <div className="relative">
            {b.logoUrl ? (
              <Image
                src={b.logoUrl}
                alt={b.logoAlt || `${b.title} logo`}
                width={128}
                height={64}
                sizes="128px"
                style={{ objectFit: 'contain', objectPosition: 'center' }}
                className="p-2"
              />
            ) : (
              <div className="h-[64px] w-[128px] flex items-center justify-center maintext text-black">
                {b.title}
              </div>
            )}
          </div>

          {/* Only show descriptions when explicitly requested (we do this for Lenses tab) */}
          {showDescriptions && b.description ? (
            <div className="mt-2 px-3 text-center text-[11px] leading-snug text-black/70 line-clamp-2">
              {b.description}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

/* ---------- Contacts: Products grid ---------- */
function ContactsShowcase({ items }: { items: ProductItem[] }) {
  if (!items?.length) return <div className="p-4">No contact lenses yet.</div>

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((p) => {
        const href = p.slug?.current ? (`/product/${p.slug.current}` as Route<`/product/${string}`>) : '#'
        const hasCompare = p.compareAtPrice && p.compareAtPrice > (p.price ?? 0)

        return (
          <a
            key={p._id}
            href={href}
            className={clsx(
              'group block rounded-xl border bg-white p-3 shadow-sm transition-all',
              'hover:border-gold-400 hover:shadow-lg',
              'border-neutral-200'
            )}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-50">
              {p.thumbUrl ? (
                <Image
                  src={p.thumbUrl}
                  alt={p.thumbAlt || p.title}
                  fill
                  sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                  className="object-contain p-3 transition-transform duration-200 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-black/40">
                  No image
                </div>
              )}
            </div>

            <div className="mt-3">
              <div className="text-xs uppercase tracking-wide text-black/50">
                {p.brand}
              </div>
              <div className="mt-0.5 text-sm text-black">
                {p.title}
              </div>

              <div className="mt-1 flex items-center gap-2">
                {hasCompare && (
                  <span className="text-xs text-black/40 line-through">
                    ${p.compareAtPrice!.toFixed(2)}
                  </span>
                )}
                <span className="text-sm font-semibold text-black">
                  ${Number(p.price ?? 0).toFixed(2)}{p.packSize ? ` / ${p.packSize} pack` : ''}
                </span>
              </div>
            </div>
          </a>
        )
      })}
    </div>
  )
}
