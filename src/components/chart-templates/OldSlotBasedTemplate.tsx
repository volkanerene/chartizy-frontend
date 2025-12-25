"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

type CalendarHeatPoint = { date: string; value: number }; // YYYY-MM-DD
type WeeklyPoint = { week: string; value: number };       // e.g. "W1", "W2"
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
    | { type: "calendarHeatmap"; dataset: "calendar"; year: string } // "2025"
    | { type: "line"; dataset: "weekly"; smooth?: boolean; dashed?: boolean }
    | { type: "scatter"; dataset: "anomalies"; symbolSize?: number }
  >;
};

// --- Demo data generator (çok iyi “template preview” çıkarır)
function makeWeirdDemoSpec(): ChartizySpecV02 {
  const year = "2025";

  // Calendar data: 2025-01-01..2025-12-31
  const start = new Date(`${year}-01-01T00:00:00Z`);
  const end = new Date(`${year}-12-31T00:00:00Z`);

  const calendar: CalendarHeatPoint[] = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    const day = d.getUTCDate();
    const month = d.getUTCMonth() + 1;

    // “yaratıcı” dağılım: sezon + dalga + noise
    const seasonal = month <= 4 ? 10 : month <= 8 ? 30 : 18;
    const wave = Math.round(10 * Math.sin(day / 3));
    const noise = (day * month) % 9;
    const value = Math.max(0, seasonal + wave + noise);

    calendar.push({ date: iso, value });
  }

  // Weekly trend (W1..W52)
  const weekly: WeeklyPoint[] = Array.from({ length: 52 }, (_, i) => {
    const w = i + 1;
    const value = Math.round(40 + 12 * Math.sin(w / 4) + (w % 7));
    return { week: `W${w}`, value };
  });

  // Anomalies: 6 adet dikkat çekici gün
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