"use client";

import { motion } from "framer-motion";
import { useId, useMemo } from "react";

/* Seeded PRNG so the figure is identical on server and client (no hydration
   mismatch, no layout shift) and stable between deploys. */
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* 500 paths so the 1% quantile is actually estimable — at 64 it degenerates to
   the single worst draw and VaR equals ES. Only a subsample is stroked; the
   full set drawn would be mud. */
const PATHS = 500;
const DRAW_EVERY = 6;
const STEPS = 252;
const S0 = 100;
const MU_D = 0.08 / 252;
const SIG_D = 0.0125;
const CONF = 0.99;

function simulate() {
  const rand = mulberry32(20260918);
  const normal = () => {
    let u = 0;
    let v = 0;
    while (u === 0) u = rand();
    while (v === 0) v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const paths = [];
  for (let p = 0; p < PATHS; p++) {
    const series = [S0];
    let s = S0;
    for (let t = 1; t <= STEPS; t++) {
      s *= Math.exp(MU_D - 0.5 * SIG_D ** 2 + SIG_D * normal());
      series.push(s);
    }
    paths.push(series);
  }

  const terminal = paths.map((p) => p[p.length - 1]).sort((a, b) => a - b);
  const qIndex = Math.max(1, Math.floor((1 - CONF) * terminal.length));
  const varLevel = terminal[qIndex];
  const tail = terminal.slice(0, qIndex);
  const es = tail.reduce((a, b) => a + b, 0) / tail.length;

  return {
    paths,
    terminal,
    varLevel,
    varPct: (varLevel / S0 - 1) * 100,
    esPct: (es / S0 - 1) * 100,
  };
}

const GUTTER = 40;
const PLOT = { x0: GUTTER + 4, x1: 520, y0: 22, y1: 282 };
const HIST = { x0: 548, x1: 726 };
const BINS = 18;

export default function MonteCarloVaR() {
  const uid = useId().replace(/:/g, "");
  const sim = useMemo(simulate, []);

  /* Scale must contain the VaR level — otherwise the threshold clamps onto the
     axis floor and its label collides with the x-axis ticks. */
  const { lo, hi } = useMemo(() => {
    const all = sim.paths.flat().sort((a, b) => a - b);
    const rawLo = all[Math.floor(all.length * 0.004)];
    const rawHi = all[Math.floor(all.length * 0.996)];
    const pad = (rawHi - rawLo) * 0.07;
    return { lo: Math.min(rawLo, sim.varLevel - pad), hi: rawHi };
  }, [sim]);

  /* Rounded so Node and the browser serialise identical coordinates — raw
     floats differ in their last digit and trip hydration. */
  const round = (n) => Math.round(n * 100) / 100;
  const sx = (i) => round(PLOT.x0 + (i / STEPS) * (PLOT.x1 - PLOT.x0));
  const sy = (v) => {
    const t = (v - lo) / (hi - lo);
    return round(PLOT.y1 - Math.max(0, Math.min(1, t)) * (PLOT.y1 - PLOT.y0));
  };

  const toPath = (series) => {
    let d = `M${sx(0)},${sy(series[0])}`;
    for (let i = 6; i <= STEPS; i += 6) d += `L${sx(i)},${sy(series[i])}`;
    return d;
  };

  const drawn = useMemo(
    () => sim.paths.filter((_, i) => i % DRAW_EVERY === 0).map(toPath),
    [sim, lo, hi]
  );

  const medianPath = useMemo(() => {
    const finals = sim.paths.map((p, i) => [p[p.length - 1], i]);
    finals.sort((a, b) => a[0] - b[0]);
    return sim.paths[finals[Math.floor(finals.length / 2)][1]];
  }, [sim]);

  const bins = useMemo(() => {
    const out = Array.from({ length: BINS }, () => 0);
    sim.terminal.forEach((v) => {
      const t = (v - lo) / (hi - lo);
      out[Math.max(0, Math.min(BINS - 1, Math.floor(t * BINS)))] += 1;
    });
    const max = Math.max(...out, 1);
    return out.map((count, i) => ({
      frac: count / max,
      isTail: lo + ((hi - lo) * (i + 1)) / BINS <= sim.varLevel,
    }));
  }, [sim, lo, hi]);

  const varY = sy(sim.varLevel);
  const bandH = (PLOT.y1 - PLOT.y0) / BINS;
  const barH = Math.min(14, bandH - 2); // 2px surface gap between bars
  // Flip the chip above the line when it would run past the plot floor
  const chipBelow = varY + 23 < PLOT.y1;
  const chipY = chipBelow ? varY + 5 : varY - 22;

  return (
    <figure className="panel relative overflow-hidden p-4 sm:p-5">
      <figcaption className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-mono text-[0.8125rem] text-ink">
          Monte Carlo VaR
          <span className="text-muted">
            {" "}
            · {PATHS} paths · {Math.ceil(PATHS / DRAW_EVERY)} shown · 252d
          </span>
        </h3>
        <span className="tag">GBM σ 19.8% p.a.</span>
      </figcaption>

      <svg
        viewBox="0 0 736 316"
        className="w-full"
        role="img"
        aria-label={`Monte Carlo simulation of ${PATHS} geometric Brownian motion price paths over a 252-day horizon. The 99% Value at Risk is ${sim.varPct.toFixed(2)} percent and expected shortfall is ${sim.esPct.toFixed(2)} percent. A histogram of terminal values sits at the right, with the loss tail below the VaR threshold highlighted.`}
      >
        <defs>
          <clipPath id={`reveal-${uid}`}>
            <motion.rect
              x={PLOT.x0}
              y={0}
              height={316}
              initial={{ width: 0 }}
              whileInView={{ width: PLOT.x1 - PLOT.x0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 2.1, ease: "linear" }}
            />
          </clipPath>
        </defs>

        {/* Gridlines — hairline, solid, recessive; ticks live in the gutter */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = PLOT.y0 + t * (PLOT.y1 - PLOT.y0);
          const val = hi - t * (hi - lo);
          return (
            <g key={t}>
              <line
                x1={PLOT.x0}
                x2={HIST.x1}
                y1={y}
                y2={y}
                stroke="var(--color-line-soft)"
                strokeWidth="1"
              />
              <text
                x={GUTTER - 6}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fill="var(--color-muted)"
                fontSize="9.5"
                fontFamily="var(--font-mono)"
              >
                {((val / S0 - 1) * 100).toFixed(0)}%
              </text>
            </g>
          );
        })}

        {/* The path cloud — a density population, not identified series */}
        <g clipPath={`url(#reveal-${uid})`}>
          {drawn.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="var(--color-s2)"
              strokeWidth="1"
              strokeOpacity="0.16"
              strokeLinejoin="round"
            />
          ))}
          <path
            d={toPath(medianPath)}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* VaR threshold — a reference line, directly labelled */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.9, duration: 0.5 }}
        >
          <line
            x1={PLOT.x0}
            x2={HIST.x1}
            y1={varY}
            y2={varY}
            stroke="var(--color-neg)"
            strokeWidth="1"
          />
          <rect
            x={PLOT.x0 + 4}
            y={chipY}
            width="132"
            height="17"
            rx="3"
            fill="var(--color-surface-2)"
            stroke="var(--color-line)"
          />
          <text
            x={PLOT.x0 + 11}
            y={chipY + 12}
            fill="var(--color-ink-2)"
            fontSize="10"
            fontFamily="var(--font-mono)"
          >
            VaR 99% · {sim.varPct.toFixed(2)}%
          </text>
        </motion.g>

        {/* Median end-marker: ≥8px, 2px surface ring */}
        <motion.circle
          cx={sx(STEPS)}
          cy={sy(medianPath[STEPS])}
          r="4"
          fill="var(--color-accent)"
          stroke="var(--color-surface)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2.0, type: "spring", stiffness: 260 }}
        />

        <line
          x1={HIST.x0 - 12}
          x2={HIST.x0 - 12}
          y1={PLOT.y0}
          y2={PLOT.y1}
          stroke="var(--color-line)"
          strokeWidth="1"
        />

        {/* Terminal-value distribution */}
        {bins.map((b, i) => {
          const y = PLOT.y1 - (i + 1) * bandH + (bandH - barH) / 2;
          return (
            <motion.rect
              key={i}
              x={HIST.x0}
              y={round(y)}
              height={round(barH)}
              rx="3"
              fill={b.isTail ? "var(--color-neg)" : "var(--color-s2)"}
              fillOpacity={b.isTail ? 0.95 : 0.55}
              initial={{ width: 0 }}
              whileInView={{ width: round(Math.max(1.5, b.frac * (HIST.x1 - HIST.x0))) }}
              viewport={{ once: true }}
              transition={{ delay: 1.75 + i * 0.022, duration: 0.45, ease: "easeOut" }}
            />
          );
        })}

        <g fill="var(--color-muted)" fontSize="9.5" fontFamily="var(--font-mono)">
          <text x={PLOT.x0} y={PLOT.y1 + 20}>
            t = 0
          </text>
          <text x={PLOT.x1} y={PLOT.y1 + 20} textAnchor="end">
            t = 252d
          </text>
          <text x={HIST.x0} y={PLOT.y1 + 20}>
            terminal dist.
          </text>
        </g>
      </svg>

      {/* Legend — never colour alone */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-3">
        <Key color="var(--color-accent)" label="Median path" />
        <Key color="var(--color-s2)" label="Simulated paths" dim />
        <Key color="var(--color-neg)" label="Loss tail (1%)" />
        <span className="ml-auto font-mono text-[0.6875rem] text-muted">
          ES <span className="text-ink-2">{sim.esPct.toFixed(2)}%</span>
        </span>
      </div>
    </figure>
  );
}

function Key({ color, label, dim }) {
  return (
    <span className="flex items-center gap-2 font-mono text-[0.6875rem] text-ink-2">
      <span
        aria-hidden
        className="h-2 w-2 rounded-[1px]"
        style={{ background: color, opacity: dim ? 0.55 : 1 }}
      />
      {label}
    </span>
  );
}
