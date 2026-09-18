"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { skillData } from "@/data/skills";
import { knoledges } from "@/data/knoledges";
import { items as capabilities } from "@/data/jobFeatures";

function SkillMeter({ title, progress, delay }) {
  return (
    <li className="group">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="font-mono text-[0.85rem] text-ink">{title}</span>
        <span className="num text-[0.78rem] text-muted">{progress}</span>
      </div>
      {/* Track is a dim step of the fill's own hue — state reads across the whole bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-accent/12">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </li>
  );
}

export default function Stack() {
  const rail = [...knoledges, ...knoledges];

  return (
    <section id="stack" className="relative scroll-mt-20 border-y border-line bg-surface/30 py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="02" kicker="Toolset" title="Stack & capabilities" />

        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <Reveal>
            <div className="panel p-5">
              <p className="tag mb-5">Proficiency</p>
              <ul className="space-y-5">
                {skillData.map((s, i) => (
                  <SkillMeter key={`${s.title}-${i}`} {...s} delay={i * 0.09} />
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-4 text-[0.7rem] leading-relaxed text-muted">
                Self-assessed against the work I ship day to day, not a
                certification score.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {capabilities.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.07}>
                <article className="panel group h-full p-5 transition-colors hover:border-accent/35">
                  <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded border border-line bg-surface-2">
                    <Image
                      src={c.icon}
                      alt=""
                      width={22}
                      height={22}
                      className="h-5.5 w-5.5 object-contain"
                    />
                  </div>
                  <h3 className="mb-2 font-mono text-[0.83rem] leading-snug text-ink">
                    {c.title.trim()}
                  </h3>
                  <p className="text-[0.82rem] leading-relaxed text-muted">{c.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Knowledge rail — a slow ticker, the one piece of ambient motion */}
      <div className="fade-x mt-14 overflow-hidden border-y border-line py-3">
        <ul className="marquee-track flex w-max items-center gap-8" aria-hidden>
          {rail.map((k, i) => (
            <li key={i} className="flex items-center gap-8 whitespace-nowrap">
              <span className="font-mono text-[0.8rem] text-ink-2">{k}</span>
              <span className="h-1 w-1 rounded-full bg-accent/50" />
            </li>
          ))}
        </ul>
        <p className="sr-only">Areas of knowledge: {knoledges.join(", ")}.</p>
      </div>
    </section>
  );
}
