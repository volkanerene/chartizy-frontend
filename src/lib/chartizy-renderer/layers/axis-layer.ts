import type { AxisLayer } from "@/lib/chartizy-dsl";

export const renderAxisLayer = (
  ctx: CanvasRenderingContext2D,
  layer: AxisLayer,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
) => {
  ctx.save();
  ctx.strokeStyle = layer.color || "#94A3B8";
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.9;

  if (layer.type === "axis-x") {
    const y = height - padding.bottom;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  } else {
    const x = padding.left;
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, height - padding.bottom);
    ctx.stroke();
  }
  ctx.restore();
};
