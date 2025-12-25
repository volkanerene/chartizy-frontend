import { scaleLinear, scaleLog, scaleTime, scaleOrdinal, scaleBand, ScaleLinear, ScaleLogarithmic, ScaleTime, ScaleOrdinal, ScaleBand } from "d3-scale";
import type { Scale, Scales } from "../chartizy-dsl";

export type D3Scale = ScaleLinear<number, number> | ScaleLogarithmic<number, number> | ScaleTime<number, number> | ScaleOrdinal<string | number, number> | ScaleBand<string | number>;

/**
 * Creates a d3 scale from DSL scale definition
 */
export function createScale(scaleDef: Scale, range: [number, number]): D3Scale {
  const domain = scaleDef.domain || [0, 1];

  switch (scaleDef.type) {
    case "linear":
      return scaleLinear()
        .domain(domain as [number, number])
        .range(range)
        .nice(scaleDef.nice);

    case "log":
      return scaleLog()
        .domain(domain as [number, number])
        .range(range)
        .nice(scaleDef.nice);

    case "time":
      return scaleTime()
        .domain(domain as [Date, Date])
        .range(range)
        .nice(scaleDef.nice);

    case "ordinal":
      return scaleOrdinal<string | number, number>()
        .domain(domain as (string | number)[])
        .range(range);

    case "band":
      return scaleBand<string | number>()
        .domain(domain as (string | number)[])
        .range(range)
        .padding(scaleDef.padding);

    default:
      return scaleLinear()
        .domain(domain as [number, number])
        .range(range)
        .nice(scaleDef.nice);
  }
}

/**
 * Creates scales for X and Y axes
 */
export function createScales(
  scalesDef: Scales,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
): { xScale: D3Scale; yScale: D3Scale } {
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const xRange: [number, number] = [padding.left, width - padding.right];
  const yRange: [number, number] = [height - padding.bottom, padding.top]; // Inverted for screen coordinates

  const xScale = createScale(scalesDef.x, xRange);
  const yScale = createScale(scalesDef.y, yRange);

  return { xScale, yScale };
}

/**
 * Formats a value using the scale's format string
 */
export function formatValue(value: number | string, format?: string): string {
  if (!format) {
    return String(value);
  }

  // Simple format string support
  // %d - integer
  // %f - float
  // %s - string
  // %.2f - float with 2 decimals
  if (format.includes("%d")) {
    return format.replace("%d", String(Math.floor(Number(value))));
  }
  if (format.includes("%.2f")) {
    return format.replace("%.2f", Number(value).toFixed(2));
  }
  if (format.includes("%f")) {
    return format.replace("%f", String(Number(value)));
  }
  if (format.includes("%s")) {
    return format.replace("%s", String(value));
  }

  // Try to use format as a template
  return format.replace(/\{value\}/g, String(value));
}
