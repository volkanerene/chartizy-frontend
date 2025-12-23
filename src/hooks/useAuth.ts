"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase, getUser, signOut as supabaseSignOut } from "@/lib/supabase";
import { authApi } from "@/lib/api";
import { useStore } from "@/store/useStore";

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, setUser, setToken, logout } = useStore();

  // Initialize auth state from Supabase session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await supabase.auth.getSession();
        if (session.data.session) {
          const accessToken = session.data.session.access_token;
          setToken(accessToken);

          // Fetch user data from our API
          try {
          const userData = await authApi.me(accessToken);
          setUser({
            id: userData.id,
            email: userData.email,
            subscription_tier: userData.subscription_tier as "free" | "pro",
            chart_count: userData.chart_count,
            first_name: userData.first_name,
            last_name: userData.last_name,
          });
          } catch {
            // If API call fails, use Supabase user data
            const supabaseUser = await getUser();
            if (supabaseUser) {
              setUser({
                id: supabaseUser.id,
                email: supabaseUser.email || "",
                subscription_tier: "free",
                chart_count: 0,
                first_name: null,
                last_name: null,
              });
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setToken(session.access_token);
        try {
          const userData = await authApi.me(session.access_token);
          setUser({
            id: userData.id,
            email: userData.email,
            subscription_tier: userData.subscription_tier as "free" | "pro",
            chart_count: userData.chart_count,
          });
        } catch {
          // Fallback
        }
      } else if (event === "SIGNED_OUT") {
        logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setToken, logout]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.session) {
        setToken(data.session.access_token);

        try {
          const userData = await authApi.me(data.session.access_token);
          setUser({
            id: userData.id,
            email: userData.email,
            subscription_tier: userData.subscription_tier as "free" | "pro",
            chart_count: userData.chart_count,
            first_name: userData.first_name,
            last_name: userData.last_name,
          });
          
          // Check if user has completed onboarding (has first_name and last_name)
          if (!userData.first_name || !userData.last_name) {
            router.push("/onboarding");
          } else {
            router.push("/dashboard");
          }
        } catch {
          setUser({
            id: data.user?.id || "",
            email: data.user?.email || "",
            subscription_tier: "free",
            chart_count: 0,
            first_name: null,
            last_name: null,
          });
          router.push("/dashboard");
        }
      }
    },
    [router, setToken, setUser]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.session) {
        setToken(data.session.access_token);

        try {
          // Fetch user data from backend
          const userData = await authApi.me(data.session.access_token);
          setUser({
            id: userData.id,
            email: userData.email,
            subscription_tier: userData.subscription_tier as "free" | "pro",
            chart_count: userData.chart_count,
            first_name: userData.first_name,
            last_name: userData.last_name,
          });
          
          // Redirect to dashboard
          router.push("/dashboard");
        } catch {
          // If API call fails, set user with null names and go to dashboard
          setUser({
            id: data.user?.id || "",
            email: data.user?.email || "",
            subscription_tier: "free",
            chart_count: 0,
            first_name: null,
            last_name: null,
          });
          router.push("/dashboard");
        }
      } else {
        // Email confirmation required
        return { confirmEmail: true };
      }
    },
    [router, setToken, setUser]
  );

  const signOut = useCallback(async () => {
    await supabaseSignOut();
    logout();
    router.push("/login");
  }, [router, logout]);

  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return false;
    }
    return true;
  }, [isAuthenticated, router]);

  return {
    user,
    token,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    requireAuth,
  };
}

