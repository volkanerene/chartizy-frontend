"use client";

import type { Chart, Template } from "@/lib/api";
import { normalize, toDSL, type ChartizyDSL } from "@/lib/chartizy-dsl";
import { generateTemplatePreviewDSL } from "@/lib/templates/preview";
import { sanitizeDSLInput } from "@/lib/chartizy-dsl/sanitize";

type ChartPreviewSource = "result_visual" | "input_data" | "fallback";

export interface ChartPreviewResult {
  dsl: ChartizyDSL | null;
  source: ChartPreviewSource;
  error?: string;
}

const baseLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const baseValues = [12, 19, 15, 25, 22, 30];

const safeJSONParse = (value: unknown) => {
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn("[ChartPreview] Failed to parse JSON string", { error, snippet: value.slice(0, 200) });
    return null;
  }
};

const buildTemplateFallback = (chart: Chart, scope: string): ChartPreviewResult => {
  const rawInput = chart.input_data || {};
  const inputData = safeJSONParse(rawInput) || {};

  const labels = Array.isArray((inputData as any)?.labels)
    ? (inputData as any).labels
    : baseLabels;
  const datasets = Array.isArray((inputData as any)?.datasets)
    ? (inputData as any).datasets
    : [];
  const firstDataset = datasets.length > 0 ? datasets[0] : null;
  const values = Array.isArray(firstDataset?.data)
    ? firstDataset.data
    : Array.isArray((inputData as any)?.values)
      ? (inputData as any).values
      : baseValues;

  const pseudoTemplate: Template = {
    id: chart.template_id || chart.id,
    name: (inputData as any)?.title || `Chart ${chart.id}`,
    description: null,
    chart_type:
      typeof (inputData as any)?.chart_type === "string"
        ? ((inputData as any).chart_type as string)
        : "bar",
    is_premium: false,
    example_data: {
      labels,
      values,
      datasets: [
        {
          label: firstDataset?.label || "Data",
          data: values,
        },
      ],
    },
    preview_dsl: undefined,
    thumbnail_url: null,
  };

  const preview = generateTemplatePreviewDSL(pseudoTemplate, {
    width: 320,
    height: 160,
    scope,
  });

  if (!preview.dsl) {
    console.warn("[ChartPreview] Fallback preview failed", {
      chartId: chart.id,
      templateId: chart.template_id,
      scope,
      error: preview.error,
    });
  }

  return {
    dsl: preview.dsl,
    source: preview.source === "preview_dsl" ? "input_data" : "fallback",
    error: preview.error,
  };
};

export function buildChartPreviewDSL(chart: Chart): ChartPreviewResult {
  const scope = `Chart#${chart.id}`;
  if (chart.result_visual) {
    try {
      const parsed = safeJSONParse(chart.result_visual) || chart.result_visual;
      const candidate =
        parsed && typeof parsed === "object" && "dsl" in (parsed as Record<string, unknown>)
          ? (parsed as Record<string, unknown>).dsl
          : parsed;

      if (candidate && typeof candidate === "object") {
        const hasDSLFields =
          "version" in (candidate as Record<string, unknown>) ||
          "layers" in (candidate as Record<string, unknown>) ||
          "canvas" in (candidate as Record<string, unknown>);

        if (hasDSLFields) {
          const normalized = normalize(sanitizeDSLInput(candidate));
          return { dsl: normalized, source: "result_visual" };
        }
      }

      const migrated = toDSL(sanitizeDSLInput(candidate));
      return { dsl: migrated, source: "result_visual" };
    } catch (error) {
      console.warn("[ChartPreview] Failed to parse result_visual", {
        chartId: chart.id,
        templateId: chart.template_id,
        error,
        snippet:
          typeof chart.result_visual === "string"
            ? chart.result_visual.slice(0, 200)
            : null,
      });
    }
  }

  return buildTemplateFallback(chart, scope);
}
