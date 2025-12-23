"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Copy,
  Check,
  Code2,
  FileJson,
  Image,
  FileCode,
  Share2,
  Sun,
  Moon,
  RefreshCw,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useStore } from "@/store/useStore";
import { chartsApi } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/CodeBlock";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { InteractiveChart, type InteractiveChartRef } from "@/components/InteractiveChart";
import { ChartTypeSelector } from "@/components/ChartTypeSelector";
import { ColorPicker } from "@/components/ColorPicker";
import { DataEditor } from "@/components/DataEditor";
import { CaptionEditor } from "@/components/CaptionEditor";
import { HeadlineEditor } from "@/components/HeadlineEditor";
import { FontSelector } from "@/components/FontSelector";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const chartRef = useRef<InteractiveChartRef>(null);
  const { token, chartResult, setChartResult } = useStore();

  const [isLoading, setIsLoading] = useState(!chartResult);
  const [copied, setCopied] = useState<string | null>(null);
  const [chartConfig, setChartConfig] = useState<Record<string, unknown> | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showStats, setShowStats] = useState(true);
  const [showGraphSelector, setShowGraphSelector] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showDataEditor, setShowDataEditor] = useState(false);
  const [showCaptionEditor, setShowCaptionEditor] = useState(false);
  const [showHeadlineEditor, setShowHeadlineEditor] = useState(false);
  const [showFontSelector, setShowFontSelector] = useState(false);
  const [headline, setHeadline] = useState<string>("");
  const [headlineNumber, setHeadlineNumber] = useState<string>("");
  const [isModified, setIsModified] = useState(false);
  const [originalConfig, setOriginalConfig] = useState<Record<string, unknown> | null>(null);
  const [chartType, setChartType] = useState<string>("bar");
  const [title, setTitle] = useState<string>("");
  const [fetchError, setFetchError] = useState<string | null>(null);

  const chartId = params.id as string;

  // Get available chart types based on current chart config
  const getAvailableChartTypes = (): string[] => {
    if (!chartConfig) return ["bar", "line", "area"];
    
    const currentType = (chartConfig.type as string) || "bar";
    const data = chartConfig.data as { labels?: string[]; datasets?: Array<{ data?: number[] }> } | undefined;
    const labels = data?.labels || [];
    const datasets = data?.datasets || [];
    const firstDataset = datasets[0];
    const dataPoints = firstDataset?.data?.length || labels.length;
    
    // Determine available types based on data structure
    const availableTypes: string[] = [];
    
    // Bar and Line work with most data
    if (dataPoints >= 2) {
      availableTypes.push("bar", "line");
    }
    
    // Area works with time series or sequential data
    if (dataPoints >= 2) {
      availableTypes.push("area");
    }
    
    // Pie/Doughnut work best with smaller datasets (2-8 items)
    if (dataPoints >= 2 && dataPoints <= 8) {
      availableTypes.push("pie", "doughnut");
    }
    
    // Scatter works with paired data
    if (dataPoints >= 2) {
      availableTypes.push("scatter");
    }
    
    // Radar works with multiple categories
    if (dataPoints >= 3 && dataPoints <= 10) {
      availableTypes.push("radar");
    }
    
    // Always include the current type
    if (!availableTypes.includes(currentType)) {
      availableTypes.unshift(currentType);
    }
    
    // Remove duplicates and return
    return Array.from(new Set(availableTypes));
  };

  useEffect(() => {
    const fetchChart = async () => {
      // First check if we have the chart in store
      if (chartResult && chartResult.id === chartId) {
        try {
          const config = chartResult.chart_config;
          setChartConfig(config);
          // Set initial chart type from config
          if (config?.type) {
            setChartType(config.type as string);
          }
        } catch {
          console.error("Failed to parse chart config from store");
        }
        setIsLoading(false);
        return;
      }

      // If no token, wait a bit for auth to initialize
      if (!token) {
        // Give auth time to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Try to fetch from API
      try {
        const currentToken = token || localStorage.getItem('supabase.auth.token');
        if (!currentToken) {
          setFetchError("Please log in to view this chart");
          setIsLoading(false);
          return;
        }

        const chart = await chartsApi.getById(chartId, currentToken);
        if (chart.result_visual) {
          const config = JSON.parse(chart.result_visual);
          setChartConfig(config);
          setOriginalConfig(JSON.parse(JSON.stringify(config))); // Deep copy
          // Set initial chart type from config
          if (config?.type) {
            setChartType(config.type as string);
          }
          setChartResult({
            id: chart.id,
            chart_config: config,
            jsx: chart.result_code || "",
            svg: null,
            description: "",
            created_at: chart.created_at,
          });
        } else {
          setFetchError("Chart data is empty");
        }
      } catch (error) {
        console.error("Failed to fetch chart:", error);
        setFetchError(error instanceof Error ? error.message : "Failed to load chart");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChart();
  }, [chartId, token, chartResult, setChartResult]);

  // Calculate statistics
  const getStats = () => {
    if (!chartConfig?.data) return null;
    const data = chartConfig.data as { datasets?: Array<{ data?: number[] }> };
    const values = data.datasets?.[0]?.data || [];
    if (values.length === 0) return null;

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const firstVal = values[0];
    const lastVal = values[values.length - 1];
    const totalChange = firstVal !== 0 ? ((lastVal - firstVal) / firstVal) * 100 : 0;

    return { sum, avg, max, min, totalChange, count: values.length };
  };

  const stats = getStats();

  // Initialize headline from stats and update when data changes
  useEffect(() => {
    if (stats) {
      setHeadlineNumber(stats.sum.toLocaleString());
      if (!headline) {
        setHeadline("Total");
      }
    }
  }, [stats, headline]);

  // Initialize title from chart config
  useEffect(() => {
    if (chartConfig && !title) {
      const chartTitle = (chartConfig?.data as { title?: string })?.title ||
        (chartConfig?.options as { title?: { display?: boolean; text?: string } })?.title?.text ||
        "Revenue Analytics";
      setTitle(chartTitle);
    }
  }, [chartConfig, title]);

  // Track modifications
  useEffect(() => {
    if (chartConfig && originalConfig) {
      const isChanged = JSON.stringify(chartConfig) !== JSON.stringify(originalConfig);
      setIsModified(isChanged);
    }
  }, [chartConfig, originalConfig]);

  // Handle chart type change
  const handleChartTypeChange = (newType: string) => {
    if (!chartConfig) return;
    
    const data = chartConfig.data as { labels?: string[]; datasets?: Array<{ data?: number[]; backgroundColor?: string | string[]; borderColor?: string }> } | undefined;
    const datasets = data?.datasets || [];
    const firstDataset = datasets[0];
    
    // For pie/doughnut, ensure data structure is correct
    if ((newType === "pie" || newType === "doughnut") && firstDataset) {
      // Ensure pie charts have array of colors
      if (!Array.isArray(firstDataset.backgroundColor)) {
        const colors = [
          "rgba(22, 93, 252, 0.8)",
          "rgba(74, 125, 253, 0.8)",
          "rgba(107, 157, 254, 0.8)",
          "rgba(142, 198, 255, 0.8)",
          "rgba(175, 220, 255, 0.8)",
        ];
        firstDataset.backgroundColor = colors.slice(0, firstDataset.data?.length || 5);
      }
    }
    
    // If switching to combo, create two datasets
    if (newType === "combo" && data) {
      const labels = data.labels || [];
      if (firstDataset) {
        const newData = {
          ...data,
          datasets: [
            { ...firstDataset, type: "bar", label: "Bar Data" },
            { ...firstDataset, type: "line", label: "Line Data", borderColor: "#60a5fa", backgroundColor: "transparent" },
          ],
        };
        setChartConfig({
          ...chartConfig,
          type: newType,
          data: newData,
        });
        setIsModified(true);
        return;
      }
    }
    
    setChartConfig({
      ...chartConfig,
      type: newType,
      data: data,
    });
    setIsModified(true);
  };

  // Handle color change
  const handleColorChange = (colors: string[]) => {
    if (!chartConfig?.data) return;
    const data = chartConfig.data as { datasets?: Array<{ backgroundColor?: string | string[] }> };
    const newConfig = {
      ...chartConfig,
      data: {
        ...data,
        datasets: data.datasets?.map((ds, i) => ({
          ...ds,
          backgroundColor: colors[i] || colors[0],
          borderColor: colors[i] || colors[0],
        })),
      },
    };
    setChartConfig(newConfig);
    setIsModified(true);
  };

  // Handle data change
  const handleDataChange = (newData: { labels: string[]; datasets: Array<{ data: number[] }> }) => {
    if (!chartConfig) return;
    setChartConfig({
      ...chartConfig,
      data: {
        ...chartConfig.data,
        labels: newData.labels,
        datasets: newData.datasets,
      },
    });
    setIsModified(true);
  };

  // Handle caption change
  const handleCaptionChange = (captions: any) => {
    if (!chartConfig) return;
    setChartConfig({
      ...chartConfig,
      data: {
        ...(chartConfig.data as object),
        title: captions.title,
        subtitle: captions.subtitle,
        footer: captions.footer,
      },
      options: {
        ...(chartConfig.options as object),
        scales: {
          ...((chartConfig.options as any)?.scales || {}),
          x: {
            ...((chartConfig.options as any)?.scales?.x || {}),
            title: { display: !!captions.xAxisLabel, text: captions.xAxisLabel },
          },
          y: {
            ...((chartConfig.options as any)?.scales?.y || {}),
            title: { display: !!captions.yAxisLabel, text: captions.yAxisLabel },
          },
        },
      },
    });
    setIsModified(true);
  };

  // Handle font change
  const handleFontChange = (fontFamily: string) => {
    if (!chartConfig) return;
    setChartConfig({
      ...chartConfig,
      fontFamily,
    });
    setIsModified(true);
  };

  // Handle save
  const handleSave = async () => {
    if (!chartConfig || !token || !chartId) return;
    try {
      const chartTitle = title || 
        (chartConfig?.data as { title?: string })?.title ||
        (chartConfig?.options as { title?: { text?: string } })?.title?.text ||
        "";
      
      await chartsApi.update(
        chartId,
        {
          result_visual: JSON.stringify({
            ...chartConfig,
            data: {
              ...(chartConfig.data as object),
              title: chartTitle,
            },
          }),
        },
        token
      );
      
      setOriginalConfig(JSON.parse(JSON.stringify(chartConfig)));
      setIsModified(false);
      
      // Update chart result in store
      if (chartResult) {
        setChartResult({
          ...chartResult,
          chart_config: chartConfig,
        });
      }
    } catch (error) {
      console.error("Failed to save chart:", error);
      alert(error instanceof Error ? error.message : "Failed to save chart");
    }
  };

  // Get current colors from chart config
  const getCurrentColors = (): string[] => {
    if (!chartConfig?.data) return ["#3b82f6", "#60a5fa", "#93c5fd"];
    const data = chartConfig.data as { datasets?: Array<{ backgroundColor?: string | string[] }> };
    const colors = data.datasets?.[0]?.backgroundColor;
    if (Array.isArray(colors)) return colors;
    if (typeof colors === "string") return [colors];
    return ["#3b82f6", "#60a5fa", "#93c5fd"];
  };

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadPNG = () => {
    if (chartRef.current) {
      const base64 = chartRef.current.toBase64Image();
      if (base64) {
        const chartTitle = (chartConfig?.data as { title?: string })?.title ||
                          (chartConfig?.options as { title?: { display?: boolean; text?: string } })?.title?.text || 
                          "chart";
        const filename = `${chartTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${chartId.slice(0, 8)}.png`;
        const link = document.createElement("a");
        link.download = filename;
        link.href = base64;
        link.click();
      }
    }
  };

  const handleDownloadJSON = () => {
    if (chartConfig) {
      const blob = new Blob([JSON.stringify(chartConfig, null, 2)], {
        type: "application/json",
      });
      const link = document.createElement("a");
      link.download = `graphzy-chart-${chartId}.json`;
      link.href = URL.createObjectURL(blob);
      link.click();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingAnimation text="Loading chart..." />
      </div>
    );
  }

  if (!chartConfig) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-900">
          {fetchError ? "Could not load chart" : "Chart not found"}
        </h2>
        <p className="text-gray-500 mt-2">
          {fetchError || "The chart you're looking for doesn't exist or has been deleted."}
        </p>
        <div className="flex gap-4 justify-center mt-4">
          <Link href="/dashboard">
            <motion.button
              className="px-6 py-3 bg-white/50 backdrop-blur-xl rounded-full font-semibold border border-white/20"
              whileHover={{ scale: 1.05 }}
            >
              Go to Dashboard
            </motion.button>
          </Link>
          <Link href="/dashboard/generate">
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] text-white rounded-full font-bold shadow-xl"
              whileHover={{ scale: 1.05 }}
            >
              Create New Chart
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        {stats && (
          <motion.div
            className="grid grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {[
              { label: "Total", value: stats.sum.toLocaleString() },
              { label: "Average", value: stats.avg.toFixed(1) },
              { label: "Highest", value: stats.max.toLocaleString() },
              { label: "Change", value: `${stats.totalChange >= 0 ? "+" : ""}${stats.totalChange.toFixed(1)}%` },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-sm text-gray-700 font-semibold mb-1">{stat.label}</div>
                <div className="text-3xl font-black bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] bg-clip-text text-transparent">
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Main Chart */}
        <motion.div
          className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-8">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-black bg-transparent border-none focus:outline-none text-gray-900"
            />
            <div className="flex gap-3 flex-wrap">
              {getAvailableChartTypes().map((type) => (
                <motion.button
                  key={type}
                  onClick={() => {
                    setChartType(type);
                    handleChartTypeChange(type);
                  }}
                  className={`px-6 py-2 rounded-full font-semibold capitalize ${
                    chartType === type
                      ? "bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="h-[400px]">
            <InteractiveChart
              ref={chartRef}
              chartConfig={{
                ...chartConfig,
                type: chartType,
              } as never}
              height={400}
              showPercentChange
              animated
              theme={theme}
            />
          </div>
        </motion.div>

        {/* Headline Display */}
        {(headline || headlineNumber) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 p-8 mb-8"
          >
            <div className="flex items-end justify-between">
              <div>
                <div className="text-sm font-medium text-blue-700 mb-2">{headline || "Key Metric"}</div>
                <div className="text-5xl font-bold text-blue-900">{headlineNumber || "0"}</div>
              </div>
              <motion.button
                onClick={() => setShowHeadlineEditor(true)}
                className="px-4 py-2 bg-white/70 rounded-full font-semibold text-sm"
                whileHover={{ scale: 1.05 }}
              >
                Edit
              </motion.button>
            </div>
          </motion.div>
        )}

      {/* Customization Modals */}
      <ChartTypeSelector
        currentType={(chartConfig?.type as string) || "bar"}
        onSelect={handleChartTypeChange}
        isOpen={showGraphSelector}
        onClose={() => setShowGraphSelector(false)}
      />
      <ColorPicker
        currentColors={getCurrentColors()}
        onColorChange={handleColorChange}
        isOpen={showColorPicker}
        onClose={() => setShowColorPicker(false)}
      />
      {chartConfig?.data && (
        <DataEditor
          data={chartConfig.data as { labels: string[]; datasets: Array<{ data: number[] }> }}
          onDataChange={handleDataChange}
          isOpen={showDataEditor}
          onClose={() => setShowDataEditor(false)}
        />
      )}
      <CaptionEditor
        captions={{
          title: (chartConfig?.data as { title?: string })?.title || 
                 (chartConfig?.options as { title?: { text?: string } })?.title?.text || "",
          xAxisLabel: (chartConfig?.options as any)?.scales?.x?.title?.text || "",
          yAxisLabel: (chartConfig?.options as any)?.scales?.y?.title?.text || "",
        }}
        onCaptionChange={handleCaptionChange}
        isOpen={showCaptionEditor}
        onClose={() => setShowCaptionEditor(false)}
      />
      <HeadlineEditor
        headline={headline}
        headlineNumber={headlineNumber}
        onSave={(h, n) => {
          setHeadline(h);
          setHeadlineNumber(n);
        }}
        isOpen={showHeadlineEditor}
        onClose={() => setShowHeadlineEditor(false)}
      />
      <FontSelector
        currentFont={(chartConfig?.fontFamily as string) || "'Geist', -apple-system, BlinkMacSystemFont, sans-serif"}
        onFontChange={handleFontChange}
        isOpen={showFontSelector}
        onClose={() => setShowFontSelector(false)}
      />

      {/* Insights */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 p-6"
        >
          <h3 className="font-bold text-gray-900 mb-3">
            AI Insights
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <p className="text-sm text-gray-700">
                Your data shows a{" "}
                <span className={stats.totalChange >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {Math.abs(stats.totalChange).toFixed(1)}% {stats.totalChange >= 0 ? "increase" : "decrease"}
                </span>{" "}
                from the first to the last data point.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <p className="text-sm text-gray-700">
                The highest value is{" "}
                <span className="text-blue-600 font-semibold">{((stats.max / stats.avg - 1) * 100).toFixed(0)}%</span>{" "}
                above average, while the lowest is{" "}
                <span className="text-blue-600 font-semibold">{((1 - stats.min / stats.avg) * 100).toFixed(0)}%</span>{" "}
                below.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Code Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/50 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl overflow-hidden"
      >
        <Tabs defaultValue="jsx" className="w-full">
          <div className="border-b border-blue-100 px-6 pt-4">
            <TabsList>
              <TabsTrigger value="jsx" className="flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                JSX
              </TabsTrigger>
              <TabsTrigger value="json" className="flex items-center gap-2">
                <FileJson className="w-4 h-4" />
                JSON
              </TabsTrigger>
              <TabsTrigger value="config" className="flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                Config
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="jsx" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                React component using react-chartjs-2
              </p>
              <motion.button
                className="px-4 py-2 bg-white/50 backdrop-blur-xl rounded-full font-semibold border border-white/20 text-sm flex items-center gap-2"
                onClick={() => handleCopy(chartResult?.jsx || "", "jsx")}
                whileHover={{ scale: 1.05 }}
              >
                {copied === "jsx" ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </motion.button>
            </div>
            <CodeBlock code={chartResult?.jsx || "// No JSX code available"} language="tsx" />
          </TabsContent>

          <TabsContent value="json" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">Chart.js configuration object</p>
              <motion.button
                className="px-4 py-2 bg-white/50 backdrop-blur-xl rounded-full font-semibold border border-white/20 text-sm flex items-center gap-2"
                onClick={() =>
                  handleCopy(JSON.stringify(chartConfig, null, 2), "json")
                }
                whileHover={{ scale: 1.05 }}
              >
                {copied === "json" ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </motion.button>
            </div>
            <CodeBlock
              code={JSON.stringify(chartConfig, null, 2)}
              language="json"
            />
          </TabsContent>

          <TabsContent value="config" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Full chart configuration with options
              </p>
              <motion.button
                className="px-4 py-2 bg-white/50 backdrop-blur-xl rounded-full font-semibold border border-white/20 text-sm flex items-center gap-2"
                onClick={() =>
                  handleCopy(
                    JSON.stringify(
                      { type: chartConfig.type, data: chartConfig.data, options: chartConfig.options },
                      null,
                      2
                    ),
                    "config"
                  )
                }
                whileHover={{ scale: 1.05 }}
              >
                {copied === "config" ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </motion.button>
            </div>
            <CodeBlock
              code={JSON.stringify(
                { type: chartConfig.type, data: chartConfig.data, options: chartConfig.options },
                null,
                2
              )}
              language="json"
            />
          </TabsContent>
        </Tabs>
      </motion.div>

        {/* Actions */}
        <div className="flex gap-4">
          {isModified && (
            <motion.button
              onClick={handleSave}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] text-white rounded-full font-bold shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save Changes
            </motion.button>
          )}
          <motion.button
            onClick={handleDownloadPNG}
            className="px-8 py-4 bg-white/50 backdrop-blur-xl rounded-full font-bold border border-white/20"
            whileHover={{ scale: 1.02 }}
          >
            Download PNG
          </motion.button>
          <motion.button
            onClick={handleDownloadJSON}
            className="px-8 py-4 bg-white/50 backdrop-blur-xl rounded-full font-bold border border-white/20"
            whileHover={{ scale: 1.02 }}
          >
            Export Data
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
