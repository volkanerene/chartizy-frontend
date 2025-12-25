import {
  scaleLinear,
  scaleLog,
  scaleTime,
  scaleOrdinal,
  scaleBand,
  type ScaleLinear,
  type ScaleLogarithmic,
  type ScaleTime,
  type ScaleOrdinal,
  type ScaleBand,
} from "d3-scale";
import type { Scale, Scales } from "@/lib/chartizy-dsl";

export type D3Scale =
  | ScaleLinear<number, number>
  | ScaleLogarithmic<number, number>
  | ScaleTime<number, number>
  | ScaleOrdinal<string | number, number>
  | ScaleBand<string | number>;

const createScale = (scaleDef: Scale, range: [number, number]): D3Scale => {
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
        .padding(scaleDef.padding ?? 0);
    default:
      return scaleLinear()
        .domain(domain as [number, number])
        .range(range)
        .nice(scaleDef.nice);
  }
};

export const createScales = (
  scalesDef: Scales,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
) => {
  const xRange: [number, number] = [padding.left, width - padding.right];
  const yRange: [number, number] = [height - padding.bottom, padding.top];
  const xScale = createScale(scalesDef.x, xRange);
  const yScale = createScale(scalesDef.y, yRange);
  return { xScale, yScale };
};
