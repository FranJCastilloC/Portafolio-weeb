/* Rosenbrock's banana: a narrow curved valley with its minimum at (1, 1).
   Easy to find, hard to follow — which is what separates the optimizers. */
export const rosenbrock = (x, y) => (1 - x) ** 2 + 100 * (y - x * x) ** 2;

const grad = (x, y) => [-2 * (1 - x) - 400 * x * (y - x * x), 200 * (y - x * x)];

export const OPTIMIZERS = [
  { key: "sgd", label: "SGD", lr: 0.0012 },
  { key: "momentum", label: "Momentum", lr: 0.00025, beta: 0.93 },
  { key: "adam", label: "Adam", lr: 0.06 },
];

// Clipping keeps plain SGD from diverging off the steep walls at larger steps
const clip = (g, max = 250) => {
  const norm = Math.hypot(g[0], g[1]);
  return norm > max ? [(g[0] / norm) * max, (g[1] / norm) * max] : g;
};

export function trajectory(opt, start, steps) {
  let [x, y] = start;
  const out = [[x, y]];
  let vx = 0;
  let vy = 0;
  let m = [0, 0];
  let v = [0, 0];

  for (let t = 1; t <= steps; t++) {
    const g = clip(grad(x, y));
    if (opt.key === "sgd") {
      x -= opt.lr * g[0];
      y -= opt.lr * g[1];
    } else if (opt.key === "momentum") {
      vx = opt.beta * vx - opt.lr * g[0];
      vy = opt.beta * vy - opt.lr * g[1];
      x += vx;
      y += vy;
    } else {
      m = [0.9 * m[0] + 0.1 * g[0], 0.9 * m[1] + 0.1 * g[1]];
      v = [0.999 * v[0] + 0.001 * g[0] ** 2, 0.999 * v[1] + 0.001 * g[1] ** 2];
      const c1 = 1 - 0.9 ** t;
      const c2 = 1 - 0.999 ** t;
      x -= (opt.lr * (m[0] / c1)) / (Math.sqrt(v[0] / c2) + 1e-8);
      y -= (opt.lr * (m[1] / c1)) / (Math.sqrt(v[1] / c2) + 1e-8);
    }
    out.push([x, y]);
  }
  return out;
}
