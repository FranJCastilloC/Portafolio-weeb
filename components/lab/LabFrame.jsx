import { forwardRef } from "react";

const LabFrame = forwardRef(function LabFrame(
  { file, title, status, actions, children, footer, className = "" },
  ref
) {
  return (
    <figure ref={ref} className={`panel flex flex-col overflow-hidden ${className}`}>
      <header className="flex items-center gap-3 border-b border-line bg-surface-2/60 px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="h-2 w-2 rounded-full bg-line" />
        </span>
        <span className="font-mono text-[0.72rem] text-muted">{file}</span>
        {status && (
          <span className="ml-auto flex items-center gap-2 font-mono text-[0.66rem] text-ink-2">
            {status}
          </span>
        )}
      </header>

      <figcaption className="flex flex-wrap items-start justify-between gap-3 px-4 pt-4 sm:px-5">
        <h3 className="text-[1.02rem] font-semibold tracking-tight text-ink">{title}</h3>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </figcaption>

      <div className="flex-1 px-4 pt-4 pb-4 sm:px-5">{children}</div>

      {footer && (
        <p className="border-t border-line px-4 py-3 text-[0.78rem] leading-relaxed text-muted sm:px-5">
          {footer}
        </p>
      )}
    </figure>
  );
});

export default LabFrame;

export function LabButton({ children, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[0.68rem] transition-colors ${
        active
          ? "border-accent/50 bg-accent/12 text-accent"
          : "border-line text-ink-2 hover:border-accent/45 hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}

export function RunState({ state }) {
  const map = {
    running: ["bg-accent", "running"],
    done: ["bg-s2", "converged"],
    paused: ["bg-muted", "paused"],
    idle: ["bg-muted", "waiting"],
  };
  const [dot, label] = map[state] ?? map.idle;
  return (
    <>
      <span className="relative flex h-1.5 w-1.5">
        {state === "running" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dot}`} />
      </span>
      {label}
    </>
  );
}

export function Stat({ label, value, sub }) {
  return (
    <div className="bg-surface px-3 py-2.5">
      <dt className="tag">{label}</dt>
      <dd className="mt-1 font-mono text-[1.02rem] text-ink">
        {value}
        {sub && <span className="ml-1 text-[0.7rem] text-muted">{sub}</span>}
      </dd>
    </div>
  );
}

export function Key({ color, label, shape = "square" }) {
  return (
    <span className="flex items-center gap-2 font-mono text-[0.68rem] text-ink-2">
      <span
        aria-hidden
        className={`shrink-0 ${shape === "line" ? "h-0.5 w-3.5 rounded-full" : shape === "dot" ? "h-2 w-2 rounded-full" : "h-2 w-2 rounded-[1px]"}`}
        style={{ background: color }}
      />
      {label}
    </span>
  );
}
