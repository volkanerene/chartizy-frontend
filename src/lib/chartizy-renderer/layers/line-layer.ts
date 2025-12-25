import type { LineLayer, Data } from "@/lib/chartizy-dsl";
import type { D3Scale } from "../scales";
import { extractDataPoints } from "../data";
import { colorToCanvas, applyEffects } from "../effects";

export const renderLineLayer = (
  ctx: CanvasRenderingContext2D,
  layer: LineLayer,
  data: Data,
  xScale: D3Scale,
  yScale: D3Scale
) => {
  const points = extractDataPoints(data, layer.xField, layer.yField);
  if (points.length === 0) return;

  points.sort((a, b) => {
    const aValue = typeof a.x === "number" ? a.x : 0;
    const bValue = typeof b.x === "number" ? b.x : 0;
    return aValue - bValue;
  });

  ctx.save();
  applyEffects(ctx, layer.effects);
  ctx.strokeStyle = colorToCanvas(layer.color);
  ctx.lineWidth = layer.width ?? 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

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

  if (layer.showPoints) {
    ctx.fillStyle = colorToCanvas(layer.color);
    points.forEach((point) => {
      const x = xScale(point.x) as number;
      const y = yScale(point.y) as number;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  ctx.restore();
};
