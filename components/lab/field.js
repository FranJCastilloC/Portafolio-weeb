/* Paints a scalar field sampled on an nx × ny vertex grid as one smoothed image.
   Filling cells one rect at a time leaves visible seams wherever translucent
   neighbours overlap; a single upscaled bitmap has none and is far cheaper. */
export function paintField(ctx, nx, ny, rgbaAt, rect) {
  let off = ctx.__fieldCanvas;
  if (!off || off.width !== nx || off.height !== ny) {
    off = document.createElement("canvas");
    off.width = nx;
    off.height = ny;
    ctx.__fieldCanvas = off;
  }
  const octx = off.getContext("2d");
  const img = octx.createImageData(nx, ny);
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const [r, g, b, a] = rgbaAt(i, j);
      const k = (j * nx + i) * 4;
      img.data[k] = r;
      img.data[k + 1] = g;
      img.data[k + 2] = b;
      img.data[k + 3] = Math.round(a * 255);
    }
  }
  octx.putImageData(img, 0, 0);

  // Stretch by half a cell each side so pixel centres land on the grid vertices,
  // keeping colour edges aligned with contours computed from the same vertices
  const cw = rect.w / (nx - 1);
  const ch = rect.h / (ny - 1);
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(off, rect.x - cw / 2, rect.y - ch / 2, rect.w + cw, rect.h + ch);
  ctx.restore();
}
