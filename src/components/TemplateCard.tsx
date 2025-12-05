"use client";

import { motion } from "framer-motion";
import { Lock, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartPreview } from "./ChartPreview";
import type { Template } from "@/lib/api";

interface TemplateCardProps {
  template: Template;
  isLocked?: boolean;
  onClick?: () => void;
  className?: string;
}

const chartTypeGradients: Record<string, string> = {
  line: "from-blue-400/20 via-cyan-400/10 to-transparent",
  bar: "from-violet-400/20 via-purple-400/10 to-transparent",
  pie: "from-pink-400/20 via-rose-400/10 to-transparent",
  doughnut: "from-fuchsia-400/20 via-pink-400/10 to-transparent",
  area: "from-teal-400/20 via-emerald-400/10 to-transparent",
  scatter: "from-orange-400/20 via-amber-400/10 to-transparent",
  radar: "from-indigo-400/20 via-blue-400/10 to-transparent",
  "stacked-bar": "from-purple-400/20 via-indigo-400/10 to-transparent",
  bubble: "from-rose-400/20 via-red-400/10 to-transparent",
  candlestick: "from-green-400/20 via-emerald-400/10 to-transparent",
  heatmap: "from-red-400/20 via-orange-400/10 to-transparent",
  treemap: "from-cyan-400/20 via-teal-400/10 to-transparent",
  sunburst: "from-amber-400/20 via-yellow-400/10 to-transparent",
  combo: "from-violet-400/20 via-pink-400/10 to-transparent",
  funnel: "from-indigo-400/20 via-purple-400/10 to-transparent",
  gauge: "from-emerald-400/20 via-green-400/10 to-transparent",
  sankey: "from-blue-400/20 via-indigo-400/10 to-transparent",
  chord: "from-purple-400/20 via-violet-400/10 to-transparent",
  network: "from-cyan-400/20 via-blue-400/10 to-transparent",
  wordcloud: "from-pink-400/20 via-purple-400/10 to-transparent",
};

const chartTypeEmojis: Record<string, string> = {
  line: "📈",
  bar: "📊",
  pie: "🥧",
  doughnut: "🍩",
  area: "📉",
  scatter: "⚡",
  radar: "🎯",
  "stacked-bar": "📊",
  bubble: "🫧",
  candlestick: "📈",
  heatmap: "🔥",
  treemap: "🌳",
  sunburst: "☀️",
  combo: "🔀",
  funnel: "🔻",
  gauge: "⏱️",
  sankey: "🌊",
  chord: "🔗",
  network: "🕸️",
  wordcloud: "☁️",
};

export function TemplateCard({
  template,
  isLocked = false,
  onClick,
  className,
}: TemplateCardProps) {
  const gradientColor = chartTypeGradients[template.chart_type] || "from-gray-400/20 via-slate-400/10 to-transparent";
  const emoji = chartTypeEmojis[template.chart_type] || "📊";

  return (
    <motion.div
      whileHover={{ scale: isLocked ? 1 : 1.02, y: isLocked ? 0 : -4 }}
      whileTap={{ scale: isLocked ? 1 : 0.98 }}
      onClick={isLocked ? undefined : onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl border-2 border-violet-100/50 bg-white/70 backdrop-blur-xl shadow-lg shadow-violet-500/5 transition-all duration-300",
        "hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/10",
        isLocked ? "cursor-not-allowed opacity-75" : "cursor-pointer",
        className
      )}
    >
      {/* Premium Badge */}
      {template.is_premium && (
        <div className="absolute top-3 right-3 z-20">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            PRO
          </div>
        </div>
      )}

      {/* Chart Preview Area */}
      <div
        className={cn(
          "h-36 bg-gradient-to-br flex items-center justify-center relative overflow-hidden",
          gradientColor
        )}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)`
          }} />
        </div>

        {/* Actual Chart Preview */}
        <div className="relative w-full h-full p-3">
          <ChartPreview
            chartType={template.chart_type}
            exampleData={template.example_data}
            height={120}
          />
        </div>

        {/* Lock overlay */}
        {isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="bg-white/90 rounded-full p-3">
              <Lock className="w-6 h-6 text-slate-600" />
            </div>
          </motion.div>
        )}

        {/* Hover Overlay */}
        {!isLocked && (
          <div className="absolute inset-0 bg-gradient-to-t from-violet-600/80 via-violet-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
            <span className="text-white text-sm font-medium flex items-center gap-1">
              Use Template <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{emoji}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-sm truncate">
              {template.name}
            </h3>
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">
              {template.description}
            </p>
          </div>
        </div>

        {/* Chart Type Badge */}
        <div className="mt-3 flex items-center gap-2">
          <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-lg capitalize">
            {template.chart_type.replace("-", " ")}
          </span>
          {!isLocked && (
            <span className="text-xs text-slate-400 group-hover:text-violet-500 transition-colors">
              Click to use →
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
