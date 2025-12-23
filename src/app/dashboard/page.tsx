"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { chartsApi, paymentApi } from "@/lib/api";
import { ChartCard } from "@/components/ChartCard";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { InteractiveChart } from "@/components/InteractiveChart";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, userCharts, setUserCharts, chartQuota, setUser } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  
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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const stats = [
    { label: "Total Charts", value: userCharts.length.toString(), change: `+${userCharts.filter(c => {
      const created = new Date(c.created_at);
      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return created > monthAgo;
    }).length}` },
    { label: "Charts Left", value: isPro ? "∞" : (chartQuota.limit - chartQuota.used).toString(), change: isPro ? "∞" : "" },
    { label: "This Month", value: userCharts.filter(c => {
      const created = new Date(c.created_at);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length.toString(), change: "+0" },
  ];

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
            Your Charts
          </h1>
          <p className="text-gray-500 text-xl">
            AI-generated visualizations at your fingertips
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="relative group"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#165DFC]/10 to-[#8EC6FF]/10 rounded-3xl blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />
              <div className="relative bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
                <div className="text-sm text-gray-700 font-semibold mb-2">{stat.label}</div>
                <div className="text-5xl font-black bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] bg-clip-text text-transparent">
                  {stat.value}
                </div>
                {stat.change && (
                  <div className="text-xs text-green-600 font-semibold mt-2">
                    {stat.change}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingAnimation text="Loading your charts..." />
          </div>
        ) : userCharts.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-gray-400 text-xl mb-8">No charts yet</div>
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] text-white rounded-full font-bold shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/dashboard/generate")}
            >
              Create Your First Chart
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {userCharts.slice(0, 6).map((chart, index) => {
              let chartConfig = null;
              try {
                if (chart.result_visual) {
                  chartConfig = JSON.parse(chart.result_visual);
                }
              } catch {
                // Ignore parse errors
              }

              return (
                <motion.div
                  key={chart.id}
                  className="relative group cursor-pointer"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  onMouseEnter={() => setHoveredCard(chart.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => router.push(`/dashboard/results/${chart.id}`)}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#165DFC]/20 to-[#8EC6FF]/20 rounded-3xl blur-xl"
                    animate={{
                      scale: hoveredCard === chart.id ? 1.1 : 1,
                      opacity: hoveredCard === chart.id ? 0.6 : 0.3,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="relative bg-white/50 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {chartConfig?.data?.title || chartConfig?.options?.title?.text || `Chart ${chart.id.slice(0, 8)}`}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {new Date(chart.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                        {chartConfig?.type || "Bar"}
                      </span>
                    </div>
                    {chartConfig ? (
                      <div className="h-[120px] bg-white rounded-lg p-2">
                        <InteractiveChart
                          chartConfig={chartConfig}
                          height={120}
                          showPercentChange={false}
                          animated={false}
                          theme="light"
                        />
                      </div>
                    ) : (
                      <div className="h-[120px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
                        No preview
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

