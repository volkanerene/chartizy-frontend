"use client";

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  TooltipItem,
} from "chart.js";
import { Line, Bar, Pie, Doughnut, Radar } from "react-chartjs-2";
import dynamic from "next/dynamic";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend
);

interface InteractiveChartProps {
  chartConfig: {
    type?: string;
    data?: {
      labels?: string[];
      datasets?: Array<{
        label?: string;
        data?: number[];
        backgroundColor?: string | string[];
        borderColor?: string | string[];
      }>;
    };
    options?: Record<string, unknown>;
  };
  height?: number;
  showPercentChange?: boolean;
  animated?: boolean;
  theme?: "light" | "dark";
}

const defaultColors = [
  "rgba(139, 92, 246, 0.8)",
  "rgba(6, 182, 212, 0.8)",
  "rgba(16, 185, 129, 0.8)",
  "rgba(245, 158, 11, 0.8)",
  "rgba(239, 68, 68, 0.8)",
  "rgba(236, 72, 153, 0.8)",
];

const borderColors = [
  "rgba(139, 92, 246, 1)",
  "rgba(6, 182, 212, 1)",
  "rgba(16, 185, 129, 1)",
  "rgba(245, 158, 11, 1)",
  "rgba(239, 68, 68, 1)",
  "rgba(236, 72, 153, 1)",
];

export interface InteractiveChartRef {
  toBase64Image: () => string | undefined;
  getChart: () => ChartJS | null;
}

export const InteractiveChart = forwardRef<InteractiveChartRef, InteractiveChartProps>(({
  chartConfig,
  height = 400,
  showPercentChange = true,
  animated = true,
  theme = "light",
}, ref) => {
  const chartRef = useRef<ChartJS>(null);

  useImperativeHandle(ref, () => ({
    toBase64Image: () => {
      return chartRef.current?.toBase64Image();
    },
    getChart: () => chartRef.current,
  }));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartType = chartConfig.type || "bar";
  const rawData = chartConfig.data || { labels: [], datasets: [] };
  const labels = rawData.labels || [];
  const datasets = rawData.datasets || [];
  const values = datasets[0]?.data || [];

  // Calculate percentage changes
  const percentChanges = values.map((val, i) => {
    if (i === 0) return null;
    const prev = values[i - 1];
    if (prev === 0) return val > 0 ? 100 : 0;
    return ((val - prev) / prev) * 100;
  });

  // Custom tooltip with % change
  const tooltipConfig = {
    enabled: true,
    backgroundColor: theme === "dark" ? "rgba(30, 41, 59, 0.95)" : "rgba(255, 255, 255, 0.95)",
    titleColor: theme === "dark" ? "#F8FAFC" : "#1E293B",
    bodyColor: theme === "dark" ? "#CBD5E1" : "#64748B",
    borderColor: theme === "dark" ? "rgba(100, 116, 139, 0.3)" : "rgba(139, 92, 246, 0.2)",
    borderWidth: 1,
    cornerRadius: 12,
    padding: 16,
    boxPadding: 8,
    usePointStyle: true,
    titleFont: { size: 14, weight: "bold" as const },
    bodyFont: { size: 13 },
    displayColors: true,
    callbacks: {
      title: (items: TooltipItem<"bar" | "line">[]) => {
        return items[0]?.label || "";
      },
      label: (item: TooltipItem<"bar" | "line">) => {
        const value = item.raw as number;
        const index = item.dataIndex;
        let label = `Value: ${value.toLocaleString()}`;
        
        if (showPercentChange && index > 0 && percentChanges[index] !== null) {
          const change = percentChanges[index]!;
          const sign = change >= 0 ? "+" : "";
          const emoji = change >= 0 ? "📈" : "📉";
          label += `\n${emoji} ${sign}${change.toFixed(1)}% from previous`;
        }
        
        return label;
      },
      afterLabel: (item: TooltipItem<"bar" | "line">) => {
        const index = item.dataIndex;
        const total = values.reduce((a, b) => a + b, 0);
        const percentage = ((values[index] / total) * 100).toFixed(1);
        return `Share: ${percentage}% of total`;
      },
    },
  };

  // Enhanced options
  const baseOptions: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: animated
      ? {
          duration: 1500,
          easing: "easeOutQuart",
          delay: (context) => context.dataIndex * 100,
        }
      : false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: (chartConfig.data as { title?: string })?.title || 
              (chartConfig.options as { title?: { text?: string } })?.title?.text || 
              "Chart",
        font: {
          size: 18,
          weight: "bold" as const,
        },
        color: theme === "dark" ? "#F8FAFC" : "#1E293B",
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      legend: {
        display: datasets.length > 1,
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: { size: 12, weight: "normal" as const },
          color: theme === "dark" ? "#CBD5E1" : "#64748B",
        },
      },
      tooltip: tooltipConfig as never,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: { size: 12 },
          color: theme === "dark" ? "#94A3B8" : "#64748B",
          padding: 8,
        },
      },
      y: {
        title: {
          display: true,
          text: datasets[0]?.label || "Value",
          font: {
            size: 14,
            weight: "bold" as const,
          },
          color: theme === "dark" ? "#CBD5E1" : "#64748B",
          padding: {
            top: 0,
            bottom: 10,
          },
        },
        grid: {
          color: theme === "dark" ? "rgba(100, 116, 139, 0.1)" : "rgba(139, 92, 246, 0.08)",
        },
        border: {
          display: false,
        },
        ticks: {
          font: { size: 12 },
          color: theme === "dark" ? "#94A3B8" : "#64748B",
          padding: 8,
          callback: (value) => {
            const num = value as number;
            if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
            if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
            return num.toString();
          },
        },
      },
    },
    onHover: (_, elements) => {
      if (elements.length > 0) {
        setHoveredIndex(elements[0].index);
      } else {
        setHoveredIndex(null);
      }
    },
  };

  // Prepare chart data with styling
  const prepareData = (): ChartData<"bar" | "line" | "pie" | "doughnut" | "radar"> => {
    const styledDatasets = datasets.map((ds, i) => ({
      ...ds,
      backgroundColor: ds.backgroundColor || (chartType === "line" 
        ? `rgba(139, 92, 246, 0.2)` 
        : defaultColors),
      borderColor: ds.borderColor || borderColors[i] || borderColors[0],
      borderWidth: chartType === "line" ? 3 : 0,
      borderRadius: chartType === "bar" ? 8 : 0,
      tension: chartType === "line" ? 0.4 : 0,
      fill: chartType === "line" || chartType === "area",
      pointRadius: chartType === "line" ? 0 : undefined,
      pointHoverRadius: chartType === "line" ? 6 : undefined,
      pointBackgroundColor: chartType === "line" ? borderColors[0] : undefined,
      pointBorderColor: chartType === "line" ? "#fff" : undefined,
      pointBorderWidth: chartType === "line" ? 2 : undefined,
      hoverBackgroundColor: chartType === "bar" 
        ? defaultColors.map(c => c.replace("0.8", "1"))
        : undefined,
    }));

    return {
      labels,
      datasets: styledDatasets as any,
    };
  };

  const renderChart = () => {
    const data = prepareData();

    switch (chartType) {
      case "line":
      case "area":
        return (
          <Line
            ref={chartRef as never}
            data={data as ChartData<"line">}
            options={baseOptions as ChartOptions<"line">}
          />
        );

      case "bar":
      case "stacked-bar":
        return (
          <Bar
            ref={chartRef as never}
            data={data as ChartData<"bar">}
            options={{
              ...baseOptions,
              scales: chartType === "stacked-bar" ? {
                ...baseOptions.scales,
                x: { ...baseOptions.scales?.x, stacked: true },
                y: { ...baseOptions.scales?.y, stacked: true },
              } : baseOptions.scales,
            } as ChartOptions<"bar">}
          />
        );

      case "pie":
        return (
          <Pie
            data={data as ChartData<"pie">}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: animated ? { duration: 1500, animateRotate: true, animateScale: true } : false,
              plugins: {
                legend: {
                  position: "right",
                  labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    padding: 16,
                    font: { size: 12 },
                  },
                },
                tooltip: tooltipConfig as never,
              },
            }}
          />
        );

      case "doughnut":
        return (
          <Doughnut
            data={{
              ...data,
              datasets: data.datasets.map(ds => ({
                ...ds,
                cutout: "65%",
                borderRadius: 4,
                spacing: 2,
              })),
            } as ChartData<"doughnut">}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: animated ? { duration: 1500, animateRotate: true, animateScale: true } : false,
              plugins: {
                legend: {
                  position: "right",
                  labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    padding: 16,
                    font: { size: 12 },
                  },
                },
                tooltip: tooltipConfig as never,
              },
            }}
          />
        );

      case "radar":
        return (
          <Radar
            data={data as ChartData<"radar">}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: animated ? { duration: 1500 } : false,
              scales: {
                r: {
                  beginAtZero: true,
                  grid: {
                    color: theme === "dark" ? "rgba(100, 116, 139, 0.2)" : "rgba(139, 92, 246, 0.1)",
                  },
                  angleLines: {
                    color: theme === "dark" ? "rgba(100, 116, 139, 0.2)" : "rgba(139, 92, 246, 0.1)",
                  },
                  pointLabels: {
                    font: { size: 12 },
                    color: theme === "dark" ? "#CBD5E1" : "#64748B",
                  },
                  ticks: {
                    display: false,
                  },
                },
              },
              plugins: {
                legend: {
                  display: datasets.length > 1,
                  position: "top",
                },
                tooltip: tooltipConfig as never,
              },
            }}
          />
        );

      case "waterfall":
      case "funnel":
        // Waterfall and Funnel can be rendered as stacked bar charts
        return (
          <Bar
            ref={chartRef as never}
            data={data as ChartData<"bar">}
            options={{
              ...baseOptions,
              scales: {
                ...baseOptions.scales,
                x: { ...baseOptions.scales?.x, stacked: true },
                y: { ...baseOptions.scales?.y, stacked: true },
              },
            } as ChartOptions<"bar">}
          />
        );

      case "3d":
      case "3d-surface":
      case "3d-bar":
        // 3D charts using Plotly.js
        try {
          const plotlyData = chartConfig.data as any;
          let plotlyConfig: any = {
            type: chartType === "3d-surface" ? "surface" : chartType === "3d-bar" ? "bar" : "scatter3d",
            mode: chartType === "3d" ? "markers" : undefined,
          };
          
          if (chartType === "3d-surface") {
            plotlyConfig = {
              ...plotlyConfig,
              z: plotlyData.z || [],
              colorscale: "Viridis",
            };
          } else if (chartType === "3d-bar") {
            plotlyConfig = {
              ...plotlyConfig,
              x: labels,
              y: values,
              type: "bar",
            };
          } else {
            plotlyConfig = {
              ...plotlyConfig,
              x: labels,
              y: values,
              z: values.map((v, i) => v + i * 10),
            };
          }

          return (
            <Plot
              data={[plotlyConfig] as any}
              layout={{
                title: {
                  text: (chartConfig.options as any)?.title?.text || "",
                },
                scene: {
                  xaxis: { title: "X Axis" },
                  yaxis: { title: "Y Axis" },
                  zaxis: { title: "Z Axis" },
                  camera: { eye: { x: 1.5, y: 1.5, z: 1.5 } },
                },
                height: height,
                margin: { l: 0, r: 0, t: 40, b: 0 },
                paper_bgcolor: "transparent",
                plot_bgcolor: "transparent",
              } as any}
              style={{ width: "100%", height: "100%" }}
              config={{ responsive: true, displayModeBar: true }}
            />
          );
        } catch (error) {
          console.error("3D chart rendering error:", error);
          return <div className="flex items-center justify-center h-full text-slate-500">3D chart rendering failed</div>;
        }

      case "sankey":
      case "treemap":
      case "sunburst":
      case "gantt":
      case "heatmap":
      case "candlestick":
        // Advanced charts - render as placeholder for now
        // These will be implemented with D3.js or custom components
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <div className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Advanced visualization coming soon
              </div>
            </div>
          </div>
        );

      default:
        return (
          <Bar
            ref={chartRef as never}
            data={data as ChartData<"bar">}
            options={baseOptions as ChartOptions<"bar">}
          />
        );
    }
  };

  return (
    <div
      className="relative"
      style={{
        height,
        background: theme === "dark"
          ? "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)"
          : "linear-gradient(135deg, #FAFAFE 0%, #F5F3FF 100%)",
        borderRadius: 16,
        padding: 24,
      }}
    >
      {/* Hover Info Overlay */}
      {hoveredIndex !== null && showPercentChange && percentChanges[hoveredIndex] !== null && (
        <div className="absolute top-4 right-4 z-10">
          <div
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              percentChanges[hoveredIndex]! >= 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {percentChanges[hoveredIndex]! >= 0 ? "↑" : "↓"}{" "}
            {Math.abs(percentChanges[hoveredIndex]!).toFixed(1)}%
          </div>
        </div>
      )}

      {renderChart()}
    </div>
  );
});

