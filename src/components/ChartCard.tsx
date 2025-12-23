"use client";

import { motion } from "framer-motion";
import { cn, formatDate } from "@/lib/utils";
import type { Chart } from "@/lib/api";
import { InteractiveChart } from "@/components/InteractiveChart";

interface ChartCardProps {
  chart: Chart;
  onClick?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function ChartCard({
  chart,
  onClick,
  onDelete,
  className,
}: ChartCardProps) {
  // Try to parse the chart config to render a live preview
  let chartPreview = null;
  try {
    if (chart.result_visual) {
      const config = JSON.parse(chart.result_visual);
      chartPreview = (
        <div className="w-full h-full p-2">
          <InteractiveChart
            chartConfig={config}
            height={120}
            showPercentChange={false}
            animated={false}
            theme="light"
          />
        </div>
      );
    }
  } catch {
    chartPreview = null;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border-2 border-violet-100/50 bg-white/70 backdrop-blur-xl shadow-lg shadow-violet-500/5 transition-all duration-300",
        "hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/10",
        "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Preview area */}
      <div className="h-40 bg-white flex items-center justify-center relative overflow-hidden">
        {chartPreview || (
          <div className="text-slate-400 text-sm">No preview available</div>
        )}

        {/* Hover overlay with actions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors text-sm font-medium"
          >
            View
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors text-sm font-medium"
          >
            Delete
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-slate-900 truncate">
            Chart #{chart.id.slice(0, 8)}
          </h3>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          <span>{formatDate(chart.created_at)}</span>
        </div>
      </div>
    </motion.div>
  );
}

