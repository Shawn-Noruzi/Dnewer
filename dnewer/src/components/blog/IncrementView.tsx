// components/blog/IncrementView.tsx
"use client";

import { useEffect } from "react";

export default function IncrementView({ slug }: { slug: string }) {
  useEffect(() => {
    // fire-and-forget; ignore errors to keep UX snappy
    fetch("/api/blog/increment-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      keepalive: true, // still sends if user navigates away quickly
    }).catch(() => {});
  }, [slug]);

  return null;
}
