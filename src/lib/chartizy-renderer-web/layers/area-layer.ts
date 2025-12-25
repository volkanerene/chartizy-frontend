import * as PIXI from "pixi.js";
import type { AreaLayer, Data } from "../../chartizy-dsl";
import type { D3Scale } from "../scales";
import { colorToPixi, applyEffects } from "../effects";

export function renderAreaLayer(
  layer: AreaLayer,
  container: PIXI.Container,
  data: Data,
  xScale: D3Scale,
  yScale: D3Scale,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
): void {
  if (!container || !container.parent) {
    console.warn("[AreaLayer] Container invalid, skipping render");
    return;
  }

  const graphics = new PIXI.Graphics();

  // Extract data points (same as line layer)
  let dataPoints: Array<{ x: number | string; y: number }> = [];

  if (Array.isArray(data.source)) {
    dataPoints = data.source.map((item, idx) => {
      if (typeof item === "object" && item !== null) {
        const xValue = layer.xField
          ? (item[layer.xField] as number | string)
          : idx;
        const yValue = layer.yField
          ? (item[layer.yField] as number)
          : (Object.values(item).find((v) => typeof v === "number") as number) || 0;
        return { x: xValue, y: yValue };
      }
      return { x: idx, y: 0 };
    });
  } else if (
    typeof data.source === "object" &&
    "labels" in data.source &&
    "datasets" in data.source
  ) {
    const labels = data.source.labels as (string | number)[];
    const datasets = data.source.datasets as Array<{ data: number[] }>;
    datasets.forEach((dataset) => {
      dataset.data.forEach((value, idx) => {
        dataPoints.push({
          x: labels[idx] || idx,
          y: value,
        });
      });
    });
  }

  // Sort by x value
  dataPoints.sort((a, b) => {
    const aX = typeof a.x === "number" ? a.x : 0;
    const bX = typeof b.x === "number" ? b.x : 0;
    return aX - bX;
  });

  if (dataPoints.length === 0) {
    return;
  }

  const color = colorToPixi(layer.color);
  const zeroY = yScale(0) as number;

  // Draw area
  const firstPoint = dataPoints[0];
  const firstX = xScale(firstPoint.x) as number;
  const firstY = yScale(firstPoint.y) as number;

  graphics.beginFill(color, layer.opacity);
  graphics.moveTo(firstX, zeroY);
  graphics.lineTo(firstX, firstY);

  for (let i = 1; i < dataPoints.length; i++) {
    const point = dataPoints[i];
    const x = xScale(point.x) as number;
    const y = yScale(point.y) as number;
    graphics.lineTo(x, y);
  }

  const lastPoint = dataPoints[dataPoints.length - 1];
  const lastX = xScale(lastPoint.x) as number;
  graphics.lineTo(lastX, zeroY);
  graphics.closePath();
  graphics.endFill();

  // Apply effects
  if (layer.effects) {
    applyEffects(graphics, layer.effects);
  }

  if (container && container.parent) {
    container.addChild(graphics);
  }
}
