"use client";

export default function CopyLinkButton({ url }: { url: string }) {
  return (
    <button
      onClick={async () => {
        try { await navigator.clipboard.writeText(url); } catch {}
      }}
      className="inline-flex cursor-pointer h-8 w-8 items-center justify-center rounded-full border border-neutral-300 hover:bg-black/5"
      aria-label="Copy link"
      type="button"
    >
      <span className="text-xs font-medium">⧉</span>
    </button>
  );
}