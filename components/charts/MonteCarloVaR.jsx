"use client";

import { useMemo, useRef, useState } from "react";
import { easeOut, useInView, useTimeline } from "@/components/hooks/motion";
import { gaussian, mulberry32 } from "@/lib/ml/random";

/* 500 paths so the 1% quantile is actually estimable — at 64 it degenerates to
   the single worst draw and VaR equals ES. Only a subsample is stroked. */
const PATHS = 500;
const DRAW_EVERY = 6;
const STEPS = 252;
const SAMPLE = 6;
const S0 = 100;
const MU_D = 0.08 / 252;
const SIG_D = 0.0125;
const CONF = 0.99;
const BASE_SEED = 20260918;

const GUTTER = 40;
const PLOT = { x0: GUTTER + 4, x1: 520, y0: 22, y1: 282 };
const HIST = { x0: 548, x1: 726 };
const VIEW = { w: 736, h: 316 };
const BINS = 18;
const TOTAL = 3.1;

const round = (n) => Math.round(n * 100) / 100;
const clamp01 = (t) => Math.min(Math.max(t, 0), 1);
const pct = (v) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;

function simulate(seed) {
  const normal = gaussian(mulberry32(seed));
  const paths = [];
  for (let p = 0; p < PATHS; p++) {
    const series = new Float64Array(STEPS + 1);
    series[0] = S0;
    for (let t = 1; t <= STEPS; t++) {
      series[t] = series[t - 1] * Math.exp(MU_D - 0.5 * SIG_D ** 2 + SIG_D * normal());
    }
    paths.push(series);
  }

  const terminal = paths.map((p) => p[STEPS]).sort((a, b) => a - b);
  const qIndex = Math.max(1, Math.floor((1 - CONF) * terminal.length));
  const tail = terminal.slice(0, qIndex);

  // Cross-sectional quantiles at each sampled day, for the hover readout
  const bands = [];
  for (let t = 0; t <= STEPS; t += SAMPLE) {
    const col = paths.map((p) => p[t]).sort((a, b) => a - b);
    const q = (f) => (col[Math.floor(f * (col.length - 1))] / S0 - 1) * 100;
    bands.push({ t, p05: q(0.05), p50: q(0.5), p95: q(0.95) });
  }

  const medianIdx = paths
    .map((p, i) => [p[STEPS], i])
    .sort((a, b) => a[0] - b[0])[Math.floor(PATHS / 2)][1];

  return {
    paths,
    terminal,
    bands,
    medianPath: paths[medianIdx],
    varLevel: terminal[qIndex],
    varPct: (terminal[qIndex] / S0 - 1) * 100,
    esPct: (tail.reduce((a, b) => a + b, 0) / tail.length / S0 - 1) * 100,
  };
}

export default function MonteCarloVaR() {
  const frameRef = useRef(null);
  const svgRef = useRef(null);
  const [seed, setSeed] = useState(BASE_SEED);
  const [hover, setHover] = useState(null);

  const inView = useInView(frameRef, { once: true, rootMargin: "0px 0px -10% 0px" });
  const time = useTimeline(inView, TOTAL, seed);
  const sim = useMemo(() => simulate(seed), [seed]);

  // The scale must contain the VaR level, or the threshold clamps onto the floor
  const { lo, hi } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    const all = [];
    sim.paths.forEach((p) => {
      for (let t = 0; t <= STEPS; t += SAMPLE) all.push(p[t]);
    });
    all.sort((a, b) => a - b);
    min = all[Math.floor(all.length * 0.004)];
    max = all[Math.floor(all.length * 0.996)];
    const pad = (max - min) * 0.07;
    return { lo: Math.min(min, sim.varLevel - pad), hi: max };
  }, [sim]);

  const sx = (i) => round(PLOT.x0 + (i / STEPS) * (PLOT.x1 - PLOT.x0));
  const sy = (v) =>
    round(PLOT.y1 - clamp01((v - lo) / (hi - lo)) * (PLOT.y1 - PLOT.y0));

  const toPath = (series) => {
    let d = `M${sx(0)},${sy(series[0])}`;
    for (let i = SAMPLE; i <= STEPS; i += SAMPLE) d += `L${sx(i)},${sy(series[i])}`;
    return d;
  };

  /* Memoised as an element so the per-frame timeline re-render skips
     reconciling 85 path strings. */
  const cloud = useMemo(
    () => (
      <g>
        {sim.paths
          .filter((_, i) => i % DRAW_EVERY === 0)
          .map((p, i) => (
            <path
              key={i}
              d={toPath(p)}
              fill="none"
              stroke="var(--color-s2)"
              strokeWidth="1"
              strokeOpacity="0.17"
              strokeLinejoin="round"
            />
          ))}
        <path
          d={toPath(sim.medianPath)}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sim, lo, hi]
  );

  const bins = useMemo(() => {
    const counts = Array.from({ length: BINS }, () => 0);
    sim.terminal.forEach((v) => {
      counts[Math.max(0, Math.min(BINS - 1, Math.floor(((v - lo) / (hi - lo)) * BINS)))] += 1;
    });
    const max = Math.max(...counts, 1);
    return counts.map((c, i) => ({
      frac: c / max,
      isTail: lo + ((hi - lo) * (i + 1)) / BINS <= sim.varLevel,
    }));
  }, [sim, lo, hi]);

  const reveal = clamp01(time / 2.1);
  const varOpacity = clamp01((time - 1.9) / 0.5);
  const dot = easeOut((time - 2.0) / 0.35);
  const varY = sy(sim.varLevel);
  const bandH = (PLOT.y1 - PLOT.y0) / BINS;
  const barH = Math.min(14, bandH - 2);
  const chipY = varY + 23 < PLOT.y1 ? varY + 5 : varY - 22;

  const onMove = (e) => {
    const r = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * VIEW.w;
    if (x < PLOT.x0 || x > PLOT.x1) return setHover(null);
    const idx = Math.round(((x - PLOT.x0) / (PLOT.x1 - PLOT.x0)) * (sim.bands.length - 1));
    setHover(sim.bands[Math.max(0, Math.min(sim.bands.length - 1, idx))]);
  };

  const hoverX = hover ? sx(hover.t) : 0;

  return (
    <figure ref={frameRef} className="panel relative overflow-hidden p-4 sm:p-5">
      <figcaption className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h3 className="font-mono text-[0.8125rem] text-ink">
          Monte Carlo VaR
          <span className="text-muted">
            {" "}
            · {PATHS} paths · {Math.ceil(PATHS / DRAW_EVERY)} shown · 252d
          </span>
        </h3>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.6875rem] tracking-wide text-muted">
            GBM · σ 19.8% p.a.
          </span>
          <button
            type="button"
            onClick={() => {
              setHover(null);
              setSeed((s) => s + 1);
            }}
            className="inline-flex items-center gap-1.5 rounded border border-line px-2.5 py-1 font-mono text-[0.68rem] text-ink-2 transition-colors hover:border-accent/45 hover:text-accent"
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v3.6H9.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Re-simulate
          </button>
        </div>
      </figcaption>

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
          className="w-full touch-pan-y"
          role="img"
          aria-label={`Monte Carlo simulation of ${PATHS} geometric Brownian motion price paths over 252 trading days. 99% Value at Risk ${sim.varPct.toFixed(2)} percent, expected shortfall ${sim.esPct.toFixed(2)} percent.`}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <clipPath id="mcvar-reveal">
              <rect x={PLOT.x0} y={0} height={VIEW.h} width={round(reveal * (PLOT.x1 - PLOT.x0 + 6))} />
            </clipPath>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = PLOT.y0 + t * (PLOT.y1 - PLOT.y0);
            return (
              <g key={t}>
                <line x1={PLOT.x0} x2={HIST.x1} y1={y} y2={y} stroke="var(--color-line-soft)" strokeWidth="1" />
                <text
                  x={GUTTER - 6}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill="var(--color-muted)"
                  fontSize="9.5"
                  fontFamily="var(--font-mono)"
                >
                  {(((hi - t * (hi - lo)) / S0 - 1) * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}

          <g clipPath="url(#mcvar-reveal)">{cloud}</g>

          <g opacity={varOpacity}>
            <line x1={PLOT.x0} x2={HIST.x1} y1={varY} y2={varY} stroke="var(--color-neg)" strokeWidth="1" />
            <rect x={PLOT.x0 + 4} y={chipY} width="132" height="17" rx="3" fill="var(--color-surface-2)" stroke="var(--color-line)" />
            <text x={PLOT.x0 + 11} y={chipY + 12} fill="var(--color-ink-2)" fontSize="10" fontFamily="var(--font-mono)">
              VaR 99% · {sim.varPct.toFixed(2)}%
            </text>
          </g>

          <circle
            cx={sx(STEPS)}
            cy={sy(sim.medianPath[STEPS])}
            r={round(4 * dot)}
            fill="var(--color-accent)"
            stroke="var(--color-surface)"
            strokeWidth="2"
          />

          <line x1={HIST.x0 - 12} x2={HIST.x0 - 12} y1={PLOT.y0} y2={PLOT.y1} stroke="var(--color-line)" strokeWidth="1" />

          {bins.map((b, i) => {
            const grow = easeOut((time - (1.75 + i * 0.022)) / 0.45);
            return (
              <rect
                key={i}
                data-bar
                x={HIST.x0}
                y={round(PLOT.y1 - (i + 1) * bandH + (bandH - barH) / 2)}
                height={round(barH)}
                width={round(Math.max(1.5, b.frac * (HIST.x1 - HIST.x0)) * grow)}
                rx="3"
                fill={b.isTail ? "var(--color-neg)" : "var(--color-s2)"}
                fillOpacity={b.isTail ? 0.95 : 0.55}
              />
            );
          })}

          {hover && (
            <g pointerEvents="none">
              <line x1={hoverX} x2={hoverX} y1={PLOT.y0} y2={PLOT.y1} stroke="var(--color-ink-2)" strokeOpacity="0.45" strokeWidth="1" />
              <circle cx={hoverX} cy={sy(S0 * (1 + hover.p50 / 100))} r="4" fill="var(--color-accent)" stroke="var(--color-surface)" strokeWidth="2" />
            </g>
          )}

          <g fill="var(--color-muted)" fontSize="9.5" fontFamily="var(--font-mono)">
            <text x={PLOT.x0} y={PLOT.y1 + 20}>t = 0</text>
            <text x={PLOT.x1} y={PLOT.y1 + 20} textAnchor="end">t = 252d</text>
            <text x={HIST.x0} y={PLOT.y1 + 20}>terminal dist.</text>
          </g>
        </svg>

        {hover && (
          <div
            className="pointer-events-none absolute top-2 z-10 w-44 rounded border border-line bg-surface-2/95 px-3 py-2 font-mono text-[0.68rem] shadow-lg backdrop-blur"
            style={{
              left: `${(hoverX / VIEW.w) * 100}%`,
              transform: hoverX > VIEW.w * 0.45 ? "translateX(calc(-100% - 10px))" : "translateX(10px)",
            }}
          >
            <p className="mb-1.5 text-ink">Day {hover.t}</p>
            <p className="flex justify-between text-ink-2">
              <span className="flex items-center gap-1.5">
                <span aria-hidden className="h-2 w-2 rounded-[1px] bg-accent" />
                median
              </span>
              <span className="num text-ink">{pct(hover.p50)}</span>
            </p>
            <p className="mt-0.5 flex justify-between text-ink-2">
              <span>5th pct</span>
              <span className="num text-ink">{pct(hover.p05)}</span>
            </p>
            <p className="mt-0.5 flex justify-between text-ink-2">
              <span>95th pct</span>
              <span className="num text-ink">{pct(hover.p95)}</span>
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-3">
        <Key color="var(--color-accent)" label="Median path" />
        <Key color="var(--color-s2)" label="Simulated paths" dim />
        <Key color="var(--color-neg)" label="Loss tail (1%)" />
        <span className="ml-auto font-mono text-[0.6875rem] text-muted">
          ES <span className="text-ink-2">{sim.esPct.toFixed(2)}%</span>
        </span>
      </div>

      <table className="sr-only">
        <caption>Simulated return distribution by horizon</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">5th percentile</th>
            <th scope="col">Median</th>
            <th scope="col">95th percentile</th>
          </tr>
        </thead>
        <tbody>
          {sim.bands
            .filter((b) => b.t % 42 === 0 || b.t === STEPS)
            .map((b) => (
              <tr key={b.t}>
                <td>{b.t}</td>
                <td>{pct(b.p05)}</td>
                <td>{pct(b.p50)}</td>
                <td>{pct(b.p95)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </figure>
  );
}

function Key({ color, label, dim }) {
  return (
    <span className="flex items-center gap-2 font-mono text-[0.6875rem] text-ink-2">
      <span aria-hidden className="h-2 w-2 rounded-[1px]" style={{ background: color, opacity: dim ? 0.55 : 1 }} />
      {label}
    </span>
  );
}
