"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fontOptions = [
  { id: "geist", name: "Geist", family: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif", description: "Modern and clean" },
  { id: "inter", name: "Inter", family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", description: "Professional and readable" },
  { id: "roboto", name: "Roboto", family: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif", description: "Classic and versatile" },
  { id: "poppins", name: "Poppins", family: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", description: "Friendly and approachable" },
  { id: "montserrat", name: "Montserrat", family: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif", description: "Elegant and geometric" },
  { id: "playfair", name: "Playfair Display", family: "'Playfair Display', serif", description: "Sophisticated serif" },
];

interface FontSelectorProps {
  currentFont: string;
  onFontChange: (font: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function FontSelector({ currentFont, onFontChange, isOpen, onClose }: FontSelectorProps) {
  if (!isOpen) return null;

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
          <h3 className="text-xl font-bold text-slate-900">Select Font</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {fontOptions.map((font) => (
            <motion.button
              key={font.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onFontChange(font.family);
                onClose();
              }}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all",
                currentFont === font.family
                  ? "border-blue-600 bg-blue-50"
                  : "border-blue-100 hover:border-blue-300 bg-white"
              )}
            >
              <div 
                className="font-semibold text-slate-900 mb-1"
                style={{ fontFamily: font.family }}
              >
                {font.name}
              </div>
              <div className="text-sm text-slate-500">{font.description}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </>
  );
}
