import Reveal from "@/components/ui/Reveal";

export default function SectionHeading({ index, title, kicker }) {
  return (
    <Reveal>
      <div className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-4">
        <div>
          <span className="tag">
            {index} <span className="text-accent/70">//</span> {kicker}
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        </div>
        <span aria-hidden className="hidden h-px flex-1 bg-line sm:block" />
      </div>
    </Reveal>
  );
}
