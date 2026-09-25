"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import NeuralNetDemo from "@/components/lab/NeuralNetDemo";
import OptimizerRace from "@/components/lab/OptimizerRace";
import PiiRedaction from "@/components/lab/PiiRedaction";
import { useLang } from "@/lib/i18n/LanguageProvider";

export default function Lab() {
  const { t } = useLang();
  return (
    <section id="lab" className="relative scroll-mt-20 py-20">
      <div aria-hidden className="grid-plane absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="03" kicker={t("sections.lab.kicker")} title={t("sections.lab.title")} />

        <Reveal>
          <p className="-mt-4 mb-10 max-w-2xl text-[0.95rem] leading-relaxed text-ink-2">
            {t("lab.intro")}
          </p>
        </Reveal>

        <div className="grid gap-6">
          <NeuralNetDemo />
          <div className="grid gap-6 lg:grid-cols-2">
            <OptimizerRace />
            <PiiRedaction />
          </div>
        </div>
      </div>
    </section>
  );
}
