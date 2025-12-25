"use client";

import React, { useState } from "react";
import ReactECharts from "echarts-for-react";

type ChartizySpec = {
  version: "0.1";
  id: string;
  title?: string;
  data: {
    source: Array<Record<string, any>>;
    transforms?: Array<{
      type: "group" | "sort" | "filter";
      by?: string;
      agg?: Record<string, "sum" | "avg" | "min" | "max" | "count">;
      field?: string;
      order?: "asc" | "desc";
      operator?: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "contains";
      value?: any;
    }>;
  };
  encoding: {
    x?: { field: string; type: "time" | "ordinal" | "linear" };
    y?: { field: string; type: "linear" | "log" };
    series?: { field: string };
    color?: { field?: string; palette?: string[] };
  };
  layers: Array<{
    type: "bars" | "line" | "area" | "points";
    stacked?: boolean;
    smooth?: boolean;
    style?: "solid" | "dashed";
    opacity?: number;
    shape?: "circle" | "diamond" | "square";
    size?: number;
  }>;
  ui?: {
    tooltip?: { enabled: boolean };
    legend?: { enabled: boolean; position?: "top" | "right" | "bottom" | "left" };
    zoom?: { enabled: boolean };
  };
  theme?: {
    radius?: number;
    fontSize?: number;
    grid?: boolean;
  };
};

// Örnek spec generator (layer sayısına göre)
function generateNewDSLSpec(layerCount: 1 | 2 | 3 | 4): ChartizySpec {
  const baseData = [
    { month: "Jan", sales: 120, profit: 50, revenue: 200 },
    { month: "Feb", sales: 190, profit: 80, revenue: 280 },
    { month: "Mar", sales: 300, profit: 120, revenue: 420 },
    { month: "Apr", sales: 250, profit: 100, revenue: 350 },
    { month: "May", sales: 400, profit: 150, revenue: 550 },
    { month: "Jun", sales: 350, profit: 140, revenue: 490 },
  ];

  const layers: ChartizySpec["layers"] = [];
  let title = "";
  let seriesField: { field: string } | undefined = undefined;

  if (layerCount >= 1) {
    layers.push({ type: "bars", stacked: false });
    title = "Sales Trend";
  }
  if (layerCount >= 2) {
    layers.push({ type: "line", smooth: true, style: "dashed" });
    seriesField = { field: "profit" };
    title = "Sales & Profit Trend";
  }
  if (layerCount >= 3) {
    layers.push({ type: "area", opacity: 0.3 });
    title = "Sales, Profit & Revenue Trend";
  }
  if (layerCount >= 4) {
    layers.push({ type: "points", size: 6, shape: "diamond" });
    title = "Full Multi-Layer Chart";
  }

  return {
    version: "0.1",
    id: `multi-layer-${layerCount}`,
    title: `${title} (Layer-First DSL)`,
    data: {
      source: baseData,
    },
    encoding: {
      x: { field: "month", type: "ordinal" },
      y: { field: "sales", type: "linear" },
      series: seriesField,
      color: { palette: ["#165DFC", "#06B6D4", "#10B981", "#F59E0B"] },
    },
    layers,
    ui: {
      tooltip: { enabled: true },
      legend: { enabled: true, position: "top" },
      zoom: { enabled: false },
    },
    theme: {
      radius: 4,
      fontSize: 12,
      grid: true,
    },
  };
}

// Compile to ECharts
function compileToECharts(spec: ChartizySpec): any {
  const { data, encoding, layers, ui, theme } = spec;
  
  // Extract data
  const xField = encoding.x?.field || "x";
  const yField = encoding.y?.field || "y";
  const seriesField = encoding.series?.field;
  
  const xData = data.source.map((d) => d[xField]);
  const yData = data.source.map((d) => d[yField]);
  
  // Build series
  const series: any[] = [];
  const colors = encoding.color?.palette || ["#165DFC", "#06B6D4", "#10B981", "#F59E0B"];
  
  let colorIndex = 0;
  let dataFieldIndex = 0;
  const dataFields = [yField, seriesField, "revenue"].filter(Boolean) as string[];
  
  layers.forEach((layer, idx) => {
    // Her layer için hangi data field'ı kullanılacak
    const currentDataField = dataFields[dataFieldIndex] || yField;
    const currentData = data.source.map((d) => d[currentDataField]);
    const layerName = currentDataField.charAt(0).toUpperCase() + currentDataField.slice(1);
    
    if (layer.type === "bars") {
      series.push({
        name: layerName,
        type: "bar",
        data: currentData,
        itemStyle: { color: colors[colorIndex % colors.length], borderRadius: theme?.radius || 0 },
        barWidth: "60%",
      });
      colorIndex++;
      dataFieldIndex++;
    } else if (layer.type === "line") {
      series.push({
        name: layerName,
        type: "line",
        data: currentData,
        smooth: layer.smooth || false,
        lineStyle: {
          type: layer.style === "dashed" ? "dashed" : "solid",
          width: 2,
          color: colors[colorIndex % colors.length],
        },
        itemStyle: { color: colors[colorIndex % colors.length] },
      });
      colorIndex++;
      dataFieldIndex++;
    } else if (layer.type === "area") {
      series.push({
        name: layerName,
        type: "line",
        data: currentData,
        areaStyle: { opacity: layer.opacity || 0.3, color: colors[colorIndex % colors.length] },
        smooth: true,
        lineStyle: { color: colors[colorIndex % colors.length] },
      });
      colorIndex++;
      dataFieldIndex++;
    } else if (layer.type === "points") {
      series.push({
        name: layerName,
        type: "scatter",
        data: currentData.map((y, i) => [xData[i], y]),
        symbolSize: layer.size || 8,
        itemStyle: { color: colors[colorIndex % colors.length] },
        symbol: layer.shape === "diamond" ? "diamond" : "circle",
      });
      colorIndex++;
      dataFieldIndex++;
    }
  });
  
  return {
    title: spec.title ? { text: spec.title, left: "center", top: 20 } : undefined,
    tooltip: ui?.tooltip?.enabled !== false ? { trigger: "axis" } : undefined,
    legend: ui?.legend?.enabled !== false
      ? {
          show: true,
          top: ui?.legend?.position === "top" ? 10 : "auto",
          right: ui?.legend?.position === "right" ? 10 : "auto",
          bottom: ui?.legend?.position === "bottom" ? 10 : "auto",
          left: ui?.legend?.position === "left" ? 10 : "auto",
        }
      : { show: false },
    grid: {
      left: "10%",
      right: "10%",
      top: "15%",
      bottom: "15%",
    },
    xAxis: {
      type: encoding.x?.type === "time" ? "time" : "category",
      data: xData,
      boundaryGap: layers.some((l) => l.type === "bars"),
    },
    yAxis: {
      type: encoding.y?.type === "log" ? "log" : "value",
    },
    series,
    color: colors,
  };
}

export function NewLayerFirstTemplate() {
  const [layerCount, setLayerCount] = useState<1 | 2 | 3 | 4>(2);
  const spec = generateNewDSLSpec(layerCount);
  const option = compileToECharts(spec);

  return (
    <div className="space-y-6">
      {/* Layer Count Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-700">Layer Sayısı:</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((count) => (
              <button
                key={count}
                onClick={() => setLayerCount(count as 1 | 2 | 3 | 4)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  layerCount === count
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {count} Layer
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 text-sm text-slate-500 space-y-1">
          {layerCount === 1 && (
            <div>✓ <strong>Bars</strong> (Sales)</div>
          )}
          {layerCount === 2 && (
            <>
              <div>✓ <strong>Bars</strong> (Sales)</div>
              <div>✓ <strong>Line</strong> (Profit - dashed)</div>
            </>
          )}
          {layerCount === 3 && (
            <>
              <div>✓ <strong>Bars</strong> (Sales)</div>
              <div>✓ <strong>Line</strong> (Profit - dashed)</div>
              <div>✓ <strong>Area</strong> (Revenue)</div>
            </>
          )}
          {layerCount === 4 && (
            <>
              <div>✓ <strong>Bars</strong> (Sales)</div>
              <div>✓ <strong>Line</strong> (Profit - dashed)</div>
              <div>✓ <strong>Area</strong> (Revenue)</div>
              <div>✓ <strong>Points</strong> (Diamond markers)</div>
            </>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <div style={{ height: 400, width: "100%" }}>
          <ReactECharts 
            option={option} 
            style={{ height: "100%", width: "100%" }}
            opts={{ renderer: "svg" }}
          />
        </div>
      </div>

      {/* Spec JSON */}
      <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">DSL Spec (JSON)</h2>
        <pre className="text-sm text-slate-300 overflow-x-auto">
{JSON.stringify(spec, null, 2)}
        </pre>
      </div>
    </div>
  );
}
