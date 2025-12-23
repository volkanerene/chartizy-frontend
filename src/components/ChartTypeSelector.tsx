"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChartType {
  id: string;
  name: string;
  icon: () => null;
  description: string;
}

const chartTypes: ChartType[] = [
  { id: "bar", name: "Bar Chart", icon: () => null, description: "Compare values across categories" },
  { id: "line", name: "Line Chart", icon: () => null, description: "Show trends over time" },
  { id: "pie", name: "Pie Chart", icon: () => null, description: "Show proportions" },
  { id: "combo", name: "Combo Chart", icon: () => null, description: "Bar + Line combination" },
];

interface ChartTypeSelectorProps {
  currentType: string;
  onSelect: (type: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ChartTypeSelector({ currentType, onSelect, isOpen, onClose }: ChartTypeSelectorProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl border-2 border-blue-100 p-6 w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Select Chart Type</h3>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {chartTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onSelect(type.id);
                    onClose();
                  }}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    currentType === type.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-blue-100 hover:border-blue-300 bg-white"
                  )}
                >
                  <div className="font-semibold text-slate-900 mb-1">{type.name}</div>
                  <div className="text-sm text-slate-500">{type.description}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
