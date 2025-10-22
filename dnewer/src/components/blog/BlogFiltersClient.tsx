// components/blog/BlogFiltersClient.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { clsx } from "clsx"

const tabs = [
  { key: "new", label: "New" },
  { key: "views", label: "Most viewed" },
  { key: "trending", label: "Trending" },
] as const

export default function BlogFiltersClient({ current }: { current: string }) {
  const router = useRouter()
  const sp = useSearchParams()

  const setSort = (key: string) => {
    const params = new URLSearchParams(sp?.toString() || "")
    params.set("sort", key)
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 rounded-full border border-neutral-200 p-1 bg-white">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => setSort(t.key)}
          className={clsx(
            "px-3 py-1.5 rounded-full text-sm transition-colors",
            current === t.key
              ? "bg-black text-white"
              : "text-black hover:bg-black/5"
          )}
          aria-pressed={current === t.key}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
