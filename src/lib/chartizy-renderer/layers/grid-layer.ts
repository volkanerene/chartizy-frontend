import type { GridLayer } from "@/lib/chartizy-dsl";
import type { D3Scale } from "../scales";

export const renderGridLayer = (
  ctx: CanvasRenderingContext2D,
  layer: GridLayer,
  xScale: D3Scale,
  yScale: D3Scale,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
) => {
  ctx.save();
  ctx.strokeStyle = layer.color;
  ctx.lineWidth = layer.width ?? 1;
  ctx.globalAlpha = layer.opacity ?? 0.5;

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const plotX = padding.left;
  const plotY = padding.top;

  let xTicks: number[] = [];
  let yTicks: number[] = [];

  if ("ticks" in xScale && typeof xScale.ticks === "function") {
    xTicks = xScale.ticks().map((value) => xScale(value as any) as number);
  } else if ("domain" in xScale) {
    const domain = xScale.domain();
    if (Array.isArray(domain) && domain.length > 0) {
      const step = plotWidth / Math.max(domain.length - 1, 1);
      xTicks = domain.map((_, index) => plotX + index * step);
    }
  }

  if ("ticks" in yScale && typeof yScale.ticks === "function") {
    yTicks = yScale.ticks().map((value) => yScale(value as any) as number);
  } else if ("domain" in yScale) {
    const domain = yScale.domain();
    if (Array.isArray(domain) && domain.length > 0) {
      const step = plotHeight / Math.max(domain.length - 1, 1);
      yTicks = domain.map((_, index) => plotY + index * step);
    }
  }

  if (layer.direction === "vertical" || layer.direction === "both") {
    xTicks.forEach((x) => {
      ctx.beginPath();
      ctx.moveTo(x, plotY);
      ctx.lineTo(x, plotY + plotHeight);
      ctx.stroke();
    });
  }

  if (layer.direction === "horizontal" || layer.direction === "both") {
    yTicks.forEach((y) => {
      ctx.beginPath();
      ctx.moveTo(plotX, y);
      ctx.lineTo(plotX + plotWidth, y);
      ctx.stroke();
    });
  }

  ctx.restore();
};
