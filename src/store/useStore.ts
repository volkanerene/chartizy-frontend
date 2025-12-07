import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Template, Chart, ChartGenerateResponse } from "@/lib/api";

interface User {
  id: string;
  email: string;
  subscription_tier: "free" | "pro";
  chart_count: number;
  first_name?: string | null;
  last_name?: string | null;
}

interface AppState {
  // Auth state
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Chart quota
  chartQuota: {
    used: number;
    limit: number;
  };

  // Templates
  templates: Template[];
  selectedTemplate: Template | null;

  // Charts
  userCharts: Chart[];
  chartResult: ChartGenerateResponse | null;

  // UI state
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  setTemplates: (templates: Template[]) => void;
  setSelectedTemplate: (template: Template | null) => void;
  setUserCharts: (charts: Chart[]) => void;
  setChartResult: (result: ChartGenerateResponse | null) => void;
  setIsLoading: (loading: boolean) => void;
  incrementChartCount: () => void;
}

const FREE_CHART_LIMIT = 5;

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      chartQuota: {
        used: 0,
        limit: FREE_CHART_LIMIT,
      },
      templates: [],
      selectedTemplate: null,
      userCharts: [],
      chartResult: null,
      isLoading: false,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          chartQuota: {
            used: user?.chart_count || 0,
            limit: user?.subscription_tier === "pro" ? -1 : FREE_CHART_LIMIT,
          },
        }),

      setToken: (token) => set({ token }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          chartQuota: { used: 0, limit: FREE_CHART_LIMIT },
          userCharts: [],
          chartResult: null,
          selectedTemplate: null,
        }),

      setTemplates: (templates) => set({ templates }),

      setSelectedTemplate: (template) => set({ selectedTemplate: template }),

      setUserCharts: (charts) => set({ userCharts: charts }),

      setChartResult: (result) => set({ chartResult: result }),

      setIsLoading: (loading) => set({ isLoading: loading }),

      incrementChartCount: () => {
        const { user, chartQuota } = get();
        if (user) {
          set({
            user: { ...user, chart_count: user.chart_count + 1 },
            chartQuota: { ...chartQuota, used: chartQuota.used + 1 },
          });
        }
      },
    }),
    {
      name: "graphzy-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

