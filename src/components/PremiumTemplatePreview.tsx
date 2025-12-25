"use client";

import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { PREMIUM_TEMPLATES } from "@/lib/templates/premium-templates";
import { ChartPreview } from "./ChartPreview";

interface PremiumTemplatePreviewProps {
  templateId: string;
  chartType: string;
  exampleData?: any;
  height?: number;
}

export function PremiumTemplatePreview({
  templateId,
  chartType,
  exampleData,
  height = 120,
}: PremiumTemplatePreviewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Try to find premium template by ID first, then by chart type
  const premiumTemplate = PREMIUM_TEMPLATES.find(
    (t) => t.id === templateId
  ) || PREMIUM_TEMPLATES.find(
    (t) => t.category === chartType
  );

  if (!mounted) {
    return (
      <div style={{ height, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="text-xs text-slate-400">Loading...</div>
      </div>
    );
  }

  if (premiumTemplate) {
    try {
      const option = premiumTemplate.getEChartsOption();
      return (
        <div style={{ height, width: "100%" }}>
          <ReactECharts
            option={option}
            style={{ height: "100%", width: "100%" }}
            opts={{ renderer: "svg" }}
          />
        </div>
      );
    } catch (error) {
      console.warn("Failed to render premium template preview:", error, { templateId, chartType, premiumTemplate });
    }
  }

  // Fallback to old ChartPreview
  return (
    <ChartPreview
      chartType={chartType}
      exampleData={exampleData}
      height={height}
    />
  );
}
