"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { templatesApi, paymentApi } from "@/lib/api";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { PricingModal } from "@/components/PricingModal";
import { InteractiveChart } from "@/components/InteractiveChart";
import { cn } from "@/lib/utils";

// Helper to generate preview data for templates
const generatePreviewData = (chartType: string) => {
  const baseLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const baseValues = [12, 19, 15, 25, 22, 30];
  
  switch (chartType.toLowerCase()) {
    case "pie":
    case "doughnut":
      return {
        labels: baseLabels.slice(0, 5),
        datasets: [{
          data: baseValues.slice(0, 5),
          backgroundColor: [
            "rgba(22, 93, 252, 0.8)",
            "rgba(74, 125, 253, 0.8)",
            "rgba(107, 157, 254, 0.8)",
            "rgba(142, 198, 255, 0.8)",
            "rgba(175, 220, 255, 0.8)",
          ],
        }],
      };
    default:
      return {
        labels: baseLabels,
        datasets: [{
          label: "Data",
          data: baseValues,
          backgroundColor: "rgba(22, 93, 252, 0.8)",
          borderColor: "rgba(22, 93, 252, 1)",
        }],
      };
  }
};

const categories = ["All", "Line", "Bar", "Pie", "Area", "Scatter", "Radar", "Other"];

export default function TemplatesPage() {
  const router = useRouter();
  const { user, token, templates, setTemplates, setSelectedTemplate } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pricingOpen, setPricingOpen] = useState(false);

  const isPro = user?.subscription_tier === "pro";

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await templatesApi.getAll(token || undefined);
        setTemplates(data);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [token, setTemplates]);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" ||
      template.chart_type === activeCategory ||
      (activeCategory === "other" &&
        !["line", "bar", "pie", "area", "scatter", "radar"].includes(
          template.chart_type
        ));
    return matchesSearch && matchesCategory;
  });

  const getTemplateSize = (index: number, total: number) => {
    const sizes = [
      "col-span-6 row-span-2",
      "col-span-6 row-span-2",
      "col-span-4 row-span-1",
      "col-span-4 row-span-1",
      "col-span-4 row-span-1",
      "col-span-8 row-span-1",
    ];
    return sizes[index % sizes.length];
  };

  const getTemplateGradient = (index: number) => {
    const gradients = [
      "from-[#165DFC] to-[#4A7DFD]",
      "from-[#4A7DFD] to-[#6B9DFE]",
      "from-[#6B9DFE] to-[#8EC6FF]",
      "from-[#165DFC] to-[#6B9DFE]",
      "from-[#4A7DFD] to-[#8EC6FF]",
      "from-[#165DFC] to-[#8EC6FF]",
    ];
    return gradients[index % gradients.length];
  };

  const handleSelectTemplate = (template: typeof templates[0]) => {
    if (template.is_premium && !isPro) {
      setPricingOpen(true);
      return;
    }

    setSelectedTemplate(template);
    router.push("/dashboard/generate");
  };

  return (
    <motion.div
      className="min-h-screen px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] bg-clip-text text-transparent">
            Templates
          </h1>
          <p className="text-gray-500 text-xl">
            Pre-built designs for instant creation
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          className="mb-12 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-8 py-4 bg-white/50 backdrop-blur-xl rounded-full border border-white/20 shadow-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#165DFC]"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-3 flex-wrap">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category.toLowerCase())}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeCategory === category.toLowerCase()
                    ? "bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] text-white shadow-xl"
                    : "bg-white/50 backdrop-blur-xl text-gray-700 border border-white/20"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-3">
            <motion.button
              onClick={() => setViewMode("grid")}
              className={`px-6 py-3 rounded-full font-semibold ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] text-white"
                  : "bg-white/50 backdrop-blur-xl text-gray-700"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              Grid
            </motion.button>
            <motion.button
              onClick={() => setViewMode("list")}
              className={`px-6 py-3 rounded-full font-semibold ${
                viewMode === "list"
                  ? "bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] text-white"
                  : "bg-white/50 backdrop-blur-xl text-gray-700"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              List
            </motion.button>
          </div>
        </motion.div>

        {/* Templates Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingAnimation text="Loading templates..." />
          </div>
        ) : filteredTemplates.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-12 gap-6">
              {filteredTemplates.map((template, index) => {
                const size = getTemplateSize(index, filteredTemplates.length);
                const gradient = getTemplateGradient(index);
                return (
                  <motion.div
                    key={template.id}
                    className={`${size} relative group cursor-pointer`}
                    initial={{ opacity: 0, scale: 0.8, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.03, y: -8 }}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-3xl blur-xl opacity-50`}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                    <div
                      className={`relative h-full bg-gradient-to-br ${gradient} rounded-3xl p-8 shadow-2xl overflow-hidden`}
                    >
                      <motion.div
                        className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"
                        animate={{
                          x: [0, 20, 0],
                          y: [0, -15, 0],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                        }}
                      />
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-2xl font-black text-white">
                              {template.name}
                            </h3>
                            {template.is_premium && !isPro && (
                              <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                                PRO
                              </span>
                            )}
                          </div>
                          <p className="text-white/70 text-sm mb-4">{template.description || ""}</p>
                          {/* Chart Preview */}
                          <div className="h-32 bg-white/10 backdrop-blur-sm rounded-xl p-2">
                            <InteractiveChart
                              chartConfig={{
                                type: template.chart_type,
                                data: generatePreviewData(template.chart_type),
                                options: {
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: { display: false },
                                    tooltip: { enabled: false },
                                  },
                                },
                              }}
                              height={120}
                              showPercentChange={false}
                              animated={false}
                              theme="light"
                            />
                          </div>
                        </div>
                        <motion.div
                          className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ x: 5 }}
                        >
                          <span className="text-white font-bold text-sm">
                            Use Template →
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  className="relative group cursor-pointer"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, x: 8 }}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl flex justify-between items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {template.name}
                        </h3>
                        {template.is_premium && !isPro && (
                          <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                            PRO
                          </span>
                        )}
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                          {template.chart_type}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{template.description || ""}</p>
                      {/* Chart Preview */}
                      <div className="h-24 bg-gray-50 rounded-lg p-2">
                        <InteractiveChart
                          chartConfig={{
                            type: template.chart_type,
                            data: generatePreviewData(template.chart_type),
                            options: {
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { display: false },
                                tooltip: { enabled: false },
                              },
                            },
                          }}
                          height={80}
                          showPercentChange={false}
                          animated={false}
                          theme="light"
                        />
                      </div>
                    </div>
                    <motion.button
                      className="px-6 py-3 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] text-white rounded-full font-bold shadow-xl flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Use
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-4 rounded-3xl bg-white/50 backdrop-blur-xl border-2 border-dashed border-gray-300"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No templates found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
            <motion.button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-4 px-6 py-3 bg-white/70 rounded-full font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={pricingOpen}
        onClose={() => setPricingOpen(false)}
        onUpgrade={async () => {
          // Handle upgrade with PayTR
          if (!token || !user) {
            alert("Please log in to upgrade");
            return;
          }
          
          try {
            const result = await paymentApi.createPayTRSession(
              299.99,
              `${window.location.origin}/dashboard?upgraded=true&payment=success`,
              `${window.location.origin}/dashboard?upgraded=false&payment=failed`,
              token
            );
            
            if (result.success && result.redirect_url) {
              sessionStorage.setItem("paytr_order_id", result.order_id);
              window.location.href = result.redirect_url;
            } else if (result.success && result.iframe_url) {
              sessionStorage.setItem("paytr_order_id", result.order_id);
              window.location.href = result.iframe_url;
            } else {
              throw new Error("Failed to create PayTR session");
            }
          } catch (error) {
            console.error("Upgrade error:", error);
            alert("Failed to start upgrade process. Please try again later.");
            setPricingOpen(false);
          }
        }}
      />
    </motion.div>
  );
}

