"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Modal from "@/components/ui/Modal";
import { awards } from "@/data/awards";

const clean = (s = "") => s.replace(/\s+/g, " ").trim();

export default function Awards() {
  const [open, setOpen] = useState(null);

  return (
    <section id="awards" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8">
      <SectionHeading index="04" kicker="Recognition" title="Awards" />

      <ul className="grid gap-4 md:grid-cols-2">
        {awards.map((a, i) => (
          <motion.li
            key={a.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={() => setOpen(a)}
              className="panel group h-full w-full overflow-hidden text-left transition-colors hover:border-accent/35"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
                {a.imgSrc ? (
                  <>
                    <Image
                      src={a.imgSrc}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 92vw, 45vw"
                      className="object-cover object-top opacity-85 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, var(--color-surface) 6%, transparent 55%)",
                      }}
                    />
                  </>
                ) : (
                  <div aria-hidden className="grid-plane absolute inset-0 grid place-items-center">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="text-accent/45">
                      <circle cx="12" cy="9" r="6" stroke="currentColor" strokeWidth="1.4" />
                      <path d="m8.5 14.5-1.2 7 4.7-2.6 4.7 2.6-1.2-7" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-5">
                <p className="num text-[0.68rem] text-muted">{a.date}</p>
                <h3 className="mt-1.5 text-[1.02rem] font-semibold leading-snug tracking-tight text-ink">
                  {a.title}
                </h3>
                <p className="mt-1.5 text-[0.82rem] text-ink-2">
                  {a.issuer}
                  {a.role && <span className="text-muted"> · {a.role}</span>}
                </p>
              </div>
            </button>
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {open && (
          <Modal label={clean(open.title)} onClose={() => setOpen(null)}>
            <>
              {open.imgSrc && (
                <div className="relative aspect-[4/3] w-full bg-surface-2">
                  <Image
                    src={open.imgSrc}
                    alt={clean(open.title)}
                    fill
                    sizes="(max-width: 768px) 92vw, 768px"
                    className="object-contain"
                  />
                </div>
              )}
              <div className="border-t border-line p-5 sm:p-7">
                <p className="tag">
                  {open.issuer} <span className="text-accent/70">·</span> {open.date}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">
                  {clean(open.title)}
                </h3>
                <div className="mt-4 space-y-3.5">
                  {open.desc.map((d, i) => (
                    <p key={i} className="text-[0.9rem] leading-relaxed text-ink-2">
                      {clean(d)}
                    </p>
                  ))}
                </div>
              </div>
            </>
          </Modal>
        )}
      </AnimatePresence>
    </section>
  );
}
