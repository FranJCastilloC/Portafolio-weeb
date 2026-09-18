import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { experiences } from "@/data/experience";
import { education } from "@/data/education";

function Track({ label, entries }) {
  return (
    <div>
      <p className="tag mb-6">{label}</p>
      <ol className="relative space-y-7 border-l border-line pl-7">
        {entries.map((e, i) => (
          <Reveal key={e.id} delay={i * 0.07}>
            <li className="relative">
              <span
                aria-hidden
                className={`absolute -left-[2.03rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-bg ${
                  e.current ? "bg-accent" : "bg-line"
                }`}
              />
              {e.current && (
                <span
                  aria-hidden
                  className="absolute -left-[2.03rem] top-1.5 h-2.5 w-2.5 animate-ping rounded-full bg-accent opacity-60"
                />
              )}
              <p className="num text-[0.72rem] text-muted">{e.session}</p>
              <h3 className="mt-1.5 text-[0.95rem] font-medium leading-snug text-ink">
                {e.role ?? e.cardTitle}
              </h3>
              <p className="mt-0.5 font-mono text-[0.78rem] text-ink-2">
                {e.company ?? e.location}
                {e.cardSubtitleSecondary && (
                  <span className="text-muted"> · {e.cardSubtitleSecondary}</span>
                )}
              </p>
              {e.summary && (
                <p className="mt-2.5 max-w-prose text-[0.83rem] leading-relaxed text-muted">
                  {e.summary}
                </p>
              )}
              {e.current && (
                <span className="mt-2.5 inline-block rounded border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[0.62rem] tracking-wide text-accent">
                  {e.role ? "CURRENT" : "IN PROGRESS"}
                </span>
              )}
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8">
      <SectionHeading index="03" kicker="Track record" title="Experience & education" />
      <div className="grid gap-12 sm:grid-cols-2 sm:gap-10">
        <Track label="Experience" entries={experiences} />
        <Track label="Education" entries={education} />
      </div>
    </section>
  );
}
