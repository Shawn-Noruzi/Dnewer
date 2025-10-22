// components/ShareButton.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as Lucide from "lucide-react";

type Props = {
  url: string;
  title: string;
  summary?: string;
  className?: string;
};

export default function ShareButton({ url, title, summary = "", className }: Props) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const share = useMemo(() => {
    const enc = encodeURIComponent;
    return {
      x: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${enc(url)}&title=${enc(title)}&summary=${enc(summary)}`
    };
  }, [url, title, summary]);

  function openModal() {
    setOpen(true);
    requestAnimationFrame(() => setVisible(true));
  }
  function closeModal() {
    setVisible(false);
    setTimeout(() => setOpen(false), 180);
  }

  useEffect(() => {
    function onEsc(e: KeyboardEvent) { if (e.key === "Escape") closeModal(); }
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      prompt("Copy link:", url);
    }
  }

  // Fallback helper: if a brand icon isn't available in this lucide version, use Share2
  const F = (icon: any) => (icon ? icon : Lucide.Share2);

  const tiles = [
    { href: share.x,        label: "X", Icon: F(Lucide.Twitter)  },
    { href: share.facebook, label: "Facebook",    Icon: F(Lucide.Facebook) },
    { href: share.linkedin, label: "LinkedIn",    Icon: F(Lucide.Linkedin) }
  ];

  return (
    <>
      <button
        onClick={openModal}
        className={className ?? "p-2 rounded-full hover:bg-black/5 cursor-pointer"}
        aria-label="Share"
        title="Share"
      >
        <Lucide.Share2 className="h-4 w-4 text-black/60" />
      </button>

      {open && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-150
            ${visible ? "bg-black/40 opacity-100" : "bg-black/0 opacity-0"}`}
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm rounded-2xl bg-white shadow-xl border border-black/10
              transition-all duration-150
              ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 pb-3">
              <div>
                <div className="text-xs uppercase tracking-wide text-black/50">Share</div>
                <div className="mt-1 font-semibold leading-snug text-black">{title}</div>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-full hover:bg-black/5 cursor-pointer" aria-label="Close">
                <Lucide.X className="h-4 w-4 text-black/60" />
              </button>
            </div>

            {/* Grid of networks */}
            <div className="grid grid-cols-3 gap-3 px-5 pb-2">
              {tiles.map(({ href, label, Icon }) => (
                <ShareTile key={label} href={href} label={label} Icon={Icon} />
              ))}
            </div>

            {/* Actions */}
            <div className="px-5 pb-5">
              <button
                onClick={copy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-black/5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Lucide.Check className="h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Lucide.Copy className="h-4 w-4 cursor-pointer" /> Copy link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---- helper ---- */
function ShareTile({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ElementType;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-1 rounded-xl border p-3 hover:bg-black/5 text-sm"
      aria-label={`Share to ${label}`}
      title={`Share to ${label}`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-[11px] text-black/70 text-center">{label}</span>
    </a>
  );
}
