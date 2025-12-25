import * as PIXI from "pixi.js";
import type { AxisLayer } from "../../chartizy-dsl";
import type { D3Scale } from "../scales";
import { colorToPixi, formatValue } from "../effects";

export function renderAxisLayer(
  layer: AxisLayer,
  container: PIXI.Container,
  xScale: D3Scale,
  yScale: D3Scale,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
): void {
  if (!container || !container.parent) {
    console.warn("[AxisLayer] Container invalid, skipping render");
    return;
  }

  const graphics = new PIXI.Graphics();
  const color = colorToPixi(layer.color);
  const isXAxis = layer.type === "axis-x";

  const scale = isXAxis ? xScale : yScale;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const plotX = padding.left;
  const plotY = padding.top;

  // Get tick positions and labels
  let ticks: Array<{ value: number | string; position: number }> = [];

  if ("ticks" in scale && typeof scale.ticks === "function") {
    const scaleTicks = scale.ticks();
    ticks = scaleTicks.map((t) => ({
      value: t,
      position: scale(t as any) as number,
    }));
  } else if ("domain" in scale) {
    const domain = scale.domain();
    if (Array.isArray(domain)) {
      ticks = domain.map((d) => ({
        value: d,
        position: scale(d) as number,
      }));
    }
  }

  if (isXAxis) {
    const axisY = layer.position === "top" ? plotY : plotY + plotHeight;

    // Draw axis line
    if (layer.showLine) {
      graphics.lineStyle(1, color, 1);
      graphics.moveTo(plotX, axisY);
      graphics.lineTo(plotX + plotWidth, axisY);
    }

    // Draw ticks and labels
    ticks.forEach((tick) => {
      const x = plotX + (tick.position as number);

      // Draw tick
      if (layer.showTicks) {
        const tickY1 = axisY;
        const tickY2 = layer.position === "top" 
          ? axisY + layer.tickLength 
          : axisY - layer.tickLength;
        graphics.lineStyle(1, color, 1);
        graphics.moveTo(x, tickY1);
        graphics.lineTo(x, tickY2);
      }

      // Draw label
      if (layer.showLabels && container && container.parent) {
        const labelText = layer.labelFormat
          ? formatValue(tick.value as number, layer.labelFormat)
          : String(tick.value);

        const text = new PIXI.Text(labelText, {
          fontSize: layer.fontSize,
          fill: color,
          align: "center",
        });

        text.anchor.set(0.5, layer.position === "top" ? 1 : 0);
        text.x = x;
        text.y = layer.position === "top"
          ? axisY - layer.tickLength - 5
          : axisY + layer.tickLength + 5;
        text.rotation = (layer.labelRotation * Math.PI) / 180;

        container.addChild(text);
      }
    });
  } else {
    const axisX = layer.position === "left" ? plotX : plotX + plotWidth;

    // Draw axis line
    if (layer.showLine) {
      graphics.lineStyle(1, color, 1);
      graphics.moveTo(axisX, plotY);
      graphics.lineTo(axisX, plotY + plotHeight);
    }

    // Draw ticks and labels
    ticks.forEach((tick) => {
      const y = plotY + plotHeight - (tick.position as number);

      // Draw tick
      if (layer.showTicks) {
        const tickX1 = axisX;
        const tickX2 = layer.position === "left"
          ? axisX + layer.tickLength
          : axisX - layer.tickLength;
        graphics.lineStyle(1, color, 1);
        graphics.moveTo(tickX1, y);
        graphics.lineTo(tickX2, y);
      }

      // Draw label
      if (layer.showLabels && container && container.parent) {
        const labelText = layer.labelFormat
          ? formatValue(tick.value as number, layer.labelFormat)
          : String(tick.value);

        const text = new PIXI.Text(labelText, {
          fontSize: layer.fontSize,
          fill: color,
          align: layer.position === "left" ? "right" : "left",
        });

        text.anchor.set(layer.position === "left" ? 1 : 0, 0.5);
        text.x = layer.position === "left"
          ? axisX - layer.tickLength - 5
          : axisX + layer.tickLength + 5;
        text.y = y;
        text.rotation = (layer.labelRotation * Math.PI) / 180;

        container.addChild(text);
      }
    });
  }

  if (container && container.parent) {
    container.addChild(graphics);
  }
}
