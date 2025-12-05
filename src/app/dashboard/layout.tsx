"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Grid3X3,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PremiumBadge } from "@/components/PremiumBadge";
import { PricingModal } from "@/components/PricingModal";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/templates", label: "Templates", icon: Grid3X3 },
  { href: "/dashboard/generate", label: "Generate", icon: PlusCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, chartQuota, token } = useStore();
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Wait for auth to initialize, then redirect if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      // Give Supabase time to restore session
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if we have a session in Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && !isAuthenticated) {
        router.push("/login");
      }
      setAuthChecked(true);
    };

    checkAuth();
  }, [isAuthenticated, router]);

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-cyan-50/30 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
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

  const isPro = user?.subscription_tier === "pro";
  const quotaPercentage = isPro ? 100 : (chartQuota.used / chartQuota.limit) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-cyan-50/30">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-violet-100 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-violet-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">Graphzy</span>
          </div>
        </div>
        <Avatar className="h-9 w-9">
          <AvatarFallback>
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </header>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl"
            >
              <div className="p-4 flex items-center justify-between border-b border-violet-100">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl text-slate-900">Graphzy</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-xl hover:bg-violet-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <SidebarContent
                pathname={pathname}
                user={user}
                isPro={isPro}
                quotaPercentage={quotaPercentage}
                chartQuota={chartQuota}
                onUpgrade={() => setPricingOpen(true)}
                onSignOut={signOut}
                onNavigate={() => setSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white/80 backdrop-blur-xl border-r border-violet-100 z-40">
        <div className="p-6 border-b border-violet-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">Graphzy</span>
          </div>
        </div>
        <SidebarContent
          pathname={pathname}
          user={user}
          isPro={isPro}
          quotaPercentage={quotaPercentage}
          chartQuota={chartQuota}
          onUpgrade={() => setPricingOpen(true)}
          onSignOut={signOut}
        />
      </aside>

      {/* Main content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={pricingOpen}
        onClose={() => setPricingOpen(false)}
        onUpgrade={() => {
          // Handle upgrade - integrate with Stripe
          console.log("Upgrade to Pro");
          setPricingOpen(false);
        }}
      />
    </div>
  );
}

interface SidebarContentProps {
  pathname: string;
  user: { email: string; subscription_tier: string } | null;
  isPro: boolean;
  quotaPercentage: number;
  chartQuota: { used: number; limit: number };
  onUpgrade: () => void;
  onSignOut: () => void;
  onNavigate?: () => void;
}

function SidebarContent({
  pathname,
  user,
  isPro,
  quotaPercentage,
  chartQuota,
  onUpgrade,
  onSignOut,
  onNavigate,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col flex-1 p-4">
      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30"
                  : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {isActive && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quota Card */}
      {!isPro && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700">
              Charts Used
            </span>
            <span className="text-sm text-slate-500">
              {chartQuota.used}/{chartQuota.limit}
            </span>
          </div>
          <div className="h-2 bg-violet-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${quotaPercentage}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onUpgrade}
            className="w-full mt-4"
          >
            <Crown className="w-4 h-4 mr-2 text-amber-500" />
            Upgrade to Pro
          </Button>
        </motion.div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* User section */}
      <div className="pt-4 border-t border-violet-100 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user?.email}
            </p>
            <div className="flex items-center gap-2">
              {isPro ? (
                <PremiumBadge size="sm" />
              ) : (
                <span className="text-xs text-slate-500">Free Plan</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            onNavigate?.();
          }}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-xl text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition-colors"
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>

        <button
          onClick={() => {
            onSignOut();
            onNavigate?.();
          }}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

