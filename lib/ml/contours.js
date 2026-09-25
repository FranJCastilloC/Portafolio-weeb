/* Marching squares for a single iso-level over a grid of values sampled at
   nx × ny vertices (row-major). Returns line segments in grid coordinates. */
export function isoSegments(values, nx, ny, level) {
  const segs = [];
  const v = (i, j) => values[j * nx + i];
  const lerp = (a, b) => (level - a) / (b - a);

  for (let j = 0; j < ny - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      const a = v(i, j);
      const b = v(i + 1, j);
      const c = v(i + 1, j + 1);
      const d = v(i, j + 1);
      const pts = [];
      if (a < level !== b < level) pts.push([i + lerp(a, b), j]);
      if (b < level !== c < level) pts.push([i + 1, j + lerp(b, c)]);
      if (d < level !== c < level) pts.push([i + lerp(d, c), j + 1]);
      if (a < level !== d < level) pts.push([i, j + lerp(a, d)]);
      if (pts.length === 2) segs.push([...pts[0], ...pts[1]]);
      else if (pts.length === 4) segs.push([...pts[0], ...pts[1]], [...pts[2], ...pts[3]]);
    }
  }
  return segs;
}
