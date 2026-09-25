"use client";

import { useEffect, useRef, useState } from "react";

/* Observe the chart's HTML wrapper, never an SVG child: an element inside
   <defs>/<clipPath> has no layout box, so IntersectionObserver never reports it
   as visible once the chart starts below the fold. */
export function useInView(ref, { once = false, rootMargin = "0px" } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, rootMargin]);

  return inView;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/* Seconds elapsed on a one-shot timeline, driven by requestAnimationFrame.
   Restarts whenever `restartKey` changes; jumps to the end under reduced motion. */
export function useTimeline(play, total, restartKey) {
  const [time, setTime] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!play) return;
    if (reduced) {
      setTime(total);
      return;
    }
    let raf;
    let start;
    setTime(0);
    const tick = (now) => {
      start ??= now;
      const t = Math.min((now - start) / 1000, total);
      setTime(t);
      if (t < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, total, restartKey, reduced]);

  return time;
}

/* Calls `step` once per frame while `running`; the loop owns no state, so the
   caller decides what a frame means. */
export function useFrameLoop(running, step) {
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    if (!running) return;
    let raf;
    const tick = (now) => {
      if (stepRef.current(now) === false) return;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}

export const easeOut = (t) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);

/* Canvas sized to its box at device pixel ratio; returns a draw-ready 2D context
   in CSS pixels and re-runs `draw` on resize. */
export function useCanvas(draw, deps) {
  const ref = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !size.w || !size.h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== size.w * dpr || canvas.height !== size.h * dpr) {
      canvas.width = size.w * dpr;
      canvas.height = size.h * dpr;
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size.w, size.h);
    draw(ctx, size.w, size.h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, ...deps]);

  return ref;
}
