"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Filter, Grid3X3, List } from "lucide-react";
import { useStore } from "@/store/useStore";
import { templatesApi, paymentApi } from "@/lib/api";
import { PREMIUM_TEMPLATES } from "@/lib/templates/premium-templates";
import { TemplateCard } from "@/components/TemplateCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { PricingModal } from "@/components/PricingModal";
import { cn } from "@/lib/utils";

const chartCategories = [
  { id: "all", label: "All" },
  { id: "line", label: "Line" },
  { id: "bar", label: "Bar" },
  { id: "pie", label: "Pie" },
  { id: "area", label: "Area" },
  { id: "scatter", label: "Scatter" },
  { id: "radar", label: "Radar" },
  { id: "comparison", label: "Comparison" },
  { id: "timeseries", label: "Time Series" },
  { id: "other", label: "Other" },
];

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

  // Convert premium templates to Template format for display
  const premiumTemplatesAsRegular: typeof templates = PREMIUM_TEMPLATES.map((pt) => ({
    id: pt.id,
    name: pt.name,
    description: pt.description,
    chart_type: pt.category,
    is_premium: pt.isPremium,
    example_data: null,
    thumbnail_url: null,
  }));

  // Combine regular templates with premium templates
  const allTemplates = [...templates, ...premiumTemplatesAsRegular];

  const filteredTemplates = allTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "all" ||
      template.chart_type === activeCategory ||
      (activeCategory === "other" &&
        !["line", "bar", "pie", "area", "scatter", "radar", "comparison", "timeseries"].includes(
          template.chart_type
        ));

    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (template: typeof templates[0]) => {
    if (template.is_premium && !isPro) {
      setPricingOpen(true);
      return;
    }

    // Navigate to template detail page instead of generate
    router.push(`/dashboard/templates/${template.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Chart Templates
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Choose a template to get started with your visualization.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          {chartCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                activeCategory === category.id
                  ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30"
                  : "bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 border border-violet-100 dark:border-slate-700"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white/70 dark:bg-slate-800/70 rounded-xl p-1 border border-violet-100 dark:border-slate-700">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              viewMode === "grid"
                ? "bg-violet-100 text-violet-700"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            )}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              viewMode === "list"
                ? "bg-violet-100 text-violet-700"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            )}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Templates Grid/List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingAnimation text="Loading templates..." />
        </div>
      ) : filteredTemplates.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          )}
        >
          {filteredTemplates.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <TemplateCard
                template={template}
                isLocked={template.is_premium && !isPro}
                onClick={() => handleSelectTemplate(template)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 px-4 rounded-3xl bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-dashed border-violet-200"
        >
          <Filter className="w-12 h-12 mx-auto text-violet-400 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            No templates found
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Try adjusting your search or filter criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </motion.div>
      )}

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
    </div>
  );
}

