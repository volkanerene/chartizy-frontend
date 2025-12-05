"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Upload,
  FileSpreadsheet,
  Table2,
  ArrowRight,
  Wand2,
  ChevronLeft,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  Lightbulb,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { chartsApi, templatesApi, aiApi, type Template, type AIChartSuggestion } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChartPreview } from "@/components/ChartPreview";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { cn } from "@/lib/utils";

type InputMode = "ai" | "manual" | "file";

interface DataRow {
  id: string;
  label: string;
  value: string;
}

interface SuggestedChart {
  template: Template;
  confidence: number;
  reason: string;
}

export default function GeneratePage() {
  const router = useRouter();
  const { user, token, selectedTemplate, setSelectedTemplate, setChartResult, incrementChartCount, chartQuota } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [inputMode, setInputMode] = useState<InputMode>("ai");
  const [aiPrompt, setAiPrompt] = useState("");
  const [dataRows, setDataRows] = useState<DataRow[]>([
    { id: "1", label: "January", value: "100" },
    { id: "2", label: "February", value: "150" },
    { id: "3", label: "March", value: "200" },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedCharts, setSuggestedCharts] = useState<SuggestedChart[]>([]);
  const [parsedData, setParsedData] = useState<{ labels: string[]; values: number[] } | null>(null);
  const [step, setStep] = useState<"input" | "select" | "customize">("input");
  const [error, setError] = useState<string | null>(null);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
  const [chartTitle, setChartTitle] = useState<string | null>(null);

  const isPro = user?.subscription_tier === "pro";
  const canGenerate = isPro || chartQuota.used < chartQuota.limit;

  // AI prompt examples
  const promptExamples = [
    "Monthly sales: Jan 12K, Feb 15K, Mar 18K, Apr 14K, May 22K, Jun 25K",
    "Team performance scores: Alice 85, Bob 72, Charlie 91, Diana 78",
    "Website traffic by source: Organic 45%, Direct 25%, Social 20%, Referral 10%",
    "Quarterly revenue growth: Q1 +12%, Q2 +8%, Q3 +15%, Q4 +22%",
  ];

  // Parse AI prompt using OpenAI API
  const parseAIPrompt = useCallback(async (prompt: string) => {
    setIsAnalyzing(true);
    setError(null);
    setAiGenerated(false);
    setAiInterpretation(null);

    try {
      // 🤖 Use OpenAI API to analyze prompt and generate data
      const aiResult = await aiApi.analyzePrompt(prompt, token || undefined);
      
      if (!aiResult.success || aiResult.labels.length < 2) {
        throw new Error("Could not understand the prompt. Please try describing your data differently.");
      }

      const labels = aiResult.labels;
      const values = aiResult.values;

      setParsedData({ labels, values });
      setAiGenerated(true);
      setAiInterpretation(aiResult.data_interpretation);
      setChartTitle(aiResult.title);

      // Convert AI suggestions to our format
      const suggestions: SuggestedChart[] = [];
      
      // Get templates to match with AI suggestions
      let templates: Template[] = [];
      try {
        templates = await templatesApi.getAll(token || undefined);
      } catch {
        // Continue without templates
      }

      for (const aiSuggestion of aiResult.suggested_charts) {
        const matchingTemplate = templates.find(
          t => t.chart_type.toLowerCase() === aiSuggestion.chart_type.toLowerCase()
        );
        if (matchingTemplate) {
          suggestions.push({
            template: matchingTemplate,
            confidence: aiSuggestion.confidence,
            reason: aiSuggestion.reason,
          });
        }
      }

      // If we don't have enough suggestions, add defaults
      if (suggestions.length < 2) {
        const defaultTypes = ["bar", "line", "pie"];
        for (const type of defaultTypes) {
          if (!suggestions.find(s => s.template.chart_type === type)) {
            const template = templates.find(t => t.chart_type === type);
            if (template) {
              suggestions.push({
                template,
                confidence: 60,
                reason: "Common visualization choice",
              });
            }
          }
          if (suggestions.length >= 4) break;
        }
      }

      setSuggestedCharts(suggestions.slice(0, 4));
      setStep("select");
    } catch (err) {
      // Fallback to local parsing if API fails
      console.error("AI API failed, falling back to local parsing:", err);
      
      try {
        const fallbackResult = await parsePromptLocally(prompt);
        setParsedData(fallbackResult);
        setAiGenerated(true);
        
        const suggestions = await analyzeAndSuggestCharts(
          fallbackResult.labels,
          fallbackResult.values,
          prompt
        );
        setSuggestedCharts(suggestions);
        setStep("select");
      } catch (fallbackErr) {
        setError(err instanceof Error ? err.message : "Failed to analyze prompt");
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [token]);

  // Local fallback parsing function
  const parsePromptLocally = async (prompt: string): Promise<{ labels: string[]; values: number[] }> => {
    const lowerPrompt = prompt.toLowerCase();
    
    // Detect context
    const contexts = {
      months: { keywords: ["month", "jan", "feb", "monthly", "ay"], labels: ["Gün 1", "Gün 2", "Gün 3", "Gün 4", "Gün 5", "Gün 6", "Gün 7"] },
      week: { keywords: ["day", "week", "gün", "hafta", "günlük"], labels: ["Gün 1", "Gün 2", "Gün 3", "Gün 4", "Gün 5", "Gün 6", "Gün 7"] },
      quarters: { keywords: ["quarter", "q1", "q2", "çeyrek"], labels: ["Q1", "Q2", "Q3", "Q4"] },
      team: { keywords: ["team", "kişi", "person", "takım"], labels: ["Kişi A", "Kişi B", "Kişi C", "Kişi D", "Kişi E"] },
    };

    let labels = ["A", "B", "C", "D", "E", "F"];
    for (const [, ctx] of Object.entries(contexts)) {
      if (ctx.keywords.some(kw => lowerPrompt.includes(kw))) {
        labels = ctx.labels;
        break;
      }
    }

    // Extract numbers from prompt
    const numbers = prompt.match(/\d+(?:[.,]\d+)?/g);
    let targetValue = 100;
    let days = 6;
    
    if (numbers) {
      // Find the largest number (likely the target)
      const parsedNumbers = numbers.map(n => parseFloat(n.replace(",", ".")));
      targetValue = Math.max(...parsedNumbers);
      
      // Check for day/period count
      const dayMatch = prompt.match(/(\d+)\s*(gün|day|hafta|week)/i);
      if (dayMatch) {
        days = parseInt(dayMatch[1]);
        labels = Array.from({ length: days }, (_, i) => `Gün ${i + 1}`);
      }
    }

    // Generate increasing values if "artan" or "increasing" mentioned
    const isIncreasing = /art|increas|büyü|grow|yüksel/i.test(prompt);
    const isDecreasing = /azal|decreas|düş|fall/i.test(prompt);
    
    const values = labels.map((_, i) => {
      if (isIncreasing) {
        // Exponential growth to reach target
        const progress = (i + 1) / labels.length;
        return Math.round(targetValue * Math.pow(progress, 1.5));
      } else if (isDecreasing) {
        const progress = 1 - (i / labels.length);
        return Math.round(targetValue * progress);
      }
      // Random variation
      return Math.round(targetValue * (0.5 + Math.random() * 0.5));
    });

    return { labels, values };
  };

  // Analyze data and suggest best charts
  const analyzeAndSuggestCharts = async (
    labels: string[],
    values: number[],
    prompt: string
  ): Promise<SuggestedChart[]> => {
    // Get available templates
    let templates: Template[] = [];
    try {
      templates = await templatesApi.getAll(token || undefined);
    } catch {
      // Use default suggestions if API fails
    }

    const suggestions: SuggestedChart[] = [];
    const lowerPrompt = prompt.toLowerCase();
    const isTimeSeries = /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|q1|q2|q3|q4|month|year|week|day/i.test(prompt);
    const isPercentage = values.some(v => v <= 100) && (lowerPrompt.includes("%") || values.reduce((a, b) => a + b, 0) <= 100);
    const hasNegatives = values.some(v => v < 0);
    const hasGrowth = /growth|increase|decrease|change|trend/i.test(prompt);
    const isComparison = /vs|versus|compare|team|score|rank/i.test(prompt);

    // Score each chart type
    const chartScores: { type: string; score: number; reason: string }[] = [
      {
        type: "line",
        score: isTimeSeries ? 95 : hasGrowth ? 85 : 60,
        reason: isTimeSeries ? "Perfect for showing trends over time" : "Great for showing continuous data",
      },
      {
        type: "bar",
        score: isComparison ? 95 : !isTimeSeries ? 85 : 70,
        reason: isComparison ? "Ideal for comparing categories" : "Clear visual comparison of values",
      },
      {
        type: "pie",
        score: isPercentage ? 90 : values.length <= 6 ? 75 : 50,
        reason: isPercentage ? "Perfect for showing proportions" : "Good for part-to-whole relationships",
      },
      {
        type: "area",
        score: isTimeSeries ? 88 : hasGrowth ? 80 : 55,
        reason: "Emphasizes volume and cumulative values over time",
      },
      {
        type: "doughnut",
        score: isPercentage ? 85 : values.length <= 5 ? 70 : 45,
        reason: "Modern alternative to pie charts",
      },
    ];

    // Add to suggestions
    chartScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .forEach(({ type, score, reason }) => {
        const template = templates.find(t => t.chart_type === type && !t.is_premium);
        if (template) {
          suggestions.push({ template, confidence: score, reason });
        }
      });

    // If we don't have enough, add defaults
    if (suggestions.length < 3) {
      const defaultTypes = ["bar", "line", "pie"];
      for (const type of defaultTypes) {
        if (!suggestions.find(s => s.template.chart_type === type)) {
          const template = templates.find(t => t.chart_type === type);
          if (template) {
            suggestions.push({
              template,
              confidence: 60,
              reason: "Common visualization choice",
            });
          }
        }
      }
    }

    return suggestions.slice(0, 4);
  };

  // File upload handler
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const text = await file.text();
      const lines = text.split("\n").filter(Boolean);
      
      if (lines.length < 2) {
        throw new Error("File must contain at least 2 rows of data");
      }

      const extractedData: { label: string; value: number }[] = [];
      
      for (const line of lines) {
        const parts = line.split(/[,\t;]+/).map(s => s.trim());
        if (parts.length >= 2) {
          const label = parts[0];
          const value = parseFloat(parts[1]);
          if (!isNaN(value)) {
            extractedData.push({ label, value });
          }
        }
      }

      if (extractedData.length < 2) {
        throw new Error("Could not parse data from file");
      }

      const labels = extractedData.map(d => d.label);
      const values = extractedData.map(d => d.value);

      setParsedData({ labels, values });
      const suggestions = await analyzeAndSuggestCharts(labels, values, labels.join(" "));
      setSuggestedCharts(suggestions);
      setStep("select");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Manual data handlers
  const addRow = () => {
    setDataRows([...dataRows, { id: Date.now().toString(), label: "", value: "" }]);
  };

  const removeRow = (id: string) => {
    if (dataRows.length > 2) {
      setDataRows(dataRows.filter(row => row.id !== id));
    }
  };

  const updateRow = (id: string, field: "label" | "value", value: string) => {
    setDataRows(dataRows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleManualSubmit = async () => {
    const validRows = dataRows.filter(row => row.label && row.value);
    if (validRows.length < 2) {
      setError("Please enter at least 2 data points");
      return;
    }

    setIsAnalyzing(true);
    const labels = validRows.map(r => r.label);
    const values = validRows.map(r => parseFloat(r.value));
    setParsedData({ labels, values });
    const suggestions = await analyzeAndSuggestCharts(labels, values, labels.join(" "));
    setSuggestedCharts(suggestions);
    setStep("select");
    setIsAnalyzing(false);
  };

  // Select chart and generate
  const handleSelectChart = async (suggestion: SuggestedChart) => {
    setSelectedTemplate(suggestion.template);
    setStep("customize");
  };

  // Generate chart
  const handleGenerate = async () => {
    if (!user?.id || !token || !selectedTemplate || !parsedData) return;

    setIsGenerating(true);
    setError(null);

    try {
      const chartData = {
        labels: parsedData.labels,
        datasets: [
          {
            label: "Data",
            data: parsedData.values,
          },
        ],
      };

      const result = await chartsApi.generate(
        {
          user_id: user.id,
          template_id: selectedTemplate.id,
          data: chartData,
          chart_type: selectedTemplate.chart_type,
        },
        token
      );

      setChartResult(result);
      incrementChartCount();
      router.push(`/dashboard/results/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate chart");
      setIsGenerating(false);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (step) {
      case "input":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Mode Selector */}
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { mode: "ai" as InputMode, icon: Sparkles, label: "AI Text Input", desc: "Describe your data" },
                { mode: "manual" as InputMode, icon: Table2, label: "Manual Entry", desc: "Enter data directly" },
                { mode: "file" as InputMode, icon: FileSpreadsheet, label: "Upload File", desc: "CSV or Excel" },
              ].map(({ mode, icon: Icon, label, desc }) => (
                <motion.button
                  key={mode}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInputMode(mode)}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all min-w-[200px]",
                    inputMode === mode
                      ? "border-violet-500 bg-violet-50 shadow-lg shadow-violet-500/20"
                      : "border-violet-100 bg-white/70 hover:border-violet-200"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-xl",
                    inputMode === mode ? "bg-violet-500 text-white" : "bg-violet-100 text-violet-600"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900">{label}</div>
                    <div className="text-sm text-slate-500">{desc}</div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Input Area */}
            <AnimatePresence mode="wait">
              {inputMode === "ai" && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <Card className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-violet-500 text-white">
                        <Wand2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">AI-Powered Data Input</h3>
                        <p className="text-sm text-slate-500">Describe your data naturally, we&apos;ll do the rest</p>
                      </div>
                    </div>

                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g., Monthly sales: January 12,000, February 15,000, March 18,000..."
                      className="w-full h-32 p-4 rounded-xl border-2 border-violet-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 bg-white/80 text-slate-900 placeholder:text-slate-400 resize-none transition-all"
                    />

                    <div className="mt-4">
                      <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" /> Try these examples:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {promptExamples.map((example, i) => (
                          <button
                            key={i}
                            onClick={() => setAiPrompt(example)}
                            className="px-3 py-1.5 text-xs bg-white/80 border border-violet-200 rounded-lg hover:bg-violet-50 text-slate-600 transition-colors"
                          >
                            {example.slice(0, 40)}...
                          </button>
                        ))}
                      </div>
                    </div>
                  </Card>

                  <Button
                    onClick={() => parseAIPrompt(aiPrompt)}
                    disabled={!aiPrompt.trim() || isAnalyzing}
                    className="w-full h-14 text-lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Analyze & Suggest Charts
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {inputMode === "manual" && (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900">Enter Your Data</h3>
                      <Button variant="outline" size="sm" onClick={addRow}>
                        <Plus className="w-4 h-4 mr-1" /> Add Row
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-[1fr,120px,40px] gap-3 text-sm font-medium text-slate-500">
                        <span>Label</span>
                        <span>Value</span>
                        <span></span>
                      </div>
                      {dataRows.map((row, i) => (
                        <motion.div
                          key={row.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="grid grid-cols-[1fr,120px,40px] gap-3"
                        >
                          <Input
                            value={row.label}
                            onChange={(e) => updateRow(row.id, "label", e.target.value)}
                            placeholder="Label"
                          />
                          <Input
                            value={row.value}
                            onChange={(e) => updateRow(row.id, "value", e.target.value)}
                            placeholder="0"
                            type="number"
                          />
                          <button
                            onClick={() => removeRow(row.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </Card>

                  <Button onClick={handleManualSubmit} disabled={isAnalyzing} className="w-full h-14 text-lg">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-5 h-5 mr-2" />
                        Continue to Chart Selection
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {inputMode === "file" && (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <Card
                    className="p-8 border-2 border-dashed border-violet-200 hover:border-violet-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.txt,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-violet-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">
                        Drop your file here or click to browse
                      </h3>
                      <p className="text-sm text-slate-500">
                        Supports CSV, TXT, Excel files (2 columns: Label, Value)
                      </p>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        );

      case "select":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <button
              onClick={() => setStep("input")}
              className="flex items-center gap-2 text-slate-500 hover:text-violet-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to data input
            </button>

            {/* AI Interpretation */}
            {aiGenerated && aiInterpretation && (
              <Card className="p-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">🤖 AI Analysis</h4>
                    <p className="text-sm text-white/90">{aiInterpretation}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Data Preview */}
            <Card className="p-6 bg-gradient-to-br from-slate-50 to-violet-50/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900">
                  {chartTitle || "Your Data"}
                </h3>
                {aiGenerated && (
                  <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
                    ✨ AI Generated
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {parsedData?.labels.map((label, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-white rounded-lg border border-violet-200 text-sm"
                  >
                    <span className="font-medium text-slate-900">{label}:</span>{" "}
                    <span className="text-violet-600">{parsedData.values[i]?.toLocaleString()}</span>
                  </span>
                ))}
              </div>
            </Card>

            {/* Chart Suggestions */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                Recommended Charts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedCharts.map((suggestion, i) => (
                  <motion.div
                    key={suggestion.template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card
                      className={cn(
                        "p-4 cursor-pointer transition-all hover:shadow-lg hover:border-violet-300",
                        i === 0 && "ring-2 ring-violet-500 ring-offset-2"
                      )}
                      onClick={() => handleSelectChart(suggestion)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-24 h-20 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 overflow-hidden">
                          <ChartPreview
                            chartType={suggestion.template.chart_type}
                            exampleData={suggestion.template.example_data}
                            height={80}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-slate-900">
                              {suggestion.template.name}
                            </h4>
                            {i === 0 && (
                              <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
                                Best Match
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-1">{suggestion.reason}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                                style={{ width: `${suggestion.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-slate-500">
                              {suggestion.confidence}% match
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case "customize":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <button
              onClick={() => setStep("select")}
              className="flex items-center gap-2 text-slate-500 hover:text-violet-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to chart selection
            </button>

            {/* Preview */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Preview</h3>
              <div className="h-64 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 p-4">
                <ChartPreview
                  chartType={selectedTemplate?.chart_type || "bar"}
                  exampleData={selectedTemplate?.example_data}
                  height={240}
                  interactive
                />
              </div>
            </Card>

            {/* Selected Template Info */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <h4 className="font-semibold text-slate-900">{selectedTemplate?.name}</h4>
                  <p className="text-sm text-slate-500">{selectedTemplate?.description}</p>
                </div>
              </div>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !canGenerate}
              className="w-full h-14 text-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Chart
                </>
              )}
            </Button>

            {!canGenerate && (
              <p className="text-center text-sm text-amber-600">
                You&apos;ve reached your free chart limit. Upgrade to Pro for unlimited charts.
              </p>
            )}
          </motion.div>
        );
    }
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingAnimation text="Creating your chart with AI magic..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          AI-Powered Chart Generation
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Your Chart</h1>
        <p className="text-slate-500">
          Describe your data, upload a file, or enter values manually
        </p>
      </motion.div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {["Input Data", "Select Chart", "Generate"].map((label, i) => {
          const stepIndex = ["input", "select", "customize"].indexOf(step);
          const isActive = i === stepIndex;
          const isComplete = i < stepIndex;

          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  isComplete
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-violet-500 text-white"
                    : "bg-slate-200 text-slate-500"
                )}
              >
                {isComplete ? <CheckCircle className="w-5 h-5" /> : i + 1}
              </div>
              <span className={cn("text-sm hidden sm:block", isActive ? "text-slate-900 font-medium" : "text-slate-500")}>
                {label}
              </span>
              {i < 2 && <div className="w-8 h-0.5 bg-slate-200" />}
            </div>
          );
        })}
      </div>

      {/* Content */}
      {renderStep()}
    </div>
  );
}
