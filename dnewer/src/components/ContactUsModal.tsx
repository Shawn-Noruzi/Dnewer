"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, Mail, Phone, User, MessageSquare } from "lucide-react";

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

type ContactModalContext = {
  openContactModal: (prefill?: Partial<ContactPayload>) => void;
  closeContactModal: () => void;
};

const ContactModalCtx = createContext<ContactModalContext | null>(null);

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<Partial<ContactPayload>>({});

  const openContactModal = useCallback((p?: Partial<ContactPayload>) => {
    if (p) setPrefill(p);
    setIsOpen(true);
  }, []);

  const closeContactModal = useCallback(() => setIsOpen(false), []);

  const ctx = useMemo(() => ({ openContactModal, closeContactModal }), [openContactModal, closeContactModal]);

  return (
    <ContactModalCtx.Provider value={ctx}>
      {children}
      <ContactUsModal isOpen={isOpen} onClose={closeContactModal} prefill={prefill} />
    </ContactModalCtx.Provider>
  );
}

export function useContactModal() {
  const ctx = useContext(ContactModalCtx);
  if (!ctx) throw new Error("useContactModal must be used within <ContactModalProvider>");
  return ctx;
}

/* ---------- Actual Modal UI ---------- */

function inputBase() {
  // Dimmed placeholders + focus ring
  return "w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-[15px] outline-none focus:ring-2 focus:ring-gold-600 placeholder:text-black/40";
}

// Animations
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } },
};

const fieldsContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const fieldItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
};

export function ContactUsModal({
  isOpen,
  onClose,
  prefill,
}: {
  isOpen: boolean;
  onClose: () => void;
  prefill?: Partial<ContactPayload>;
}) {
  const [form, setForm] = useState<ContactPayload>({
    name: prefill?.name ?? "",
    email: prefill?.email ?? "",
    phone: prefill?.phone ?? "",
    message: prefill?.message ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<null | "success" | "error">(null);
  const [err, setErr] = useState<string | null>(null);

  // keep prefill updated if prop changes while closed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => {
    if (!isOpen && prefill) {
      setForm((f) => ({ ...f, ...prefill }));
    }
  }, [prefill, isOpen]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setOk(null);
    setErr(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setOk("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (e: any) {
      setOk("error");
      setErr(e?.message || "Failed to send.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-[2px]"
          aria-modal="true"
          role="dialog"
        >
          <div className="container h-full flex items-center justify-center">
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-0 shadow-xl overflow-hidden"
            >
              {/* Full-bleed brand banner */}
              <motion.div
                variants={headerVariants}
                initial="hidden"
                animate="show"
                className="relative -mx-0 -mt-0 rounded-t-2xl bg-gradient-to-r from-gold-600 to-gold-400 px-6 py-4 text-white"
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-[13px] tracking-wide uppercase/5">Contact Dnewer</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-white/90 hover:bg-white/15 cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <motion.h3
                  variants={headerVariants}
                  className="mt-2 font-display text-2xl leading-tight drop-shadow-sm"
                >
                  Let’s talk about your project
                </motion.h3>
                <motion.p variants={headerVariants} className="text-white/90 text-sm">
                  We’ll get back within one business day.
                </motion.p>
              </motion.div>

              {/* Body */}
              <div className="p-6">
                {/* Form */}
                <motion.form
                  onSubmit={submit}
                  className="mt-2 space-y-3"
                  variants={fieldsContainer}
                  initial="hidden"
                  animate="show"
                >
                  <motion.label className="block" variants={fieldItem}>
                    <span className="mb-1 flex items-center gap-2 text-sm font-medium text-black/80">
                      <User className="h-4 w-4" /> Name
                    </span>
                    <input
                      className={inputBase()}
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Your full name"
                    />
                  </motion.label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <motion.label className="block" variants={fieldItem}>
                      <span className="mb-1 flex items-center gap-2 text-sm font-medium text-black/80">
                        <Mail className="h-4 w-4" /> Email
                      </span>
                      <input
                        type="email"
                        required
                        className={inputBase()}
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com"
                      />
                    </motion.label>
                    <motion.label className="block" variants={fieldItem}>
                      <span className="mb-1 flex items-center gap-2 text-sm font-medium text-black/80">
                        <Phone className="h-4 w-4" /> Phone (optional)
                      </span>
                      <input
                        className={inputBase()}
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="604-xxx-xxxx"
                      />
                    </motion.label>
                  </div>

                  <motion.label className="block" variants={fieldItem}>
                    <span className="mb-1 flex items-center gap-2 text-sm font-medium text-black/80">
                      <MessageSquare className="h-4 w-4" /> Project details
                    </span>
                    <textarea
                      required
                      rows={5}
                      className={inputBase()}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us about your renovation, budget, and timeline…"
                    />
                  </motion.label>

                  {/* Actions */}
                  <motion.div
                    variants={fieldItem}
                    className="mt-4 flex items-center justify-between"
                  >
                    <a
                      href="tel:604-446-9332"
                      className="text-sm underline text-black/70 cursor-pointer"
                    >
                      or call 604-446-9332
                    </a>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-secondary min-w-[150px] cursor-pointer"
                    >
                      {submitting ? "Sending…" : "Send Request"}
                    </button>
                  </motion.div>

                  {/* Status */}
                  <AnimatePresence>
                    {ok === "success" && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="mt-3 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-[13px] text-green-800"
                      >
                        Thanks! Your message has been sent.
                      </motion.div>
                    )}
                    {ok === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-800"
                      >
                        Something went wrong. {err ?? "Please try again."}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
