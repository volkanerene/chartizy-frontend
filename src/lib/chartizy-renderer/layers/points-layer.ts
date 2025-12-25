import type { PointsLayer, Data } from "@/lib/chartizy-dsl";
import type { D3Scale } from "../scales";
import { extractDataPoints } from "../data";
import { colorToCanvas, applyEffects } from "../effects";

export const renderPointsLayer = (
  ctx: CanvasRenderingContext2D,
  layer: PointsLayer,
  data: Data,
  xScale: D3Scale,
  yScale: D3Scale
) => {
  const points = extractDataPoints(data, layer.xField, layer.yField);
  if (points.length === 0) return;

  ctx.save();
  applyEffects(ctx, layer.effects);
  ctx.fillStyle = colorToCanvas(layer.color);

  const radius = typeof layer.size === "number" ? layer.size / 2 : 5;

  points.forEach((point) => {
    const x = xScale(point.x) as number;
    const y = yScale(point.y) as number;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
};
