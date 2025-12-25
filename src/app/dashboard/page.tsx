"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, BarChart3, TrendingUp, Clock, Sparkles, Wand2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { chartsApi, paymentApi, templatesApi } from "@/lib/api";
import { ChartCard } from "@/components/ChartCard";
import { GradientButton } from "@/components/GradientButton";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, userCharts, setUserCharts, chartQuota, setUser } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPreviews, setIsGeneratingPreviews] = useState(false);
  const [previewGenerationResult, setPreviewGenerationResult] = useState<any>(null);
  
  // Handle PayTR payment callback
  useEffect(() => {
    const upgraded = searchParams?.get("upgraded");
    const paymentStatus = searchParams?.get("payment");
    
    if (upgraded === "true" && paymentStatus === "success" && user) {
      // PayTR callback is handled server-side, but we update UI here
      // The backend webhook already updated the subscription
      setUser({
        ...user,
        subscription_tier: "pro",
      });
      // Clean up
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("paytr_order_id");
      }
      // Remove query params
      router.replace("/dashboard");
    } else if (paymentStatus === "failed") {
      // Payment failed
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("paytr_order_id");
      }
      router.replace("/dashboard");
    }
  }, [searchParams, user, setUser, router]);

  useEffect(() => {
    const fetchCharts = async () => {
      if (!user?.id || !token) return;

      try {
        const charts = await chartsApi.getUserCharts(user.id, token);
        setUserCharts(charts);
      } catch (error) {
        console.error("Failed to fetch charts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharts();
  }, [user?.id, token, setUserCharts]);

  const isPro = user?.subscription_tier === "pro";

  const handleGeneratePreviews = async () => {
    if (!token) {
      alert("Please log in to generate previews");
      return;
    }

    setIsGeneratingPreviews(true);
    setPreviewGenerationResult(null);

    try {
      const result = await templatesApi.generatePreviews(token);
      setPreviewGenerationResult(result);
      alert(`Preview generation complete!\nProcessed: ${result.processed}\nSkipped: ${result.skipped}\nFailed: ${result.failed}`);
    } catch (error) {
      console.error("Failed to generate previews:", error);
      alert("Failed to generate previews. Please try again.");
    } finally {
      setIsGeneratingPreviews(false);
    }
  };

  const stats = [
    {
      label: "Total Charts",
      value: userCharts.length,
      icon: BarChart3,
      color: "from-violet-500 to-purple-500",
    },
    {
      label: "Charts Left",
      value: isPro ? "∞" : chartQuota.limit - chartQuota.used,
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-500",
    },
    {
      label: "This Month",
      value: userCharts.filter(c => {
        const created = new Date(c.created_at);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length,
      icon: Clock,
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here&apos;s an overview of your charts and activity.
          </p>
        </div>
        <Link href="/dashboard/generate">
          <GradientButton className="w-full sm:w-auto">
            <Plus className="w-5 h-5" />
            Create Chart
          </GradientButton>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-2 border-violet-100/50 dark:border-slate-700/50 p-6 shadow-lg shadow-violet-500/5 dark:shadow-slate-900/20"
          >
            <div className={cn(
              "absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 bg-gradient-to-br",
              stat.color
            )} />
            <div className={cn(
              "inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br shadow-lg mb-4",
              stat.color
            )}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Your Charts</h2>
          {userCharts.length > 0 && (
            <Link
              href="/dashboard/templates"
              className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium"
            >
              View All Templates →
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingAnimation text="Loading your charts..." />
          </div>
        ) : userCharts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCharts.slice(0, 6).map((chart, i) => (
              <motion.div
                key={chart.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <ChartCard
                  chart={chart}
                  onClick={() => {
                    router.push(`/dashboard/results/${chart.id}`);
                  }}
                  onDelete={async () => {
                    if (!token) return;
                    try {
                      await chartsApi.delete(chart.id, token);
                      setUserCharts(userCharts.filter((c) => c.id !== chart.id));
                    } catch (error) {
                      console.error("Failed to delete chart:", error);
                    }
                  }}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-4 rounded-3xl bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-dashed border-violet-200"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-violet-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No charts yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Start by selecting a template and let AI generate beautiful
              visualizations from your data.
            </p>
            <Link href="/dashboard/templates">
              <GradientButton>
                <Plus className="w-5 h-5" />
                Create Your First Chart
              </GradientButton>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

