"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import MonteCarloVaR from "@/components/charts/MonteCarloVaR";
import CountUp from "@/components/ui/CountUp";
import { socialMediaData } from "@/data/socials";
import { portfolioData } from "@/data/portfolioData";
import { blogData } from "@/data/blogs";
import { useLang } from "@/lib/i18n/LanguageProvider";

function RoleTyper({ roles }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(roles[0]);
      return;
    }
    const full = roles[index];
    const complete = text === full;

    if (!deleting && complete) {
      const hold = setTimeout(() => setDeleting(true), 1900);
      return () => clearTimeout(hold);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % roles.length);
      return;
    }

    const step = setTimeout(
      () => setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1)),
      deleting ? 38 : 72
    );
    return () => clearTimeout(step);
  }, [text, deleting, index, roles]);

  return (
    <span className="caret text-accent text-glow" aria-label={roles.join(", ")}>
      {text}
    </span>
  );
}

/* Counted from the data, never typed in: a hard-coded "8" had drifted to
   overstate certifications (it counted the degree and an exam in progress). */
const SHIPPED = portfolioData.filter((p) => !p.category.includes("In Progress")).length;
const EARNED = blogData.filter((c) => c.category !== "University degree" && c.date !== "In Progress").length;
// Tenure as stated on the CV: 4+ years in total
const YEARS = 4;

export default function Hero() {
  const { t, lang } = useLang();
  const stats = [
    { value: YEARS, suffix: "+", label: t("hero.stats.years") },
    { value: SHIPPED, suffix: "", label: t("hero.stats.projects") },
    { value: EARNED, suffix: "", label: t("hero.stats.certs") },
  ];
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-32">
      <div aria-hidden className="grid-plane absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 h-[30rem] w-[52rem] -translate-x-1/2 rounded-full opacity-25 blur-[100px]"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-accent), transparent 72%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32"
        style={{ background: "linear-gradient(to bottom, transparent, var(--color-bg))" }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/70 px-3.5 py-1.5 font-mono text-[0.7rem] text-ink-2 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              {t("hero.badge")}
              <span className="text-muted">· {t("hero.location")}</span>
            </p>

            <h1 className="text-[2.6rem] leading-[1.04] font-semibold tracking-tight sm:text-6xl">
              Francisco
              <br />
              Castillo
            </h1>

            <p className="mt-5 font-mono text-lg sm:text-xl">
              <span className="text-muted">$ </span>
              <RoleTyper key={lang} roles={t("hero.roles")} />
            </p>

            <p className="mt-6 max-w-lg text-[0.975rem] leading-relaxed text-ink-2">
              {t("hero.intro")}
            </p>

            <p className="mt-5 inline-flex max-w-full items-center gap-2.5 rounded border border-line bg-surface/60 px-3.5 py-2 font-mono text-[0.72rem] text-ink-2">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0 text-accent">
                <path d="M8 1.6 15 5l-7 3.4L1 5l7-3.4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                <path d="M3.6 6.4v3.9c0 .9 2 2.1 4.4 2.1s4.4-1.2 4.4-2.1V6.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="whitespace-nowrap">
                {t("hero.mscPre")} <span className="text-accent">{t("hero.mscEm")}</span>
              </span>
              <span className="hidden whitespace-nowrap text-muted xl:inline">· UAX</span>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded bg-accent px-5 py-2.5 font-mono text-[0.82rem] font-medium text-black transition-transform hover:-translate-y-0.5"
              >
                {t("hero.viewProjects")}
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="#contact"
                className="rounded border border-line bg-surface px-5 py-2.5 font-mono text-[0.82rem] text-ink-2 transition-colors hover:border-accent/40 hover:text-ink"
              >
                {t("hero.getInTouch")}
              </a>

              <ul className="ml-1 flex items-center gap-1">
                {socialMediaData.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={labelFor(s.className)}
                      className="grid h-9 w-9 place-items-center rounded border border-line text-muted transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      <SocialIcon name={labelFor(s.className)} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded border border-line bg-line">
              {stats.map((s) => (
                <div key={s.label} className="bg-surface px-4 py-3.5">
                  <dd className="num text-2xl font-semibold text-ink">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </dd>
                  <dt className="mt-1 text-[0.7rem] leading-snug text-muted">{s.label}</dt>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <MonteCarloVaR />
          <p className="mt-2.5 text-center font-mono text-[0.68rem] text-muted">
            {t("hero.chartCaption")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function labelFor(cls = "") {
  if (cls.includes("github")) return "GitHub";
  if (cls.includes("linkedin")) return "LinkedIn";
  if (cls.includes("instagram")) return "Instagram";
  if (cls.includes("rss")) return "Blog";
  return "Link";
}

function SocialIcon({ name }) {
  const common = { width: 15, height: 15, viewBox: "0 0 16 16", fill: "currentColor", "aria-hidden": true };
  if (name === "GitHub")
    return (
      <svg {...common}>
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
    );
  if (name === "LinkedIn")
    return (
      <svg {...common}>
        <path d="M3.6 14H1V5.3h2.6V14ZM2.3 4.2a1.5 1.5 0 1 1 0-3.1 1.5 1.5 0 0 1 0 3.1ZM15 14h-2.6V9.8c0-1-.02-2.3-1.4-2.3-1.4 0-1.6 1.1-1.6 2.2V14H6.8V5.3h2.5v1.2h.04c.35-.66 1.2-1.36 2.47-1.36 2.64 0 3.13 1.74 3.13 4V14Z" />
      </svg>
    );
  if (name === "Instagram")
    return (
      <svg {...common}>
        <path d="M8 1.44c2.14 0 2.39.01 3.23.05.78.04 1.2.17 1.49.28.37.15.64.32.92.6.28.28.45.55.6.92.11.28.24.71.28 1.49.04.84.05 1.1.05 3.23s-.01 2.39-.05 3.23c-.04.78-.17 1.2-.28 1.49-.15.37-.32.64-.6.92-.28.28-.55.45-.92.6-.28.11-.71.24-1.49.28-.84.04-1.1.05-3.23.05s-2.39-.01-3.23-.05c-.78-.04-1.2-.17-1.49-.28a2.5 2.5 0 0 1-.92-.6 2.5 2.5 0 0 1-.6-.92c-.11-.28-.24-.71-.28-1.49C1.45 10.39 1.44 10.14 1.44 8s.01-2.39.05-3.23c.04-.78.17-1.2.28-1.49.15-.37.32-.64.6-.92.28-.28.55-.45.92-.6.28-.11.71-.24 1.49-.28C5.61 1.45 5.86 1.44 8 1.44ZM8 0C5.83 0 5.55.01 4.7.05c-.85.04-1.43.17-1.94.37-.53.2-.98.48-1.42.93-.45.44-.72.89-.93 1.42-.2.51-.33 1.09-.37 1.94C.01 5.55 0 5.83 0 8s.01 2.45.05 3.3c.04.85.17 1.43.37 1.94.2.53.48.98.93 1.42.44.45.89.72 1.42.93.51.2 1.09.33 1.94.37.85.04 1.13.05 3.3.05s2.45-.01 3.3-.05c.85-.04 1.43-.17 1.94-.37.53-.2.98-.48 1.42-.93.45-.44.72-.89.93-1.42.2-.51.33-1.09.37-1.94.04-.85.05-1.13.05-3.3s-.01-2.45-.05-3.3c-.04-.85-.17-1.43-.37-1.94a3.9 3.9 0 0 0-.93-1.42A3.9 3.9 0 0 0 13.24.42c-.51-.2-1.09-.33-1.94-.37C10.45.01 10.17 0 8 0Zm0 3.89a4.11 4.11 0 1 0 0 8.22 4.11 4.11 0 0 0 0-8.22Zm0 6.78a2.67 2.67 0 1 1 0-5.34 2.67 2.67 0 0 1 0 5.34Zm5.23-6.94a.96.96 0 1 1-1.92 0 .96.96 0 0 1 1.92 0Z" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M2 2a12 12 0 0 1 12 12h-2A10 10 0 0 0 2 4V2Zm0 4.5A7.5 7.5 0 0 1 9.5 14h-2A5.5 5.5 0 0 0 2 8.5v-2ZM3.4 11.2a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Z" />
    </svg>
  );
}
