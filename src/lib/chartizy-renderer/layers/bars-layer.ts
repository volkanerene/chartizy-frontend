import type { BarsLayer, Data } from "@/lib/chartizy-dsl";
import type { D3Scale } from "../scales";
import { extractDataPoints } from "../data";
import { colorToCanvas, applyEffects } from "../effects";

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const effectiveRadius = Math.max(0, Math.min(radius, Math.abs(height) / 2, width / 2));
  ctx.beginPath();
  ctx.moveTo(x + effectiveRadius, y);
  ctx.lineTo(x + width - effectiveRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + effectiveRadius);
  ctx.lineTo(x + width, y + height - effectiveRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - effectiveRadius, y + height);
  ctx.lineTo(x + effectiveRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - effectiveRadius);
  ctx.lineTo(x, y + effectiveRadius);
  ctx.quadraticCurveTo(x, y, x + effectiveRadius, y);
  ctx.closePath();
};

export const renderBarsLayer = (
  ctx: CanvasRenderingContext2D,
  layer: BarsLayer,
  data: Data,
  xScale: D3Scale,
  yScale: D3Scale
) => {
  const points = extractDataPoints(data, layer.xField, layer.yField);
  if (points.length === 0) return;

  const colors = Array.isArray(layer.color) ? layer.color : [layer.color];

  let barWidth = 20;
  if ("bandwidth" in xScale && typeof xScale.bandwidth === "function") {
    barWidth = xScale.bandwidth() * layer.width;
  } else if (points.length > 1) {
    const firstX = xScale(points[0].x) as number;
    const secondX = xScale(points[1].x) as number;
    barWidth = Math.abs(secondX - firstX) * layer.width;
  }

  ctx.save();
  applyEffects(ctx, layer.effects);

  points.forEach((point, index) => {
    const x = xScale(point.x) as number;
    const y = yScale(point.y) as number;
    const zeroY = yScale(0) as number;
    const height = zeroY - y;
    const rectX = x - barWidth * 0.5;
    const rectY = height >= 0 ? y : y - Math.abs(height);

    ctx.fillStyle = colorToCanvas(colors[index % colors.length]);
    drawRoundedRect(ctx, rectX, rectY, barWidth, Math.abs(height), layer.borderRadius ?? 4);
    ctx.fill();
  });

  ctx.restore();
};
