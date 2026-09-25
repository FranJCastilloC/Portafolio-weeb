"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import LabFrame, { Key, LabButton, RunState } from "@/components/lab/LabFrame";
import { useFrameLoop, useInView, useReducedMotion } from "@/components/hooks/motion";
import { useLang } from "@/lib/i18n/LanguageProvider";

/* Colour encodes which layer of the hybrid pipeline caught the entity (three
   hues, validated all-pairs); the entity type is always written out, so five
   types never have to be told apart by colour. */
const LAYERS = {
  regex: { color: "#2b90d9" },
  presidio: { color: "#c98500" },
  model: { color: "#0ca772" },
};

/* Fictional text (example.com domain, 555 number, documentation-sample IBAN),
   one string per segment in lib/i18n/ui.js. Entities keep their type and
   detecting layer in both languages; only the surrounding prose changes. */
const SPEC = [
  {},
  { type: "PERSON", layer: "model" },
  {},
  { type: "IBAN", layer: "regex" },
  {},
  { type: "PHONE", layer: "presidio" },
  {},
  { type: "EMAIL", layer: "regex" },
  {},
  { type: "NATIONAL_ID", layer: "regex" },
  {},
  { type: "LOCATION", layer: "model" },
  {},
];
const ENTITY_COUNT = SPEC.filter((s) => s.type).length;

// Timeline, in seconds
const SCAN = 5.2;
const REDACT_AT = SCAN + 0.9;
const REDACT_GAP = 0.3;
const HOLD_UNTIL = REDACT_AT + ENTITY_COUNT * REDACT_GAP + 4.5;

export default function PiiRedaction() {
  const { t, lang } = useLang();
  const SEGMENTS = useMemo(() => t("pii.sample").map((text, i) => ({ t: text, ...SPEC[i] })), [t]);
  const ENTITIES = useMemo(() => SEGMENTS.map((s, i) => ({ ...s, i })).filter((s) => s.type), [SEGMENTS]);
  const TOTAL_CHARS = useMemo(() => SEGMENTS.reduce((n, s) => n + s.t.length, 0), [SEGMENTS]);
  const layerLabel = (key) => t(`pii.layers.${key}`);
  const frameRef = useRef(null);
  const inView = useInView(frameRef, { rootMargin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const [time, setTime] = useState(0);
  const [manual, setManual] = useState(null);
  const clock = useRef({ last: null, t: 0 });

  // Loops while visible; pauses (not resets) when scrolled away
  useFrameLoop(inView && !reduced && manual === null, (now) => {
    const c = clock.current;
    const dt = c.last === null ? 0 : Math.min((now - c.last) / 1000, 0.1);
    c.last = now;
    c.t = c.t + dt > HOLD_UNTIL ? 0 : c.t + dt;
    setTime(c.t);
  });
  useEffect(() => {
    if (!inView) clock.current.last = null;
  }, [inView]);
  useEffect(() => {
    clock.current = { last: null, t: 0 };
    setTime(0);
  }, [lang]);

  const elapsed = reduced ? HOLD_UNTIL : time;
  const cursor = Math.min(elapsed / SCAN, 1) * TOTAL_CHARS;

  let offset = 0;
  const view = SEGMENTS.map((s, i) => {
    const start = offset;
    offset += s.t.length;
    if (!s.type) return { ...s, i, visibleChars: Math.max(0, Math.min(s.t.length, cursor - start)) };
    const k = ENTITIES.findIndex((e) => e.i === i);
    const detected = cursor >= offset;
    const redacted =
      manual !== null ? manual === "redacted" : elapsed >= REDACT_AT + k * REDACT_GAP;
    return { ...s, i, visibleChars: Math.max(0, Math.min(s.t.length, cursor - start)), detected, redacted };
  });

  const found = view.filter((s) => s.type && (s.detected || manual !== null || reduced));
  const scanning = cursor < TOTAL_CHARS && manual === null && !reduced;
  const state = manual !== null || reduced ? "done" : !inView ? "paused" : scanning ? "running" : "done";

  return (
    <LabFrame
      ref={frameRef}
      file="redact.py"
      status={<RunState state={state} />}
      title={t("pii.title")}
      actions={
        <>
          <LabButton active={manual === "original"} onClick={() => setManual("original")}>
            {t("pii.original")}
          </LabButton>
          <LabButton active={manual === "redacted"} onClick={() => setManual("redacted")}>
            {t("pii.redacted")}
          </LabButton>
          {manual !== null && (
            <LabButton
              onClick={() => {
                clock.current = { last: null, t: 0 };
                setTime(0);
                setManual(null);
              }}
            >
              {t("pii.replay")}
            </LabButton>
          )}
        </>
      }
      footer={
        <>
          {t("pii.footerPre")}{" "}
          <a href="#projects" className="text-ink-2 underline decoration-line underline-offset-2 hover:text-accent">
            {t("pii.footerLink")}
          </a>{" "}
          {t("pii.footerPost")}
        </>
      }
    >
      <div className="rounded border border-line-soft bg-bg/40 p-4 font-mono text-[0.8rem] leading-[2.1] text-ink-2 sm:text-[0.84rem]">
        {view.map((s) => {
          if (!s.type) return <span key={s.i}>{s.t.slice(0, Math.ceil(s.visibleChars))}</span>;
          if (s.visibleChars <= 0 && manual === null && !reduced) return null;
          const layer = LAYERS[s.layer];
          const showFull = manual !== null || reduced;
          const text = showFull ? s.t : s.t.slice(0, Math.ceil(s.visibleChars));
          const lit = showFull || s.detected;
          return (
            <span key={s.i} className="relative inline">
              {s.redacted ? (
                <span
                  className="rounded-sm px-1.5 py-0.5 text-[0.72rem] tracking-wide text-ink"
                  style={{ background: `${layer.color}33`, boxShadow: `inset 0 0 0 1px ${layer.color}` }}
                >
                  [{s.type}]
                </span>
              ) : (
                <span
                  className="rounded-sm px-0.5 transition-colors duration-300"
                  style={
                    lit
                      ? { background: `${layer.color}26`, boxShadow: `inset 0 -2px 0 ${layer.color}`, color: "var(--color-ink)" }
                      : undefined
                  }
                >
                  {text}
                </span>
              )}
            </span>
          );
        })}
        {scanning && <span className="caret" aria-hidden />}
      </div>

      <ol className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded border border-line bg-line">
        {Object.entries(LAYERS).map(([key, layer], n) => {
          const total = ENTITIES.filter((e) => e.layer === key).length;
          const hits = found.filter((f) => f.layer === key).length;
          return (
            <li key={key} className="bg-surface px-3 py-2.5">
              <p className="tag mb-1.5">{t("pii.layer")} {n + 1}</p>
              <Key color={layer.color} label={layerLabel(key)} />
              <p className="num mt-1.5 text-[0.95rem] text-ink">
                {hits}
                <span className="text-[0.7rem] text-muted">/{total} {t("pii.found")}</span>
              </p>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 overflow-hidden rounded border border-line">
        <table className="w-full font-mono text-[0.7rem]">
          <thead className="bg-surface-2/60 text-left text-muted">
            <tr>
              <th scope="col" className="px-3 py-2 font-normal">{t("pii.entity")}</th>
              <th scope="col" className="px-3 py-2 font-normal">{t("pii.caughtBy")}</th>
            </tr>
          </thead>
          <tbody>
            {ENTITIES.map((e) => {
              const hit = found.find((f) => f.i === e.i);
              return (
                <tr key={e.i} className="border-t border-line">
                  <td className={`px-3 py-1.5 ${hit ? "text-ink" : "text-muted/50"}`}>{e.type}</td>
                  <td className="px-3 py-1.5">
                    {hit ? <Key color={LAYERS[e.layer].color} label={layerLabel(e.layer)} /> : <span className="text-muted/50">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </LabFrame>
  );
}
