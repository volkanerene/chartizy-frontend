const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
}

async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    // Try to get token from localStorage if not provided
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("graphzy-token") : null;
    if (storedToken) {
      headers["Authorization"] = `Bearer ${storedToken}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    const errorMessage = error.detail || error.message || `Request failed with status ${response.status}`;
    console.error(`API Error [${response.status}]: ${endpoint}`, errorMessage);
    throw new Error(errorMessage);
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{
      access_token: string;
      user_id: string;
      email: string;
      subscription_tier: string;
      chart_count: number;
    }>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  register: (email: string, password: string) =>
    apiRequest<{
      access_token: string;
      user_id: string;
      email: string;
      subscription_tier: string;
      chart_count: number;
    }>("/auth/register", {
      method: "POST",
      body: { email, password },
    }),

  me: (token: string) =>
    apiRequest<{
      id: string;
      email: string;
      first_name?: string | null;
      last_name?: string | null;
      subscription_tier: string;
      chart_count: number;
      created_at: string;
    }>("/auth/me", { token }),
};

// Templates API
export const templatesApi = {
  getAll: (token?: string) =>
    apiRequest<Template[]>("/templates", { token }),

  getById: (id: string, token?: string) =>
    apiRequest<Template>(`/templates/${id}`, { token }),
};

// Charts API
export const chartsApi = {
  generate: (
    data: {
      user_id: string;
      template_id: string;
      data: Record<string, unknown>;
      chart_type?: string;
    },
    token: string
  ) =>
    apiRequest<ChartGenerateResponse>("/chart/generate", {
      method: "POST",
      body: data,
      token,
    }),

  getUserCharts: (userId: string, token: string) =>
    apiRequest<Chart[]>(`/chart/user/${userId}`, { token }),

  getById: (id: string, token: string) =>
    apiRequest<Chart>(`/chart/${id}`, { token }),

  delete: (id: string, token: string) =>
    apiRequest<{ success: boolean; message: string }>(`/chart/${id}`, {
      method: "DELETE",
      token,
    }),
};

// Subscription API
export const subscriptionApi = {
  update: (
    data: {
      user_id: string;
      tier: "free" | "pro";
      payment_method?: string;
      transaction_id?: string;
    },
    token: string
  ) =>
    apiRequest<{
      success: boolean;
      message: string;
      subscription_tier: string;
    }>("/subscription/update", {
      method: "POST",
      body: data,
      token,
    }),

  getStatus: (token: string) =>
    apiRequest<{
      user_id: string;
      subscription_tier: string;
      chart_count: number;
      chart_limit: number;
      features: {
        unlimited_charts: boolean;
        premium_templates: boolean;
        all_export_formats: boolean;
      };
    }>("/subscription/status", { token }),
};

// AI API
export const aiApi = {
  analyzePrompt: (prompt: string, token?: string) =>
    apiRequest<AIAnalyzeResponse>("/ai/analyze-prompt", {
      method: "POST",
      body: { prompt },
      token,
    }),

  generateData: (
    description: string,
    dataPoints?: number,
    chartType?: string,
    token?: string
  ) =>
    apiRequest<AIGenerateDataResponse>("/ai/generate-data", {
      method: "POST",
      body: { description, data_points: dataPoints, chart_type: chartType },
      token,
    }),
};

// Profile API
export const profileApi = {
  updateProfile: (data: { first_name?: string; last_name?: string }, token: string) =>
    apiRequest<{ success: boolean; message: string; first_name?: string; last_name?: string }>("/profile/update", {
      method: "PUT",
      body: data,
      token,
    }),
};

// Payment API (PayTR - works in Turkey, both web and mobile)
export const paymentApi = {
  createPayTRSession: (amount: number, successUrl: string, failUrl: string, token: string) =>
    apiRequest<{ success: boolean; order_id: string; iframe_url: string; redirect_url: string }>("/payment/create-paytr-session", {
      method: "POST",
      body: {
        amount,
        success_url: successUrl,
        fail_url: failUrl,
        user_id: "", // Will be set by backend from token
      },
      token,
    }),
  // Keep PayPal for backward compatibility (optional)
  createPayPalSession: (amount: number, successUrl: string, cancelUrl: string, token: string) =>
    apiRequest<{ order_id: string; approval_url: string }>("/payment/create-paypal-session", {
      method: "POST",
      body: {
        amount,
        success_url: successUrl,
        cancel_url: cancelUrl,
        currency: "USD",
      },
      token,
    }),
  capturePayPalPayment: (orderId: string, token: string) =>
    apiRequest<{ success: boolean; order_id: string; status: string }>("/payment/capture-paypal-payment", {
      method: "POST",
      body: { order_id: orderId },
      token,
    }),
};

// AI Types
export interface AIChartSuggestion {
  chart_type: string;
  confidence: number;
  reason: string;
}

export interface AIAnalyzeResponse {
  success: boolean;
  labels: string[];
  values: number[];
  title: string | null;
  description: string | null;
  suggested_charts: AIChartSuggestion[];
  data_interpretation: string;
}

export interface AIGenerateDataResponse {
  labels: string[];
  values: number[];
  title: string;
  suggested_type: string;
}

// Types
export interface Template {
  id: string;
  name: string;
  description: string | null;
  chart_type: string;
  is_premium: boolean;
  example_data: Record<string, unknown> | null;
  thumbnail_url: string | null;
}

export interface Chart {
  id: string;
  template_id: string;
  input_data: Record<string, unknown>;
  result_visual: string | null;
  result_code: string | null;
  created_at: string;
}

export interface ChartGenerateResponse {
  id: string;
  chart_config: Record<string, unknown>;
  jsx: string;
  svg: string | null;
  description: string;
  created_at: string;
}

