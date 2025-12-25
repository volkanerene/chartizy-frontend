"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { FloatingNav } from "@/components/FloatingNav";
import { BlobBackground } from "@/components/BlobBackground";
import { PricingModal } from "@/components/PricingModal";
import { paymentApi } from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, token, setUser } = useStore();
  const { signOut } = useAuth();
  const [pricingOpen, setPricingOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse position for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Wait for auth to initialize, then redirect if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      // Give Supabase time to restore session
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if we have a session in Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && !isAuthenticated) {
        router.push("/login");
        setAuthChecked(true);
        return;
      }

      // Check if user needs onboarding
      if (session && user && (!user.first_name || !user.last_name)) {
        router.push("/onboarding");
        setAuthChecked(true);
        return;
      }
      
      setAuthChecked(true);
    };

    checkAuth();
  }, [isAuthenticated, router, user]);

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#165DFC] to-[#8EC6FF] flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <span className="text-slate-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && authChecked) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        className="fixed inset-0"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        <BlobBackground />
      </motion.div>

      {/* Navigation */}
      <FloatingNav />

      {/* Content */}
      <main className="pt-32 pb-20 min-h-screen">
        <div className="px-8">{children}</div>
      </main>

      {/* Cursor Glow */}
      <motion.div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-50 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(22, 93, 252, 0.15) 0%, transparent 70%)",
        }}
        animate={{
          x: mousePosition.x * 2,
          y: mousePosition.y * 2,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      />

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
            // Create PayTR payment session
            const result = await paymentApi.createPayTRSession(
              299.99, // 299.99 TL/month (approximately $9.99)
              `${window.location.origin}/dashboard?upgraded=true&payment=success`,
              `${window.location.origin}/dashboard?upgraded=false&payment=failed`,
              token
            );
            
            if (result.success && result.redirect_url) {
              // Store order_id for tracking
              sessionStorage.setItem("paytr_order_id", result.order_id);
              // Redirect to PayTR payment page
              window.location.href = result.redirect_url;
            } else if (result.success && result.iframe_url) {
              // If iframe_url is returned, use that
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
