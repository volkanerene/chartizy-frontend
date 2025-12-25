"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useStore } from "@/store/useStore";
import { templatesApi } from "@/lib/api";
import { ChartizyCanvas } from "@/components/ChartizyCanvas";
import { normalize } from "@/lib/chartizy-dsl";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import type { Template } from "@/lib/api";

// Helper to generate DSL preview for templates
const generatePreviewDSL = (template: Template) => {
  // If template has preview_dsl, use it directly
  if (template?.preview_dsl) {
    try {
      const dsl = typeof template.preview_dsl === "string" 
        ? JSON.parse(template.preview_dsl) 
        : template.preview_dsl;
      return normalize(dsl);
    } catch (e) {
      console.warn("Failed to parse preview_dsl:", e);
    }
  }
  
  // Fallback: Generate DSL from template data
  const baseLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const baseValues = [12, 19, 15, 25, 22, 30];
  
  const chartTypeLower = template.chart_type.toLowerCase();
  
  // Parse example_data if it's a string (JSON)
  let exampleData: any = null;
  if (template.example_data) {
    if (typeof template.example_data === "string") {
      try {
        exampleData = JSON.parse(template.example_data);
      } catch (e) {
        exampleData = null;
      }
    } else {
      exampleData = template.example_data;
    }
  }
  
  // Use example_data if it has labels/datasets, otherwise use defaults
  let labels = baseLabels;
  let values = baseValues;
  
  if (exampleData) {
    // Check for labels array
    if (exampleData.labels && Array.isArray(exampleData.labels)) {
      labels = exampleData.labels.map(String);
    }
    // Check for values array
    if (exampleData.values && Array.isArray(exampleData.values)) {
      values = exampleData.values;
    }
    // Check for datasets array
    else if (exampleData.datasets && Array.isArray(exampleData.datasets) && exampleData.datasets.length > 0) {
      values = exampleData.datasets[0]?.data || baseValues;
    }
  }
  
  // Create appropriate layer based on chart type
  let mainLayer: any;
  switch (chartTypeLower) {
    case "bar":
      mainLayer = {
        type: "bars",
        dataField: "data",
        color: "#165DFC",
        width: 0.8,
        borderRadius: 4,
        stacked: false,
      };
      break;
    case "line":
      mainLayer = {
        type: "line",
        dataField: "data",
        color: "#165DFC",
        width: 2,
        style: "solid",
        smooth: false,
        showPoints: false,
      };
      break;
    case "area":
      mainLayer = {
        type: "area",
        dataField: "data",
        color: "#165DFC",
        opacity: 0.3,
      };
      break;
    case "pie":
    case "doughnut":
      mainLayer = {
        type: "bars",
        dataField: "data",
        color: ["#165DFC", "#4A7DFD", "#6B9DFE", "#8EC6FF", "#B3D9FF"],
        width: 0.8,
        borderRadius: 4,
      };
      labels = labels.slice(0, 5);
      values = values.slice(0, 5);
      break;
    case "scatter":
    case "points":
      mainLayer = {
        type: "points",
        dataField: "data",
        color: "#165DFC",
        size: 4,
        shape: "circle",
      };
      break;
    default:
      mainLayer = {
        type: "bars",
        dataField: "data",
        color: "#165DFC",
        width: 0.8,
        borderRadius: 4,
      };
  }
  
  // Create DSL structure
  const previewConfig = {
    type: chartTypeLower,
    data: {
      labels,
      datasets: [{
        label: "Data",
        data: values,
      }],
    },
  };
  
  // Import toDSL dynamically or use a simpler approach
  // For now, return a basic DSL structure
  return {
    version: "1.0",
    canvas: {
      width: 800,
      height: 600,
      padding: { top: 40, right: 40, bottom: 60, left: 60 },
      backgroundColor: "#ffffff",
    },
    data: {
      labels,
      datasets: [{ label: "Data", data: values }],
    },
    layers: [
      { type: "grid", show: true, color: "#e5e7eb" },
      { type: "axis-x", position: "bottom", labels },
      { type: "axis-y", position: "left" },
      { ...mainLayer },
    ],
  };
};

// Get data requirements for template
const getDataRequirements = (chartType: string) => {
  const type = chartType.toLowerCase();
  switch (type) {
    case "bar":
    case "line":
    case "area":
      return {
        minPoints: 2,
        description: "At least 2 data points (label + value pairs)",
        example: "Month: January, Value: 100",
      };
    case "pie":
    case "doughnut":
      return {
        minPoints: 2,
        description: "At least 2 categories with values (percentages work best)",
        example: "Category: Sales, Value: 45",
      };
    case "scatter":
    case "points":
      return {
        minPoints: 3,
        description: "At least 3 data points with X and Y values",
        example: "X: 10, Y: 20",
      };
    default:
      return {
        minPoints: 2,
        description: "At least 2 data points",
        example: "Label: Value",
      };
  }
};

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token, setSelectedTemplate } = useStore();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewDSL, setPreviewDSL] = useState<any>(null);

  const isPro = user?.subscription_tier === "pro";
  const templateId = params.id as string;

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const templates = await templatesApi.getAll(token || undefined);
        const found = templates.find((t) => t.id === templateId);
        if (found) {
          setTemplate(found);
          const dsl = generatePreviewDSL(found);
          setPreviewDSL(normalize(dsl));
        } else {
          router.push("/dashboard/templates");
        }
      } catch (error) {
        console.error("Failed to fetch template:", error);
        router.push("/dashboard/templates");
      } finally {
        setIsLoading(false);
      }
    };

    if (templateId) {
      fetchTemplate();
    }
  }, [templateId, token, router]);

  const handleUseTemplate = () => {
    if (!template) return;
    
    if (template.is_premium && !isPro) {
      // Show pricing modal or redirect
      router.push("/dashboard/pricing");
      return;
    }

    setSelectedTemplate(template);
    router.push("/dashboard/generate?template=" + template.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingAnimation text="Loading template..." />
      </div>
    );
  }

  if (!template) {
    return null;
  }

  const requirements = getDataRequirements(template.chart_type);

  return (
    <motion.div
      className="min-h-screen px-4 sm:px-6 md:px-8 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Templates</span>
        </motion.button>

        {/* Template Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] bg-clip-text text-transparent">
                {template.name}
              </h1>
              <p className="text-gray-500 text-base sm:text-lg">
                {template.description || "Professional chart template"}
              </p>
            </div>
            {template.is_premium && !isPro && (
              <span className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold">
                PRO
              </span>
            )}
          </div>
        </motion.div>

        {/* Chart Preview */}
        <motion.div
          className="bg-white/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Preview</h2>
          <div className="h-[400px] sm:h-[500px] md:h-[600px] rounded-xl bg-white/50 p-4 flex items-center justify-center">
            {previewDSL ? (
              (() => {
                try {
                  if (!previewDSL || !previewDSL.data) {
                    return <div className="text-gray-400">Invalid preview data</div>;
                  }
                  return (
                    <ChartizyCanvas
                      definition={previewDSL}
                      data={previewDSL.data}
                      width={800}
                      height={600}
                      responsive={true}
                    />
                  );
                } catch (error) {
                  console.error("Failed to render preview:", error);
                  return <div className="text-gray-400">Preview error</div>;
                }
              })()
            ) : (
              <div className="text-gray-400">Loading preview...</div>
            )}
          </div>
        </motion.div>

        {/* Data Requirements */}
        <motion.div
          className="bg-white/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Data Requirements</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-900 font-semibold mb-2">
                {requirements.description}
              </p>
              <p className="text-xs text-blue-700">
                Example: {requirements.example}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-sm font-semibold text-gray-700 mb-1">Minimum Data Points</div>
                <div className="text-2xl font-bold text-gray-900">{requirements.minPoints}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-sm font-semibold text-gray-700 mb-1">Chart Type</div>
                <div className="text-lg font-bold text-gray-900 capitalize">{template.chart_type}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Use Template Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <motion.button
            onClick={handleUseTemplate}
            className="px-8 py-4 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] text-white rounded-full font-bold shadow-xl text-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Use This Template
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
