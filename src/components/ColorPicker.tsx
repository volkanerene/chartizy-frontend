"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const colorPresets = [
  { name: "Blue", colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"] },
  { name: "Indigo", colors: ["#6366f1", "#818cf8", "#a5b4fc", "#e0e7ff"] },
  { name: "Purple", colors: ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ede9fe"] },
  { name: "Green", colors: ["#10b981", "#34d399", "#6ee7b7", "#d1fae5"] },
  { name: "Orange", colors: ["#f59e0b", "#fbbf24", "#fcd34d", "#fef3c7"] },
  { name: "Red", colors: ["#ef4444", "#f87171", "#fca5a5", "#fee2e2"] },
];

interface ColorPickerProps {
  currentColors: string[];
  onColorChange: (colors: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ColorPicker({ currentColors, onColorChange, isOpen, onClose }: ColorPickerProps) {
  if (!isOpen) return null;

  const handlePresetSelect = (preset: string[]) => {
    onColorChange(preset);
  };

  const handleIndividualColorChange = (index: number, color: string) => {
    const newColors = [...currentColors];
    newColors[index] = color;
    onColorChange(newColors);
  };

  return (
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
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl border-2 border-blue-100 p-6 w-full max-w-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Customize Colors</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Color Presets</h4>
            <div className="grid grid-cols-3 gap-3">
              {colorPresets.map((preset) => (
                <motion.button
                  key={preset.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePresetSelect(preset.colors)}
                  className="p-3 rounded-xl border-2 border-blue-100 hover:border-blue-300 bg-white"
                >
                  <div className="flex gap-1 mb-2">
                    {preset.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="text-xs font-medium text-slate-700">{preset.name}</div>
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Individual Colors</h4>
            <div className="space-y-2">
              {currentColors.map((color, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="text-sm text-slate-600 w-20">Color {index + 1}</div>
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-blue-200 cursor-pointer"
                    style={{ backgroundColor: color }}
                  />
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleIndividualColorChange(index, e.target.value)}
                    className="w-20 h-10 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => handleIndividualColorChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-blue-200 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
