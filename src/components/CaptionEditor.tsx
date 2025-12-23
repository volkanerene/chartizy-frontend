"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CaptionEditorProps {
  captions: {
    title?: string;
    subtitle?: string;
    footer?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
  };
  onCaptionChange: (captions: CaptionEditorProps["captions"]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function CaptionEditor({ captions, onCaptionChange, isOpen, onClose }: CaptionEditorProps) {
  const [localCaptions, setLocalCaptions] = useState(captions);

  const handleChange = (field: keyof typeof captions, value: string) => {
    setLocalCaptions({ ...localCaptions, [field]: value });
  };

  const handleSave = () => {
    onCaptionChange(localCaptions);
    onClose();
  };

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
          <h3 className="text-xl font-bold text-slate-900">
            Edit Captions
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={localCaptions.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Chart Title"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={localCaptions.subtitle || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Chart Subtitle"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="xAxisLabel">X-Axis Label</Label>
            <Input
              id="xAxisLabel"
              value={localCaptions.xAxisLabel || ""}
              onChange={(e) => handleChange("xAxisLabel", e.target.value)}
              placeholder="X-Axis Label"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="yAxisLabel">Y-Axis Label</Label>
            <Input
              id="yAxisLabel"
              value={localCaptions.yAxisLabel || ""}
              onChange={(e) => handleChange("yAxisLabel", e.target.value)}
              placeholder="Y-Axis Label"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="footer">Footer</Label>
            <Input
              id="footer"
              value={localCaptions.footer || ""}
              onChange={(e) => handleChange("footer", e.target.value)}
              placeholder="Footer Text"
              className="mt-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-blue-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save
          </Button>
        </div>
      </motion.div>
    </>
  );
}
