"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import LabFrame, { Key, LabButton, RunState, Stat } from "@/components/lab/LabFrame";
import { useCanvas, useFrameLoop, useInView, useReducedMotion } from "@/components/hooks/motion";
import { createMLP, evaluate, predict, trainEpoch, twoMoons } from "@/lib/ml/mlp";
import { isoSegments } from "@/lib/ml/contours";
import { paintField } from "@/components/lab/field";
import { useLang } from "@/lib/i18n/LanguageProvider";

const SIZES = [2, 16, 16, 1];
const LR = 0.01;
const MAX_EPOCHS = 600;
const PER_FRAME = 2;
const NOISE = 0.25;
const DOMAIN = { x0: -2.3, x1: 2.3, y0: -1.6, y1: 1.6 };

// Validated diverging poles for the dark surface: blue (class A) and amber (class B)
const CLASS_A = [43, 144, 217];
const CLASS_B = [201, 133, 0];
const LOSS_TRAIN = "var(--color-s1)";
const LOSS_VAL = "var(--color-s5)";

function freshHistory() {
  return { train: [], val: [], trainAcc: 0, valAcc: 0, best: { epoch: 0, loss: Infinity }, bestNet: null };
}

// Inference only needs weights; the Adam moments stay with the live network
const snapshot = (net) => ({
  ...net,
  layers: net.layers.map((L) => ({ ...L, W: L.W.slice(), b: L.b.slice() })),
});

export default function NeuralNetDemo() {
  const { t } = useLang();
  const frameRef = useRef(null);
  const inView = useInView(frameRef, { rootMargin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();

  const train = useMemo(() => twoMoons(160, NOISE, 7), []);
  const val = useMemo(() => twoMoons(160, NOISE, 99), []);

  const [initSeed, setInitSeed] = useState(1);
  const [epoch, setEpoch] = useState(0);
  const [hover, setHover] = useState(null);
  const [weights, setWeights] = useState("final");
  const net = useRef(null);
  const hist = useRef(freshHistory());

  const reset = (seed) => {
    net.current = createMLP(SIZES, seed);
    hist.current = freshHistory();
    setWeights("final");
    setEpoch(0);
  };
  if (!net.current) net.current = createMLP(SIZES, initSeed);

  const step = () => {
    const h = hist.current;
    let r;
    let v;
    for (let k = 0; k < PER_FRAME && h.train.length < MAX_EPOCHS; k++) {
      r = trainEpoch(net.current, train, LR);
      v = evaluate(net.current, val);
      h.train.push(r.loss);
      h.val.push(v.loss);
      if (v.loss < h.best.loss) {
        h.best = { epoch: h.train.length, loss: v.loss, acc: v.acc };
        h.bestNet = snapshot(net.current);
      }
    }
    if (r) {
      h.trainAcc = r.acc;
      h.valAcc = v.acc;
    }
    setEpoch(h.train.length);
    return h.train.length < MAX_EPOCHS;
  };

  // Reduced motion: train to completion once and show the finished state
  useEffect(() => {
    if (!reduced || !inView || epoch >= MAX_EPOCHS) return;
    while (step()) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, inView, initSeed]);

  const done = epoch >= MAX_EPOCHS;
  const running = inView && !done && !reduced;
  useFrameLoop(running, step);

  const viewingBest = done && weights === "best" && hist.current.bestNet;
  const model = viewingBest ? hist.current.bestNet : net.current;
  const accuracy = useMemo(
    () =>
      viewingBest
        ? { train: evaluate(model, train).acc, val: evaluate(model, val).acc }
        : { train: hist.current.trainAcc, val: hist.current.valAcc },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewingBest, epoch, initSeed]
  );

  const canvasRef = useCanvas(
    (ctx, w, h) => {
      const scale = Math.min(w / (DOMAIN.x1 - DOMAIN.x0), h / (DOMAIN.y1 - DOMAIN.y0));
      const ox = (w - (DOMAIN.x1 - DOMAIN.x0) * scale) / 2;
      const oy = (h - (DOMAIN.y1 - DOMAIN.y0) * scale) / 2;
      const toPx = (x, y) => [ox + (x - DOMAIN.x0) * scale, oy + (DOMAIN.y1 - y) * scale];

      // Probability field on a vertex grid: cells for colour, vertices for the contour
      const nx = 72;
      const ny = Math.round((nx * (DOMAIN.y1 - DOMAIN.y0)) / (DOMAIN.x1 - DOMAIN.x0));
      const grid = new Float64Array(nx * ny);
      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          const x = DOMAIN.x0 + (i / (nx - 1)) * (DOMAIN.x1 - DOMAIN.x0);
          const y = DOMAIN.y1 - (j / (ny - 1)) * (DOMAIN.y1 - DOMAIN.y0);
          grid[j * nx + i] = predict(model, x, y);
        }
      }
      const fieldW = (DOMAIN.x1 - DOMAIN.x0) * scale;
      const fieldH = (DOMAIN.y1 - DOMAIN.y0) * scale;
      const cw = fieldW / (nx - 1);
      const ch = fieldH / (ny - 1);
      // Diverging: blue ← neutral (transparent over the surface) → amber
      paintField(
        ctx,
        nx,
        ny,
        (i, j) => {
          const p = grid[j * nx + i];
          const t = Math.abs(p - 0.5) * 2;
          return [...(p < 0.5 ? CLASS_A : CLASS_B), 0.04 + 0.32 * t ** 1.4];
        },
        { x: ox, y: oy, w: fieldW, h: fieldH }
      );

      // Decision boundary p = 0.5
      ctx.strokeStyle = "rgba(231,238,246,0.85)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      isoSegments(grid, nx, ny, 0.5).forEach(([x0, y0, x1, y1]) => {
        ctx.moveTo(ox + x0 * cw, oy + y0 * ch);
        ctx.lineTo(ox + x1 * cw, oy + y1 * ch);
      });
      ctx.stroke();

      // Training points: ≥8px markers with a 2px surface ring
      for (let s = 0; s < train.n; s++) {
        const [px, py] = toPx(train.X[s * 2], train.X[s * 2 + 1]);
        const [r, g, b] = train.y[s] ? CLASS_B : CLASS_A;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#0a0e14";
        ctx.stroke();
      }

      if (hover) {
        const [px, py] = toPx(hover.x, hover.y);
        ctx.strokeStyle = "rgba(231,238,246,0.9)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.stroke();
      }

      canvasRef.current.toData = (cx, cy) => [
        DOMAIN.x0 + (cx - ox) / scale,
        DOMAIN.y1 - (cy - oy) / scale,
      ];
    },
    [epoch, initSeed, hover, weights]
  );

  const onMove = (e) => {
    const c = canvasRef.current;
    if (!c?.toData) return;
    const r = c.getBoundingClientRect();
    const [x, y] = c.toData(e.clientX - r.left, e.clientY - r.top);
    if (x < DOMAIN.x0 || x > DOMAIN.x1 || y < DOMAIN.y0 || y > DOMAIN.y1) return setHover(null);
    setHover({ x, y, p: predict(model, x, y), cx: e.clientX - r.left, cy: e.clientY - r.top, w: r.width });
  };

  const h = hist.current;
  const state = done ? "done" : running ? "running" : epoch > 0 ? "paused" : "idle";

  return (
    <LabFrame
      ref={frameRef}
      file="train.py"
      status={<RunState state={state} />}
      title={t("nn.title")}
      actions={
        <LabButton
          onClick={() => {
            const next = initSeed + 1;
            setInitSeed(next);
            setHover(null);
            reset(next);
          }}
        >
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v3.6H9.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("nn.retrain")}
        </LabButton>
      }
      footer={
        <>{t("nn.footer")(SIZES.join("→"), LR, NOISE, train.n, val.n)}</>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="aspect-[23/16] w-full cursor-crosshair rounded border border-line-soft bg-bg/40"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
            role="img"
            aria-label={t("nn.aria")(epoch, (accuracy.train * 100).toFixed(0), (accuracy.val * 100).toFixed(0))}
          />
          {hover && (
            <div
              className="pointer-events-none absolute z-10 rounded border border-line bg-surface-2/95 px-2.5 py-1.5 font-mono text-[0.66rem] text-ink-2 shadow-lg backdrop-blur"
              style={{
                left: hover.cx,
                top: hover.cy,
                transform: `translate(${hover.cx > hover.w * 0.6 ? "calc(-100% - 12px)" : "12px"}, -50%)`,
              }}
            >
              {t("nn.pClassB")} <span className="text-ink">{hover.p.toFixed(3)}</span>
            </div>
          )}
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
            <Key color={`rgb(${CLASS_A})`} label={t("nn.classA")} shape="dot" />
            <Key color={`rgb(${CLASS_B})`} label={t("nn.classB")} shape="dot" />
            <Key color="rgba(231,238,246,0.85)" label={t("nn.boundary")} shape="line" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded border border-line bg-line">
            <Stat label={t("nn.epoch")} value={viewingBest ? h.best.epoch : epoch} sub={`/${MAX_EPOCHS}`} />
            <Stat label={t("nn.trainAcc")} value={`${(accuracy.train * 100).toFixed(1)}%`} />
            <Stat label={t("nn.valAcc")} value={`${(accuracy.val * 100).toFixed(1)}%`} />
          </dl>

          {done && h.bestNet && (
            <div className="rounded border border-line bg-surface-2/40 p-3">
              <p className="tag mb-2">{t("nn.whichWeights")}</p>
              <div className="flex flex-wrap gap-2">
                <LabButton active={weights === "final"} onClick={() => setWeights("final")}>
                  {t("nn.final")} · ep {MAX_EPOCHS}
                </LabButton>
                <LabButton active={weights === "best"} onClick={() => setWeights("best")}>
                  {t("nn.early")} · ep {h.best.epoch}
                </LabButton>
              </div>
              <p className="mt-2 text-[0.72rem] leading-relaxed text-muted">
                {t("nn.weightsNote")}
              </p>
            </div>
          )}

          <LossChart history={h} highlightBest={viewingBest} />
        </div>
      </div>
    </LabFrame>
  );
}

const LC = { w: 340, h: 176, x0: 30, x1: 330, y0: 12, y1: 150, yMax: 0.8 };

function LossChart({ history, highlightBest }) {
  const { t } = useLang();
  const svgRef = useRef(null);
  const [hoverEp, setHoverEp] = useState(null);
  const sx = (e) => LC.x0 + (e / MAX_EPOCHS) * (LC.x1 - LC.x0);
  const sy = (v) => LC.y1 - (Math.min(v, LC.yMax) / LC.yMax) * (LC.y1 - LC.y0);
  const line = (arr) => arr.map((v, i) => `${i ? "L" : "M"}${sx(i + 1).toFixed(1)},${sy(v).toFixed(1)}`).join("");

  const n = history.train.length;
  const best = history.best;
  const showBest = n > 40 && best.epoch > 0 && n - best.epoch > 20;

  const onMove = (e) => {
    if (!n) return;
    const r = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * LC.w;
    const ep = Math.round(((x - LC.x0) / (LC.x1 - LC.x0)) * MAX_EPOCHS);
    setHoverEp(ep >= 1 && ep <= n ? ep : null);
  };

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="tag">{t("nn.lossTitle")}</p>
        <div className="flex gap-3">
          <Key color={LOSS_TRAIN} label={t("nn.train")} shape="line" />
          <Key color={LOSS_VAL} label={t("nn.validation")} shape="line" />
        </div>
      </div>
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${LC.w} ${LC.h}`}
          className="w-full touch-pan-y"
          onPointerMove={onMove}
          onPointerLeave={() => setHoverEp(null)}
          role="img"
          aria-label={t("nn.lossAria")(n, Number.isFinite(best.loss) ? best.loss.toFixed(3) : "n/a", best.epoch)}
        >
          {[0, 0.2, 0.4, 0.6, 0.8].map((v) => (
            <g key={v}>
              <line x1={LC.x0} x2={LC.x1} y1={sy(v)} y2={sy(v)} stroke="var(--color-line-soft)" />
              <text x={LC.x0 - 5} y={sy(v)} textAnchor="end" dominantBaseline="middle" fill="var(--color-muted)" fontSize="10" fontFamily="var(--font-mono)">
                {v.toFixed(1)}
              </text>
            </g>
          ))}
          {[0, 200, 400, 600].map((e) => (
            <text key={e} x={sx(e)} y={LC.y1 + 16} textAnchor="middle" fill="var(--color-muted)" fontSize="10" fontFamily="var(--font-mono)">
              {e}
            </text>
          ))}

          {showBest && (
            <g>
              <line x1={sx(best.epoch)} x2={sx(best.epoch)} y1={LC.y0} y2={LC.y1} stroke="var(--color-ink-2)" strokeOpacity="0.4" />
              <text x={sx(best.epoch) + 5} y={LC.y0 + 9} fill="var(--color-ink-2)" fontSize="10" fontFamily="var(--font-mono)">
                {t("nn.earlyStop")} {best.epoch}
              </text>
            </g>
          )}

          <path d={line(history.train)} fill="none" stroke={LOSS_TRAIN} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <path d={line(history.val)} fill="none" stroke={LOSS_VAL} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {showBest && (
            <circle cx={sx(best.epoch)} cy={sy(best.loss)} r={highlightBest ? 6 : 4} fill={LOSS_VAL} stroke="var(--color-surface)" strokeWidth="2" />
          )}

          {hoverEp && (
            <g pointerEvents="none">
              <line x1={sx(hoverEp)} x2={sx(hoverEp)} y1={LC.y0} y2={LC.y1} stroke="var(--color-ink-2)" strokeOpacity="0.5" />
              <circle cx={sx(hoverEp)} cy={sy(history.train[hoverEp - 1])} r="4" fill={LOSS_TRAIN} stroke="var(--color-surface)" strokeWidth="2" />
              <circle cx={sx(hoverEp)} cy={sy(history.val[hoverEp - 1])} r="4" fill={LOSS_VAL} stroke="var(--color-surface)" strokeWidth="2" />
            </g>
          )}
        </svg>
        {hoverEp && (
          <div
            className="pointer-events-none absolute top-1 z-10 rounded border border-line bg-surface-2/95 px-2.5 py-1.5 font-mono text-[0.66rem] shadow-lg backdrop-blur"
            style={{
              left: `${(sx(hoverEp) / LC.w) * 100}%`,
              transform: sx(hoverEp) > LC.w * 0.55 ? "translateX(calc(-100% - 8px))" : "translateX(8px)",
            }}
          >
            <p className="text-ink">{t("nn.epoch")} {hoverEp}</p>
            <p className="text-ink-2">{t("nn.train")} <span className="text-ink">{history.train[hoverEp - 1].toFixed(3)}</span></p>
            <p className="text-ink-2">{t("nn.val")} <span className="text-ink">{history.val[hoverEp - 1].toFixed(3)}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
