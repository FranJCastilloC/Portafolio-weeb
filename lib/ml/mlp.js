import { gaussian, mulberry32 } from "./random";

/* A small fully connected network trained with full-batch Adam: tanh hidden
   layers, sigmoid output, binary cross-entropy. Written out by hand so the
   demo trains for real in the browser with no dependency. */

export function twoMoons(n, noise, seed) {
  const rand = mulberry32(seed);
  const g = gaussian(rand);
  const X = new Float64Array(n * 2);
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = Math.PI * rand();
    const upper = i < n / 2;
    const x0 = upper ? Math.cos(t) : 1 - Math.cos(t);
    const x1 = upper ? Math.sin(t) : 0.5 - Math.sin(t);
    X[i * 2] = x0 - 0.5 + g() * noise;
    X[i * 2 + 1] = x1 - 0.25 + g() * noise;
    y[i] = upper ? 0 : 1;
  }
  return { X, y, n };
}

export function createMLP(sizes, seed) {
  const g = gaussian(mulberry32(seed));
  const layers = [];
  for (let l = 0; l < sizes.length - 1; l++) {
    const nin = sizes[l];
    const nout = sizes[l + 1];
    const scale = Math.sqrt(1 / nin);
    const W = new Float64Array(nin * nout).map(() => g() * scale);
    layers.push({
      nin,
      nout,
      W,
      b: new Float64Array(nout),
      mW: new Float64Array(nin * nout),
      vW: new Float64Array(nin * nout),
      mb: new Float64Array(nout),
      vb: new Float64Array(nout),
    });
  }
  return { sizes, layers, t: 0 };
}

const sigmoid = (z) => 1 / (1 + Math.exp(-z));

export function predict(net, x0, x1) {
  let a = [x0, x1];
  net.layers.forEach((L, l) => {
    const out = new Array(L.nout);
    for (let j = 0; j < L.nout; j++) {
      let z = L.b[j];
      for (let i = 0; i < L.nin; i++) z += L.W[j * L.nin + i] * a[i];
      out[j] = l === net.layers.length - 1 ? sigmoid(z) : Math.tanh(z);
    }
    a = out;
  });
  return a[0];
}

export function evaluate(net, data) {
  let loss = 0;
  let correct = 0;
  for (let s = 0; s < data.n; s++) {
    const p = Math.min(Math.max(predict(net, data.X[s * 2], data.X[s * 2 + 1]), 1e-7), 1 - 1e-7);
    loss -= data.y[s] * Math.log(p) + (1 - data.y[s]) * Math.log(1 - p);
    if ((p >= 0.5 ? 1 : 0) === data.y[s]) correct++;
  }
  return { loss: loss / data.n, acc: correct / data.n };
}

export function trainEpoch(net, data, lr = 0.02) {
  const { X, y, n } = data;
  const { layers } = net;
  const acts = [X];

  for (let l = 0; l < layers.length; l++) {
    const L = layers[l];
    const A = acts[l];
    const Z = new Float64Array(n * L.nout);
    const last = l === layers.length - 1;
    for (let s = 0; s < n; s++) {
      for (let j = 0; j < L.nout; j++) {
        let z = L.b[j];
        for (let i = 0; i < L.nin; i++) z += L.W[j * L.nin + i] * A[s * L.nin + i];
        Z[s * L.nout + j] = last ? sigmoid(z) : Math.tanh(z);
      }
    }
    acts.push(Z);
  }

  const P = acts[acts.length - 1];
  let loss = 0;
  let correct = 0;
  let dZ = new Float64Array(n);
  for (let s = 0; s < n; s++) {
    const p = Math.min(Math.max(P[s], 1e-7), 1 - 1e-7);
    loss -= y[s] * Math.log(p) + (1 - y[s]) * Math.log(1 - p);
    if ((P[s] >= 0.5 ? 1 : 0) === y[s]) correct++;
    dZ[s] = (P[s] - y[s]) / n;
  }

  net.t += 1;
  const b1 = 0.9;
  const b2 = 0.999;
  const c1 = 1 - b1 ** net.t;
  const c2 = 1 - b2 ** net.t;
  const adam = (w, m, v, i, grad) => {
    m[i] = b1 * m[i] + (1 - b1) * grad;
    v[i] = b2 * v[i] + (1 - b2) * grad * grad;
    w[i] -= (lr * (m[i] / c1)) / (Math.sqrt(v[i] / c2) + 1e-8);
  };

  for (let l = layers.length - 1; l >= 0; l--) {
    const L = layers[l];
    const A = acts[l];
    const dW = new Float64Array(L.nin * L.nout);
    const db = new Float64Array(L.nout);
    for (let s = 0; s < n; s++) {
      for (let j = 0; j < L.nout; j++) {
        const d = dZ[s * L.nout + j];
        db[j] += d;
        for (let i = 0; i < L.nin; i++) dW[j * L.nin + i] += d * A[s * L.nin + i];
      }
    }

    // Propagate before updating: the backward pass needs this layer's old weights
    if (l > 0) {
      const dPrev = new Float64Array(n * L.nin);
      for (let s = 0; s < n; s++) {
        for (let i = 0; i < L.nin; i++) {
          let acc = 0;
          for (let j = 0; j < L.nout; j++) acc += dZ[s * L.nout + j] * L.W[j * L.nin + i];
          const a = A[s * L.nin + i];
          dPrev[s * L.nin + i] = acc * (1 - a * a);
        }
      }
      dZ = dPrev;
    }

    for (let i = 0; i < dW.length; i++) adam(L.W, L.mW, L.vW, i, dW[i]);
    for (let j = 0; j < db.length; j++) adam(L.b, L.mb, L.vb, j, db[j]);
  }

  return { loss: loss / n, acc: correct / n };
}
