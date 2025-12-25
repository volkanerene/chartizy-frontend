"use client";

import type { Template } from "@/lib/api";
import { normalize, type ChartizyDSL } from "@/lib/chartizy-dsl";
import { sanitizeDSLInput } from "@/lib/chartizy-dsl/sanitize";

type PreviewSource = "preview_dsl" | "example_data" | "fallback";

export interface TemplatePreviewResult {
  dsl: ChartizyDSL | null;
  source: PreviewSource;
  error?: string;
}

const baseLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const baseValues = [12, 19, 15, 25, 22, 30];

const logTemplateMeta = (scope: string, message: string, data: Record<string, unknown>) => {
  console.log(`[Templates:${scope}] ${message}`, data);
};

const warnTemplateMeta = (scope: string, message: string, data: Record<string, unknown>) => {
  console.warn(`[Templates:${scope}] ${message}`, data);
};

const errorTemplateMeta = (scope: string, message: string, data: Record<string, unknown>) => {
  console.error(`[Templates:${scope}] ${message}`, data);
};

const sanitizeNumberArray = (values: unknown[], fallback: number[]): number[] => {
  const sanitized = values
    .map((value, idx) => {
      const numericValue = Number(value);
      if (Number.isFinite(numericValue)) {
        return numericValue;
      }
      return fallback[idx % fallback.length] ?? fallback[0] ?? 0;
    })
    .filter((value) => typeof value === "number");

  if (sanitized.length === 0) {
    return fallback.slice();
  }

  return sanitized;
};

const ensureLabels = (labels: unknown[], count: number): string[] => {
  if (!Array.isArray(labels) || labels.length === 0) {
    return baseLabels.slice(0, count);
  }

  const normalized = labels.map((label, idx) =>
    label === null || label === undefined ? `Label ${idx + 1}` : String(label)
  );

  if (normalized.length >= count) {
    return normalized.slice(0, count);
  }

  const padded = [...normalized];
  while (padded.length < count) {
    padded.push(`Label ${padded.length + 1}`);
  }
  return padded;
};

const createMainLayer = (chartType: string) => {
  switch (chartType) {
    case "bar":
      return {
        type: "bars" as const,
        dataField: "data",
        color: "#165DFC",
        width: 0.8,
        borderRadius: 4,
        stacked: false,
      };
    case "line":
      return {
        type: "line" as const,
        dataField: "data",
        color: "#165DFC",
        width: 2,
        style: "solid" as const,
        smooth: false,
        showPoints: true,
      };
    case "area":
      return {
        type: "area" as const,
        dataField: "data",
        color: "#165DFC",
        opacity: 0.3,
      };
    case "pie":
    case "doughnut":
      return {
        type: "bars" as const,
        dataField: "data",
        color: ["#165DFC", "#4A7DFD", "#6B9DFE", "#8EC6FF", "#B3D9FF"],
        width: 0.8,
        borderRadius: 4,
      };
    case "scatter":
    case "points":
      return {
        type: "points" as const,
        dataField: "data",
        color: "#165DFC",
        size: 4,
        shape: "circle" as const,
      };
    default:
      return {
        type: "bars" as const,
        dataField: "data",
        color: "#165DFC",
        width: 0.8,
        borderRadius: 4,
      };
  }
};

const deriveDataFromExample = (exampleData: any) => {
  if (!exampleData) {
    return { labels: baseLabels.slice(), values: baseValues.slice() };
  }

  // Example data may already be DSL-like
  if (Array.isArray(exampleData.source)) {
    const labels = exampleData.source.map((item: Record<string, unknown>, idx: number) => {
      if (typeof item === "object" && item) {
        const labelKey = Object.keys(item).find((key) => key.toLowerCase().includes("label"));
        if (labelKey) {
          return String(item[labelKey as keyof typeof item]);
        }
      }
      return `Label ${idx + 1}`;
    });
    const firstNumericKey = exampleData.source.find((item: Record<string, unknown>) =>
      typeof item === "object" && item !== null
        ? Object.values(item).some((value) => typeof value === "number")
        : false
    );
    const numericKey =
      firstNumericKey &&
      Object.keys(firstNumericKey).find((key) => typeof (firstNumericKey as any)[key] === "number");
    const values = exampleData.source.map((item: Record<string, unknown>, idx: number) => {
      if (typeof item === "object" && item !== null && numericKey) {
        return Number(item[numericKey]);
      }
      return baseValues[idx % baseValues.length];
    });
    return {
      labels,
      values: sanitizeNumberArray(values, baseValues),
    };
  }

  if (Array.isArray(exampleData.labels) && Array.isArray(exampleData.datasets)) {
    const dataset = exampleData.datasets[0] || {};
    const datasetValues = Array.isArray(dataset.data) ? dataset.data : baseValues;
    const values = sanitizeNumberArray(datasetValues, baseValues);
    return {
      labels: ensureLabels(exampleData.labels, values.length),
      values,
    };
  }

  if (Array.isArray(exampleData.values)) {
    const values = sanitizeNumberArray(exampleData.values, baseValues);
    return {
      labels: ensureLabels(exampleData.labels || [], values.length),
      values,
    };
  }

  return { labels: baseLabels.slice(), values: baseValues.slice() };
};

export function generateTemplatePreviewDSL(
  template: Template,
  options?: { width?: number; height?: number; scope?: string }
): TemplatePreviewResult {
  const scope = options?.scope ?? "Preview";
  const meta = {
    templateId: template?.id,
    name: template?.name,
    chartType: template?.chart_type,
    hasPreviewDSL: Boolean(template?.preview_dsl),
    hasExampleData: Boolean(template?.example_data),
    exampleDataType: typeof template?.example_data,
  };

  logTemplateMeta(scope, "generateTemplatePreviewDSL:start", meta);

  if (template?.preview_dsl) {
    try {
      const parsedDSL =
        typeof template.preview_dsl === "string"
          ? JSON.parse(template.preview_dsl)
          : template.preview_dsl;
      const normalized = normalize(sanitizeDSLInput(parsedDSL));
      logTemplateMeta(scope, "generateTemplatePreviewDSL:using-preview", {
        ...meta,
        layerCount: normalized.layers?.length,
        canvas: normalized.canvas,
      });
      return { dsl: normalized, source: "preview_dsl" };
    } catch (error) {
      warnTemplateMeta(scope, "generateTemplatePreviewDSL:preview-dsl-parse-failed", {
        ...meta,
        error,
      });
    }
  }

  let parsedExampleData: any = null;
  if (template?.example_data) {
    if (typeof template.example_data === "string") {
      try {
        parsedExampleData = JSON.parse(template.example_data);
        logTemplateMeta(scope, "generateTemplatePreviewDSL:parsed-example-data", {
          ...meta,
          exampleKeys: Object.keys(parsedExampleData || {}),
        });
      } catch (error) {
        warnTemplateMeta(scope, "generateTemplatePreviewDSL:example-data-json-failed", {
          ...meta,
          error,
        });
      }
    } else if (typeof template.example_data === "object") {
      parsedExampleData = template.example_data;
      logTemplateMeta(scope, "generateTemplatePreviewDSL:example-data-object", {
        ...meta,
        exampleKeys: Object.keys(parsedExampleData || {}),
      });
    }
  }

  const chartTypeLower = (template?.chart_type || "bar").toLowerCase();
  const dataSource = deriveDataFromExample(parsedExampleData);

  // Adjust for pie/doughnut previews
  if (chartTypeLower === "pie" || chartTypeLower === "doughnut") {
    dataSource.labels = dataSource.labels.slice(0, 5);
    dataSource.values = dataSource.values.slice(0, 5);
  }

  const width = options?.width ?? 320;
  const height = options?.height ?? 180;

  const fallbackDSL = {
    version: "1.0.0",
    canvas: {
      width,
      height,
      background: "transparent",
      padding: {
        top: 16,
        right: 16,
        bottom: 32,
        left: 32,
      },
    },
    theme: {
      palette: {
        primary: "#165DFC",
        secondary: "#8EC6FF",
        accent: "#4A7DFD",
        background: "#ffffff",
        foreground: "#030213",
        muted: "#94A3B8",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
      typography: {
        fontFamily: "Geist, sans-serif",
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.2,
      },
      effects: {
        blur: 0,
        blendMode: "normal",
        opacity: 1,
      },
    },
    data: {
      source: {
        labels: dataSource.labels,
        datasets: [
          {
            label: template?.name || "Data",
            data: dataSource.values,
          },
        ],
      },
      transforms: [],
    },
    scales: {
      x: {
        type: chartTypeLower === "bar" ? "band" : "ordinal",
        padding: 0.1,
      },
      y: {
        type: "linear",
        nice: true,
      },
    },
    layers: [
      {
        type: "grid",
        direction: "both",
        color: "#E5E7EB",
        width: 1,
        style: "dashed",
        opacity: 0.5,
      },
      {
        type: "axis-x",
        position: "bottom",
        showLabels: true,
        showTicks: true,
        showLine: true,
        color: "#94A3B8",
        fontSize: 10,
        tickLength: 4,
      },
      {
        type: "axis-y",
        position: "left",
        showLabels: true,
        showTicks: true,
        showLine: true,
        color: "#94A3B8",
        fontSize: 10,
        tickLength: 4,
      },
      createMainLayer(chartTypeLower),
    ],
    interactions: {
      tooltip: {
        enabled: false,
      },
      zoom: {
        enabled: false,
        min: 0.5,
        max: 2,
        mode: "xy",
      },
      pan: {
        enabled: false,
        mode: "xy",
      },
      selection: {
        enabled: false,
        mode: "single",
        color: "#165DFC",
        opacity: 0.2,
      },
    },
  };

  try {
    const normalized = normalize(fallbackDSL);
    const normalizedSource = normalized.data?.source as any;
    logTemplateMeta(scope, "generateTemplatePreviewDSL:fallback-success", {
      ...meta,
      layerCount: normalized.layers?.length,
      labelsLength: Array.isArray(normalizedSource?.labels)
        ? normalizedSource.labels.length
        : Array.isArray(normalizedSource)
          ? normalizedSource.length
          : 0,
      datasetLength: Array.isArray(normalizedSource?.datasets?.[0]?.data)
        ? normalizedSource.datasets[0].data.length
        : 0,
    });
    return {
      dsl: normalized,
      source: parsedExampleData ? "example_data" : "fallback",
    };
  } catch (error) {
    errorTemplateMeta(scope, "generateTemplatePreviewDSL:fallback-failed", {
      ...meta,
      labelsLength: dataSource.labels.length,
      valuesLength: dataSource.values.length,
      error,
    });
    return {
      dsl: null,
      source: "fallback",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
