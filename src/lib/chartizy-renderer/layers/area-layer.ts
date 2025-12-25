import type { AreaLayer, Data } from "@/lib/chartizy-dsl";
import type { D3Scale } from "../scales";
import { extractDataPoints } from "../data";
import { createGradient, colorToCanvas, applyEffects } from "../effects";

export const renderAreaLayer = (
  ctx: CanvasRenderingContext2D,
  layer: AreaLayer,
  data: Data,
  xScale: D3Scale,
  yScale: D3Scale,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
) => {
  const points = extractDataPoints(data, layer.xField, layer.yField);
  if (points.length === 0) return;

  points.sort((a, b) => {
    const aValue = typeof a.x === "number" ? a.x : 0;
    const bValue = typeof b.x === "number" ? b.x : 0;
    return aValue - bValue;
  });

  const baseY = yScale(0) as number;

  ctx.save();
  applyEffects(ctx, layer.effects);

  if (layer.effects?.gradient) {
    ctx.fillStyle = createGradient(ctx, layer.effects.gradient, width, height);
  } else {
    ctx.fillStyle = colorToCanvas(layer.color);
  }
  ctx.globalAlpha = layer.opacity ?? 0.7;

  ctx.beginPath();
  points.forEach((point, index) => {
    const x = xScale(point.x) as number;
    const y = yScale(point.y) as number;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else if (layer.smooth) {
      const prevPoint = points[index - 1];
      const prevX = xScale(prevPoint.x) as number;
      const prevY = yScale(prevPoint.y) as number;
      const cpX = (prevX + x) / 2;
      const cpY = (prevY + y) / 2;
      ctx.quadraticCurveTo(prevX, prevY, cpX, cpY);
    } else {
      ctx.lineTo(x, y);
    }
  });

  const lastX = xScale(points[points.length - 1].x) as number;
  ctx.lineTo(lastX, baseY);
  const firstX = xScale(points[0].x) as number;
  ctx.lineTo(firstX, baseY);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = colorToCanvas(layer.stroke?.color || layer.color);
  ctx.lineWidth = layer.stroke?.width ?? 2;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  points.forEach((point, index) => {
    const x = xScale(point.x) as number;
    const y = yScale(point.y) as number;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else if (layer.smooth) {
      const prevPoint = points[index - 1];
      const prevX = xScale(prevPoint.x) as number;
      const prevY = yScale(prevPoint.y) as number;
      const cpX = (prevX + x) / 2;
      const cpY = (prevY + y) / 2;
      ctx.quadraticCurveTo(prevX, prevY, cpX, cpY);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
  ctx.restore();
};
