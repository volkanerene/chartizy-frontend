import * as PIXI from "pixi.js";
import type { LabelsLayer, Data } from "../../chartizy-dsl";
import type { D3Scale } from "../scales";
import { colorToPixi } from "../effects";

export function renderLabelsLayer(
  layer: LabelsLayer,
  container: PIXI.Container,
  data: Data,
  xScale: D3Scale,
  yScale: D3Scale,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
): void {
  if (!container || !container.parent) {
    console.warn("[LabelsLayer] Container invalid, skipping render");
    return;
  }

  // Extract data points
  let dataPoints: Array<{ x: number | string; y: number; text?: string }> = [];

  if (Array.isArray(data.source)) {
    dataPoints = data.source.map((item, idx) => {
      if (typeof item === "object" && item !== null) {
        const xValue = layer.xField
          ? (item[layer.xField] as number | string)
          : idx;
        const yValue = layer.yField
          ? (item[layer.yField] as number)
          : (Object.values(item).find((v) => typeof v === "number") as number) || 0;
        const textValue = layer.textField
          ? String(item[layer.textField])
          : String(yValue);
        return { x: xValue, y: yValue, text: textValue };
      }
      return { x: idx, y: 0, text: "0" };
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
          text: String(value),
        });
      });
    });
  }

  const color = colorToPixi(layer.color);

  // Draw labels
  dataPoints.forEach((point) => {
    if (!container || !container.parent) return;

    const x = xScale(point.x) as number;
    const y = yScale(point.y) as number;
    const text = point.text || String(point.y);

    const textObj = new PIXI.Text(text, {
      fontSize: layer.fontSize,
      fill: color,
      align: "center",
    });

    textObj.anchor.set(0.5, 0.5);

    // Position based on layer.position
    switch (layer.position) {
      case "top":
        textObj.y = y - layer.offset;
        textObj.x = x;
        break;
      case "bottom":
        textObj.y = y + layer.offset;
        textObj.x = x;
        break;
      case "left":
        textObj.x = x - layer.offset;
        textObj.y = y;
        break;
      case "right":
        textObj.x = x + layer.offset;
        textObj.y = y;
        break;
      case "center":
        textObj.x = x;
        textObj.y = y;
        break;
      case "auto":
      default:
        textObj.x = x;
        textObj.y = y - layer.offset;
        break;
    }

    // Apply effects to text (if supported)
    if (layer.effects) {
      textObj.alpha = layer.effects.opacity;
    }

    container.addChild(textObj);
  });
}
