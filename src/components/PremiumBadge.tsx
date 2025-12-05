"use client";

import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeVariants = {
  sm: "h-5 px-2 text-xs",
  md: "h-6 px-3 text-sm",
  lg: "h-7 px-4 text-base",
};

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
};

export function PremiumBadge({ size = "md", className }: PremiumBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold",
        "bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400",
        "text-amber-900 shadow-lg shadow-amber-500/30",
        sizeVariants[size],
        className
      )}
    >
      <Crown className={iconSizes[size]} />
      <span>PRO</span>
    </motion.div>
  );
}

