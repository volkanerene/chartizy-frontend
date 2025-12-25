/**
 * Premium Chart Templates Registry
 * 
 * Bu dosya tüm premium template'lerin tanımlarını içerir.
 * Her template kendi demo verisiyle birlikte gelir ve ECharts ile render edilir.
 */

export type PremiumTemplateType = 
  | "editorial-compare"
  | "roas-difference"
  | "year-over-year"
  | "calendar-heatmap"
  | "slot-based-trend"
  | "layer-first-combo"
  | "funnel-conversion"
  | "waterfall-revenue"
  | "gauge-performance"
  | "heatmap-calendar"
  | "sankey-flow"
  | "radar-comparison"
  | "candlestick-trading"
  | "treemap-hierarchy"
  | "bubble-scatter"
  | "stacked-area-trend";

export interface PremiumTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  isPremium: boolean;
  getEChartsOption: () => any;
  dataRequirements: {
    minFields: number;
    requiredFields?: string[];
    description: string;
  };
}

// ===== Helper Functions =====

function fmt(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

function pct(delta: number, base: number) {
  if (!base) return "—";
  const p = (delta / base) * 100;
  const sign = p >= 0 ? "+" : "";
  return `${sign}${p.toFixed(1)}%`;
}

// ===== Editorial Compare Template =====

function buildEditorialCompareOption(data?: Array<{ t: string; a: number; b: number }>) {
  const defaultData = Array.from({ length: 30 }, (_, i) => {
    const t = `2025-12-${String(i + 1).padStart(2, "0")}`;
    return {
      t,
      a: Math.round(65 + 10 * Math.sin(i / 3) + (i % 7)),
      b: Math.round(55 + 12 * Math.cos(i / 4) + ((i * 3) % 9))
    };
  });

  const chartData = data || defaultData;
  const x = chartData.map((d) => d.t);
  const A = chartData.map((d) => d.a);
  const B = chartData.map((d) => d.b);

  const lastA = A[A.length - 1] ?? 0;
  const prevA = A[A.length - 2] ?? lastA;
  const deltaA = lastA - prevA;

  const lastB = B[B.length - 1] ?? 0;
  const prevB = B[B.length - 2] ?? lastB;
  const deltaB = lastB - prevB;

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

  return {
    backgroundColor: "transparent",
    animation: true,
    animationDuration: 900,
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
    series: [
      {
        name: "Series A",
        type: "line",
        data: A,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 3 },
        areaStyle: { opacity: 0.10 },
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

// ===== ROAS Difference Template =====

function buildROASDifferenceOption(data?: Array<{ name: string; value: number }>) {
  const defaultData = [
    { name: "Google Ads", value: 4.8 },
    { name: "Facebook Ads", value: 3.0 },
    { name: "Instagram Ads", value: 2.0 },
    { name: "TikTok Ads", value: 1.45 }
  ];

  const chartData = data || defaultData;
  const cats = chartData.map((d) => d.name);
  const values = chartData.map((d) => d.value);
  const idxA = 0;
  const idxB = values.length - 1;
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
      text: `The ROAS on ${cats[idxA]} is ${ratio} bigger than ${cats[idxB]}`,
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
      max: Math.max(...values) * 1.2,
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

// ===== Year Over Year Template =====

function buildYearOverYearOption(
  focusMonth: string = "Jul",
  data?: { currentYear: number[]; lastYear: number[] }
) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  
  const defaultCurrentYear = [110,115,125,140,145,155,175,180,190,205,215,235].map(x=>x*1000);
  const defaultLastYear = [100,110,120,130,140,150,160,170,180,190,205,220].map(x=>x*1000);

  const currentYear = data?.currentYear || defaultCurrentYear;
  const lastYear = data?.lastYear || defaultLastYear;

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

// ===== Template Registry =====

export const PREMIUM_TEMPLATES: PremiumTemplate[] = [
  // Existing templates
  {
    id: "editorial-compare",
    name: "Editorial Compare",
    description: "Two series comparison with gap annotation, peak markers, and target band",
    category: "comparison",
    tags: ["comparison", "dual-series", "gap-analysis", "premium"],
    isPremium: true,
    getEChartsOption: () => buildEditorialCompareOption(),
    dataRequirements: {
      minFields: 3,
      requiredFields: ["date", "series_a", "series_b"],
      description: "Requires date field and two numeric series (A and B)"
    }
  },
  {
    id: "roas-difference",
    name: "ROAS Difference",
    description: "Bar chart with comparison arrow showing ratio between platforms",
    category: "comparison",
    tags: ["bar", "comparison", "ratio", "premium"],
    isPremium: true,
    getEChartsOption: () => buildROASDifferenceOption(),
    dataRequirements: {
      minFields: 2,
      requiredFields: ["name", "value"],
      description: "Requires category names and numeric values"
    }
  },
  {
    id: "year-over-year",
    name: "Year Over Year",
    description: "Dual year comparison with premium tooltip and focus month marker",
    category: "timeseries",
    tags: ["line", "timeseries", "comparison", "premium", "tooltip"],
    isPremium: true,
    getEChartsOption: () => buildYearOverYearOption("Jul"),
    dataRequirements: {
      minFields: 2,
      requiredFields: ["month", "current_year", "last_year"],
      description: "Requires month field and two year series"
    }
  },
  // New premium templates (10 creative charts)
  ...NEW_PREMIUM_TEMPLATES
];

// ===== Template Selection Logic =====

export function selectBestTemplate(data: any): PremiumTemplate | null {
  if (!data || typeof data !== "object") return null;

  // Check if data is array of objects
  if (Array.isArray(data) && data.length > 0) {
    const firstItem = data[0];
    const fields = Object.keys(firstItem);
    const numericFields = fields.filter((f) => typeof firstItem[f] === "number");

    // Check for date/time field (in any field)
    const hasDateField = fields.some((f) => {
      const val = firstItem[f];
      if (typeof val === "string") {
        // Check if it's a date string
        if (/^\d{4}-\d{2}-\d{2}/.test(val)) return true;
        // Check if field name suggests date
        if (f.toLowerCase().includes("date") || f.toLowerCase().includes("time")) return true;
      }
      return false;
    });

    // Check for month field (in any field)
    const hasMonthField = fields.some((f) => {
      const val = firstItem[f];
      if (typeof val === "string") {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        if (months.includes(val)) return true;
        // Check if field name suggests month
        if (f.toLowerCase().includes("month")) return true;
      }
      return false;
    });

    // Check for label/name field
    const hasNameField = fields.some((f) => {
      const lower = f.toLowerCase();
      return lower === "name" || lower === "label" || lower === "category" || lower === "platform";
    });

    // Year Over Year: needs month + 2 numeric fields
    if (hasMonthField && numericFields.length >= 2) {
      return PREMIUM_TEMPLATES.find((t) => t.id === "year-over-year") || null;
    }

    // Editorial Compare: needs date + 2 numeric fields (or label field with 2 numeric)
    if (hasDateField && numericFields.length >= 2) {
      return PREMIUM_TEMPLATES.find((t) => t.id === "editorial-compare") || null;
    }

    // If we have label field and at least 1 numeric, and it's comparison context
    if (hasNameField && numericFields.length >= 1 && data.length >= 2) {
      // Check if it looks like comparison data (multiple categories)
      return PREMIUM_TEMPLATES.find((t) => t.id === "roas-difference") || null;
    }
  }

  // Check if data has labels and datasets (Chart.js format)
  if (data.labels && Array.isArray(data.labels) && data.datasets && Array.isArray(data.datasets)) {
    // ROAS Difference for category data
    if (data.datasets.length === 1 && data.labels.length >= 2) {
      return PREMIUM_TEMPLATES.find((t) => t.id === "roas-difference") || null;
    }
    
    // Editorial Compare for multiple datasets
    if (data.datasets.length >= 2) {
      return PREMIUM_TEMPLATES.find((t) => t.id === "editorial-compare") || null;
    }
  }

  return null;
}

// ===== New Premium Templates (10 Creative Charts) =====

// 1. Funnel Conversion
function buildFunnelConversionOption(data?: Array<{ stage: string; value: number; dropoff?: number }>) {
  const defaultData = [
    { stage: "Visitors", value: 10000, dropoff: 0 },
    { stage: "Sign-ups", value: 2500, dropoff: 75 },
    { stage: "Trials", value: 1200, dropoff: 52 },
    { stage: "Purchases", value: 480, dropoff: 60 },
    { stage: "Renewals", value: 360, dropoff: 25 }
  ];
  const chartData = data || defaultData;
  
  return {
    backgroundColor: "transparent",
    animation: true,
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const d = chartData[params.dataIndex];
        return `${d.stage}<br/>${fmt(d.value)} (${d.dropoff}% drop-off)`;
      }
    },
    series: [{
      type: "funnel",
      left: "10%",
      top: 60,
      bottom: 60,
      width: "80%",
      min: 0,
      max: chartData[0].value,
      minSize: "0%",
      maxSize: "100%",
      sort: "descending",
      gap: 2,
      label: {
        show: true,
        position: "inside",
        formatter: "{b}: {c}",
        fontSize: 12
      },
      labelLine: { length: 10, lineStyle: { width: 1, type: "solid" } },
      itemStyle: { borderColor: "#fff", borderWidth: 1 },
      emphasis: { label: { fontSize: 14 } },
      data: chartData.map(d => ({ value: d.value, name: d.stage }))
    }]
  };
}

// 2. Waterfall Revenue
function buildWaterfallRevenueOption(data?: Array<{ label: string; value: number; type?: "start" | "positive" | "negative" | "end" }>) {
  const defaultData = [
    { label: "Starting", value: 50000, type: "start" },
    { label: "Sales", value: 25000, type: "positive" },
    { label: "Refunds", value: -5000, type: "negative" },
    { label: "Fees", value: -3000, type: "negative" },
    { label: "Ending", value: 67000, type: "end" }
  ];
  const chartData = data || defaultData;
  
  const colors = chartData.map(d => {
    if (d.type === "start" || d.type === "end") return "#165DFC";
    if (d.type === "negative") return "#ef4444";
    return "#10b981";
  });
  
  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const p = params[0];
        return `${p.name}<br/>${p.marker}${p.seriesName}: ${fmt(p.value)}`;
      }
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      data: chartData.map(d => d.label)
    },
    yAxis: { type: "value" },
    series: [{
      type: "bar",
      stack: "waterfall",
      data: chartData.map((d, i) => ({
        value: d.value,
        itemStyle: { color: colors[i] }
      })),
      label: {
        show: true,
        position: "top",
        formatter: (params: any) => {
          const val = params.value;
          return val >= 0 ? `+${fmt(val)}` : fmt(val);
        }
      }
    }]
  };
}

// 3. Gauge Performance
function buildGaugePerformanceOption(value?: number, target?: number) {
  const val = value ?? 75;
  const tgt = target ?? 100;
  const percentage = (val / tgt) * 100;
  
  return {
    backgroundColor: "transparent",
    series: [{
      type: "gauge",
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: tgt,
      splitNumber: 8,
      axisLine: {
        lineStyle: {
          width: 6,
          color: [[val / tgt, "#165DFC"], [1, "#e5e7eb"]]
        }
      },
      pointer: { itemStyle: { color: "auto" } },
      axisTick: { distance: -30, length: 8, lineStyle: { color: "#fff", width: 2 } },
      splitLine: { distance: -30, length: 14, lineStyle: { color: "#fff", width: 3 } },
      axisLabel: { distance: -20, color: "#999", fontSize: 12 },
      detail: {
        valueAnimation: true,
        formatter: `{value} / ${tgt}\n${percentage.toFixed(0)}%`,
        fontSize: 20,
        offsetCenter: [0, "70%"]
      },
      data: [{ value: val, name: "Performance" }]
    }]
  };
}

// 4-10. Placeholder builders (simplified versions)
function buildHeatmapCalendarOption() {
  const days = Array.from({ length: 365 }, (_, i) => {
    const date = new Date(2024, 0, i + 1);
    return [date.getMonth(), date.getDate(), Math.floor(Math.random() * 100)];
  });
  
  return {
    backgroundColor: "transparent",
    calendar: { top: "middle", left: "center", cellSize: ["auto", 13] },
    visualMap: { min: 0, max: 100, calculable: true, orient: "horizontal", left: "center", bottom: "15%" },
    series: [{
      type: "heatmap",
      coordinateSystem: "calendar",
      data: days
    }]
  };
}

function buildSankeyFlowOption() {
  return {
    backgroundColor: "transparent",
    series: [{
      type: "sankey",
      data: [
        { name: "Source A" }, { name: "Source B" }, { name: "Target 1" }, { name: "Target 2" }
      ],
      links: [
        { source: "Source A", target: "Target 1", value: 10 },
        { source: "Source B", target: "Target 2", value: 15 }
      ]
    }]
  };
}

function buildRadarComparisonOption() {
  return {
    backgroundColor: "transparent",
    radar: {
      indicator: [
        { name: "Speed", max: 100 },
        { name: "Quality", max: 100 },
        { name: "Cost", max: 100 },
        { name: "Service", max: 100 }
      ]
    },
    series: [{
      type: "radar",
      data: [
        { value: [80, 90, 70, 85], name: "Series A" },
        { value: [70, 85, 90, 75], name: "Series B" }
      ]
    }]
  };
}

function buildCandlestickTradingOption() {
  const dates = Array.from({ length: 20 }, (_, i) => `Day ${i + 1}`);
  const data = dates.map(() => [
    Math.random() * 100 + 50,
    Math.random() * 100 + 50,
    Math.random() * 100 + 50,
    Math.random() * 100 + 50
  ]);
  
  return {
    backgroundColor: "transparent",
    xAxis: { type: "category", data: dates },
    yAxis: { scale: true },
    series: [{
      type: "candlestick",
      data
    }]
  };
}

function buildTreemapHierarchyOption() {
  return {
    backgroundColor: "transparent",
    series: [{
      type: "treemap",
      data: [
        { name: "Category A", value: 100, children: [
          { name: "A1", value: 60 },
          { name: "A2", value: 40 }
        ]},
        { name: "Category B", value: 80 }
      ]
    }]
  };
}

function buildBubbleScatterOption() {
  return {
    backgroundColor: "transparent",
    xAxis: { type: "value" },
    yAxis: { type: "value" },
    series: [{
      type: "scatter",
      symbolSize: (data: number[]) => data[2] * 2,
      data: Array.from({ length: 20 }, () => [
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 50
      ])
    }]
  };
}

function buildStackedAreaTrendOption() {
  const categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },
    legend: { data: ["Series A", "Series B", "Series C"] },
    xAxis: { type: "category", boundaryGap: false, data: categories },
    yAxis: { type: "value" },
    series: [
      { name: "Series A", type: "line", stack: "Total", areaStyle: {}, data: [120, 132, 101, 134, 90, 230] },
      { name: "Series B", type: "line", stack: "Total", areaStyle: {}, data: [220, 182, 191, 234, 290, 330] },
      { name: "Series C", type: "line", stack: "Total", areaStyle: {}, data: [150, 232, 201, 154, 190, 330] }
    ]
  };
}

// Add new templates to PREMIUM_TEMPLATES array
const NEW_PREMIUM_TEMPLATES: PremiumTemplate[] = [
  {
    id: "funnel-conversion",
    name: "Funnel Conversion",
    description: "Conversion funnel with drop-off annotations and stage visualization",
    category: "funnel",
    tags: ["funnel", "conversion", "drop-off", "premium"],
    isPremium: true,
    getEChartsOption: () => buildFunnelConversionOption(),
    dataRequirements: {
      minFields: 2,
      requiredFields: ["stage", "value"],
      description: "Requires stage names and conversion values"
    }
  },
  {
    id: "waterfall-revenue",
    name: "Waterfall Revenue",
    description: "Revenue breakdown with positive/negative bars showing cumulative changes",
    category: "waterfall",
    tags: ["waterfall", "revenue", "breakdown", "premium"],
    isPremium: true,
    getEChartsOption: () => buildWaterfallRevenueOption(),
    dataRequirements: {
      minFields: 2,
      requiredFields: ["label", "value"],
      description: "Requires labels and values (positive/negative)"
    }
  },
  {
    id: "gauge-performance",
    name: "Gauge Performance",
    description: "Speedometer style gauge with target bands and performance indicators",
    category: "gauge",
    tags: ["gauge", "performance", "target", "premium"],
    isPremium: true,
    getEChartsOption: () => buildGaugePerformanceOption(),
    dataRequirements: {
      minFields: 1,
      requiredFields: ["value"],
      description: "Requires a numeric value and optional target"
    }
  },
  {
    id: "heatmap-calendar",
    name: "Heatmap Calendar",
    description: "Calendar heatmap with intensity colors showing activity over time",
    category: "heatmap",
    tags: ["heatmap", "calendar", "time-series", "premium"],
    isPremium: true,
    getEChartsOption: () => buildHeatmapCalendarOption(),
    dataRequirements: {
      minFields: 2,
      requiredFields: ["date", "value"],
      description: "Requires dates and intensity values"
    }
  },
  {
    id: "sankey-flow",
    name: "Sankey Flow",
    description: "Flow diagram with node connections showing data movement",
    category: "sankey",
    tags: ["sankey", "flow", "network", "premium"],
    isPremium: true,
    getEChartsOption: () => buildSankeyFlowOption(),
    dataRequirements: {
      minFields: 3,
      requiredFields: ["source", "target", "value"],
      description: "Requires source, target nodes and flow values"
    }
  },
  {
    id: "radar-comparison",
    name: "Radar Comparison",
    description: "Multi-series radar chart with area fills for comparison",
    category: "radar",
    tags: ["radar", "comparison", "multi-series", "premium"],
    isPremium: true,
    getEChartsOption: () => buildRadarComparisonOption(),
    dataRequirements: {
      minFields: 2,
      requiredFields: ["dimension", "value"],
      description: "Requires dimensions and values for each series"
    }
  },
  {
    id: "candlestick-trading",
    name: "Candlestick Trading",
    description: "OHLC candlestick chart with volume bars for trading analysis",
    category: "candlestick",
    tags: ["candlestick", "trading", "ohlc", "premium"],
    isPremium: true,
    getEChartsOption: () => buildCandlestickTradingOption(),
    dataRequirements: {
      minFields: 4,
      requiredFields: ["open", "high", "low", "close"],
      description: "Requires OHLC (Open, High, Low, Close) values"
    }
  },
  {
    id: "treemap-hierarchy",
    name: "Treemap Hierarchy",
    description: "Hierarchical data visualization with nested rectangles",
    category: "treemap",
    tags: ["treemap", "hierarchy", "nested", "premium"],
    isPremium: true,
    getEChartsOption: () => buildTreemapHierarchyOption(),
    dataRequirements: {
      minFields: 2,
      requiredFields: ["name", "value"],
      description: "Requires hierarchical structure with names and values"
    }
  },
  {
    id: "bubble-scatter",
    name: "Bubble Scatter",
    description: "Multi-dimensional scatter plot with size/color encoding",
    category: "scatter",
    tags: ["scatter", "bubble", "multi-dimensional", "premium"],
    isPremium: true,
    getEChartsOption: () => buildBubbleScatterOption(),
    dataRequirements: {
      minFields: 3,
      requiredFields: ["x", "y", "size"],
      description: "Requires X, Y coordinates and size values"
    }
  },
  {
    id: "stacked-area-trend",
    name: "Stacked Area Trend",
    description: "Multiple series with gradient fills and trend annotations",
    category: "area",
    tags: ["area", "stacked", "trend", "premium"],
    isPremium: true,
    getEChartsOption: () => buildStackedAreaTrendOption(),
    dataRequirements: {
      minFields: 2,
      requiredFields: ["date", "series_values"],
      description: "Requires dates and multiple series values"
    }
  }
];
