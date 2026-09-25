"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Modal from "@/components/ui/Modal";
import { blogData } from "@/data/blogs";

const clean = (s = "") => s.replace(/\s+/g, " ").trim();

export default function Certificates() {
  const [open, setOpen] = useState(null);

  return (
    <section id="certificates" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8">
      <SectionHeading index="07" kicker="Credentials" title="Certificates" />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {blogData.map((c, i) => (
          <motion.li
            key={`${c.id}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={() => setOpen(c)}
              className="panel group h-full w-full overflow-hidden text-left transition-colors hover:border-accent/35"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
                <Image
                  src={c.imgSrc}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 280px"
                  className="object-cover opacity-80 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, var(--color-surface) 4%, transparent 60%)",
                  }}
                />
              </div>
              <div className="p-4">
                <p className="num text-[0.68rem] text-muted">{c.date}</p>
                <h3 className="mt-1.5 text-[0.88rem] font-medium leading-snug text-ink">
                  {clean(c.title)}
                </h3>
                <p className="mt-2 font-mono text-[0.68rem] text-accent/80">
                  {clean(c.category)}
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
              <div className="relative aspect-[16/9] w-full bg-surface-2">
                <Image
                  src={open.imgSrc}
                  alt={clean(open.title)}
                  fill
                  sizes="(max-width: 768px) 92vw, 768px"
                  className="object-contain"
                />
              </div>
              <div className="border-t border-line p-5 sm:p-7">
                <p className="tag">
                  {clean(open.category)} <span className="text-accent/70">·</span> {open.date}
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
                {open.previewLink && (
                  <a
                    href={open.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded border border-accent/45 bg-accent/10 px-5 py-2.5 font-mono text-[0.8rem] text-accent transition-colors hover:bg-accent/20"
                  >
                    Verify credential
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M6 3h7v7M13 3L3.5 12.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </div>
            </>
          </Modal>
        )}
      </AnimatePresence>
    </section>
  );
}
