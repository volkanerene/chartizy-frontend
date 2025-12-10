"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const colorVariants = {
  primary: "bg-blue-600 hover:bg-blue-700",
  secondary: "bg-blue-500 hover:bg-blue-600",
  success: "bg-blue-600 hover:bg-blue-700",
};

const sizeVariants = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      onDrag,
      onDragStart,
      onDragEnd,
      onAnimationStart,
      onAnimationEnd,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-white shadow-lg transition-all duration-300",
          colorVariants[variant],
          sizeVariants[size],
          "shadow-blue-500/30 hover:shadow-blue-500/50",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

GradientButton.displayName = "GradientButton";

