import type { Data } from "@/lib/chartizy-dsl";

export type DataPoint = { x: number | string; y: number; label?: string };

export const extractDataPoints = (
  data: Data,
  xField?: string,
  yField?: string
): DataPoint[] => {
  const points: DataPoint[] = [];

  if (Array.isArray(data.source)) {
    data.source.forEach((item, index) => {
      if (typeof item === "object" && item !== null) {
        const xValue = xField ? (item[xField] as number | string) : index;
        const value =
          yField && typeof item[yField] === "number"
            ? (item[yField] as number)
            : (Object.values(item).find((val) => typeof val === "number") as number) || 0;
        points.push({
          x: xValue,
          y: value,
          label: String(item[xField || "label"] ?? index),
        });
      } else if (typeof item === "number") {
        points.push({ x: index, y: item, label: `Item ${index + 1}` });
      }
    });
    return points;
  }

  if (
    typeof data.source === "object" &&
    "labels" in data.source &&
    "datasets" in data.source
  ) {
    const labels = data.source.labels as (string | number)[];
    const datasets = data.source.datasets as Array<{ data: number[] }>;
    datasets.forEach((dataset) => {
      dataset.data.forEach((value, idx) => {
        points.push({
          x: labels[idx] ?? idx,
          y: value,
          label: String(labels[idx] ?? idx),
        });
      });
    });
    return points;
  }

  return points;
};
