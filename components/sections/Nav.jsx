"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "lab", label: "Lab" },
  { id: "experience", label: "Experience" },
  { id: "awards", label: "Awards" },
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "reading", label: "Reading" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.2, 0.6] }
    );

    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-line bg-bg/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5" aria-label="Back to top">
          <span className="grid h-7 w-7 place-items-center rounded border border-accent/40 bg-accent/10 font-mono text-[0.7rem] font-bold text-accent">
            FC
          </span>
          <span className="hidden font-mono text-[0.8125rem] text-ink-2 transition-colors group-hover:text-ink sm:block">
            francisco<span className="text-muted">.castillo</span>
          </span>
        </a>

        <ul className="ml-auto hidden items-center gap-1 xl:flex">
          {LINKS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={`relative rounded px-2.5 py-2 font-mono text-[0.78rem] transition-colors ${
                  active === id ? "text-accent" : "text-muted hover:text-ink-2"
                }`}
              >
                {active === id && <span aria-hidden className="text-accent/60">/</span>}
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto rounded border border-accent/45 bg-accent/10 px-3.5 py-1.5 font-mono text-[0.75rem] text-accent transition-all hover:bg-accent/20 hover:glow-accent xl:ml-0"
        >
          CV<span className="hidden sm:inline">.pdf</span>
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation"
          className="grid h-9 w-9 place-items-center rounded border border-line text-ink-2 xl:hidden"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            {open ? (
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M2 4.5h12M2 11.5h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <ul className="border-t border-line bg-surface/95 px-5 py-2 backdrop-blur-md xl:hidden">
          {LINKS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className={`block py-2.5 font-mono text-sm ${
                  active === id ? "text-accent" : "text-ink-2"
                }`}
              >
                <span className="text-muted">/</span> {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
