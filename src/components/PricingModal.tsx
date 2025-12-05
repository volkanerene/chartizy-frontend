"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { GradientButton } from "./GradientButton";
import { cn } from "@/lib/utils";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

const freeFeatures = [
  "5 charts per month",
  "7 chart templates",
  "PNG & JSX export",
  "Basic customization",
];

const proFeatures = [
  "Unlimited charts",
  "13+ premium templates",
  "All export formats (PNG, SVG, JSX, JSON)",
  "Advanced customization",
  "Priority support",
  "API access",
];

export function PricingModal({ isOpen, onClose, onUpgrade }: PricingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Upgrade to Pro
            </DialogTitle>
            <DialogDescription className="text-violet-100">
              Unlock the full power of Graphzy with unlimited charts and premium features.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border-2 border-slate-200 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900">Free</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900">$0</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Perfect for getting started
              </p>

              <ul className="mt-6 space-y-3">
                {freeFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-slate-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={onClose}
                className="mt-6 w-full py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                Current Plan
              </button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={cn(
                "relative rounded-2xl border-2 border-violet-500 p-6",
                "bg-gradient-to-br from-violet-50 to-purple-50"
              )}
            >
              <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-xs font-bold text-amber-900">
                POPULAR
              </div>

              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-violet-500" />
                Pro
              </h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900">$9</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                For power users and teams
              </p>

              <ul className="mt-6 space-y-3">
                {proFeatures.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-slate-700 font-medium"
                  >
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <GradientButton
                onClick={onUpgrade}
                className="mt-6 w-full"
              >
                Upgrade Now
              </GradientButton>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

