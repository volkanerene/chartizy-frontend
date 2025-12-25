"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import { authApi } from "@/lib/api";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setToken } = useStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error in URL
        const error = searchParams?.get("error");
        const errorDescription = searchParams?.get("error_description");
        
        if (error) {
          console.error("OAuth error:", error, errorDescription);
          router.replace(`/login?error=oauth_error&details=${encodeURIComponent(errorDescription || error)}`);
          return;
        }

        // Check for code in query params (PKCE flow)
        const code = searchParams?.get("code");
        
        if (code) {
          // Exchange code for session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error("Exchange error:", exchangeError);
            router.replace(`/login?error=oauth_error&details=${encodeURIComponent(exchangeError.message)}`);
            return;
          }

          if (data.session) {
            await handleSession(data.session);
            return;
          }
        }

        // If no code, check hash fragment (implicit flow)
        // This handles the case where token is in hash fragment
        const hash = window.location.hash;
        if (hash) {
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get("access_token");
          const errorHash = hashParams.get("error");
          
          if (errorHash) {
            const errorDescription = hashParams.get("error_description");
            console.error("OAuth error in hash:", errorHash, errorDescription);
            router.replace(`/login?error=oauth_error&details=${encodeURIComponent(errorDescription || errorHash)}`);
            return;
          }

          if (accessToken) {
            // Get session with the token from hash
            // Supabase automatically handles hash fragments, but we need to set the session
            const refreshToken = hashParams.get("refresh_token") || "";
            const { data: { session }, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              console.error("Session error:", sessionError);
              router.replace(`/login?error=oauth_error&details=${encodeURIComponent(sessionError.message)}`);
              return;
            }

            if (session) {
              await handleSession(session);
              return;
            }
          }
        }

        // If we get here, try to get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Get session error:", sessionError);
          router.replace(`/login?error=oauth_error&details=${encodeURIComponent(sessionError.message)}`);
          return;
        }

        if (session) {
          await handleSession(session);
        } else {
          // No session found, redirect to login
          console.log("No session found");
          router.replace("/login?error=no_session");
        }
      } catch (error) {
        console.error("Callback error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        router.replace(`/login?error=oauth_error&details=${encodeURIComponent(errorMessage)}`);
      }
    };

    const handleSession = async (session: any) => {
      try {
        setToken(session.access_token);
        
        // Fetch user data from backend
        const userData = await authApi.me(session.access_token);
        setUser({
          id: userData.id,
          email: userData.email,
          subscription_tier: userData.subscription_tier as "free" | "pro",
          chart_count: userData.chart_count,
          first_name: userData.first_name,
          last_name: userData.last_name,
        });
        
        // Check if user needs onboarding
        if (!userData.first_name || !userData.last_name) {
          router.replace("/onboarding");
        } else {
          router.replace("/dashboard");
        }
      } catch (apiError) {
        console.error("API error fetching user data:", apiError);
        // Fallback to Supabase user data
        if (session.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            subscription_tier: "free",
            chart_count: 0,
            first_name: null,
            last_name: null,
          });
          router.replace("/onboarding");
        } else {
          router.replace("/login?error=user_data_error");
        }
      }
    };

    handleAuthCallback();
  }, [router, searchParams, setUser, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Completing sign in...</p>
      </div>
    </div>
  );
}

