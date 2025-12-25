"use client";

import React, { useState } from "react";
import ReactECharts from "echarts-for-react";

type TimeseriesPoint = { t: string; v: number };
type Timeseries = { name: string; points: TimeseriesPoint[] };

type EventMarker = { t: string; label: string; kind?: "incident" | "release" | "note" };
type Targets = { low?: number; high?: number; line?: number };

type CategoryPoint = { label: string; value: number };

type TemplateInput = {
  timeseries_main: Timeseries;
  timeseries_compare?: Timeseries;
  events?: EventMarker[];
  targets?: Targets;
  category_breakdown?: CategoryPoint[];
};

// --- demo data generator (senin sistemde otomatik doldurma için)
export function makeDemoInput(mode: 2 | 3 | 4 | 5): TemplateInput {
  const days = Array.from({ length: 30 }, (_, i) => i + 1).map((d) => `2025-12-${String(d).padStart(2, "0")}`);
  const main: Timeseries = {
    name: "Main",
    points: days.map((t, i) => ({ t, v: Math.round(40 + 10 * Math.sin(i / 4) + (i % 5)) }))
  };

  const compare: Timeseries = {
    name: "Compare",
    points: days.map((t, i) => ({ t, v: Math.round(35 + 8 * Math.cos(i / 5) + (i % 3)) }))
  };

  const breakdown: CategoryPoint[] = mode >= 2 ? [
    { label: "Plant A", value: 42 },
    { label: "Plant B", value: 31 },
    { label: "Terminal", value: 18 },
    { label: "Offsite", value: 9 }
  ] : [];

  const events: EventMarker[] = [
    { t: "2025-12-07", label: "Incident", kind: "incident" },
    { t: "2025-12-15", label: "Policy update", kind: "release" },
    { t: "2025-12-23", label: "Audit", kind: "note" }
  ];

  const targets: Targets = { low: 25, high: 60, line: 50 };

  return {
    timeseries_main: main,
    ...(mode >= 3 ? { timeseries_compare: compare } : {}),
    ...(mode >= 4 ? { events } : {}),
    ...(mode >= 5 ? { targets } : {}),
    ...(mode >= 2 ? { category_breakdown: breakdown } : {})
  };
}

// --- template builder (asıl "template" mantığı)
function buildOption(input: TemplateInput) {
  const x = input.timeseries_main.points.map((p) => p.t);
  const yMain = input.timeseries_main.points.map((p) => p.v);

  const hasCompare = !!input.timeseries_compare;
  const yCompare = input.timeseries_compare?.points.map((p) => p.v) ?? [];

  const hasBreakdown = (input.category_breakdown?.length ?? 0) > 0;
  const hasEvents = (input.events?.length ?? 0) > 0;
  const hasTargets = !!input.targets;

  // KPI (son değer + delta)
  const last = yMain[yMain.length - 1] ?? 0;
  const prev = yMain[yMain.length - 2] ?? last;
  const delta = last - prev;

  // Events -> markLine
  const markLines =
    hasEvents
      ? input.events!.map((e) => ({
          xAxis: e.t,
          label: { formatter: e.label, rotate: 0 },
          lineStyle: { type: "dashed", width: 1 }
        }))
      : [];

  // Target band -> markArea
  const markArea =
    hasTargets && (input.targets!.low != null || input.targets!.high != null)
      ? {
          silent: true,
          itemStyle: { opacity: 0.08 },
          data: [[
            { yAxis: input.targets!.low ?? "min" },
            { yAxis: input.targets!.high ?? "max" }
          ]]
        }
      : undefined;

  const targetLine =
    hasTargets && input.targets!.line != null
      ? [{
          yAxis: input.targets!.line,
          label: { formatter: `Target: ${input.targets!.line}` },
          lineStyle: { type: "dotted", width: 2 }
        }]
      : [];

  // Layout: ana chart + opsiyonel right breakdown
  const gridMain = hasBreakdown
    ? { left: 48, right: 240, top: 76, bottom: 48 }
    : { left: 48, right: 48, top: 76, bottom: 48 };

  const gridRight = { left: "78%", right: 24, top: 120, bottom: 56 };

  const series: any[] = [
    {
      name: input.timeseries_main.name,
      type: "line",
      smooth: true,
      showSymbol: false,
      data: yMain,
      lineStyle: { width: 3, color: "#165DFC" },
      itemStyle: { color: "#165DFC" },
      markLine: markLines.length || targetLine.length ? { data: [...markLines, ...targetLine] } : undefined,
      markArea
    }
  ];

  if (hasCompare) {
    series.push({
      name: input.timeseries_compare!.name,
      type: "line",
      smooth: true,
      showSymbol: false,
      data: yCompare,
      lineStyle: { type: "dashed", width: 2, color: "#06B6D4" },
      itemStyle: { color: "#06B6D4" }
    });
  }

  if (hasBreakdown) {
    series.push({
      name: "Category Breakdown",
      type: "bar",
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: input.category_breakdown!.map((c) => c.value),
      barWidth: 12,
      itemStyle: {
        color: "#8B5CF6"
      }
    });
  }

  return {
    // Basit ama premium header alanı
    title: [
      {
        text: "Trend Overview",
        left: 48,
        top: 16
      },
      {
        text: `${last} (${delta >= 0 ? "+" : ""}${delta})`,
        left: 48,
        top: 40
      }
    ],
    tooltip: { trigger: "axis" },
    legend: { top: 16, right: 48 },
    grid: hasBreakdown ? [gridMain, gridRight] : [gridMain],
    xAxis: hasBreakdown
      ? [
          { type: "category", data: x, boundaryGap: false },
          { type: "category", data: input.category_breakdown!.map((c) => c.label), gridIndex: 1 }
        ]
      : [{ type: "category", data: x, boundaryGap: false }],
    yAxis: hasBreakdown
      ? [
          { type: "value" },
          { type: "value", gridIndex: 1 }
        ]
      : [{ type: "value" }],
    series
  };
}

// ===== YENİ DSL YAPISI (Layer-First) =====

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

// Örnek spec generator (dataset sayısına göre)
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

// ===== V0.2 DSL (Calendar Heatmap + Weekly + Anomalies) =====

type CalendarHeatPoint = { date: string; value: number };
type WeeklyPoint = { week: string; value: number };
type AnomalyPoint = { date: string; value: number; label?: string };

type ChartizySpecV02 = {
  version: "0.2";
  id: string;
  title?: string;
  subtitle?: string;
  data: {
    calendar: CalendarHeatPoint[];
    weekly?: WeeklyPoint[];
    anomalies?: AnomalyPoint[];
  };
  theme?: {
    fontSize?: number;
    radius?: number;
  };
  layers: Array<
    | { type: "calendarHeatmap"; dataset: "calendar"; year: string }
    | { type: "line"; dataset: "weekly"; smooth?: boolean; dashed?: boolean }
    | { type: "scatter"; dataset: "anomalies"; symbolSize?: number }
  >;
};

function makeWeirdDemoSpec(): ChartizySpecV02 {
  const year = "2025";
  const start = new Date(`${year}-01-01T00:00:00Z`);
  const end = new Date(`${year}-12-31T00:00:00Z`);

  const calendar: CalendarHeatPoint[] = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    const day = d.getUTCDate();
    const month = d.getUTCMonth() + 1;

    const seasonal = month <= 4 ? 10 : month <= 8 ? 30 : 18;
    const wave = Math.round(10 * Math.sin(day / 3));
    const noise = (day * month) % 9;
    const value = Math.max(0, seasonal + wave + noise);

    calendar.push({ date: iso, value });
  }

  const weekly: WeeklyPoint[] = Array.from({ length: 52 }, (_, i) => {
    const w = i + 1;
    const value = Math.round(40 + 12 * Math.sin(w / 4) + (w % 7));
    return { week: `W${w}`, value };
  });

  const anomalies: AnomalyPoint[] = [
    { date: `${year}-02-11`, value: 55, label: "Spike" },
    { date: `${year}-03-07`, value: 5, label: "Drop" },
    { date: `${year}-06-18`, value: 62, label: "Peak" },
    { date: `${year}-08-02`, value: 8, label: "Low" },
    { date: `${year}-10-14`, value: 58, label: "Spike" },
    { date: `${year}-12-05`, value: 60, label: "Peak" },
  ];

  return {
    version: "0.2",
    id: "calendar_heatmap_weekly_trend_anomalies",
    title: "Operational Risk Intensity",
    subtitle: "Calendar Heatmap + Weekly Trend + Anomaly Markers",
    data: { calendar, weekly, anomalies },
    theme: { fontSize: 12, radius: 10 },
    layers: [
      { type: "calendarHeatmap", dataset: "calendar", year },
      { type: "line", dataset: "weekly", smooth: true, dashed: false },
      { type: "scatter", dataset: "anomalies", symbolSize: 10 }
    ]
  };
}

function compileToEChartsV02(spec: ChartizySpecV02) {
  const yearLayer = spec.layers.find((l) => l.type === "calendarHeatmap") as any;
  const year = yearLayer?.year ?? "2025";

  const cal = spec.data.calendar.map((p) => [p.date, p.value]);

  const weekly = (spec.data.weekly ?? []).map((p) => p.value);
  const weeklyX = (spec.data.weekly ?? []).map((p) => p.week);

  const avg =
    spec.data.calendar.length
      ? Math.round(spec.data.calendar.reduce((a, b) => a + b.value, 0) / spec.data.calendar.length)
      : 0;

  const anomalies = (spec.data.anomalies ?? []).map((a) => ({
    value: [a.date, a.value],
    name: a.label ?? "Anomaly"
  }));

  const hasWeekly = spec.layers.some((l) => l.type === "line") && weeklyX.length > 0;
  const hasAnom = spec.layers.some((l) => l.type === "scatter") && anomalies.length > 0;

  return {
    backgroundColor: "transparent",
    title: [
      {
        text: spec.title ?? "",
        left: 24,
        top: 16,
        textStyle: { fontSize: 16, fontWeight: 700 }
      },
      {
        text: spec.subtitle ?? "",
        left: 24,
        top: 40,
        textStyle: { fontSize: 12, opacity: 0.75 }
      },
      {
        text: `Avg: ${avg}`,
        right: 24,
        top: 16,
        textStyle: { fontSize: 14, fontWeight: 700 }
      }
    ],
    tooltip: { trigger: "item" },
    calendar: [
      {
        top: 84,
        left: 24,
        right: 24,
        cellSize: ["auto", 18],
        range: year,
        splitLine: { show: true, lineStyle: { width: 1, opacity: 0.25 } },
        itemStyle: { borderWidth: 1, opacity: 0.9 }
      }
    ],
    grid: hasWeekly
      ? [{ left: 24, right: 24, top: 380, height: 140 }]
      : [],
    xAxis: hasWeekly
      ? [{ type: "category", data: weeklyX, boundaryGap: false }]
      : [],
    yAxis: hasWeekly
      ? [{ type: "value", splitLine: { show: true } }]
      : [],
    visualMap: {
      min: 0,
      max: 70,
      orient: "horizontal",
      left: 24,
      bottom: 12,
      inRange: { color: ["#0EA5E9", "#22C55E", "#F59E0B", "#EF4444"] }
    },
    series: [
      {
        name: "Daily Intensity",
        type: "heatmap",
        coordinateSystem: "calendar",
        data: cal
      },
      ...(hasAnom
        ? [
            {
              name: "Anomalies",
              type: "scatter",
              coordinateSystem: "calendar",
              symbolSize: 10,
              data: anomalies,
              label: {
                show: true,
                formatter: (p: any) => p.data?.name ?? "",
                position: "top",
                fontSize: 10
              }
            }
          ]
        : []),
      ...(hasWeekly
        ? [
            {
              name: "Weekly Trend",
              type: "line",
              data: weekly,
              smooth: true,
              showSymbol: false,
              lineStyle: { width: 3 }
            }
          ]
        : [])
    ]
  };
}

// ===== Premium Editorial Compare Template =====

type ComparePoint = { t: string; a: number; b: number };

function makeCompareData(): ComparePoint[] {
  const days = Array.from({ length: 30 }, (_, i) => i + 1).map(
    (d) => `2025-12-${String(d).padStart(2, "0")}`
  );
  return days.map((t, i) => {
    const a = Math.round(65 + 10 * Math.sin(i / 3) + (i % 7));
    const b = Math.round(55 + 12 * Math.cos(i / 4) + ((i * 3) % 9));
    return { t, a, b };
  });
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

function pct(delta: number, base: number) {
  if (!base) return "—";
  const p = (delta / base) * 100;
  const sign = p >= 0 ? "+" : "";
  return `${sign}${p.toFixed(1)}%`;
}

function buildEditorialCompareOption(data: ComparePoint[]) {
  const x = data.map((d) => d.t);
  const A = data.map((d) => d.a);
  const B = data.map((d) => d.b);

  // KPI'lar
  const lastA = A[A.length - 1] ?? 0;
  const prevA = A[A.length - 2] ?? lastA;
  const deltaA = lastA - prevA;

  const lastB = B[B.length - 1] ?? 0;
  const prevB = B[B.length - 2] ?? lastB;
  const deltaB = lastB - prevB;

  // En büyük farkı bul
  let maxGap = -Infinity;
  let gapIndex = 0;
  for (let i = 0; i < A.length; i++) {
    const g = Math.abs(A[i] - B[i]);
    if (g > maxGap) {
      maxGap = g;
      gapIndex = i;
    }
  }

  const gapDate = x[gapIndex];
  const aGap = A[gapIndex];
  const bGap = B[gapIndex];
  const topIsA = aGap >= bGap;
  const highVal = topIsA ? aGap : bGap;
  const lowVal = topIsA ? bGap : aGap;
  const gapPct = pct(highVal - lowVal, lowVal);

  // En yüksek nokta
  let peakVal = -Infinity;
  let peakSeries: "A" | "B" = "A";
  let peakIndex = 0;
  for (let i = 0; i < A.length; i++) {
    if (A[i] > peakVal) {
      peakVal = A[i];
      peakSeries = "A";
      peakIndex = i;
    }
    if (B[i] > peakVal) {
      peakVal = B[i];
      peakSeries = "B";
      peakIndex = i;
    }
  }

  const targetLow = 58;
  const targetHigh = 72;

  const graphic = [
    {
      type: "line",
      left: 24,
      top: 76,
      shape: { x1: 0, y1: 0, x2: 1000, y2: 0 },
      style: { opacity: 0.15, lineWidth: 1 }
    }
  ];

  return {
    backgroundColor: "transparent",
    animation: true,
    animationDuration: 900,
    animationEasing: "cubicOut",
    animationDurationUpdate: 650,
    animationEasingUpdate: "cubicOut",
    title: [
      {
        text: "Performance Delta Story",
        left: 24,
        top: 18,
        textStyle: { fontSize: 18, fontWeight: 700 }
      },
      {
        text: "A vs B • highlight the biggest separation • annotate what matters",
        left: 24,
        top: 44,
        textStyle: { fontSize: 12, opacity: 0.7 }
      },
      {
        text: `A: ${fmt(lastA)}  (${deltaA >= 0 ? "+" : ""}${fmt(deltaA)})`,
        right: 24,
        top: 18,
        textStyle: { fontSize: 12, fontWeight: 700 }
      },
      {
        text: `B: ${fmt(lastB)}  (${deltaB >= 0 ? "+" : ""}${fmt(deltaB)})`,
        right: 24,
        top: 40,
        textStyle: { fontSize: 12, fontWeight: 700, opacity: 0.85 }
      }
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "line" },
      formatter: (params: any) => {
        const pA = params?.find((p: any) => p.seriesName === "Series A");
        const pB = params?.find((p: any) => p.seriesName === "Series B");
        const dt = pA?.axisValue ?? "";
        const a = pA?.data ?? 0;
        const b = pB?.data ?? 0;
        const gap = Math.abs(a - b);
        const top = Math.max(a, b);
        const low = Math.min(a, b);
        return `
          <div style="font-weight:700;margin-bottom:6px;">${dt}</div>
          <div style="display:flex;gap:10px;">
            <div><b>A</b>: ${fmt(a)}</div>
            <div><b>B</b>: ${fmt(b)}</div>
          </div>
          <div style="margin-top:6px;opacity:.85;">Gap: <b>${fmt(gap)}</b> (${pct(top-low, low)})</div>
        `;
      }
    },
    legend: {
      top: 16,
      right: 24,
      itemWidth: 12,
      itemHeight: 8,
      textStyle: { fontSize: 12 }
    },
    grid: { left: 24, right: 24, top: 96, bottom: 56 },
    xAxis: {
      type: "category",
      data: x,
      boundaryGap: false,
      axisLabel: { fontSize: 11, opacity: 0.7 },
      axisLine: { lineStyle: { opacity: 0.2 } },
      axisTick: { show: false }
    },
    yAxis: {
      type: "value",
      axisLabel: { fontSize: 11, opacity: 0.7 },
      splitLine: { lineStyle: { opacity: 0.12 } }
    },
    visualMap: [
      {
        show: false,
        type: "continuous",
        min: 0,
        max: 100,
        inRange: { colorLightness: [0.85, 0.55] }
      }
    ],
    graphic,
    series: [
      {
        name: "Series A",
        type: "line",
        data: A,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 3 },
        areaStyle: { opacity: 0.10 },
        emphasis: { focus: "series" },
        universalTransition: true,
        markArea: {
          silent: true,
          itemStyle: { opacity: 0.08 },
          data: [[{ yAxis: targetLow }, { yAxis: targetHigh }]]
        },
        markPoint: {
          symbolSize: 1,
          data:
            peakSeries === "A"
              ? [
                  {
                    coord: [x[peakIndex], peakVal],
                    value: peakVal,
                    label: {
                      show: true,
                      formatter: `PEAK  ${fmt(peakVal)}`,
                      padding: [6, 10],
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700
                    }
                  }
                ]
              : []
        }
      },
      {
        name: "Series B",
        type: "line",
        data: B,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, type: "dashed" },
        emphasis: { focus: "series" },
        universalTransition: true,
        markPoint: {
          symbolSize: 1,
          data:
            peakSeries === "B"
              ? [
                  {
                    coord: [x[peakIndex], peakVal],
                    value: peakVal,
                    label: {
                      show: true,
                      formatter: `PEAK  ${fmt(peakVal)}`,
                      padding: [6, 10],
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700
                    }
                  }
                ]
              : []
        }
      },
      {
        name: "Gap Connector",
        type: "line",
        data: [],
        silent: true,
        tooltip: { show: false },
        lineStyle: { opacity: 0 },
        markLine: {
          symbol: ["none", "none"],
          lineStyle: { width: 2, type: "solid", opacity: 0.8 },
          label: {
            show: true,
            formatter: () =>
              `BIGGEST GAP  ${fmt(Math.round(maxGap))}  (${gapPct})`,
            fontSize: 11,
            fontWeight: 800,
            padding: [6, 10],
            borderRadius: 10
          },
          data: [
            [
              { coord: [gapDate, lowVal] },
              { coord: [gapDate, highVal] }
            ]
          ]
        },
        markPoint: {
          symbol: "circle",
          symbolSize: 10,
          data: [
            {
              coord: [gapDate, highVal],
              value: highVal,
              label: {
                show: true,
                formatter: topIsA ? `A leads here` : `B leads here`,
                position: "top",
                fontSize: 11,
                fontWeight: 700,
                padding: [6, 10],
                borderRadius: 10
              }
            }
          ]
        }
      }
    ]
  };
}

// ===== ROAS Difference Bar Template =====

function buildROASDifferenceBarOption() {
  const cats = ["Google Ads", "Facebook Ads", "Instagram Ads", "TikTok Ads"];
  const values = [4.8, 3.0, 2.0, 1.45];
  const idxA = 0; // Google
  const idxB = 3; // TikTok
  const ratio = (values[idxA] / values[idxB]).toFixed(1) + "x";

  const graphic = [
    {
      type: "group",
      left: "6%",
      top: 70,
      children: [
        {
          type: "line",
          shape: { x1: 0, y1: 0, x2: 820, y2: 0 },
          style: { lineWidth: 10, lineCap: "round", stroke: "#111" }
        },
        {
          type: "polyline",
          shape: { points: [[0, 0], [-28, -18], [-18, 0], [-28, 18], [0, 0]] },
          style: { fill: "#111", stroke: "#111" }
        },
        {
          type: "line",
          shape: { x1: 820, y1: 0, x2: 820, y2: 180 },
          style: { lineWidth: 10, lineCap: "round", stroke: "#111" }
        },
        {
          type: "rect",
          shape: { x: 380, y: -28, width: 70, height: 38, r: 8 },
          style: { fill: "#fff", stroke: "#111", lineWidth: 3 }
        },
        {
          type: "text",
          style: {
            x: 415,
            y: -8,
            text: ratio,
            fill: "#111",
            fontSize: 18,
            fontWeight: 800,
            textAlign: "center",
            textVerticalAlign: "middle"
          }
        }
      ]
    }
  ];

  return {
    backgroundColor: "#fff",
    title: {
      text: "The ROAS on Google Ads is 3.3x bigger than Tiktok Ads",
      left: 24,
      top: 18,
      textStyle: { fontSize: 18, fontWeight: 800 }
    },
    grid: { left: 50, right: 30, top: 160, bottom: 60 },
    xAxis: {
      type: "category",
      data: cats,
      axisTick: { show: false },
      axisLine: { lineStyle: { opacity: 0.2 } },
      axisLabel: { fontSize: 12, opacity: 0.8 }
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 5,
      splitLine: { lineStyle: { opacity: 0.12 } },
      axisLabel: { fontSize: 12, opacity: 0.7 }
    },
    tooltip: {
      trigger: "item",
      formatter: (p: any) => `<b>${p.name}</b><br/>ROAS: ${p.value}`
    },
    graphic,
    series: [
      {
        type: "bar",
        data: values.map((v, i) => ({
          value: v,
          itemStyle: {
            borderRadius: [14, 14, 6, 6],
            color:
              i === 0 ? "#EFE9E0" : i === 1 ? "#E879F9" : i === 2 ? "#86EFAC" : "#F5B7F0"
          }
        })),
        barWidth: 70
      }
    ]
  };
}

// ===== Year Over Year Line Template =====

function buildYearOverYearLineOption(focusMonth: string) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const lastYear = [100,110,120,130,140,150,160,170,180,190,205,220].map(x=>x*1000);
  const currentYear = [110,115,125,140,145,155,175,180,190,205,215,235].map(x=>x*1000);

  const idx = months.indexOf(focusMonth);
  const ly = lastYear[idx];
  const cy = currentYear[idx];
  const mom = idx > 0 ? ((cy - currentYear[idx-1]) / currentYear[idx-1]) * 100 : 0;

  return {
    backgroundColor: "#fff",
    title: {
      text: "2024 outperformed 2023",
      left: 24,
      top: 18,
      textStyle: { fontSize: 20, fontWeight: 800 }
    },
    legend: {
      top: 18,
      right: 24,
      textStyle: { fontSize: 12, fontWeight: 700 }
    },
    grid: { left: 60, right: 40, top: 90, bottom: 55 },
    xAxis: {
      type: "category",
      data: months,
      axisTick: { show: false },
      axisLine: { lineStyle: { opacity: 0.2 } },
      axisLabel: { fontSize: 12, opacity: 0.75 }
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 12,
        opacity: 0.75,
        formatter: (v: number) => `$${Math.round(v/1000)}k`
      },
      splitLine: { lineStyle: { opacity: 0.12 } }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "line" },
      backgroundColor: "transparent",
      borderWidth: 0,
      extraCssText: "box-shadow:none;",
      formatter: (params: any) => {
        const pCY = params.find((p: any) => p.seriesName === "Current Year ($)");
        const pLY = params.find((p: any) => p.seriesName === "Last Year ($)");
        const month = pCY?.axisValue ?? "";
        const val = pLY?.data ?? 0;

        return `
        <div style="
          background:#111; color:#fff;
          padding:16px 18px; border-radius:12px;
          min-width:240px;
          box-shadow:0 18px 40px rgba(0,0,0,0.25);
          font-family: ui-sans-serif, system-ui;">
          <div style="opacity:.85; font-weight:700; margin-bottom:8px;">Last Year ($)</div>
          <div style="font-size:34px; font-weight:900; line-height:1;">$${(val/1000).toFixed(2)}k</div>
          <div style="margin-top:10px; color:#22c55e; font-weight:800;">
            +${mom.toFixed(2)}% <span style="color:rgba(255,255,255,.7); font-weight:600;">vs previous month</span>
          </div>
          <div style="margin-top:12px; opacity:.75; font-weight:700;">${month}</div>
        </div>`;
      }
    },
    series: [
      {
        name: "Current Year ($)",
        type: "line",
        data: currentYear,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 4 },
        emphasis: { focus: "series" }
      },
      {
        name: "Last Year ($)",
        type: "line",
        data: lastYear,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 3, type: "solid", opacity: 0.85 },
        emphasis: { focus: "series" },
        markLine: {
          symbol: ["none","none"],
          lineStyle: { type: "dashed", width: 2, opacity: 0.6 },
          data: [{ xAxis: focusMonth }]
        },
        markPoint: {
          data: [
            {
              coord: [focusMonth, ly],
              value: ly,
              symbolSize: 18,
              label: { show: false }
            }
          ]
        }
      }
    ]
  };
}

export default function ChartTemplateDemoPage() {
  const [activeTab, setActiveTab] = useState<"old" | "new" | "v02" | "editorial" | "roas" | "yoy">("old");
  const [mode, setMode] = useState<2 | 3 | 4 | 5>(5);
  const [newLayerCount, setNewLayerCount] = useState<1 | 2 | 3 | 4>(2);
  const [focusMonth, setFocusMonth] = useState("Jul");
  
  // Eski yapı
  const input = makeDemoInput(mode);
  const option = buildOption(input);
  
  // Yeni DSL için
  const newSpec = generateNewDSLSpec(newLayerCount);
  const newSpecOption = compileToECharts(newSpec);
  
  // V0.2 DSL için
  const v02Spec = makeWeirdDemoSpec();
  const v02Option = compileToEChartsV02(v02Spec);
  
  // Editorial Compare için
  const compareData = makeCompareData();
  const editorialOption = buildEditorialCompareOption(compareData);
  
  // ROAS Difference Bar için
  const roasOption = buildROASDifferenceBarOption();
  
  // Year Over Year için
  const yoyOption = buildYearOverYearLineOption(focusMonth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Chart Template Demo
          </h1>
          <p className="text-slate-600">
            Eski (Slot-based) vs Yeni (Layer-First DSL) karşılaştırması
          </p>
        </div>

        {/* Tab Selector */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-1 inline-flex">
          <button
            onClick={() => setActiveTab("old")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "old"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            Eski Yapı (Slot-Based)
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "new"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            Yeni Yapı (Layer-First DSL)
          </button>
          <button
            onClick={() => setActiveTab("v02")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "v02"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            V0.2 (Calendar Heatmap)
          </button>
          <button
            onClick={() => setActiveTab("editorial")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "editorial"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            Editorial Compare
          </button>
          <button
            onClick={() => setActiveTab("roas")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "roas"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            ROAS Difference
          </button>
          <button
            onClick={() => setActiveTab("yoy")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "yoy"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            Year Over Year
          </button>
        </div>

        {activeTab === "old" && (
          <>

        {/* Mode Selector */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">Dataset Sayısı:</span>
            <div className="flex gap-2">
              {[2, 3, 4, 5].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m as 2 | 3 | 4 | 5)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    mode === m
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {m} Dataset
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 text-sm text-slate-500 space-y-1">
            {mode === 2 && (
              <>
                <div>✓ <strong>Main Timeseries</strong> (mavi çizgi)</div>
                <div>✓ <strong>Category Breakdown</strong> (sağda bar chart - Plant A, B, Terminal, Offsite)</div>
              </>
            )}
            {mode === 3 && (
              <>
                <div>✓ <strong>Main Timeseries</strong> (mavi kalın çizgi)</div>
                <div>✓ <strong>Compare Timeseries</strong> (turkuaz kesikli çizgi - YENİ!)</div>
                <div>✓ <strong>Category Breakdown</strong> (sağda bar chart)</div>
              </>
            )}
            {mode === 4 && (
              <>
                <div>✓ <strong>Main Timeseries</strong> (mavi kalın çizgi)</div>
                <div>✓ <strong>Compare Timeseries</strong> (turkuaz kesikli çizgi)</div>
                <div>✓ <strong>Event Markers</strong> (dikey çizgiler - Incident, Policy update, Audit)</div>
                <div>✓ <strong>Category Breakdown</strong> (sağda bar chart)</div>
              </>
            )}
            {mode === 5 && (
              <>
                <div>✓ <strong>Main Timeseries</strong> (mavi kalın çizgi)</div>
                <div>✓ <strong>Compare Timeseries</strong> (turkuaz kesikli çizgi)</div>
                <div>✓ <strong>Event Markers</strong> (dikey çizgiler)</div>
                <div>✓ <strong>Target Band</strong> (gri alan + Target: 50 çizgisi)</div>
                <div>✓ <strong>Category Breakdown</strong> (sağda bar chart)</div>
              </>
            )}
          </div>
        </div>

        {/* Chart Container */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div style={{ height: 520, width: "100%" }} className="relative">
            <ReactECharts 
              option={option} 
              style={{ height: "100%", width: "100%" }}
              opts={{ renderer: "svg" }}
            />
          </div>
        </div>

        {/* Template Info */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Template Özellikleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-slate-700 mb-2">Slot Yapısı</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• <strong>A (zorunlu):</strong> timeseries_main - Ana zaman serisi</li>
                <li>• <strong>B (opsiyonel):</strong> timeseries_compare - Karşılaştırma serisi (3+ dataset)</li>
                <li>• <strong>C (opsiyonel):</strong> events - Olay işaretleri (4+ dataset)</li>
                <li>• <strong>D (opsiyonel):</strong> targets - Hedef bant ve çizgi (5+ dataset)</li>
                <li>• <strong>E (opsiyonel):</strong> category_breakdown - Kategori dağılımı (2+ dataset, sağda bar chart)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-slate-700 mb-2">Premium UI Özellikleri</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>✓ <strong>KPI Header:</strong> Son değer + delta (üstte)</li>
                <li>✓ <strong>Legend & Tooltip:</strong> Hover ile detaylar</li>
                <li>✓ <strong>Event Markers:</strong> Dikey çizgiler (4+ dataset)</li>
                <li>✓ <strong>Target Band:</strong> Gri alan + hedef çizgisi (5+ dataset)</li>
                <li>✓ <strong>Right Breakdown:</strong> Sağda kategori bar chart (2+ dataset)</li>
              </ul>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Not:</strong> Sağdaki "Category Breakdown" (Plant A, Plant B, Terminal, Offsite) 
                  kategorilere göre veri dağılımını gösterir. Bu, ana zaman serisinin farklı kategorilerdeki 
                  değerlerini görselleştirir.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Template JSON */}
        <div className="mt-6 bg-slate-900 rounded-xl shadow-sm border border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Template JSON</h2>
          <pre className="text-sm text-slate-300 overflow-x-auto">
{`{
  "id": "trend_compare_events_target_breakdown_v1",
  "name": "Trend + Compare + Events + Target + Breakdown",
  "tags": ["timeseries", "executive", "ops", "interactive", "premium"],
  "slots": [
    { "key": "timeseries_main", "type": "timeseries", "required": true },
    { "key": "timeseries_compare", "type": "timeseries", "required": false },
    { "key": "events", "type": "events", "required": false },
    { "key": "targets", "type": "targets", "required": false },
    { "key": "category_breakdown", "type": "category", "required": false }
  ],
  "min_inputs": 2,
  "max_inputs": 5
}`}
          </pre>
        </div>
          </>
        )}

        {activeTab === "new" && (
          <>
            {/* Layer Count Selector */}
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700">Layer Sayısı:</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((count) => (
                    <button
                      key={count}
                      onClick={() => setNewLayerCount(count as 1 | 2 | 3 | 4)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        newLayerCount === count
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
                {newLayerCount === 1 && (
                  <div>✓ <strong>Bars</strong> (Sales)</div>
                )}
                {newLayerCount === 2 && (
                  <>
                    <div>✓ <strong>Bars</strong> (Sales)</div>
                    <div>✓ <strong>Line</strong> (Profit - dashed)</div>
                  </>
                )}
                {newLayerCount === 3 && (
                  <>
                    <div>✓ <strong>Bars</strong> (Sales)</div>
                    <div>✓ <strong>Line</strong> (Profit - dashed)</div>
                    <div>✓ <strong>Area</strong> (Revenue)</div>
                  </>
                )}
                {newLayerCount === 4 && (
                  <>
                    <div>✓ <strong>Bars</strong> (Sales)</div>
                    <div>✓ <strong>Line</strong> (Profit - dashed)</div>
                    <div>✓ <strong>Area</strong> (Revenue)</div>
                    <div>✓ <strong>Points</strong> (Diamond markers)</div>
                  </>
                )}
              </div>
            </div>

            {/* Yeni DSL Açıklama */}
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Layer-First DSL (v0.1)
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">Temel Farklar</h3>
                  <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                    <li><strong>Layer-First:</strong> chartType yok, sadece layers var</li>
                    <li><strong>Encoding:</strong> x/y/series/color field mapping net tanımlı</li>
                    <li><strong>Canonical Data:</strong> Sadece Array of Objects format</li>
                    <li><strong>Combo Charts:</strong> Birden fazla layer ile (bar + line + area + points)</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Örnek:</strong> Bu chart'ta birden fazla layer birlikte kullanılıyor. 
                    Layer sayısını değiştirerek farklı kombinasyonları görebilirsin.
                  </p>
                </div>
              </div>
            </div>

            {/* Yeni DSL Chart */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
              <div style={{ height: 400, width: "100%" }}>
                <ReactECharts 
                  option={newSpecOption} 
                  style={{ height: "100%", width: "100%" }}
                  opts={{ renderer: "svg" }}
                />
              </div>
            </div>

            {/* Yeni DSL Spec JSON */}
            <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Yeni DSL Spec (JSON)</h2>
              <pre className="text-sm text-slate-300 overflow-x-auto">
{JSON.stringify(newSpec, null, 2)}
              </pre>
            </div>

            {/* Yeni DSL Özellikleri */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Yeni Yapının Avantajları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">✅ Çözülen Problemler</h3>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• chartType + layers karışıklığı yok</li>
                    <li>• Field mapping encoding'de net</li>
                    <li>• Combo charts doğal (layer stacking)</li>
                    <li>• Minimum spec zorunlu alanları belirli</li>
                    <li>• Compile fonksiyonu tek nokta</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">📋 Zorunlu Alanlar</h3>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• <strong>version:</strong> "0.1"</li>
                    <li>• <strong>id:</strong> unique identifier</li>
                    <li>• <strong>data.source:</strong> Array of Objects</li>
                    <li>• <strong>encoding:</strong> x/y field mapping</li>
                    <li>• <strong>layers:</strong> En az 1 layer</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "v02" && (
          <>
            {/* V0.2 DSL Açıklama */}
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Calendar Heatmap DSL (v0.2)
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">Özellikler</h3>
                  <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                    <li><strong>Calendar Heatmap:</strong> Yıllık takvim görünümünde günlük değerler</li>
                    <li><strong>Weekly Trend:</strong> Alt panelde haftalık trend çizgisi</li>
                    <li><strong>Anomaly Markers:</strong> Takvim üzerinde anomali işaretleri</li>
                    <li><strong>Multi-Dataset:</strong> calendar, weekly, anomalies ayrı dataset'ler</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Kullanım:</strong> Operational risk, aktivite yoğunluğu, günlük metrikler gibi 
                    zaman bazlı veriler için ideal. Takvim görünümü ile pattern'leri kolayca görebilirsin.
                  </p>
                </div>
              </div>
            </div>

            {/* V0.2 Chart */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
              <div style={{ height: 560, width: "100%" }}>
                <ReactECharts 
                  option={v02Option} 
                  style={{ height: "100%", width: "100%" }}
                  opts={{ renderer: "svg" }}
                />
              </div>
            </div>

            {/* V0.2 Spec JSON */}
            <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">V0.2 DSL Spec (JSON)</h2>
              <pre className="text-sm text-slate-300 overflow-x-auto">
{JSON.stringify(v02Spec, null, 2)}
              </pre>
            </div>

            {/* V0.2 Özellikleri */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">V0.2 Yapının Özellikleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">✅ Dataset Yapısı</h3>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• <strong>calendar:</strong> Günlük değerler (YYYY-MM-DD formatında)</li>
                    <li>• <strong>weekly:</strong> Haftalık trend (W1, W2, ... formatında)</li>
                    <li>• <strong>anomalies:</strong> Anomali noktaları (tarih + değer + label)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">📋 Layer Tipleri</h3>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• <strong>calendarHeatmap:</strong> Takvim heatmap (zorunlu)</li>
                    <li>• <strong>line:</strong> Haftalık trend çizgisi (opsiyonel)</li>
                    <li>• <strong>scatter:</strong> Anomali işaretleri (opsiyonel)</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "editorial" && (
          <>
            {/* Editorial Compare Açıklama */}
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Premium Editorial Compare Template
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">Özellikler</h3>
                  <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                    <li><strong>Dual Series Comparison:</strong> İki seriyi (A vs B) karşılaştırır</li>
                    <li><strong>Gap Annotation:</strong> En büyük farkı otomatik bulur ve işaretler</li>
                    <li><strong>Peak Markers:</strong> Her serinin en yüksek noktasını gösterir</li>
                    <li><strong>Target Band:</strong> Kabul edilebilir aralık (gri bant)</li>
                    <li><strong>KPI Headers:</strong> Son değer + delta gösterimi</li>
                    <li><strong>Editorial Tooltips:</strong> Detaylı gap analizi</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Kullanım:</strong> İki metrik, kampanya, veya performans göstergesini 
                    karşılaştırmak için ideal. Gap annotation'ları ile farkları vurgular.
                  </p>
                </div>
              </div>
            </div>

            {/* Editorial Chart */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-slate-600">
                  Template: <b>Editorial Compare (typography + gap annotation + target band)</b>
                </div>
                <div className="text-xs text-slate-500">ECharts • svg renderer</div>
              </div>
              <div style={{ height: 520, width: "100%" }}>
                <ReactECharts 
                  option={editorialOption} 
                  style={{ height: "100%", width: "100%" }}
                  opts={{ renderer: "svg" }}
                />
              </div>
            </div>

            {/* Editorial Özellikleri */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Editorial Template Özellikleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">✅ Otomatik Analizler</h3>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• <strong>Biggest Gap:</strong> İki seri arasındaki en büyük fark</li>
                    <li>• <strong>Peak Detection:</strong> Her serinin en yüksek noktası</li>
                    <li>• <strong>Delta Calculation:</strong> Son değer değişimi</li>
                    <li>• <strong>Percentage Gap:</strong> Farkın yüzdesel ifadesi</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">📋 Visual Elements</h3>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• <strong>Target Band:</strong> 58-72 aralığı (gri bant)</li>
                    <li>• <strong>Gap Connector:</strong> Dikey çizgi + label</li>
                    <li>• <strong>Peak Badges:</strong> "PEAK" etiketleri</li>
                    <li>• <strong>Lead Indicator:</strong> "A leads here" / "B leads here"</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "roas" && (
          <>
            {/* ROAS Difference Açıklama */}
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                ROAS Difference Bar Template
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">Özellikler</h3>
                  <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                    <li><strong>Comparison Arrow:</strong> İki değer arasındaki farkı görsel ok ile gösterir</li>
                    <li><strong>Ratio Display:</strong> Fark oranını (3.3x gibi) gösterir</li>
                    <li><strong>Custom Colors:</strong> Her bar için özel renk</li>
                    <li><strong>Rounded Bars:</strong> Üst köşeler yuvarlatılmış bar'lar</li>
                    <li><strong>Editorial Title:</strong> Açıklayıcı başlık</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Kullanım:</strong> Farklı platformların ROAS (Return on Ad Spend) değerlerini 
                    karşılaştırmak için ideal. Görsel ok ile farkı vurgular.
                  </p>
                </div>
              </div>
            </div>

            {/* ROAS Chart */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
              <div style={{ height: 520, width: "100%" }}>
                <ReactECharts 
                  option={roasOption} 
                  style={{ height: "100%", width: "100%" }}
                  opts={{ renderer: "svg" }}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === "yoy" && (
          <>
            {/* Year Over Year Açıklama */}
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Year Over Year Line Template
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">Özellikler</h3>
                  <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                    <li><strong>Dual Year Comparison:</strong> Mevcut yıl vs geçen yıl</li>
                    <li><strong>Focus Month:</strong> Belirli bir ayı vurgular (dikey çizgi + marker)</li>
                    <li><strong>Premium Tooltip:</strong> Kart stilinde detaylı tooltip</li>
                    <li><strong>MoM Calculation:</strong> Month-over-month yüzde değişimi</li>
                    <li><strong>Currency Formatting:</strong> $Xk formatında gösterim</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Kullanım:</strong> Yıllık performans karşılaştırması için ideal. 
                    Belirli bir ayı focus ederek detaylı analiz yapabilirsin.
                  </p>
                </div>
              </div>
            </div>

            {/* Month Selector */}
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700">Focus Month:</span>
                <div className="flex gap-2 flex-wrap">
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setFocusMonth(m)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        focusMonth === m
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Year Over Year Chart */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
              <div style={{ height: 520, width: "100%" }}>
                <ReactECharts 
                  option={yoyOption} 
                  style={{ height: "100%", width: "100%" }}
                  opts={{ renderer: "svg" }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
