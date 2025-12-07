"use client";

import { useEffect, useRef, memo } from "react";
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
} from "chart.js";
import { Line, Bar, Pie, Doughnut, Radar, Scatter, Chart } from "react-chartjs-2";

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

interface ChartPreviewProps {
  chartType: string;
  exampleData?: Record<string, unknown> | null;
  height?: number;
  interactive?: boolean;
}

const defaultColors = [
  "rgba(139, 92, 246, 1)",
  "rgba(6, 182, 212, 1)",
  "rgba(16, 185, 129, 1)",
  "rgba(245, 158, 11, 1)",
  "rgba(239, 68, 68, 1)",
  "rgba(236, 72, 153, 1)",
];

const sampleLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const sampleValues = [12, 19, 8, 15, 22, 17];
const sampleValues2 = [8, 12, 15, 9, 18, 14];

function ChartPreviewComponent({
  chartType,
  exampleData,
  height = 100,
  interactive = false,
}: ChartPreviewProps) {
  // Parse example_data for colors and style
  const config = exampleData as Record<string, unknown> | null;
  const colors = (config?.colors as string[]) || defaultColors;
  const isDark = config?.theme === "dark";
  const hasGlow = config?.glow === true;
  const hasGradient = config?.gradient === true;

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: "easeOutQuart" as const },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: interactive },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  const wrapperStyle = {
    height,
    filter: hasGlow ? "drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))" : undefined,
    background: isDark ? "#1E293B" : undefined,
    borderRadius: isDark ? 8 : undefined,
    padding: isDark ? 8 : undefined,
  };

  const renderChart = () => {
    const primaryColor = colors[0] || defaultColors[0];
    const secondaryColor = colors[1] || defaultColors[1];

    switch (chartType) {
      case "line":
        return (
          <Line
            data={{
              labels: sampleLabels,
              datasets: [
                {
                  data: sampleValues,
                  borderColor: primaryColor,
                  backgroundColor: hasGradient
                    ? `${primaryColor.replace("1)", "0.3)")}`
                    : "transparent",
                  fill: hasGradient,
                  tension: 0.4,
                  pointRadius: interactive ? 4 : 0,
                  borderWidth: 2,
                },
              ],
            }}
            options={baseOptions as never}
          />
        );

      case "bar":
        return (
          <Bar
            data={{
              labels: sampleLabels,
              datasets: [
                {
                  data: sampleValues,
                  backgroundColor: colors.map((c, i) =>
                    hasGradient ? `${c.replace("1)", "0.8)")}` : c
                  ),
                  borderRadius: 6,
                  borderSkipped: false,
                },
              ],
            }}
            options={baseOptions as never}
          />
        );

      case "stacked-bar":
        return (
          <Bar
            data={{
              labels: sampleLabels,
              datasets: [
                {
                  data: sampleValues,
                  backgroundColor: primaryColor,
                  borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 6, bottomRight: 6 },
                },
                {
                  data: sampleValues2,
                  backgroundColor: secondaryColor,
                  borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
                },
              ],
            }}
            options={{
              ...baseOptions,
              scales: {
                x: { display: false, stacked: true },
                y: { display: false, stacked: true },
              },
            } as never}
          />
        );

      case "pie":
        return (
          <Pie
            data={{
              labels: sampleLabels.slice(0, 5),
              datasets: [
                {
                  data: sampleValues.slice(0, 5),
                  backgroundColor: colors.slice(0, 5),
                  borderWidth: 0,
                  hoverOffset: 8,
                },
              ],
            }}
            options={{
              ...baseOptions,
              scales: undefined,
            } as never}
          />
        );

      case "doughnut":
        return (
          <Doughnut
            data={{
              labels: sampleLabels.slice(0, 4),
              datasets: [
                {
                  data: sampleValues.slice(0, 4),
                  backgroundColor: colors.slice(0, 4),
                  borderWidth: 0,
                  hoverOffset: 6,
                },
              ],
            }}
            options={{
              ...baseOptions,
              scales: undefined,
              cutout: "65%",
            } as never}
          />
        );

      case "area":
        return (
          <Line
            data={{
              labels: sampleLabels,
              datasets: [
                {
                  data: sampleValues,
                  borderColor: primaryColor,
                  backgroundColor: `${primaryColor.replace("1)", "0.4)")}`,
                  fill: true,
                  tension: 0.4,
                  pointRadius: 0,
                  borderWidth: 2,
                },
                {
                  data: sampleValues2,
                  borderColor: secondaryColor,
                  backgroundColor: `${secondaryColor.replace("1)", "0.3)")}`,
                  fill: true,
                  tension: 0.4,
                  pointRadius: 0,
                  borderWidth: 2,
                },
              ],
            }}
            options={baseOptions as never}
          />
        );

      case "scatter":
      case "bubble":
        return (
          <Scatter
            data={{
              datasets: [
                {
                  data: sampleValues.map((v, i) => ({
                    x: i * 4 + Math.random() * 2,
                    y: v + Math.random() * 3,
                  })),
                  backgroundColor: `${primaryColor.replace("1)", "0.6)")}`,
                  borderColor: primaryColor,
                  borderWidth: 1,
                  pointRadius: chartType === "bubble" ? sampleValues.map((v) => v / 3) : 5,
                },
                {
                  data: sampleValues2.map((v, i) => ({
                    x: i * 4 + Math.random() * 2 + 1,
                    y: v + Math.random() * 3,
                  })),
                  backgroundColor: `${secondaryColor.replace("1)", "0.6)")}`,
                  borderColor: secondaryColor,
                  borderWidth: 1,
                  pointRadius: chartType === "bubble" ? sampleValues2.map((v) => v / 3) : 5,
                },
              ],
            }}
            options={{
              ...baseOptions,
              scales: {
                x: { display: false, type: "linear" },
                y: { display: false },
              },
            } as never}
          />
        );

      case "radar":
        return (
          <Radar
            data={{
              labels: ["Speed", "Power", "Skill", "Defense", "Magic"],
              datasets: [
                {
                  data: [15, 20, 12, 18, 14],
                  backgroundColor: `${primaryColor.replace("1)", "0.3)")}`,
                  borderColor: primaryColor,
                  borderWidth: 2,
                  pointRadius: 3,
                  pointBackgroundColor: primaryColor,
                },
              ],
            }}
            options={{
              ...baseOptions,
              scales: {
                r: {
                  display: false,
                  beginAtZero: true,
                },
              },
            } as never}
          />
        );

      case "combo":
        return (
          <Chart
            type="bar"
            data={{
              labels: sampleLabels,
              datasets: [
                {
                  type: "bar" as const,
                  data: sampleValues,
                  backgroundColor: `${primaryColor.replace("1)", "0.7)")}`,
                  borderRadius: 4,
                  order: 2,
                },
                {
                  type: "line" as const,
                  data: sampleValues2.map((v) => v + 5),
                  borderColor: colors[4] || defaultColors[4],
                  borderWidth: 2,
                  tension: 0.4,
                  pointRadius: 3,
                  pointBackgroundColor: colors[4] || defaultColors[4],
                  order: 1,
                },
              ],
            }}
            options={baseOptions as never}
          />
        );

      // Complex chart placeholders with visual representations
      case "heatmap":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <div className="grid grid-cols-6 gap-0.5 w-full h-full">
              {Array(30)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="rounded-sm transition-all hover:scale-110"
                    style={{
                      backgroundColor: primaryColor.replace("1)", `${0.2 + Math.random() * 0.8})`),
                    }}
                  />
                ))}
            </div>
          </div>
        );

      case "treemap":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full">
              <div className="col-span-2 row-span-2 rounded-lg" style={{ backgroundColor: primaryColor }} />
              <div className="rounded-lg" style={{ backgroundColor: secondaryColor }} />
              <div className="rounded-lg" style={{ backgroundColor: colors[2] || defaultColors[2] }} />
              <div className="col-span-2 rounded-lg" style={{ backgroundColor: colors[3] || defaultColors[3] }} />
            </div>
          </div>
        );

      case "sunburst":
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative" style={{ width: height * 0.8, height: height * 0.8 }}>
              <div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: `${primaryColor.replace("1)", "0.3)")}` }}
              />
              <div
                className="absolute inset-[15%] rounded-full"
                style={{ backgroundColor: `${secondaryColor.replace("1)", "0.5)")}` }}
              />
              <div
                className="absolute inset-[35%] rounded-full"
                style={{ backgroundColor: colors[2] || defaultColors[2] }}
              />
            </div>
          </div>
        );

      case "candlestick":
        return (
          <div className="w-full h-full flex items-end justify-around p-2 gap-1">
            {[1, 0, 1, 1, 0, 1].map((isUp, i) => (
              <div key={i} className="flex flex-col items-center" style={{ height: "100%" }}>
                <div
                  className="w-0.5"
                  style={{
                    height: `${20 + Math.random() * 20}%`,
                    backgroundColor: isUp ? "#10B981" : "#EF4444",
                  }}
                />
                <div
                  className="w-3 rounded-sm"
                  style={{
                    height: `${30 + Math.random() * 30}%`,
                    backgroundColor: isUp ? "#10B981" : "#EF4444",
                  }}
                />
                <div
                  className="w-0.5"
                  style={{
                    height: `${15 + Math.random() * 15}%`,
                    backgroundColor: isUp ? "#10B981" : "#EF4444",
                  }}
                />
              </div>
            ))}
          </div>
        );

      case "funnel":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
            {[100, 75, 50, 30].map((width, i) => (
              <div
                key={i}
                className="rounded-sm transition-all"
                style={{
                  width: `${width}%`,
                  height: `${100 / 4 - 4}%`,
                  backgroundColor: colors[i] || defaultColors[i],
                }}
              />
            ))}
          </div>
        );

      case "gauge":
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="relative rounded-full"
              style={{
                width: height * 0.9,
                height: height * 0.45,
                background: `conic-gradient(from 180deg, ${colors[2] || "#10B981"} 0deg, ${colors[1] || "#F59E0B"} 90deg, ${colors[4] || "#EF4444"} 180deg, transparent 180deg)`,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                borderRadius: "100% 100% 0 0",
              }}
            >
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 rounded-full origin-bottom"
                style={{
                  height: "70%",
                  backgroundColor: "#1E293B",
                  transform: "translateX(-50%) rotate(-30deg)",
                }}
              />
            </div>
          </div>
        );

      case "waterfall":
        return (
          <div className="w-full h-full flex items-end justify-center gap-1 p-2">
            {[30, 50, 40, 60, 45, 70].map((height, i) => (
              <div
                key={i}
                className="rounded-t transition-all"
                style={{
                  width: `${100 / 6 - 2}%`,
                  height: `${height}%`,
                  backgroundColor: i % 2 === 0 ? primaryColor : secondaryColor,
                }}
              />
            ))}
          </div>
        );

      case "sankey":
      case "chord":
      case "network":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <svg width="100%" height="100%" viewBox="0 0 100 60">
              {/* Nodes */}
              <circle cx="15" cy="15" r="8" fill={primaryColor} />
              <circle cx="15" cy="45" r="8" fill={secondaryColor} />
              <circle cx="50" cy="30" r="10" fill={colors[2] || defaultColors[2]} />
              <circle cx="85" cy="20" r="7" fill={colors[3] || defaultColors[3]} />
              <circle cx="85" cy="45" r="7" fill={colors[4] || defaultColors[4]} />
              {/* Connections */}
              <path d="M23 15 Q35 15 40 30" stroke={primaryColor} strokeWidth="2" fill="none" opacity="0.5" />
              <path d="M23 45 Q35 45 40 30" stroke={secondaryColor} strokeWidth="2" fill="none" opacity="0.5" />
              <path d="M60 30 Q70 25 78 20" stroke={colors[2]} strokeWidth="2" fill="none" opacity="0.5" />
              <path d="M60 30 Q70 38 78 45" stroke={colors[2]} strokeWidth="2" fill="none" opacity="0.5" />
            </svg>
          </div>
        );

      case "gantt":
        return (
          <div className="w-full h-full flex flex-col justify-center gap-1 p-2">
            {["Task 1", "Task 2", "Task 3"].map((task, i) => (
              <div key={i} className="relative" style={{ height: "25%" }}>
                <div
                  className="rounded h-full"
                  style={{
                    width: `${40 + i * 20}%`,
                    marginLeft: `${i * 10}%`,
                    backgroundColor: colors[i] || defaultColors[i],
                  }}
                />
              </div>
            ))}
          </div>
        );

      case "3d":
      case "3d-surface":
      case "3d-bar":
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            <div className="relative" style={{ transform: "perspective(200px) rotateX(20deg) rotateY(-20deg)" }}>
              {[30, 50, 40, 60].map((h, i) => (
                <div
                  key={i}
                  className="absolute rounded-t"
                  style={{
                    width: "20px",
                    height: `${h}px`,
                    left: `${i * 25}px`,
                    bottom: 0,
                    backgroundColor: colors[i] || defaultColors[i],
                    transform: `translateZ(${i * 5}px)`,
                    boxShadow: `0 0 ${i * 2}px rgba(0,0,0,0.3)`,
                  }}
                />
              ))}
            </div>
          </div>
        );

      case "wordcloud":
        return (
          <div className="w-full h-full flex items-center justify-center flex-wrap gap-1 p-2 overflow-hidden">
            {["Data", "AI", "Chart", "Graph", "Analytics", "Viz", "Stats"].map((word, i) => (
              <span
                key={i}
                className="font-bold"
                style={{
                  fontSize: 8 + Math.random() * 12,
                  color: colors[i % colors.length],
                  transform: `rotate(${Math.random() > 0.7 ? 90 : 0}deg)`,
                }}
              >
                {word}
              </span>
            ))}
          </div>
        );

      default:
        return (
          <Bar
            data={{
              labels: sampleLabels,
              datasets: [
                {
                  data: sampleValues,
                  backgroundColor: colors,
                  borderRadius: 4,
                },
              ],
            }}
            options={baseOptions as never}
          />
        );
    }
  };

  return (
    <div style={wrapperStyle} className="w-full">
      {renderChart()}
    </div>
  );
}

export const ChartPreview = memo(ChartPreviewComponent);
