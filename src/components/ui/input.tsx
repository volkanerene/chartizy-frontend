import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border-2 border-violet-100 bg-white/80 backdrop-blur-sm px-4 py-2 text-base text-slate-900 shadow-sm transition-all duration-200",
          "placeholder:text-slate-400",
          "focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10",
          "hover:border-violet-200",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

