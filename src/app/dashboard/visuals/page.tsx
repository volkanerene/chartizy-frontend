"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { aiApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { cn } from "@/lib/utils";

interface KPICard {
  id: string;
  label: string;
  value: string;
  change: number;
  changeLabel?: string;
  color: string;
}

export default function VisualsPage() {
  const router = useRouter();
  const { user, token } = useStore();
  const [inputData, setInputData] = useState("");
  const [kpiCards, setKpiCards] = useState<KPICard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colorOptions = [
    { name: "Blue", value: "from-blue-500 to-blue-600" },
    { name: "Indigo", value: "from-indigo-500 to-indigo-600" },
    { name: "Purple", value: "from-purple-500 to-purple-600" },
    { name: "Green", value: "from-green-500 to-green-600" },
    { name: "Orange", value: "from-orange-500 to-orange-600" },
    { name: "Red", value: "from-red-500 to-red-600" },
  ];

  const generateVisuals = async () => {
    if (!inputData.trim() || !user || !token) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Use AI to analyze the data and extract KPIs
      const prompt = `From this data, extract key metrics and create KPI cards. Return JSON array with format: [{"label": "Metric Name", "value": "formatted value", "change": percentage_change, "changeLabel": "vs previous period"}]. Data: ${inputData}`;
      
      const aiResult = await aiApi.analyzePrompt(prompt, token);
      
      if (aiResult.success && aiResult.labels.length > 0) {
        const cards: KPICard[] = aiResult.labels.map((label, index) => ({
          id: `kpi-${index}`,
          label,
          value: typeof aiResult.values[index] === 'number' 
            ? aiResult.values[index].toLocaleString() 
            : String(aiResult.values[index]),
          change: index > 0 ? ((aiResult.values[index] - aiResult.values[index - 1]) / aiResult.values[index - 1]) * 100 : 0,
          changeLabel: "vs previous",
          color: colorOptions[index % colorOptions.length].value,
        }));

        setKpiCards(cards);
      } else {
        setError("Could not extract metrics from the data. Please provide clearer data.");
      }
    } catch (error) {
      console.error("Error generating visuals:", error);
      setError(error instanceof Error ? error.message : "Failed to generate visuals");
    } finally {
      setIsGenerating(false);
    }
  };

  const exampleData = `Total Revenue: $43,200
Active Users: 2,510
Engagement: 82.4%
Growth Rate: 23.7%`;

  return (
    <motion.div
      className="min-h-screen px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] bg-clip-text text-transparent">
            KPI Visuals
          </h1>
          <p className="text-gray-500 text-xl">
            Create beautiful metric cards instantly
          </p>
        </motion.div>

        {/* Input Area */}
        <motion.div
          className="mb-12 bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-bold mb-4">Enter Metrics</label>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder={exampleData}
            className="w-full h-32 px-6 py-4 bg-white/70 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#165DFC] resize-none"
          />
          <div className="flex gap-4 mt-6">
            <motion.button
              onClick={() => setInputData(exampleData)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              Use Example
            </motion.button>
            <motion.button
              onClick={generateVisuals}
              disabled={!inputData.trim() || isGenerating}
              className={`flex-1 px-8 py-4 rounded-full font-bold text-white ${
                inputData.trim() && !isGenerating
                  ? "bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] shadow-xl"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              whileHover={inputData.trim() && !isGenerating ? { scale: 1.05 } : {}}
              whileTap={inputData.trim() && !isGenerating ? { scale: 0.95 } : {}}
            >
              {isGenerating ? "Generating..." : "Generate KPI Cards"}
            </motion.button>
          </div>
        </motion.div>

        {/* Preview Cards */}
        {isGenerating && (
          <div className="flex items-center justify-center py-12">
            <LoadingAnimation text="Analyzing data and generating visuals..." />
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-red-50 border-2 border-red-200 text-red-700"
          >
            {error}
          </motion.div>
        )}

        {kpiCards.length > 0 && !isGenerating && (
          <div className="grid grid-cols-2 gap-6">
            {kpiCards.map((metric, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${metric.color} rounded-3xl blur-xl opacity-50`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
                <div className={`relative bg-gradient-to-br ${metric.color} rounded-3xl p-8 shadow-2xl`}>
                  <div className="text-white/80 text-sm font-medium mb-2">
                    {metric.label}
                  </div>
                  <div className="text-white text-4xl font-black mb-2">
                    {metric.value}
                  </div>
                  <div className="text-white/90 text-sm font-bold">
                    {metric.change >= 0 ? "+" : ""}{metric.change.toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
