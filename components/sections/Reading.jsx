"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { books } from "@/data/books";

const clean = (s = "") => s.replace(/\s+/g, " ").trim();

export default function Reading() {
  return (
    <section id="reading" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8">
      <SectionHeading index="07" kicker="Self-study" title="Reading" />

      <p className="mb-8 max-w-2xl text-[0.92rem] leading-relaxed text-ink-2">
        The machine learning and deep learning groundwork behind the work above —
        what I read, and what I took from each one.
      </p>

      <ul className="grid gap-4 md:grid-cols-2">
        {books.map((b, i) => (
          <motion.li
            key={b.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="panel flex h-full flex-col p-5 transition-colors hover:border-accent/35"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="num text-[0.68rem] text-muted">{b.year}</span>
              <span className="rounded border border-accent/35 bg-accent/10 px-2 py-0.5 font-mono text-[0.65rem] text-accent">
                {b.status}
              </span>
            </div>

            <h3 className="mt-2 text-[1.02rem] font-semibold leading-snug tracking-tight text-ink">
              {b.title}
            </h3>
            {b.edition && (
              <p className="mt-0.5 font-mono text-[0.68rem] text-muted">{b.edition}</p>
            )}
            <p className="mt-1.5 text-[0.8rem] text-ink-2">
              {b.authors.join(", ")}
              <span className="text-muted"> · {b.publisher}</span>
            </p>

            <p className="mt-3.5 flex-1 text-[0.86rem] leading-relaxed text-ink-2">
              {clean(b.note)}
            </p>

            <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-3.5">
              {b.topics.map((t) => (
                <li
                  key={t}
                  className="rounded border border-line bg-surface-2 px-2 py-0.5 font-mono text-[0.65rem] text-ink-2"
                >
                  {t}
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
