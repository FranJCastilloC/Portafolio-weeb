import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { bioData } from "@/data/bioData";
import { contactData } from "@/data/contactData";
import { profileInfo } from "@/data/profileInfo";

const FACTS = contactData.filter((c) => c.text.label !== "Birthday");

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8">
      <SectionHeading index="01" kicker="Profile" title="About" />

      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <Reveal>
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-2 rounded-lg opacity-20 blur-2xl"
              style={{
                background: "linear-gradient(140deg, var(--color-accent), var(--color-s2))",
              }}
            />
            <div className="panel relative overflow-hidden">
              <Image
                src={profileInfo.imageSrc}
                alt={profileInfo.name}
                width={800}
                height={800}
                sizes="(max-width: 1024px) 90vw, 380px"
                className="h-auto w-full object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, var(--color-surface) 2%, transparent 45%)",
                }}
              />
            </div>

            <dl className="mt-4 divide-y divide-line overflow-hidden rounded border border-line bg-surface">
              {FACTS.map((f) => (
                <div key={f.id} className="flex items-baseline gap-3 px-4 py-3">
                  <dt className="tag w-[4.5rem] shrink-0">{f.text.label}</dt>
                  <dd className="font-mono text-[0.8rem] break-all text-ink-2">
                    {f.text.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <div className="space-y-5">
          {[bioData.descOne, bioData.descTwo, bioData.descThree, bioData.descFour].map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="flex gap-4 text-[0.975rem] leading-relaxed text-ink-2">
                <span aria-hidden className="mt-2 h-px w-6 shrink-0 bg-accent/50" />
                <span>{p.replace(/\s+/g, " ").trim()}</span>
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.24}>
            <blockquote className="panel mt-8 p-5">
              <p className="font-mono text-[0.85rem] leading-relaxed text-ink-2">
                <span className="text-accent">{">"}</span> Industrial engineering
                taught me to model a process. Risk analysis taught me to price its
                uncertainty. The AI master&apos;s is teaching me to automate both.
              </p>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
