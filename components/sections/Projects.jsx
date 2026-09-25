"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Modal from "@/components/ui/Modal";
import { portfolioData, filterButtons } from "@/data/portfolioData";

/* Categorical slots from the validated palette. Every chip also carries its
   label, so hue never carries the meaning on its own. */
const TAG_COLOR = {
  Python: "var(--color-s1)",
  SQL: "var(--color-s2)",
  "Power BI": "var(--color-s3)",
  Excel: "var(--color-s4)",
  Tableau: "var(--color-s5)",
  HTML: "var(--color-s5)",
  "In Progress": "var(--color-muted)",
};

const colorFor = (t) => TAG_COLOR[t] ?? "var(--color-muted)";
const clean = (s = "") => s.replace(/\s+/g, " ").trim();

function Chip({ label, subtle }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[0.65rem] ${
        subtle ? "border-line text-muted" : "border-line bg-surface-2 text-ink-2"
      }`}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-[1px]"
        style={{ background: colorFor(label) }}
      />
      {label}
    </span>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <Modal label={clean(project.title)} onClose={onClose}>
      <>
        <div className="relative aspect-[16/8] w-full bg-surface-2">
          <Image
            src={project.imgSrc}
            alt={clean(project.title)}
            fill
            sizes="(max-width: 768px) 92vw, 768px"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, var(--color-surface), transparent 60%)" }}
          />
        </div>

        <div className="p-5 sm:p-7">
          <p className="tag">{clean(project.project)}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
            {clean(project.title)}
          </h3>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.languages.map((l) => (
              <Chip key={l} label={l} />
            ))}
          </div>

          <div className="mt-6 space-y-3.5">
            {project.desc.map((d, i) => (
              <p key={i} className="text-[0.9rem] leading-relaxed text-ink-2">
                {clean(d)}
              </p>
            ))}
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-3">
            <Meta label="Client" value={project.client} />
            <Meta label="Type" value={clean(project.project)} />
            <Meta label="Stack" value={project.languages.join(", ")} />
          </dl>

          {project.previewLink || project.repoLink ? (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {project.previewLink && (
                <a
                  href={project.previewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded bg-accent px-5 py-2.5 font-mono text-[0.8rem] font-medium text-black transition-transform hover:-translate-y-0.5"
                >
                  {project.previewLabel || "Open project"}
                  <ArrowOut />
                </a>
              )}
              {project.repoLink && (
                <a
                  href={project.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded border border-accent/45 bg-accent/10 px-5 py-2.5 font-mono text-[0.8rem] text-accent transition-colors hover:bg-accent/20"
                >
                  View code
                  <ArrowOut />
                </a>
              )}
            </div>
          ) : (
            <p className="mt-6 inline-block rounded border border-line px-4 py-2 font-mono text-[0.75rem] text-muted">
              Work in progress — no public link yet
            </p>
          )}
        </div>
      </>
    </Modal>
  );
}

function ArrowOut() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M6 3h7v7M13 3L3.5 12.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Meta({ label, value }) {
  return (
    <div className="bg-surface px-3.5 py-3">
      <dt className="tag">{label}</dt>
      <dd className="mt-1 font-mono text-[0.75rem] leading-snug text-ink-2">{value}</dd>
    </div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);

  const visible = useMemo(
    () =>
      filter === "All"
        ? portfolioData
        : portfolioData.filter((p) => p.category.includes(filter)),
    [filter]
  );

  return (
    <section
      id="projects"
      className="relative scroll-mt-20 border-y border-line bg-surface/30 py-20"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="05" kicker="Selected work" title="Projects" />

        <div className="mb-8 flex flex-wrap items-center gap-2">
          {filterButtons.map((b) => {
            const isActive = filter === b.text;
            const count =
              b.text === "All"
                ? portfolioData.length
                : portfolioData.filter((p) => p.category.includes(b.text)).length;
            if (count === 0) return null;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setFilter(b.text)}
                aria-pressed={isActive}
                className={`rounded border px-3.5 py-1.5 font-mono text-[0.76rem] transition-colors ${
                  isActive
                    ? "border-accent/50 bg-accent/12 text-accent"
                    : "border-line text-muted hover:border-line hover:text-ink-2"
                }`}
              >
                {b.text}
                <span className="ml-1.5 opacity-55">{count}</span>
              </button>
            );
          })}
        </div>

        <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(p)}
                  className="panel group h-full w-full overflow-hidden text-left transition-colors hover:border-accent/35"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
                    <Image
                      src={p.imgSrc}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 360px"
                      className="object-cover opacity-85 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, var(--color-surface) 4%, transparent 55%)",
                      }}
                    />
                    <span className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      {p.category.map((c) => (
                        <Chip key={c} label={c} />
                      ))}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="text-[0.95rem] font-medium leading-snug text-ink">
                      {clean(p.title)}
                    </h3>
                    <p className="mt-1.5 font-mono text-[0.72rem] text-muted">
                      {clean(p.subtitle)}
                    </p>
                    <span className="mt-3.5 inline-flex items-center gap-1.5 font-mono text-[0.72rem] text-accent opacity-0 transition-opacity group-hover:opacity-100">
                      Read case
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      <AnimatePresence>
        {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}
