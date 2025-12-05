"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const sizeVariants = {
  sm: { dot: "w-2 h-2", gap: "gap-1", text: "text-sm" },
  md: { dot: "w-3 h-3", gap: "gap-2", text: "text-base" },
  lg: { dot: "w-4 h-4", gap: "gap-3", text: "text-lg" },
};

export function LoadingAnimation({
  size = "md",
  text = "Loading",
  className,
}: LoadingAnimationProps) {
  const { dot, gap, text: textSize } = sizeVariants[size];

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn("flex items-center", gap)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              dot,
              "rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      {text && (
        <motion.p
          className={cn("mt-3 text-slate-500 font-medium", textSize)}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn("relative", className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <div className="w-8 h-8 rounded-full border-4 border-violet-200 border-t-violet-600" />
    </motion.div>
  );
}

export function LoadingScreen({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600"
            animate={{
              rotate: [0, 180, 360],
              borderRadius: ["20%", "50%", "20%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-2 rounded-xl bg-white"
            animate={{
              rotate: [0, -180, -360],
              borderRadius: ["30%", "40%", "30%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <motion.p
          className="text-lg font-medium text-slate-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text || "Loading Graphzy..."}
        </motion.p>
      </motion.div>
    </div>
  );
}

