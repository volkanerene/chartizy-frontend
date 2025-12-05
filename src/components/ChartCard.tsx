"use client";

import { motion } from "framer-motion";
import { Calendar, MoreVertical, Trash2, Eye, Download } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { Chart } from "@/lib/api";

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
  // Try to parse the chart config to render a mini preview
  let chartPreview = null;
  try {
    if (chart.result_visual) {
      const config = JSON.parse(chart.result_visual);
      const type = config.type || "bar";
      chartPreview = (
        <div className="text-4xl opacity-50">
          {type === "line" && "📈"}
          {type === "bar" && "📊"}
          {type === "pie" && "🥧"}
          {type === "doughnut" && "🍩"}
          {!["line", "bar", "pie", "doughnut"].includes(type) && "📊"}
        </div>
      );
    }
  } catch {
    chartPreview = <div className="text-4xl opacity-50">📊</div>;
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
      <div className="h-40 bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center relative">
        {chartPreview}

        {/* Hover overlay with actions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-violet-900/60 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <Eye className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              // Download logic
            }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <Download className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-slate-900 truncate">
            Chart #{chart.id.slice(0, 8)}
          </h3>
          <button
            className="p-1 rounded-lg hover:bg-violet-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Show menu
            }}
          >
            <MoreVertical className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(chart.created_at)}</span>
        </div>
      </div>
    </motion.div>
  );
}

