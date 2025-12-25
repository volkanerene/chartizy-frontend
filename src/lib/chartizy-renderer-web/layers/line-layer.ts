import * as PIXI from "pixi.js";
import type { LineLayer, Data } from "../../chartizy-dsl";
import type { D3Scale } from "../scales";
import { colorToPixi, applyEffects } from "../effects";

export function renderLineLayer(
  layer: LineLayer,
  container: PIXI.Container,
  data: Data,
  xScale: D3Scale,
  yScale: D3Scale,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
): void {
  if (!container || !container.parent) {
    console.warn("[LineLayer] Container invalid, skipping render");
    return;
  }

  const graphics = new PIXI.Graphics();

  // Extract data points
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

  const color = colorToPixi(layer.color);

  // Draw line
  if (dataPoints.length > 0) {
    const firstPoint = dataPoints[0];
    const firstX = xScale(firstPoint.x) as number;
    const firstY = yScale(firstPoint.y) as number;

    graphics.lineStyle(layer.width, color, 1);

    if (layer.smooth) {
      // Bezier curve
      graphics.moveTo(firstX, firstY);
      for (let i = 1; i < dataPoints.length; i++) {
        const point = dataPoints[i];
        const x = xScale(point.x) as number;
        const y = yScale(point.y) as number;

        if (i === 1) {
          graphics.quadraticCurveTo(x, y, x, y);
        } else {
          const prevPoint = dataPoints[i - 1];
          const prevX = xScale(prevPoint.x) as number;
          const prevY = yScale(prevPoint.y) as number;
          const cpX = (prevX + x) / 2;
          const cpY = (prevY + y) / 2;
          graphics.quadraticCurveTo(prevX, prevY, cpX, cpY);
        }
      }
    } else {
      // Straight line
      graphics.moveTo(firstX, firstY);
      for (let i = 1; i < dataPoints.length; i++) {
        const point = dataPoints[i];
        const x = xScale(point.x) as number;
        const y = yScale(point.y) as number;
        graphics.lineTo(x, y);
      }
    }
  }

  // Draw points if enabled
  if (layer.showPoints) {
    dataPoints.forEach((point) => {
      const x = xScale(point.x) as number;
      const y = yScale(point.y) as number;
      graphics.beginFill(color);
      graphics.drawCircle(x, y, 3);
      graphics.endFill();
    });
  }

  // Apply effects
  if (layer.effects) {
    applyEffects(graphics, layer.effects);
  }

  if (container && container.parent) {
    container.addChild(graphics);
  }
}
