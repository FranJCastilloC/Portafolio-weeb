"use client";

import { useMemo, useRef, useState } from "react";
import LabFrame, { Key, LabButton, RunState } from "@/components/lab/LabFrame";
import { useCanvas, useInView, useTimeline } from "@/components/hooks/motion";
import { OPTIMIZERS, rosenbrock, trajectory } from "@/lib/ml/optimizers";
import { isoSegments } from "@/lib/ml/contours";
import { paintField } from "@/components/lab/field";
import { useLang } from "@/lib/i18n/LanguageProvider";

const STEPS = 800;
const DURATION = 4.2;
const DEFAULT_START = [-1.6, 2.4];
const DOMAIN = { x0: -2, x1: 2, y0: -1, y1: 3 };
const MIN = [1, 1];

// Validated all-pairs trio for the dark surface
const COLORS = { sgd: "#2b90d9", momentum: "#c98500", adam: "#0ca772" };
const LEVELS = [0.5, 2, 6, 20, 60, 180, 500, 1400];

export default function OptimizerRace() {
  const { t } = useLang();
  const frameRef = useRef(null);
  const inView = useInView(frameRef, { once: true, rootMargin: "0px 0px -15% 0px" });
  const [start, setStart] = useState(DEFAULT_START);
  const [run, setRun] = useState(0);
  const [hover, setHover] = useState(null);
  const time = useTimeline(inView, DURATION, run);

  const paths = useMemo(
    () => OPTIMIZERS.map((o) => ({ ...o, pts: trajectory(o, start, STEPS) })),
    [start]
  );

  // The landscape never changes: sample it once
  const field = useMemo(() => {
    const nx = 90;
    const ny = 90;
    const grid = new Float64Array(nx * ny);
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const x = DOMAIN.x0 + (i / (nx - 1)) * (DOMAIN.x1 - DOMAIN.x0);
        const y = DOMAIN.y1 - (j / (ny - 1)) * (DOMAIN.y1 - DOMAIN.y0);
        grid[j * nx + i] = rosenbrock(x, y);
      }
    }
    return {
      nx,
      ny,
      grid,
      contours: LEVELS.map((lv) => isoSegments(grid, nx, ny, lv)),
    };
  }, []);

  const step = Math.min(STEPS, Math.round((time / DURATION) ** 1.35 * STEPS));

  const canvasRef = useCanvas(
    (ctx, w, h) => {
      const size = Math.min(w, h);
      const ox = (w - size) / 2;
      const oy = (h - size) / 2;
      const toPx = (x, y) => [
        ox + ((x - DOMAIN.x0) / (DOMAIN.x1 - DOMAIN.x0)) * size,
        oy + ((DOMAIN.y1 - y) / (DOMAIN.y1 - DOMAIN.y0)) * size,
      ];
      const { nx, ny, grid, contours } = field;
      const cw = size / (nx - 1);

      // Sequential single-hue field: log loss, darkest at the valley floor
      paintField(
        ctx,
        nx,
        ny,
        (i, j) => [43, 144, 217, 0.02 + 0.2 * Math.min(Math.log10(grid[j * nx + i] + 1) / 3.4, 1)],
        { x: ox, y: oy, w: size, h: size }
      );

      ctx.lineWidth = 1;
      contours.forEach((segs, k) => {
        ctx.strokeStyle = `rgba(159,176,195,${(0.14 + 0.05 * (LEVELS.length - k) / LEVELS.length).toFixed(3)})`;
        ctx.beginPath();
        segs.forEach(([x0, y0, x1, y1]) => {
          ctx.moveTo(ox + x0 * cw, oy + y0 * cw);
          ctx.lineTo(ox + x1 * cw, oy + y1 * cw);
        });
        ctx.stroke();
      });

      // Global minimum
      const [mx, my] = toPx(...MIN);
      ctx.strokeStyle = "rgba(231,238,246,0.9)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(mx - 6, my);
      ctx.lineTo(mx + 6, my);
      ctx.moveTo(mx, my - 6);
      ctx.lineTo(mx, my + 6);
      ctx.stroke();
      ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillStyle = "rgba(159,176,195,0.95)";
      ctx.fillText("min (1, 1)", mx + 9, my + 14);

      // Start point
      const [sx0, sy0] = toPx(...start);
      ctx.beginPath();
      ctx.arc(sx0, sy0, 5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(231,238,246,0.9)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      /* Momentum and Adam share the valley floor, so the slower optimizers are
         drawn last and every line gets a surface-coloured halo: overlaps read as
         two lines instead of one. */
      [...paths].reverse().forEach((p) => {
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();
        for (let s = 0; s <= step; s += 2) {
          const [px, py] = toPx(...p.pts[s]);
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "#0a0e14";
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.strokeStyle = COLORS[p.key];
        ctx.lineWidth = 2;
        ctx.stroke();
        const [ex, ey] = toPx(...p.pts[step]);
        ctx.beginPath();
        ctx.arc(ex, ey, 4, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[p.key];
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#0a0e14";
        ctx.stroke();
      });

      canvasRef.current.toData = (cx, cy) => [
        DOMAIN.x0 + ((cx - ox) / size) * (DOMAIN.x1 - DOMAIN.x0),
        DOMAIN.y1 - ((cy - oy) / size) * (DOMAIN.y1 - DOMAIN.y0),
      ];
    },
    [step, paths]
  );

  const pointerToData = (e) => {
    const c = canvasRef.current;
    if (!c?.toData) return null;
    const r = c.getBoundingClientRect();
    const [x, y] = c.toData(e.clientX - r.left, e.clientY - r.top);
    const inside = x >= DOMAIN.x0 && x <= DOMAIN.x1 && y >= DOMAIN.y0 && y <= DOMAIN.y1;
    return inside ? { x, y, cx: e.clientX - r.left, cy: e.clientY - r.top, w: r.width } : null;
  };

  const restartFrom = (pt) => {
    setStart(pt);
    setRun((r) => r + 1);
  };

  const state = step >= STEPS ? "done" : inView ? "running" : "idle";

  return (
    <LabFrame
      ref={frameRef}
      file="optimize.py"
      status={<RunState state={state} />}
      title={t("opt.title")}
      actions={
        <LabButton onClick={() => restartFrom(DEFAULT_START)}>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v3.6H9.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("opt.replay")}
        </LabButton>
      }
      footer={
        <>{t("opt.footer")(STEPS)}</>
      }
    >
      <div className="relative mx-auto max-w-[26rem]">
        <canvas
          ref={canvasRef}
          className="aspect-square w-full cursor-crosshair rounded border border-line-soft bg-bg/40"
          onPointerMove={(e) => setHover(pointerToData(e))}
          onPointerLeave={() => setHover(null)}
          onClick={(e) => {
            const pt = pointerToData(e);
            if (pt) restartFrom([pt.x, pt.y]);
          }}
          role="img"
          aria-label={t("opt.aria")(start[0].toFixed(2), start[1].toFixed(2), step, STEPS)}
        />
        {hover && (
          <div
            className="pointer-events-none absolute z-10 rounded border border-line bg-surface-2/95 px-2.5 py-1.5 font-mono text-[0.66rem] text-ink-2 shadow-lg backdrop-blur"
            style={{
              left: hover.cx,
              top: hover.cy,
              transform: `translate(${hover.cx > hover.w * 0.55 ? "calc(-100% - 12px)" : "12px"}, -50%)`,
            }}
          >
            <p>
              ({hover.x.toFixed(2)}, {hover.y.toFixed(2)})
            </p>
            <p>
              f = <span className="text-ink">{rosenbrock(hover.x, hover.y).toFixed(2)}</span>
            </p>
            <p className="text-muted">{t("opt.clickHere")}</p>
          </div>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded border border-line">
        <table className="w-full font-mono text-[0.72rem]">
          <thead className="bg-surface-2/60 text-left">
            <tr className="text-muted">
              <th scope="col" className="px-3 py-2 font-normal">{t("opt.cols.optimizer")}</th>
              <th scope="col" className="px-3 py-2 text-right font-normal">{t("opt.cols.step")}</th>
              <th scope="col" className="px-3 py-2 text-right font-normal">{t("opt.cols.loss")}</th>
              <th scope="col" className="px-3 py-2 text-right font-normal">{t("opt.cols.dist")}</th>
            </tr>
          </thead>
          <tbody>
            {paths.map((p) => {
              const [x, y] = p.pts[step];
              return (
                <tr key={p.key} className="border-t border-line">
                  <td className="px-3 py-2">
                    <Key color={COLORS[p.key]} label={p.label} shape="line" />
                  </td>
                  <td className="num px-3 py-2 text-right text-ink-2">{step}</td>
                  <td className="num px-3 py-2 text-right text-ink">{rosenbrock(x, y).toFixed(3)}</td>
                  <td className="num px-3 py-2 text-right text-ink">{Math.hypot(x - MIN[0], y - MIN[1]).toFixed(3)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </LabFrame>
  );
}
