"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { BlobBackground } from "@/components/BlobBackground";
import { FloatingNav } from "@/components/FloatingNav";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/templates", label: "Templates" },
  { href: "/dashboard/generate", label: "Generate" },
  { href: "/dashboard/bulk", label: "Bulk Upload" },
  { href: "/dashboard/visuals", label: "Visuals" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, chartQuota, token, setUser } = useStore();
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse position tracking for parallax effect
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
      
      setAuthChecked(true);
    };

    checkAuth();
  }, [isAuthenticated, router, user]);

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-cyan-50/30 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="text-slate-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && authChecked) {
    return null;
  }

  const isPro = user?.subscription_tier === "pro";
  const quotaPercentage = isPro ? 100 : (chartQuota.used / chartQuota.limit) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden relative">
      {/* Parallax Background */}
      <motion.div
        className="fixed inset-0 z-0"
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

      {/* Main content */}
      <main className="relative z-10 pt-32 pb-20">
        {children}
      </main>

    </div>
  );
}

