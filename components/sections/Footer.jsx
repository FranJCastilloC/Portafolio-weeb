import { socialMediaData } from "@/data/socials";

const labelFor = (cls = "") =>
  cls.includes("github")
    ? "GitHub"
    : cls.includes("linkedin")
      ? "LinkedIn"
      : cls.includes("instagram")
        ? "Instagram"
        : cls.includes("rss")
          ? "Blog"
          : "Link";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-mono text-[0.72rem] text-muted">
          <span className="text-accent">$</span> Francisco Castillo ·{" "}
          {new Date().getFullYear()} · Built with Next.js
        </p>

        <ul className="flex flex-wrap items-center gap-4">
          {socialMediaData.map((s) => (
            <li key={s.id}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.72rem] text-muted transition-colors hover:text-accent"
              >
                {labelFor(s.className)}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#top"
              className="font-mono text-[0.72rem] text-muted transition-colors hover:text-accent"
            >
              ↑ Top
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
