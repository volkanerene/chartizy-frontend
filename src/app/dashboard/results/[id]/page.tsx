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
  Sparkles,
  TrendingUp,
  TrendingDown,
  Share2,
  Palette,
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/CodeBlock";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { InteractiveChart, type InteractiveChartRef } from "@/components/InteractiveChart";
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

  const chartId = params.id as string;

  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChart = async () => {
      // First check if we have the chart in store
      if (chartResult && chartResult.id === chartId) {
        try {
          setChartConfig(chartResult.chart_config);
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
        <h2 className="text-xl font-semibold text-slate-900">
          {fetchError ? "Could not load chart" : "Chart not found"}
        </h2>
        <p className="text-slate-500 mt-2">
          {fetchError || "The chart you're looking for doesn't exist or has been deleted."}
        </p>
        <div className="flex gap-4 justify-center mt-4">
          <Link href="/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
          <Link href="/dashboard/generate">
            <Button>Create New Chart</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                {(chartConfig?.data as { title?: string })?.title ||
                 (chartConfig?.options as { title?: { display?: boolean; text?: string } })?.title?.text || 
                 "Your Chart"}
              </h1>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            </div>
            {chartResult?.description && (
              <p className="text-slate-500 mt-1">{chartResult.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
          <Button variant="outline" onClick={handleDownloadPNG}>
            <Image className="w-4 h-4 mr-2" />
            PNG
          </Button>
          <Button variant="outline" onClick={handleDownloadJSON}>
            <FileJson className="w-4 h-4 mr-2" />
            JSON
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {stats && showStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {[
            { label: "Total", value: stats.sum.toLocaleString(), icon: "📊" },
            { label: "Average", value: stats.avg.toFixed(1), icon: "📈" },
            { label: "Highest", value: stats.max.toLocaleString(), icon: "🔝" },
            { label: "Lowest", value: stats.min.toLocaleString(), icon: "🔻" },
            {
              label: "Change",
              value: `${stats.totalChange >= 0 ? "+" : ""}${stats.totalChange.toFixed(1)}%`,
              icon: stats.totalChange >= 0 ? "📈" : "📉",
              highlight: true,
              positive: stats.totalChange >= 0,
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={cn(
                "p-4 rounded-2xl border-2 transition-all hover:shadow-md",
                stat.highlight
                  ? stat.positive
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800"
                    : "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800"
                  : "bg-white/70 dark:bg-slate-800/70 border-violet-100 dark:border-slate-700"
              )}
            >
              <div className="text-lg mb-1">{stat.icon}</div>
              <div
                className={cn(
                  "text-xl font-bold",
                  stat.highlight
                    ? stat.positive
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                    : "text-slate-900 dark:text-slate-100"
                )}
              >
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Interactive Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border-2 border-violet-100/50 dark:border-slate-700/50 shadow-xl shadow-violet-500/5 dark:shadow-slate-900/20 overflow-hidden"
      >
        <div className="p-2 border-b border-violet-100 flex items-center justify-between">
          <div className="flex items-center gap-2 px-4">
            <span className="text-sm font-semibold text-slate-900">
              {(chartConfig?.data as { title?: string })?.title ||
               (chartConfig?.options as { title?: { display?: boolean; text?: string } })?.title?.text || 
               "Interactive Chart"}
            </span>
            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
              Hover for details
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowStats(!showStats)}
              className={cn(
                "p-2 rounded-lg transition-colors text-sm",
                showStats ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              )}
            >
              Stats
            </button>
          </div>
        </div>
        <div className="p-4">
          <InteractiveChart
            ref={chartRef}
            chartConfig={chartConfig as never}
            height={450}
            showPercentChange
            animated
            theme={theme}
          />
        </div>
      </motion.div>

      {/* Insights */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border-2 border-violet-200 p-6"
        >
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            AI Insights
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              {stats.totalChange >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500 mt-0.5" />
              )}
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Your data shows a{" "}
                <span className={stats.totalChange >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {Math.abs(stats.totalChange).toFixed(1)}% {stats.totalChange >= 0 ? "increase" : "decrease"}
                </span>{" "}
                from the first to the last data point.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">📊</span>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                The highest value is{" "}
                <span className="text-violet-600 font-medium">{((stats.max / stats.avg - 1) * 100).toFixed(0)}%</span>{" "}
                above average, while the lowest is{" "}
                <span className="text-violet-600 font-medium">{((1 - stats.min / stats.avg) * 100).toFixed(0)}%</span>{" "}
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
        className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border-2 border-violet-100/50 dark:border-slate-700/50 shadow-xl shadow-violet-500/5 dark:shadow-slate-900/20 overflow-hidden"
      >
        <Tabs defaultValue="jsx" className="w-full">
          <div className="border-b border-violet-100 px-6 pt-4">
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
              <p className="text-sm text-slate-500 dark:text-slate-400">
                React component using react-chartjs-2
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(chartResult?.jsx || "", "jsx")}
              >
                {copied === "jsx" ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <CodeBlock code={chartResult?.jsx || "// No JSX code available"} language="tsx" />
          </TabsContent>

          <TabsContent value="json" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Chart.js configuration object</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleCopy(JSON.stringify(chartConfig, null, 2), "json")
                }
              >
                {copied === "json" ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <CodeBlock
              code={JSON.stringify(chartConfig, null, 2)}
              language="json"
            />
          </TabsContent>

          <TabsContent value="config" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Full chart configuration with options
              </p>
              <Button
                variant="outline"
                size="sm"
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
              >
                {copied === "config" ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link href="/dashboard/generate">
          <Button variant="outline" size="lg" className="min-w-[200px]">
            <RefreshCw className="w-4 h-4 mr-2" />
            Create Another Chart
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button size="lg" className="min-w-[200px]">
            Go to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
