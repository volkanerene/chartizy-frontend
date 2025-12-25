import * as PIXI from "pixi.js";
import type { PointsLayer, Data } from "../../chartizy-dsl";
import type { D3Scale } from "../scales";
import { colorToPixi, applyEffects } from "../effects";

export function renderPointsLayer(
  layer: PointsLayer,
  container: PIXI.Container,
  data: Data,
  xScale: D3Scale,
  yScale: D3Scale,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
): void {
  if (!container || !container.parent) {
    console.warn("[PointsLayer] Container invalid, skipping render");
    return;
  }

  const graphics = new PIXI.Graphics();

  // Extract data points
  let dataPoints: Array<{ x: number | string; y: number; size?: number }> = [];

  if (Array.isArray(data.source)) {
    dataPoints = data.source.map((item, idx) => {
      if (typeof item === "object" && item !== null) {
        const xValue = layer.xField
          ? (item[layer.xField] as number | string)
          : idx;
        const yValue = layer.yField
          ? (item[layer.yField] as number)
          : (Object.values(item).find((v) => typeof v === "number") as number) || 0;
        const sizeValue = typeof layer.size === "string" && layer.xField
          ? (item[layer.size] as number)
          : (typeof layer.size === "number" ? layer.size : 4);
        return { x: xValue, y: yValue, size: sizeValue };
      }
      return { x: idx, y: 0, size: typeof layer.size === "number" ? layer.size : 4 };
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
          size: typeof layer.size === "number" ? layer.size : 4,
        });
      });
    });
  }

  // Get colors
  const colors = Array.isArray(layer.color)
    ? layer.color
    : [layer.color];

  // Draw points
  dataPoints.forEach((point, idx) => {
    const x = xScale(point.x) as number;
    const y = yScale(point.y) as number;
    const size = point.size || (typeof layer.size === "number" ? layer.size : 4);
    const color = colors[idx % colors.length];
    const pixiColor = colorToPixi(color);

    graphics.beginFill(pixiColor);

    switch (layer.shape) {
      case "circle":
        graphics.drawCircle(x, y, size);
        break;
      case "square":
        graphics.drawRect(x - size, y - size, size * 2, size * 2);
        break;
      case "triangle":
        graphics.drawPolygon([
          x, y - size,
          x - size, y + size,
          x + size, y + size,
        ]);
        break;
      case "diamond":
        graphics.drawPolygon([
          x, y - size,
          x + size, y,
          x, y + size,
          x - size, y,
        ]);
        break;
      case "cross":
        graphics.lineStyle(size / 2, pixiColor, 1);
        graphics.moveTo(x - size, y);
        graphics.lineTo(x + size, y);
        graphics.moveTo(x, y - size);
        graphics.lineTo(x, y + size);
        break;
    }

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
