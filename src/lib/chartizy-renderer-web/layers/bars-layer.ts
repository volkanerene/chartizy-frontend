import * as PIXI from "pixi.js";
import type { BarsLayer, Data } from "../../chartizy-dsl";
import type { D3Scale } from "../scales";
import { colorToPixi, applyEffects } from "../effects";

export function renderBarsLayer(
  layer: BarsLayer,
  container: PIXI.Container,
  data: Data,
  xScale: D3Scale,
  yScale: D3Scale,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
): void {
  if (!container || !container.parent) {
    console.warn("[BarsLayer] Container invalid, skipping render");
    return;
  }

  const graphics = new PIXI.Graphics();

  // Extract data points
  let dataPoints: Array<{ x: number | string; y: number; label?: string }> = [];

  if (Array.isArray(data.source)) {
    // Array of objects
    dataPoints = data.source.map((item, idx) => {
      if (typeof item === "object" && item !== null) {
        const xValue = layer.xField
          ? (item[layer.xField] as number | string)
          : idx;
        const yValue = layer.yField
          ? (item[layer.yField] as number)
          : (Object.values(item).find((v) => typeof v === "number") as number) || 0;
        return {
          x: xValue,
          y: yValue,
          label: String(item[layer.xField || "label"] || idx),
        };
      }
      return { x: idx, y: 0 };
    });
  } else if (
    typeof data.source === "object" &&
    "labels" in data.source &&
    "datasets" in data.source
  ) {
    // Chart.js format
    const labels = data.source.labels as (string | number)[];
    const datasets = data.source.datasets as Array<{ data: number[] }>;
    datasets.forEach((dataset, datasetIdx) => {
      dataset.data.forEach((value, idx) => {
        dataPoints.push({
          x: labels[idx] || idx,
          y: value,
          label: String(labels[idx] || idx),
        });
      });
    });
  }

  // Get colors
  const colors = Array.isArray(layer.color)
    ? layer.color
    : [layer.color];

  // Calculate bar width from scale
  let barWidth = 20; // Default
  if ("bandwidth" in xScale && typeof xScale.bandwidth === "function") {
    barWidth = xScale.bandwidth() * layer.width;
  } else if (dataPoints.length > 1) {
    const firstX = xScale(dataPoints[0].x) as number;
    const secondX = xScale(dataPoints[1].x) as number;
    barWidth = Math.abs(secondX - firstX) * layer.width;
  }

  // Draw bars
  dataPoints.forEach((point, idx) => {
    const x = xScale(point.x) as number;
    const y = yScale(point.y) as number;
    const zeroY = yScale(0) as number;

    const barHeight = Math.abs(zeroY - y);
    const barX = x - (barWidth * 0.5);
    const barY = Math.min(y, zeroY);

    const color = colors[idx % colors.length];
    const pixiColor = colorToPixi(color);

    // Draw bar
    graphics.beginFill(pixiColor);
    graphics.drawRoundedRect(barX, barY, barWidth, barHeight, layer.borderRadius);
    graphics.endFill();
  });

  // Apply effects
  if (layer.effects) {
    applyEffects(graphics, layer.effects);
  }

  if (container && container.parent) {
    container.addChild(graphics);
  }
}
