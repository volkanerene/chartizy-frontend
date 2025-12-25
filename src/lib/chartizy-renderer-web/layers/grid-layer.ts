import * as PIXI from "pixi.js";
import type { GridLayer } from "../../chartizy-dsl";
import type { D3Scale } from "../scales";
import { colorToPixi } from "../effects";

export function renderGridLayer(
  layer: GridLayer,
  container: PIXI.Container,
  xScale: D3Scale,
  yScale: D3Scale,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
): void {
  if (!container || !container.parent) {
    console.warn("[GridLayer] Container invalid, skipping render");
    return;
  }

  const graphics = new PIXI.Graphics();
  const color = colorToPixi(layer.color);
  const alpha = layer.opacity;

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const plotX = padding.left;
  const plotY = padding.top;

  // Get tick positions from scales
  let xTicks: number[] = [];
  let yTicks: number[] = [];

  if ("ticks" in xScale && typeof xScale.ticks === "function") {
    xTicks = xScale.ticks().map((t) => xScale(t as any) as number);
  } else if ("domain" in xScale) {
    const domain = xScale.domain();
    if (Array.isArray(domain) && domain.length > 0) {
      const step = plotWidth / Math.max(domain.length - 1, 1);
      xTicks = domain.map((_, i) => plotX + i * step);
    }
  }

  if ("ticks" in yScale && typeof yScale.ticks === "function") {
    yTicks = yScale.ticks().map((t) => yScale(t as any) as number);
  } else if ("domain" in yScale) {
    const domain = yScale.domain();
    if (Array.isArray(domain) && domain.length > 0) {
      const step = plotHeight / Math.max(domain.length - 1, 1);
      yTicks = domain.map((_, i) => plotY + i * step);
    }
  }

  // Draw grid lines
  if (layer.direction === "vertical" || layer.direction === "both") {
    xTicks.forEach((x) => {
      graphics.lineStyle(layer.width, color, alpha);
      graphics.moveTo(x, plotY);
      graphics.lineTo(x, plotY + plotHeight);
    });
  }

  if (layer.direction === "horizontal" || layer.direction === "both") {
    yTicks.forEach((y) => {
      graphics.lineStyle(layer.width, color, alpha);
      graphics.moveTo(plotX, y);
      graphics.lineTo(plotX + plotWidth, y);
    });
  }

  if (container && container.parent) {
    container.addChild(graphics);
  }
}
