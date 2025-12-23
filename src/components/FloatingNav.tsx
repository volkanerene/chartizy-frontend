"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import Logo from "@/components/Logo";

export function FloatingNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useStore();

  const items = [
    { id: "/dashboard", label: "Dashboard" },
    { id: "/dashboard/templates", label: "Templates" },
    { id: "/dashboard/generate", label: "Generate" },
    { id: "/dashboard/bulk", label: "Bulk" },
    { id: "/dashboard/visuals", label: "Visuals" },
    { id: "/dashboard/settings", label: "Settings" },
  ];

  return (
    <>
      {/* Logo */}
      <motion.div
        className="fixed top-8 left-8 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link href="/dashboard">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Logo size="sm" variant="black" />
          </motion.div>
        </Link>
      </motion.div>

      {/* Floating Navigation */}
      <motion.div
        className="fixed top-8 left-1/2 -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex gap-2 p-2 rounded-full bg-white/40 backdrop-blur-xl border border-white/20 shadow-2xl">
          {items.map((item) => {
            const isActive = pathname === item.id || 
              (item.id === "/dashboard" && pathname?.startsWith("/dashboard/results"));
            return (
              <motion.button
                key={item.id}
                onClick={() => router.push(item.id)}
                className="relative px-6 py-3 rounded-full font-semibold text-sm overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] rounded-full"
                    layoutId="activeTab"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    isActive ? "text-white" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
